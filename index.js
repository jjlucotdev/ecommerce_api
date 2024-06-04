const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://admin:admin1234@capstone2-ecommerce.x4q92t5.mongodb.net/ecommerce?retryWrites=true&w=majority");

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("We're connected to the cloud database"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

if(require.main === module){
	app.listen(process.env.PORT || port, () => console.log(`API is now online on port ${process.env.PORT || port}`));
}

module.exports = {app, mongoose};