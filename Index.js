const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const connectDB = require('./Config/Db');
const adminRoutes = require("./Routes/AdminRoute");
const tlmRoutes = require("./Routes/TlmRoute");
const slmRoutes = require("./Routes/SlmRoute");
const flmRoutes = require("./Routes/FlmRoute");


//Configure dotenv file...
dotenv.config();


//Configure Database connectin file...
connectDB();


//Configure Object Files...
const app = express();


//Setup Middlewares...
app.use(express());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


//Configure Routes...
app.use("/api/admin", adminRoutes);
app.use("/api/tlm", tlmRoutes);
app.use("/api/slm", slmRoutes);
app.use("/api/flm", flmRoutes);


//Configure Server Port...
const port = process.env.PORT || 9001;


//Setup Server port...
app.listen(port, () => {
    console.log(`Server is successfully running at port no : ${process.env.PORT}`.bgCyan.white);
})