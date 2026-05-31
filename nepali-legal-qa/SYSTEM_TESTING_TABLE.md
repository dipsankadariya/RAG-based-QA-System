# Table 3.1 System testing table

| Test Case ID | Description | Input | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| TC001 | Login page loads when user is not authenticated | Open app URL | Redirects to login page | Redirected to login page | PASS |
| TC002 | Google Sign-In generates JWT token | Valid Google account | Token returned and saved | Token returned and saved | PASS |
| TC003 | Verify token returns current user | Authorization: Bearer `<jwt>` | User details returned | User details returned | PASS |
| TC004 | Forum API health endpoint works | GET `/api/forum/health` | `{status: "ok"}` | `{status: "ok"}` | PASS |
| TC005 | Forum list loads threads from database | Open `/forum` | Threads displayed | Threads displayed | PASS |
| TC006 | Create a new forum question | POST `/api/forum/questions` | Question created | Question created | PASS |
| TC007 | Open question details with answers | GET `/api/forum/questions/{id}` | Question + answers shown | Question + answers shown | PASS |
| TC008 | Post an answer to a question | POST `/api/forum/questions/{id}/answers` | Answer added and count updated | Answer added and count updated | PASS |
| TC009 | Upvote a question | POST `/api/forum/questions/{id}/vote` (`value=1`) | Upvote increments | Upvote increments | PASS |
| TC010 | Upvote an answer | POST `/api/forum/answers/{aid}/vote` (`value=1`) | Answer upvote increments | Answer upvote increments | PASS |
| TC011 | RAG API health endpoint shows readiness | GET `/api/health` | System status returned | System status returned | PASS |
| TC012 | HyDE RAG query returns Nepali legal answer | POST `/api/query` (`mode=hyde`) | Nepali answer returned | Nepali answer returned | PASS |
| TC013 | Agent mode query returns answer | POST `/api/query` (`mode=agent`) | Answer returned | Answer returned | PASS |
| TC014 | Frontend proxy avoids CORS issues | Browser calls `/api/*` | No CORS error | No CORS error | PASS |
| TC015 | Forum data persists after backend restart | Restart forum API | Existing threads remain | Existing threads remain | PASS |
| TC016 | Logout protects routes | Logout then open `/forum` | Redirects to login | Redirects to login | PASS |
## Notes (what to record during testing)
- **Environment**: OS, browser, backend URLs (ngrok), versions.
- **Evidence**: screenshots of key pass/fail cases; API responses for failures.
- **Defects**: log the TC ID, steps, expected vs actual, and severity.
