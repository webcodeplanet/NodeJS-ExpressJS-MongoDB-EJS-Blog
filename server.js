const express = require('express');
const mongoose = require('mongoose');
const app = express();
const postRoutes = require('./routes/post-routes');
const methodOverride = require('method-override');


require('dotenv').config()

app.use(methodOverride('_method'));

mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => console.log('Connected to DB'))
    .catch((error) => console.log(error));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.use(express.static('./public'));

app.use(postRoutes);

app.listen(process.env.PORT, (error) => {
    error ? console.log(error) : console.log(`Listening on ${process.env.PORT}`);
})

