# AbroadMates-AI-Chatbot

An AI-powered chatbot that helps students with study abroad guidance — from scholarships and universities to part-time jobs and visas.  
Built using **Rasa** and **Google Gemini**, and deployed with **Docker** + **Nginx** on a secure HTTPS subdomain.

---

## ✨ Features

- 🤖 Smart hybrid chatbot: Rule-based + LLM fallback (Gemini)
- 📚 Handles questions like:
  - Scholarships & funding
  - Visa & application process
  - Student accommodation
  - University selection
  - Part-time jobs & work permits
  - Student life & culture abroad
- 💬 Clean web-based chat UI
- 🔐 Deployed on `https://chat.abroadmates.com` with HTTPS
- 🐳 Runs using Docker & Nginx reverse proxy

---

## 🛠 Tech Stack

- Rasa 3.6.2  
- Python 3.9  
- Gemini API (via custom action)  
- Docker + Docker Compose  
- HTML / JS Frontend  
- Nginx + Certbot (HTTPS)

---

## 🚀 How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/AbroadMates-AI-Chatbot.git
   cd AbroadMates-AI-Chatbot
Train Rasa model
docker exec -it rasa-core bash
rasa train
exit
Start everything
sudo docker-compose up -d --build
(Optional) Setup HTTPS
sudo certbot --nginx -d chat.abroadmates.com

🌐 Live Demo

👉 Visit: https://chat.abroadmates.com
Try asking:

"What scholarships are available in Japan?"
"How do I apply for a student visa?"
"Can I work part-time while studying in Germany?"


---

## 📝 License

This project is licensed under the MIT License.


