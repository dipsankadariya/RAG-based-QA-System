from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class AgentStatus:
    ready: bool
    error: Optional[str] = None


_agent_app = None
_status = AgentStatus(ready=False, error="Agent not initialized")


def get_agent_status() -> AgentStatus:
    return _status


async def init_agent() -> None:
    """Initialize the MCP agent if dependencies + API keys exist.

    This is intentionally resilient: if deps/keys are missing, HyDE mode should
    continue to work and Agent mode will return a 503 with a clear message.
    """

    global _agent_app, _status

    try:
        from langchain_core.messages import HumanMessage, SystemMessage
        from langgraph.graph import START, MessagesState, StateGraph
        from langgraph.prebuilt import ToolNode, tools_condition
        from langchain_mcp_adapters.client import MultiServerMCPClient
        from langchain_google_genai import ChatGoogleGenerativeAI
    except Exception as exc:  # ImportError or optional dependency issues
        _agent_app = None
        _status = AgentStatus(
            ready=False,
            error=(
                "Agent dependencies not installed. Install `langgraph`, `langchain-mcp-adapters`, "
                "and `langchain-google-genai`. Underlying error: " + str(exc)
            ),
        )
        return

    pageindex_api_key = os.getenv("PAGEINDEX_API_KEY")
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not pageindex_api_key or not google_api_key:
        _agent_app = None
        _status = AgentStatus(
            ready=False,
            error="Agent not configured. Set PAGEINDEX_API_KEY and GOOGLE_API_KEY environment variables.",
        )
        return

    pageindex_url = os.getenv("PAGEINDEX_MCP_URL", "https://api.pageindex.ai/mcp")

    mcp_client = MultiServerMCPClient(
        {
            "pageindex": {
                "transport": "http",
                "url": pageindex_url,
                "headers": {"Authorization": f"Bearer {pageindex_api_key}"},
            }
        }
    )

    tools = await mcp_client.get_tools()
    tools = [tool for tool in tools if tool.name != "get_document_structure"]
    if not tools:
        _agent_app = None
        _status = AgentStatus(ready=False, error="MCP returned no tools. Check PAGEINDEX_API_KEY / PAGEINDEX_MCP_URL.")
        return

    agent_model = os.getenv("AGENT_MODEL", "gemini-3.1-flash-lite")
    llm = ChatGoogleGenerativeAI(model=agent_model, google_api_key=google_api_key)
    llm_with_tools = llm.bind_tools(tools)

    assistant_prompt = SystemMessage(
        content=(
            "You are a strictly grounded legal research assistant. You answer ONLY using information "
            "retrieved via your PageIndex tools. You have NO outside knowledge and cannot offer personal legal advice.\n\n"
            "### MANDATORY EXECUTION WORKFLOW\n"
            "You must execute your retrieval in this exact sequence. Never skip steps.\n\n"
            "1. Orient & Semantic Search: Call browse_documents(sort=\"relevance\", query=\"<natural language topic>\").\n"
            "2. Verify Status: Call get_document(doc_name=\"<exact_doc_name>\", wait_for_completion=true).\n"
            "3. Find Relevant Pages: Call get_page_content(doc_name=..., pages=\"1-6\") to locate TOC/index, then targeted pages.\n"
            "4. Extract Content: get_page_content() max 3-5 pages at a time.\n"
            "5. Fallback only if zero docs: search_documents(query=\"<keywords>\").\n\n"
            "### HARD CONSTRAINTS\n"
            "- Never guess page numbers; verify via TOC.\n"
            "- Never request more than 5 pages at a time.\n"
            "- Never answer from memory/general knowledge. If not found, say so.\n\n"
            "### FINAL OUTPUT FORMAT\n"
            "Provide a structured answer with citations (doc name + page numbers) for every claim."
        )
    )

    async def assistant_node(state: MessagesState):
        response = await llm_with_tools.ainvoke([assistant_prompt] + state["messages"])
        return {"messages": [response]}

    builder = StateGraph(MessagesState)
    builder.add_node("assistant", assistant_node)
    builder.add_node("tools", ToolNode(tools))
    builder.add_edge(START, "assistant")
    builder.add_conditional_edges("assistant", tools_condition)
    builder.add_edge("tools", "assistant")

    _agent_app = builder.compile()
    _status = AgentStatus(ready=True, error=None)


async def run_agent(question: str) -> str:
    global _agent_app

    if not _agent_app or not _status.ready:
        raise RuntimeError(_status.error or "Agent not ready")

    # Import here to avoid hard dependency if agent isn't used.
    from langchain_core.messages import HumanMessage

    result = await _agent_app.ainvoke({"messages": [HumanMessage(content=question)]})
    messages = result.get("messages") or []
    if not messages:
        return "Agent produced no output."

    last = messages[-1]
    return getattr(last, "content", None) or str(last)
