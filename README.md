# 🎟️ TicketBari - Online Ticket Booking Platform

TicketBari is a full-stack MERN-based online ticket booking platform where users can discover and book tickets for different transportation services such as **Bus, Train, Flight, and Launch**. The platform supports three different roles: **User**, **Vendor**, and **Admin**, each with their own dashboard and permissions.

---

## 🚀 Live Demo

### Client
https://your-client-url.vercel.app

### Server
https://your-server-url.onrender.com

---

## 📌 Project Purpose

The goal of this project is to provide a complete online ticket booking solution where:

- Users can browse and book tickets.
- Vendors can add and manage their tickets.
- Admins can approve tickets, manage users, and advertise featured tickets.
- Secure authentication and Stripe payment integration ensure a seamless user experience.

---

# ✨ Features

## 🔐 Authentication

- Better Auth Authentication
- Google Login
- Email & Password Login
- Protected Routes
- JWT Protected APIs

---

## 👤 User Features

- View all approved tickets
- Search & Filter tickets
- Sort tickets by price
- Book tickets
- Stripe payment integration
- View booked tickets
- Transaction history
- Countdown before departure

---

## 🏢 Vendor Features

- Vendor Dashboard
- Add new tickets
- Update/Delete tickets
- View booking requests
- Accept/Reject bookings
- Revenue overview with charts

---

## 🛠️ Admin Features

- Manage all tickets
- Approve/Reject tickets
- Manage users
- Promote users to Vendor/Admin
- Mark vendors as Fraud
- Advertise tickets
- Maximum 6 advertised tickets

---

## 🎨 UI Features

- Fully Responsive
- Modern Dashboard
- Dark & Light Mode
- Charts using Recharts
- Hero Slider
- Advertisement Section
- Latest Tickets Section
- Loading Spinner
- Custom Error Page

---

# 🛠️ Tech Stack

### Frontend

- Next.js 16
- React 19
- HeroUI
- React Icons
- Swiper.js
- Recharts
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Better Auth
- JWT
- Stripe

---

# 📦 NPM Packages Used

```json
{
  "@better-auth/mongo-adapter": "^1.6.22",
  "@heroui/react": "^3.2.1",
  "@heroui/styles": "^3.2.1",
  "@stripe/stripe-js": "^9.8.0",
  "better-auth": "^1.6.22",
  "jsonwebtoken": "^9.0.3",
  "mongodb": "^7.4.0",
  "next": "^16.2.9",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "react-hot-toast": "^2.6.0",
  "react-icons": "^5.6.0",
  "recharts": "^3.9.0",
  "stripe": "^22.3.0",
  "swiper": "^14.0.1"
}
```

---

# 📁 Folder Structure

```
client/
│── app/
│── components/
│── hooks/
│── lib/
│── providers/
│── public/

server/
│── routes/
│── middleware/
│── utils/
│── config/
│── index.js
```

---

# ⚙️ Environment Variables

Create a `.env.local` file for the client and a `.env` file for the server.

## Client

```env
BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_API_URL=http://localhost:5000

NEXT_PUBLIC_IMGBB_KEY=YOUR_IMGBB_KEY

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
```

## Server

```env
BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET

MONGODB_URI=YOUR_MONGODB_URI

STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
```

> **⚠️ Security Note:** Never commit your actual secrets (database URI, authentication secret, Stripe keys, etc.) to GitHub. Replace them with placeholder values like the examples above before publishing your repository.

---

# 💻 Installation

Clone both repositories.

```bash
git clone https://github.com/your-username/ticketbari-client.git

git clone https://github.com/your-username/ticketbari-server.git
```

Install dependencies.

```bash
npm install
```

Run the client.

```bash
npm run dev
```

Run the server.

```bash
nodemon index.js
```

---

# 📊 Main Functionalities

- Better Auth Authentication
- Google Login
- JWT Authentication
- Role-Based Dashboard
- Ticket Booking
- Stripe Payment
- Vendor Ticket Management
- Admin Ticket Approval
- Advertisement System
- Search
- Filter
- Sorting
- Pagination
- Revenue Charts

---

# 🔒 Security

- Environment Variables
- JWT Protected APIs
- Better Auth Session Management
- Protected Routes
- Secure MongoDB Connection

---

# 👨‍💻 Author

**Md Shajjadul Ferdous**

GitHub: https://github.com/your-github-username

---

# 📄 License

This project is developed for educational purposes.