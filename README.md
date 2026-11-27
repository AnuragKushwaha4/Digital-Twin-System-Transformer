# Digital Twin System – Transformer Monitoring
### Project Documentation & Setup Guide

## 1. Project Overview

The **Digital Twin System for Transformer Monitoring** is a web-based application designed to monitor and evaluate the operational health of electrical transformers.

The application maintains a digital representation of physical transformers by collecting and evaluating important operating parameters, including temperature, oil condition, voltage, and current.

Using predefined threshold-based algorithms, the system identifies abnormal operating conditions, determines the overall transformer health status, and maintains daily historical records for monitoring performance over time.

The primary objective is to support condition-based monitoring and help identify potential transformer issues before they develop into serious failures.

## 2. Key Features

- **User Authentication:** Secure registration and login using JWT-based authentication and HTTP-only cookies.
- **Transformer Management:** Add, view, update, and delete transformer records.
- **Temperature Monitoring:** Evaluate ambient, top oil, and winding temperatures.
- **Oil Condition Monitoring:** Evaluate oil moisture levels and oil levels against predefined thresholds and manufacturer markings.
- **Load Monitoring:** Calculate three-phase average current, apparent power, and transformer loading percentage.
- **Overall Health Assessment:** Combine temperature, oil, and load evaluation results to determine whether a transformer is Healthy, Warning, or Critical.
- **Historical Monitoring:** Maintain daily average readings and retrieve historical transformer performance records.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, HTTP-only Cookies |
| API Architecture | REST APIs |

## 4. Application Access

The application is deployed and can be accessed using the following link:

**Frontend:** [[Insert deployed frontend URL](https://digital-twin-system-transformer-qwn.vercel.app/)]

**Demo Login Credentials:**

| Field | Value |
|---|---|
| Email | anurag@gmail.com |
| Password | 1234567890 |

These credentials are provided for application testing purposes.

## 5. Deployment Information – Render

The backend application is deployed on **Render's Free Web Service Plan**.

Please be aware of the following hosting limitations:

- Render automatically spins down the backend after approximately 15 minutes of inactivity.
- When a new API request arrives, Render automatically starts the backend again.
- The first request after inactivity may take approximately 30–60 seconds or longer to respond.
- Once the backend has restarted, subsequent API requests should work normally.

**Important:** A delay in the initial API response is expected behavior of Render's free hosting plan and does not necessarily indicate an application failure.

## 6. Running the Project Locally

If the deployed backend is unavailable or takes too long to respond, the application can be executed locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js and npm
- Git
- MongoDB connection (MongoDB Atlas or a local MongoDB instance)

### Step 1: Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/AnuragKushwaha4/Digital-Twin-System-Transformer.git

cd Digital-Twin-System-Transformer
```

### Step 2: Configure the Backend

Navigate to the backend directory:

```bash
cd SystemBackend
npm install
```

Create a `.env` file in the backend root directory.

The required environment configuration will be shared separately through email.

Make sure the MongoDB connection string and other required environment variables are correctly configured.

### Step 3: Start the Backend

Run the following command:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:8000
```

### Step 4: Configure the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd SystemFrontend
npm install
```

Create a `.env` file in the frontend root directory.

Configure the backend URL as follows:

```env
VITE_BACKEND_URL=http://localhost:8000
```

This ensures that frontend API requests are directed to the locally running backend instead of the deployed Render service.

### Step 5: Start the Frontend

Execute:

```bash
npm run dev
```

The frontend will generally be available at:

```text
http://localhost:5173
```

### Step 6: Access the Application

Open the frontend URL in your browser:

```text
http://localhost:5173
```

Log in using the demo credentials provided in Section 4.

The application should now run using your local backend and MongoDB database.

## 7. Environment Configuration

The environment configuration files required to run the project will be shared separately through email.

These files contain the necessary configuration values, including backend settings and database connectivity.

**Important:** Keep the `.env` files private. Do not upload them to GitHub or share their contents publicly.

If the deployed backend becomes unavailable, use the shared environment configuration to run the project locally.


**Digital Twin System – Transformer Monitoring**

*Project Documentation | Application Access | Local Development Guide*