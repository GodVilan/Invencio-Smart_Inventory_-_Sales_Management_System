# 🚀 Invencio – Smart Inventory & Sales Management System

**Invencio** is a modern, full-featured inventory and sales management system designed to streamline product tracking, order processing, and inventory analytics for small to medium-sized businesses.

This system helps businesses stay ahead of stock issues, optimize supply chains, and make confident, data-driven decisions.

---

## 🔧 Core Features

### 🛡️ Authentication & User Management
- Secure registration and login with JWT-based authentication
- Profile and password management
- Role-based access control (Admin, Seller, Supplier)

---

## 👥 User Roles & Functionalities

### 👑 Admin – Full Access
- Manage users: Add, update, delete Sellers and Suppliers
- Manage products: Create, edit, delete, categorize
- Manage purchases and inventory updates
- Full control over all sales records
- View sales history and generate time-based reports
- Access full dashboard with analytics
- Receive low-stock alerts and reorder suggestions
- *(Future)* Export reports (PDF/Excel)
- *(Future)* Email notifications for stock/sales events

### 🧑‍💼 Seller – Sales-Focused Access
- View available products
- Create, edit, and delete own sales records
- Auto-update inventory after sales
- View personal sales history (daily/weekly/monthly/yearly)
- Access personalized dashboard insights
- Manage own profile
- ❌ Cannot manage users, suppliers, or purchases

### 🚚 Supplier – Read-Only Access
- View supplier-related purchase data
- Manage own profile and contact details
- *(Optional)* View analytics for supplied products
- ❌ Cannot manage products, sales, or users

---

## 📦 Product Management
- Add, edit, and delete product details (name, description, price, stock)
- Manage categories, brands, and variants
- Filter, search, and paginate through product lists

---

## 💰 Sales Management
- Sell products with automatic stock adjustment
- Edit and delete sales records
- View sales trends and generate reports

---

## 🛒 Purchase & Inventory Control
- Record and update purchase data
- Sync inventory in real-time
- Auto-flag low stock for reorder

---

## 👤 Seller & Supplier Management
- Add, update, and delete seller and supplier profiles
- Organize supplier data for efficient procurement

---

## 📊 Sales History & Reports
- View and analyze sales by:
  - Daily
  - Weekly
  - Monthly
  - Yearly
- Analyze product performance by time or category

---

## 📈 Dashboard & Visualization
- Interactive visual dashboard to monitor:
  - Stock by brand/category
  - Top-selling products
  - Sales trends
  - Low-stock alerts
- Built using Chart.js or Recharts for clean and responsive charts

---

## 🧩 Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (NoSQL)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Styling:** Bootstrap (Responsive Design)  
- **Visualization:** Chart.js or Recharts  
- **Tools & Libraries:** Mongoose, Axios, React Router, dotenv, bcrypt, etc.

---

## ✅ Key Highlights
- Advanced search, filtering, and pagination
- Real-time inventory updates
- Role-based user access and permissions
- Responsive UI with Bootstrap
- Insightful sales and stock visualizations

---

## 🚧 Future Enhancements
- Enhanced role-based access (Admin, Seller, Viewer)
- Export reports as PDF/Excel
- Email alerts for stock thresholds and completed orders
- Advanced BI dashboard with dynamic filters and drill-down charts

---

## 📌 License

This project is open-source.

---

## 🙌 Contributions

Contributions are welcome! Please feel free to fork the repo and submit a pull request. For major changes, open an issue first to discuss what you'd like to change.

