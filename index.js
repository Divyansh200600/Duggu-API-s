const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const port = 3001;

const allowedOrigins = [
  "https://dms-kcmt.netlify.app",
  "https://netflix-definitive-edition.vercel.app",
  "https://sis-kcmt.netlify.app",
  "https://duggu-ramz.netlify.app",
 
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
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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


// ----------------------------------------------------------------

// ✅ Import API Routes

// 1. KCMT-SIS Route
const WishEmailRoute = require("./routes/KCMT-SIS/WishEmail/wishEmailRoute");

// 2. KCMT-DMS Route
const DepartmentCreateRoute = require("./routes/KCMT-DMS/DepartmentCreate/departmentCreateRoute");

// 3. Netflix Definitive Edition Route
const authRoutes = require("./routes/Netflix-Definitive/authRoutes");

// 4. Duggu-Ramz Route
const shayariRoutes = require("./routes/Duggu-Ramz/shayariRoutes");
// ----------------------------------------------------------------


// ----------------------------------------------------------------

// ✅ Set API Endpoints

// 1. KCMT-SIS Endpoints
app.use("/duggu-api", WishEmailRoute);

// 2. KCMT-DMS Endpoints
app.use("/duggu-api", DepartmentCreateRoute);

// 3. Netflix Definitive Edition Endpoints
app.use("/duggu-api/auth", authRoutes);

// 4. Duggu-Ramz Endpoints
app.use("/duggu-api/ramz", shayariRoutes);

// ----------------------------------------------------------------


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

module.exports = app;
