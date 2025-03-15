const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 

dotenv.config();

const app = express();
const port = 3001;


const allowedOrigins = [
  "https://dms-kcmt.netlify.app",
  "http://localhost:3000",
  "https://api-fixer.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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
