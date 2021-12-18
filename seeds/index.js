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
            images : [
                {
                  url: 'https://res.cloudinary.com/dcdj6plnq/image/upload/v1639706557/YelpCamp/hyjbf09pfdruaxz7clzi.jpg',
                  filename: 'YelpCamp/hyjbf09pfdruaxz7clzi',
                },
                {
                  url: 'https://res.cloudinary.com/dcdj6plnq/image/upload/v1639706562/YelpCamp/psbziw3cdakjwtzliwm8.jpg',
                  filename: 'YelpCamp/psbziw3cdakjwtzliwm8',
                },
                {
                  url: 'https://res.cloudinary.com/dcdj6plnq/image/upload/v1639706566/YelpCamp/dnghwggigacqyhjsqpcz.jpg',
                  filename: 'YelpCamp/dnghwggigacqyhjsqpcz',
                }
              ],
            description : 'Here is a good place',
            price : price,
        })

        await camp.save();
    }

}

seedDB().then(()=>{
    mongoose.disconnect;
});