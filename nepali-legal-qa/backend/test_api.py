from fastapi.testclient import TestClient
import main
import logging

logging.basicConfig(level=logging.ERROR)

client = TestClient(main.app)
print('health:', client.get('/api/health').status_code, client.get('/api/health').json())

try:
    resp = client.post('/api/query', json={'question':'What is the process to file a complaint in Nepal?','mode':'agent'})
    print('agent:', resp.status_code, resp.json())
except Exception as e:
    print('agent error:', e)

try:
    resp2 = client.post('/api/query', json={'question':'Any question','mode':'hyde'})
    print('hyde:', resp2.status_code, resp2.json())
except Exception as e:
    print('hyde error:', e)
