const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 

dotenv.config();

const app = express();
const port = 3001;

// Configure CORS options
const corsOptions = {
  origin: ['http://localhost:3000'], // Allow specific frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight requests for all routes

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set Routes for All Applications------------------------>

// 1. KCMT-SIS
const WishEmailRoute = require('./routes/KCMT-SIS/WishEmail/wishEmailRoute');

// 2. KCMT-DMS
const DepartmentCreateRoute = require('./routes/KCMT-DMS/DepartmentCreate/departmentCreateRoute');

// Set Path for All Applications-------------------------->

// 1. KCMT-SIS
app.use('/duggu-api', WishEmailRoute);

// 2. KCMT-DMS
app.use('/duggu-api', DepartmentCreateRoute);

// Root API endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

// Start the server
app.listen(port, () => {
  console.log(`API at http://localhost:${port}`);
});
