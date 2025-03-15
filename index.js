// ✅ Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Initialize Express app
const app = express();
const port = 3001;

// ✅ Define allowed origins for CORS
const allowedOrigins = [
  "https://api-fixer.vercel.app",
  "https://dms-kcmt.netlify.app",
  "https://netflix-definitive-edition.vercel.app/",
  "http://localhost:3000",
];

// ✅ Configure CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin!"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware to Set CORS Headers in All Responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// ✅ Handle Preflight Requests (OPTIONS)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end();
});

// ✅ Middleware for parsing JSON and serving static files
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Import API Routes

// 1. KCMT-SIS Route
const WishEmailRoute = require("./routes/KCMT-SIS/WishEmail/wishEmailRoute");

// 2. KCMT-DMS Route
const DepartmentCreateRoute = require("./routes/KCMT-DMS/DepartmentCreate/departmentCreateRoute");

// 3. Netflix Definitive Edition Route
const authRoutes = require("./routes/Netflix-Definitive/authRoutes");

// ✅ Set API Endpoints

// 1. KCMT-SIS Routes
app.use("/duggu-api", WishEmailRoute);

// 2. KCMT-DMS Routes
app.use("/duggu-api", DepartmentCreateRoute);

// 3. Netflix Definitive Edition Routes
app.use("/duggu-api/auth", authRoutes);

// ✅ Dummy Test Route to check API functionality
app.get("/duggu-api/dummy", (req, res) => {
  res.json({
    success: true,
    message: "Dummy API is working in production mode!",
  });
});

// ✅ Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

// ✅ Export for serverless deployment (e.g., Vercel)
module.exports = app;
