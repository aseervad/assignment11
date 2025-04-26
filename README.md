# Assignment 11: React + Flask IELTS Speaking Test Platform

## Project Structure
assignment11/
├── backend/               # Flask API
│   ├── app.py            # Flask app entry
│   ├── requirements.txt  # Python dependencies
│   └── routes/           # API endpoints
├── ielts-speaking-test/  # React Frontend
│   ├── src/              # React components
│   ├── package.json      # Node.js dependencies
│   └── vite.config.js    # React build config
└── README.md             # Project docs
How to Run
Backend (Flask)
bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python app.py
Frontend (React)
bash
cd ielts-speaking-test
npm install
npm run dev
Features
Fetch speaking test questions from Flask API.

Dynamic rendering in React.

Error handling for API failures.
