from __future__ import annotations

from datetime import datetime, timedelta, timezone

from forum_db import get_conn, init_db


def iso_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat()


def reset_and_seed() -> None:
    init_db()

    now = datetime.now(timezone.utc)

    sample_questions = [
        {
            "title": "Can a landlord increase rent without prior notice in Nepal?",
            "body": "My landlord raised the rent suddenly this month without any written notice. What does Nepali law say about notice period and rent increase?",
            "tags": "property,tenancy,rent",
            "author_sub": "seed:aarav",
            "author_name": "Aarav Sharma",
            "author_picture": None,
            "author_role": "Student",
            "created_at": iso_utc(now - timedelta(days=3, hours=2)),
        },
        {
            "title": "Difference between FIR and a normal complaint in Nepal?",
            "body": "I want to report a fraud case but I’m confused about FIR vs complaint. What should I file and where (police, CDO, court)?",
            "tags": "criminal,police,procedure",
            "author_sub": "seed:priya",
            "author_name": "Priya KC",
            "author_picture": None,
            "author_role": "Law Intern",
            "created_at": iso_utc(now - timedelta(days=2, hours=6)),
        },
        {
            "title": "Is a digital signature legally valid in Nepal?",
            "body": "Are contracts signed digitally accepted in Nepal for court or government purposes? Any specific law/requirements for verification?",
            "tags": "cyber,contracts,e-sign",
            "author_sub": "seed:ritesh",
            "author_name": "Ritesh Adhikari",
            "author_picture": None,
            "author_role": "Advocate",
            "created_at": iso_utc(now - timedelta(days=2, hours=1)),
        },
        {
            "title": "Traffic fine appearing after vehicle ownership transfer",
            "body": "I sold my bike months ago and did the transfer, but fines are still showing under my name. What steps should I take to correct records?",
            "tags": "transport,traffic,ownership",
            "author_sub": "seed:nabin",
            "author_name": "Nabin Rai",
            "author_picture": None,
            "author_role": "Member",
            "created_at": iso_utc(now - timedelta(days=1, hours=18)),
        },
        {
            "title": "Can an employer force unpaid overtime in Nepal?",
            "body": "My company regularly asks us to work extra hours without pay. Is this legal? What does labour law say about overtime and compensation?",
            "tags": "labour,overtime,employment",
            "author_sub": "seed:samantha",
            "author_name": "Samantha Thapa",
            "author_picture": None,
            "author_role": "HR Consultant",
            "created_at": iso_utc(now - timedelta(days=1, hours=7)),
        },
        {
            "title": "How to file for divorce in Nepal (mutual vs contested)?",
            "body": "What is the process for divorce in Nepal? What documents are needed, and how long does mutual consent vs contested divorce usually take?",
            "tags": "family,divorce,court",
            "author_sub": "seed:mina",
            "author_name": "Mina Shrestha",
            "author_picture": None,
            "author_role": "Student",
            "created_at": iso_utc(now - timedelta(hours=20)),
        },
    ]

    with get_conn() as conn:
        cur = conn.cursor()

        # Clear existing data
        cur.execute("DELETE FROM answers")
        cur.execute("DELETE FROM questions")

        # Reset autoincrement counters (safe even if sqlite_sequence doesn't exist)
        try:
            cur.execute("DELETE FROM sqlite_sequence WHERE name IN ('questions', 'answers')")
        except Exception:
            pass

        # Insert sample questions
        for q in sample_questions:
            cur.execute(
                """
                INSERT INTO questions (
                    title,
                    body,
                    tags,
                    author_sub,
                    author_name,
                    author_picture,
                    author_role,
                    created_at,
                    updated_at,
                    upvotes,
                    downvotes,
                    answer_count
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    q["title"],
                    q["body"],
                    q["tags"],
                    q["author_sub"],
                    q["author_name"],
                    q["author_picture"],
                    q["author_role"],
                    q["created_at"],
                    q["created_at"],
                    0,
                    0,
                    0,
                ),
            )


if __name__ == "__main__":
    reset_and_seed()
    print("Seeded forum DB with sample questions.")
