const express = require('express');
const app = express();
const env = require('dotenv');
const db = require('./Config/db');

// Load environment variables before using them
env.config();

// Initialize the database connection after loading environment variables
db();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./Routes/user.routes');
app.use('/user', userRouter);

app.listen(3000, () => {
    console.log(`Server has been started at 3000`);
});
