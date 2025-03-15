const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ✅ Allowed Frontend Domains
const allowedOrigins = [
  "https://api-fixer.vercel.app",
  "https://dms-kcmt.netlify.app",
  "http://localhost:3000"
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("CORS policy does not allow this origin!"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Middleware to Set CORS Headers in All Responses (Avoiding Duplicate Headers)
app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// ✅ Handle Preflight Requests
app.options('*', (req, res) => {
  res.sendStatus(204);
});

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Import Routes
const WishEmailRoute = require('./routes/KCMT-SIS/WishEmail/wishEmailRoute');
const DepartmentCreateRoute = require('./routes/KCMT-DMS/DepartmentCreate/departmentCreateRoute');
const authRoutes = require('./routes/Netflix-Definitive/authRoutes');

// ✅ Set API Routes
app.use('/duggu-api', WishEmailRoute);
app.use('/duggu-api', DepartmentCreateRoute);
app.use('/duggu-api/auth', authRoutes);

// ✅ Dummy Route for Testing
app.get('/duggu-api/dummy', (req, res) => {
  res.json({ 
    success: true, 
    message: "✅ Dummy API is working with proper CORS settings!" 
  });
});

// ✅ Root Endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ success: false, error: err.message });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
