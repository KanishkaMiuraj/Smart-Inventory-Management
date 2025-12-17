📦 Smart Inventory Management System
A full-stack inventory management solution built with React.js (Frontend) and .NET 8 Web API (Backend), featuring real-time stock alerts, order management, and SQL Server integration.

🚀 Prerequisites
Ensure you have the following installed on your system:

Node.js (v16 or higher)

.NET 8 SDK

SQL Server (Express or Developer)

🛠️ Setup Instructions
1️⃣ Database Setup
Open SQL Server Management Studio (SSMS).

Create a new database named InventoryDB.

Go to the backend folder and open appsettings.json.

Update the ConnectionStrings section with your local Server Name:

JSON

"DefaultConnection": "Server=YOUR_SERVER_NAME;Database=InventoryDB;Trusted_Connection=True;TrustServerCertificate=True;"
Open a terminal in the backend folder and run migrations to create tables:

Bash

dotnet ef database update
2️⃣ Backend Setup (.NET API)
Navigate to the backend folder:

Bash

cd backend
Restore dependencies and run the API:

Bash

dotnet restore
dotnet run
The API will start at http://localhost:5000 (or similar port shown in terminal).

3️⃣ Frontend Setup (React)
Open a new terminal and navigate to the frontend folder:

Bash

cd frontend
Install dependencies:

Bash

npm install
Start the application:

Bash

npm start
The app will launch in your browser at http://localhost:3000.

🔑 Login Credentials (If applicable)
This is an open dashboard, no login required for this demo version.

✨ Key Features
Low Stock Alerts: Automatic visual alerts and animations when stock dips below limit.

Order Validation: Backend prevents ordering more items than available in stock.

Real-time Calculations: Backend-driven price and total logic.

N-Tier Architecture: Clean separation of UI, Business Logic, and Data Access.
