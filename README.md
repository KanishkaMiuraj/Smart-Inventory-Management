Markdown

# 📦 Smart Inventory Management System

> **Author:** Kanishka Miuraj  
> **Stack:** React.js (Frontend) | .NET 8 Web API (Backend) | SQL Server (Database)

A complete, enterprise-grade inventory management solution featuring real-time stock tracking, backend-driven validation, and automated low-stock alerts.

---

## 📂 1. Project Structure

Before starting, please understand the folder structure of this repository. The project is divided into two main parts:

```text
Smart-Inventory-Management/  (Root Folder)
│
├── backend/                 # Contains the .NET 8 Web API & Database Logic
│   ├── Controllers/
│   ├── Models/
│   ├── appsettings.json     # Database Configuration is here
│   └── Program.cs
│
└── frontend/                # Contains the React.js Client Application
    ├── public/
    ├── src/
    └── package.json
```

## ⚙️ 2. Prerequisites

To run this project on a new system, ensure the following software is installed:

- **Node.js** (v16 or higher) – Required for frontend
- **.NET 8 SDK** – Required for backend
- **SQL Server** (Express or Developer Edition) – Database
- **Git** – Repository cloning


## 🛠️ 3. Backend Setup Guide (Server & Database)
- **The Backend must be started first so the Frontend has an API to talk to**

Step 3.1: Navigate to the Backend
- **Open your terminal (Command Prompt or PowerShell) and navigate into the backend folder:**


``` 
cd backend
```


Step 3.2: Configure the Database Connection

- **Open the file appsettings.json located inside the backend folder.**
- **Locate the "ConnectionStrings" section.**


## CRITICAL: You must update the Server= value to match your local SQL Server name.

- **If you are using SQL Express, it is usually .\SQLEXPRESS or (localdb)\MSSQLLocalDB.**
- **If you are using a full instance, it might be localhost or . (dot).**

Example appsettings.json:

```

"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=InventoryDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
Step 3.3: Create the Database (Migrations)
- **Run the following commands in your terminal (while inside the backend folder) to automatically create the InventoryDB database and tables:**



# Install Entity Framework Tool (Run only if not installed)

```
dotnet tool install --global dotnet-ef
```

# Apply Migrations to create the database

```
dotnet ef database update
```

Step 3.4: Run the Backend Server
- **Now, start the API server:**



```
dotnet restore
```

```
dotnet run
```


✅ Success: You should see output indicating the server is listening, typically at: http://localhost:5000 or https://localhost:7001

- **Note:** Keep this terminal window OPEN while testing the app.


## 💻 4. Frontend Setup Guide (Client App)
Now that the backend is running, let's start the React user interface.

Step 4.1: Open a New Terminal
Do not close the backend terminal. Open a NEW terminal window.

Step 4.2: Navigate to the Frontend
Navigate into the frontend folder:


```
cd frontend
```

Step 4.3: Install Dependencies
This downloads all necessary React libraries (node_modules). This may take a minute.

Bash

```
npm install
```

Step 4.4: Start the Application
Run the project:

```
npm start
```

✅ Success: Your default web browser should automatically open the application at: http://localhost:3000

## 🧪 5. How to Verify & Test
Once both terminals are running, you can test the full system:

Check Admin Dashboard:

Go to http://localhost:3000/admin (or click "Admin Dashboard" in the nav).

Verify that products load from the database.

Test Low Stock Logic:

In the Dashboard, add a product with Quantity: 5.

The "Low Stock Alert" card should immediately turn Red and pulse.

Test Order Validation:

Go to the Shop.

Try to add more items to the cart than the available stock.

The system will prevent this action (The + button will be disabled).

## 🆘 Troubleshooting
Database Connection Error?

Double-check your Server= name in appsettings.json.

Ensure SQL Server Service is running in Windows Services.

Port Conflicts?

If port 3000 or 5000 is busy, the terminal will ask to use another port. Type Y (Yes).
