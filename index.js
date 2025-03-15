const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 

dotenv.config();

const app = express();
const port = 3001;


const allowedOrigins = [
  "https://api-fixer.vercel.app",  // ✅ Your production frontend
  "https://dms-kcmt.netlify.app",  // ✅ Another allowed frontend
  "http://localhost:3000",         // ✅ Local development
];

app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://api-fixer.vercel.app","http://localhost:3000"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.options('*', cors());



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set Routes for All Applications------------------------>

// 1. KCMT-SIS
const WishEmailRoute = require('./routes/KCMT-SIS/WishEmail/wishEmailRoute');

// 2. KCMT-DMS
const DepartmentCreateRoute = require('./routes/KCMT-DMS/DepartmentCreate/departmentCreateRoute');

// 3. Netflix Definitive Edition
const authRoutes = require('./routes/Netflix-Definitive/authRoutes');

// Set Path for All Applications-------------------------->

// 1. KCMT-SIS
app.use('/duggu-api', WishEmailRoute);

// 2. KCMT-DMS
app.use('/duggu-api', DepartmentCreateRoute);

// 3. Netflix Definitive Edition
app.use('/duggu-api/auth', authRoutes);

// ✅ Dummy Route to Test API
app.get('/duggu-api/dummy', (req, res) => {
  res.json({ 
      success: true, 
      message: "Dummy API is working in production mode!" 
  });
});


// Root API endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});


app.listen(port, () => {
  console.log(`API at http://localhost:${port}`);
});
