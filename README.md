# Digital Twin System – Transformer Monitoring

## 🔑 Demo Login Credentials

Use the following credentials to test the application:

| Field | Value |
|---|---|
| Email | `anurag@gmail.com` |
| Password | `1234567890` |

> These are demo credentials for testing purposes only.

---

## 📌 Project Overview

The **Digital Twin System for Transformer Monitoring** is a web-based application designed to monitor and evaluate the operating condition of electrical transformers.

The system creates a digital representation of a physical transformer by collecting important operating parameters such as temperature, oil condition, voltage, and current.

Based on these readings, the system evaluates transformer health, identifies abnormal operating conditions, and maintains daily historical records to help understand transformer performance over time.

The main objective is to support condition-based monitoring and help identify potential transformer issues before they become serious failures.

## ✨ Key Features

### 1. User Authentication
- User registration and login.
- JWT-based authentication.
- Secure HTTP-only cookie storage.
- Protected backend API endpoints.

### 2. Transformer Management
- Add new transformers.
- View all registered transformers.
- Store transformer specifications, including:
  - Transformer ID
  - Installation address
  - Voltage class
  - Rated capacity
  - Manufacturer oil level markings
- Update and delete transformer records.

### 3. Real-Time Transformer Condition Evaluation

Evaluate transformer health using three major monitoring categories:

**Temperature Monitoring**
- Ambient temperature.
- Top oil temperature.
- Winding temperature.
- Classifies temperature conditions as Healthy, Warning, or Critical.

**Oil Condition Monitoring**
- Oil moisture level (ppm).
- Oil level based on manufacturer markings.
- Identifies abnormal oil conditions.

**Load Monitoring**
- Three-phase current measurements (A, B, C).
- Line-to-line voltage.
- Calculates average current and apparent power (kVA).
- Calculates transformer load percentage.
- Identifies normal loading, near-rated loading, and overloading.

### 4. Overall Health Assessment

The system combines temperature, oil, and load evaluation results to determine the overall transformer condition.

Possible health statuses:
- 🟢 Healthy
- 🟡 Warning
- 🔴 Critical

### 5. Daily Historical Monitoring

- Automatically maintains daily average readings.
- Stores average temperature, oil condition, and load measurements.
- Tracks the number of readings collected each day.
- Displays historical transformer performance.
- Retrieves historical records directly from MongoDB through the history API.

## 🧠 Monitoring and Evaluation Logic

The system uses predefined threshold-based algorithms to evaluate transformer operating conditions.

**Apparent Power Calculation**

For a three-phase transformer:

\[
S = \frac{\sqrt{3}\times V_{LL}\times I_{avg}}{1000}
\]

Where:
- \(S\) = Apparent power in kVA.
- \(V_{LL}\) = Line-to-line voltage in volts.
- \(I_{avg}\) = Average three-phase current in amperes.

**Load Percentage**

\[
Load\% = \frac{Apparent\ Power}{Rated\ Capacity}\times 100
\]

**Daily Average Calculation**

The system updates daily averages incrementally whenever a new reading is received.

\[
NewAverage = \frac{OldAverage \times Count + NewValue}{Count+1}
\]

Daily averages are stored with two decimal places.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, HTTP-only Cookies |
| API Architecture | REST APIs |

## 📂 Project Structure

### Backend

```text
SystemBackend/
├── Cache/
│   ├── TemperatureCache.js
│   └── OilCache.js
├── Controllers/
│   ├── AuthController.js
│   └── TransformerController.js
├── Middleware/
│   └── Authorized.js
├── Models/
│   ├── UserModel.js
│   ├── TransformerModel.js
│   └── TransformerDailyStatsModel.js
├── Routes/
│   ├── AuthRoute.js
│   └── TransformerRoute.js
├── Services/
│   └── TransformerServices.js
├── app.js
└── index.js
```

### Frontend

```text
SystemFrontend/
├── src/
│   ├── Components/
│   │   ├── AuthComponent/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── CommanComponent/
│   │   │   └── Header.jsx
│   │   └── TransformerComponent/
│   │       ├── TransformerDashboard.jsx
│   │       ├── TransformerList.jsx
│   │       ├── TransformerCard.jsx
│   │       ├── TransformerDetails.jsx
│   │       ├── CurrentCondition.jsx
│   │       ├── TransformerHistory.jsx
│   │       ├── AddTransformer.jsx
│   │       └── utils/
│   ├── Http/
│   │   └── http.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🔗 Backend API Endpoints

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Logout user |

### Transformer APIs

All transformer endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transformer` | Get all transformers |
| POST | `/api/transformer/add` | Add a new transformer |
| POST | `/api/transformer/:transformerID/condition` | Evaluate current transformer condition |
| GET | `/api/transformer/:transformerID/history` | Retrieve daily historical records |
| PUT | `/api/transformer/:transformerID` | Update transformer details |
| DELETE | `/api/transformer/:transformerID` | Delete transformer and its history |

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AnuragKushwaha4/Digital-Twin-System-Transformer.git
cd Digital Twin System
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd SystemBackend
npm install
```

Create a `.env` file in the backend root directory:

```env
PORT=8000
MONGO_URI=Deployed on Atlas
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd SystemFrontend
npm install
```

Create a `.env` file in the frontend root directory:

```env
VITE_BACKEND_URL=http://localhost:5173
```

Start the frontend:

```bash
npm run dev
```

### 4. Access the Application

Open the frontend URL provided by Vite, usually:

```text
http://localhost:5173
```

Login using the demo credentials provided at the beginning of this README.

## 📊 Historical Data Management

The system maintains one daily statistics record per transformer per day.

Each record stores:

- Average ambient temperature.
- Average top oil temperature.
- Average winding temperature.
- Average oil level.
- Average oil moisture.
- Average apparent power.
- Average load percentage.
- Number of readings collected.

Historical records are retrieved through the dedicated transformer history API.

## 🚀 Future Improvements

- Integration with actual transformer sensors and IoT devices.
- Live monitoring through WebSockets.
- Interactive historical charts and trend analysis.
- Predictive maintenance using machine learning.
- Automated alerts and notifications.
- Advanced transformer health analytics.

---

**Digital Twin System – Transformer Monitoring**

*A condition-based monitoring solution for understanding and tracking transformer health.*




## ⚠️ Deployment Note – Render Free Tier

The backend is deployed on Render's free web service plan.

- Render automatically spins down the backend after 15 minutes of inactivity.
- When a new API request arrives, Render automatically starts the backend again.
- The first request after inactivity may take approximately **one minute** to receive a response because of the cold start.
- Subsequent requests work normally once the backend is running.
- The frontend may experience a temporary delay while the backend wakes up.

**Note:** This is expected behavior of Render's free hosting plan and does not indicate an application error.