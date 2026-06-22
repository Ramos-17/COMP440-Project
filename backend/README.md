# Backend

Flask API for the COMP440 project.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API runs on `http://127.0.0.1:5000`.

## Endpoints

- `GET /api/health` returns `{"status": "ok"}`
- `GET /api/message` returns a sample message for frontend testing
