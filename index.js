const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 



dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// Set Routes for All Applications------------------------>

const WishEmailRoute = require('./routes/KCMT-SIS/WishEmail/wishEmailRoute');


// Set Path for All Applications-------------------------->


app.use('/duggu-api', WishEmailRoute);


// Root API endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});


// Start the server
app.listen(port, () => {
  console.log(`API at http://localhost:${port}`);
});
