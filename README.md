# Hararghe Agricultural Marketplace Hub 🌾☕

Hararghe is a production-ready agricultural marketplace web application designed to connect farmers in the Hararghe Highlands (famous for premium coffee, chat, and groundnuts) with buyers.

## 🚀 Key Features

1. **Farmer Portals**: Set up profiles, manage crop listings (harvest dates, price, unit), track sales metrics, and update order fulfillment statuses.
2. **Buyer Catalog**: Advanced search & filter (filter by category, type, price ranges, and hubs like Babille or Alem Maya).
3. **Multilingual Interface**: Full translation support in **Amharic (አማርኛ)**, **Somali (Soomaali)**, **Afaan Oromo**, and **English** via `react-i18next`.
4. **CBE Birr payment gateway simulation**: Integrated with CBE Birr OTP checkout authorization and administrative feature-toggle configurations.
5. **Real-time Logistics Tracker**: Steps progress indicator showing carrier status (e.g. pending, ready for pickup, in transit, delivered) and estimated arrival.
6. **Agri-Bulletins Board**: Integrated announcements for weather notifications, market coffee auction rates, and cooperative notices.
7. **Interactive Charts**: Responsive analytics dashboards showing earnings trends (farmers) and purchase breakdowns (buyers) using Chart.js.
8. **Offline Mock Fallback**: The app detects if Firebase environment variables are defined. If missing, it automatically launches a persistent, local JSON database (`db.json`) ensuring a 100% functional workspace out-of-the-box.

---

## 🛠️ Tech Stack

*   **Backend**: Node.js, Express, Joi validation, JWT security, winston logging, Firebase Admin SDK.
*   **Frontend**: React.js (Vite), Tailwind CSS styling, Chart.js, i18next, Lucide React icons, Canvas Confetti.
*   **Database**: Firebase Firestore (backed by local JSON DB fallback).
*   **Auth**: Firebase Auth + JWT roles.
*   **Deployment**: Support for Docker / Docker Compose / Firebase Hosting + Functions.
*   **CI/CD**: GitHub Actions workflow.

---

## 💻 Local Installation & Setup

### Option 1: Manual Node.js Startup (Recommended for Local Dev)

Ensure you have **Node.js >= 20** installed on your system.

#### 1. Setup Backend:
```bash
cd backend
npm install
npm run dev
```
*The backend server will run on [http://localhost:8080](http://localhost:8080)*.

#### 2. Setup Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend server will run on [http://localhost:5173](http://localhost:5173)*.

---

### Option 2: Docker Compose Containerization
To run the entire stack in isolated Docker containers:
```bash
docker-compose up --build
```
*   The frontend will be served at [http://localhost:80](http://localhost:80)
*   The API service will be accessible at [http://localhost:8080](http://localhost:8080)

---

## ⚙️ Configuration & Environment Variables

You can configure the backend by modifying `backend/.env`.

*   `PORT`: Port of backend server (default `8080`).
*   `JWT_SECRET`: Signature key for authorization.
*   `ENABLE_CBE_BIRR`: Toggle to disable/enable CBE Birr payment processor (`true`/`false`).
*   `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Connect to a live production Firebase project (leave blank to run local Mock simulation).

---

## 🧪 Testing the Simulation

To test the application, register with the following default accounts or sign up a new account:

*   **Default Farmer Account**:
    *   **Email**: `farmer@hararghe.com`
    *   **Password**: `demo123`
*   **Default Buyer Account**:
    *   **Email**: `buyer@hararghe.com`
    *   **Password**: `demo123`

### Simulating CBE Birr Checkout:
1. Log in as `buyer@hararghe.com`.
2. Browse the marketplace catalog and click **Place Order** on a product.
3. Select **CBE Birr** payment, input phone number (e.g. `0911223344`), and submit.
4. Input security OTP verification code **`123456`** when prompted.
5. Pay and watch order status transfer, accompanied by celebratory confetti!
6. Log in as `farmer@hararghe.com` to see the received order, update shipping state, and view analytics charts.
