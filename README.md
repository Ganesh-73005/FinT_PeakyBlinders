

# **FinT - AI-Driven Financial Literacy & Fraud Detection**  
🚀 **A Smart Financial Assistant for Teens & the Elderly**  

## **📁 Project Structure**  

```
FinAutomata/
│── App.js                   # Main entry point for React Native frontend
│── CommonStyles.js          # Global styles for UI components
│── app.json                 # App configuration
│
│── automatic-categorization-backend/  # Backend for automatic GST categorization
│   ├── app.py               # Flask API for bill processing
│   ├── static/              # Frontend assets for Flask app
│   │   ├── script.js        # JS scripts for UI interactions
│   │   ├── style.css        # Styles for frontend
│   ├── templates/           # HTML templates for Flask views
│   │   ├── gst.html         # GST bill upload UI
│   │   ├── index.html       # Home page UI
│   ├── uploads/             # Captcha images (temp storage)
│
│── backend-node/            # Node.js backend (alternative API server)
│   ├── app.js               # API for fraud detection chatbot & scam classification
│
│── components/              # Reusable UI components
│   ├── Chatbot.js           # AI-based fraud detection chatbot
│
│── config.js                # Configuration settings
│
│── context/                 # Global state management (React Context API)
│   ├── StateContext.js      # Context provider for state management
│
│── screens/                 # Main app screens
│   ├── MainScreen.js        # Dashboard UI
│   ├── auth/                # Authentication screens
│   │   ├── AuthScreen.js    # Authentication container
│   │   ├── GetStarted.js    # Welcome screen
│   │   ├── Login.js         # User login screen
│   │   ├── Register.js      # User registration screen
│   │   ├── Register2.js     # Additional registration steps
│   ├── features/            # Core features of FinAutomata
│   │   ├── ExpenseTracker.js     # AI-powered expense tracking
│   │   ├── GSTScanner.js         # GST bill scanning and categorization
│   │   ├── LearningMaterials.js  # Financial literacy tutorials (cartoons for teens)
│   │   ├── MapInterface.js       # Map-based spending analysis
│   │   ├── NewsSection.js        # Scam alerts & fraud news
│   │   ├── ProfileScreen.js      # User profile & settings
│   ├── pages/               # Additional pages
│   │   ├── Loading.js       # Loading screen
│   │   ├── Profile.js       # Profile settings UI
│
│── server/                  # Backend services for scam detection
│   ├── App.py               # Flask API for scam & phishing detection
│   ├── app2.py              # Alternative implementation
│   ├── phishing_urls.csv    # Dataset of phishing links
│   ├── requirements.txt     # Dependencies for backend
│   ├── spam_classifier.pkl  # Pre-trained spam classification model
│
│── tests/                   # Automated test scripts
│   ├── backend_tests/       # Unit tests for Flask backend
│   ├── frontend_tests/      # UI component tests
│
│── .gitignore               # Ignore unnecessary files
│── README.md                # Project documentation (this file)
│── LICENSE                  # Open-source license
│── Dockerfile               # Docker container setup
```

---

## **📌 Features & Description**  

### **📂 Backend Services**
1. **GST Bill Processing (`automatic-categorization-backend/`)**
   - `app.py` → Extracts GST details, classifies expenses, and updates the tracker.  
   - `uploads/` → Stores temporary CAPTCHA images for GST validation.  

2. **Fraud Detection API (`backend-node/`)**
   - `app.js` → Handles chatbot fraud analysis, scam classification, and phishing detection.  

3. **Spam & Phishing Classifier (`server/`)**
   - `App.py` → Uses ML to detect scam messages.  
   - `phishing_urls.csv` → Dataset for phishing detection training + blacklist api.  
   - `spam_classifier.pkl` → Pre-trained scam detection model. (bayes model) 

---

### **📂 Frontend (React Native)**
1. **Main Screens (`screens/`)**
   - **Dashboard (`MainScreen.js`)** → Shows expenses, scam alerts, and financial insights.  
   - **Expense Tracker (`features/ExpenseTracker.js`)** → AI categorizes expenses automatically.  
   - **Chatbot (`components/Chatbot.js`)** → Users upload text, PDFs, or audio to check fraud.  
   - **Learning Materials (`features/LearningMaterials.js`)** → Cartoon-based tutorials for financial literacy.  

2. **Authentication (`screens/auth/`)**
   - **Login (`Login.js`)** → User authentication screen.  
   - **Registration (`Register.js, Register2.js`)** → Sign-up process with security verification.  

---
---

## **🔧 Setup & Installation**  

### **1️⃣ Backend Setup (Flask & Node.js)**
#### **Flask API**
```bash
cd automatic-categorization-backend
pip install -r requirements.txt
python app.py
```

#### **Node.js API**
```bash
cd backend-node
npm install
node app.js
```

---

### **2️⃣ Frontend Setup (React Native)**
```bash
npm install
npm run start
```

---

### **3️⃣ Database Setup**
- Configure **MongoDB/PostgreSQL** and initialize with:
```bash
python database/init_db.py
```

---

### **4️⃣ Testing APIs**
- Use **Postman** or **cURL** to test APIs.  
- Example request (Expense Categorization API):  
```bash
curl -X POST http://localhost:5000/api/scan_bill -F "file=@receipt.jpg"
```

---

## **🛡️ Security Measures**
✔ **OAuth2.0 / Firebase Auth** for secure login.  
✔ **JWT Tokens** for API authentication.  
✔ **Data encryption** for sensitive financial details.  

---

## **🚀 Roadmap & Future Enhancements**
✅ **Phase 1:** GST Scanning, Expense Tracker, Fraud Detection.  
🚧 **Phase 2:** AI Chatbot, Scam Analysis, Teen Financial Literacy.  
🔜 **Phase 3:** **Multilingual Support** & Blockchain Security.  

---

## **📜 License**
This project is open-source under the **MIT License**.  

---

This **README.md** covers everything—**folder descriptions, setup instructions, API testing, and security**. Let me know if you need additional refinements! 🚀
