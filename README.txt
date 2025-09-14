 # Cysh – Cyber Safety Classifier 

Cysh is a small project we built for our hackathon to make online communication safer.  
It is a web app that checks any message you type and classifies it into one of these categories:  
- Safe  
- Abusive  
- Harassment  
- Sarcasm  
- Dangerous  

---

## Problem Statement
In present time, people especially Women face a lot of abusive, threatening, and sarcastic content online.  
Most platforms don’t catch these messages quickly, which can harm mental health and safety.  
Our idea is to create a simple system that can automatically detect unsafe messages.

---

## working
- The backend is built with Python + Flask, using a pre-trained NLP model from HuggingFace (Transformers + PyTorch).  
- The frontend is built with Next.js + TailwindCSS, where users can type a message and get instant results.  
- The two parts are connected with an API (`/classify`) that returns the classification.  

---

## Features
1)Real-time message classification  
2)Categories for safe / abusive / harassment / sarcasm / dangerous  
3)Simple and clean web interface  
4)Keeps a history of recent classified messages

---

## Tech Stack
- Frontend: Next.js, TailwindCSS, shadcn/ui
- Backend:** Flask, Transformers, PyTorch
- Other: GitHub, Vercel/Render for hosting

---

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
