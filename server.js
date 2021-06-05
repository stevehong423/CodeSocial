//SETTING UP SERVER

//require express
const express = require('express');
const app = express();

//require in database connection, and connect to database
const connectDB = require('./config/db');
connectDB();

//initialize middleware (this allows us to see request.body)
app.use(express.json({ extended: false}))

//test endpoint
app.get('/', (req, res) => res.send('API Running'));

//define routes 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//create port 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));