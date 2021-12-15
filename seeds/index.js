const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i ++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author : '61b3e3851dcb80a1e0288b47',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(places)} ${sample(descriptors)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : 'Here is a good place',
            price : price,
        })

        await camp.save();
    }

}

seedDB().then(()=>{
    mongoose.disconnect;
});