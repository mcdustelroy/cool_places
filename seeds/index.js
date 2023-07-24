const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Coolplace = require('../models/coolplace');

mongoose.connect('mongodb://localhost:27017/mapApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Coolplace.deleteMany({});
    for (let i = 0; i < 1000; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const place = new Coolplace({
            //YOUR USER ID
            author: '61558453f98685661825bff5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: `https://picsum.photos/200?random=${random1000}`,
                    filename: `mapApp/photo${random1000}`
                },
                {
                  url: `https://picsum.photos/200?random=${random1000 + 1}`,
                  filename: `mapApp/photo${random1000 + 1}`
              },
            ]
        })
        await place.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})