const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const port = 3001;

const allowedOrigins = [
  "https://api-fixer.vercel.app",
  "https://dms-kcmt.netlify.app",
  "https://netflix-definitive-edition.vercel.app",
  "https://sis-kcmt.netlify.app",
  "http://localhost:3000",
];

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

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end();
});

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

app.get("/duggu-api/dummy", (req, res) => {
  res.json({
    success: true,
    message: "Dummy API is working in production mode!",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

module.exports = app;
