const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/CatchAsync');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { campgroundSchema } = require('./schema.js');
const { privateDecrypt } = require('crypto');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const validateCampground = (req, res, next) => {
    const { error }= campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();


app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended : true}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/',  (req, res) => {
    res.render('home');
});

app.get('/campgrounds',  async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campground/new',  async(req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds/:id/reviews', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}))

app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
    // if(!req.body.Campground) throw new ExpressError('Invalid Campground Data', 400);    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`)
}));

app.get('/campground/:id',  catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

app.get('/campground/:id/edit',  catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campground/${campground._id}`);
}));


app.delete('/campgrounds/:id', catchAsync(async(req, res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.massage){
        err.massage = 'Something went wrong!';
    }
    res.status(statusCode).render('error', { err });
})

app.listen(3000 , () => {
    console.log('Serving on port 3000');
});