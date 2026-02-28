# FinanceWise 📊

**A Production-Ready Full-Stack Personal Finance Management Application**

FinanceWise is a secure, cross-platform financial tracking system built to solve the day-to-day transaction management problem for individuals on tight budgets. It provides real-time expense logging, dynamic budget calculations, and strictly isolates data for multiple concurrent users.

## 🚀 Key Features

* **Secure Authentication:** JWT-based user login and registration.
* **Dynamic OTP Password Recovery:** Engineered custom HTTP-based OTP email delivery (bypassing cloud SMTP restrictions) to ensure reliable password resets.
* **Multi-Tenant Data Isolation:** Robust MongoDB schema design ensuring strict privacy and data isolation across multiple concurrent mobile clients.
* **Real-Time Processing:** Live expense calculation, category-wise tracking, and budget monitoring without client-side lag.
* **Cross-Platform Client:** A responsive, natively compiled Flutter frontend for both Android and iOS.

## 🛠️ Tech Stack

**Frontend (Mobile):**
* Flutter / Dart
* State Management & HTTP requests (Dio/HTTP)

**Backend (API Server):**
* Node.js & Express.js
* RESTful API Architecture
* EmailJS API (For secure, non-SMTP email handling)

**Database:**
* MongoDB & Mongoose (NoSQL Relational Schemas)

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your backend `.env` file:

`PORT` = 5000

`MONGO_URI` = < MongoDB Connection String>

`JWT_SECRET` = < Secure JWT Key>

`EMAILJS_SERVICE_ID` = < EmailJS Service ID>

`EMAILJS_TEMPLATE_ID` = < EmailJS Template ID>

`EMAILJS_PUBLIC_KEY` = < EmailJS Public Key>

`EMAILJS_PRIVATE_KEY` = < EmailJS Private Key>

## 💻 Local Setup Instructions

### Backend (Node.js)
1. Clone the repository.
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Start the server: `npm start` (Runs on http://localhost:5000)

### Frontend (Flutter)
1. Navigate to the frontend directory: `cd frontend`
2. Install packages: `flutter pub get`
3. Connect an emulator or physical device.
4. Run the app: `flutter run`

## 🏗️ Future Scope
* **Intelligent Analytics:** Machine learning implementation for spending pattern warnings.
* **Receipt Scanning:** OCR integration for automated expense entry.
* **Household Sync:** Multi-device shared database for family budget tracking.
