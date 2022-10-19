const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const ingredientRoutes = require('./routes/ingredient.routes');
const recetteRoutes = require('./routes/recette.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middlware');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

//routes
app.use('/api/user', userRoutes);

//ingredient router
app.use('/api/ingredient', ingredientRoutes);

//recette router
app.use('/api/recette', recetteRoutes);


//server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});
