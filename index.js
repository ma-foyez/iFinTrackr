const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRouter = require("./routes/userRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
var cors = require('cors');
const AuthRouter = require("./routes/userRoute");
const ProfileRoute = require("./routes/PeopleRoute");
const TransactionRoute = require("./routes/transactionRoute");

dotenv.config();

const PORT = process.env.PORT || 4200;
const app = express();
app.use(cors())
connectDB();

app.use(express.json()); //to accept json data;

app.get('/', (req, res) => {
    res.send("Yahoo! APP is running successfully!");
});

app.use('/api/v1/user', AuthRouter)
app.use('/api/v1/profile', ProfileRoute)
app.use('/api/v1/transaction', TransactionRoute)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, console.log(`Server start on PORT ${PORT}`.yellow.bold));