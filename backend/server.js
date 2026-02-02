const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const user = require('./model/user');
const fileRoutes = require("./routes/file.routes");


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/users', userRoutes);
app.use("/files", fileRoutes);


app.listen(PORT, () => {
  console.log(`server run on http://localhost:${PORT}`);
});
