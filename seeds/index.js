const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Story = require('../models/story')

mongoose.connect('mongodb://127.0.0.1:27017/travel-stories');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Story.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        // const price = Math.floor(Math.random() * 20) + 10;
        const story = new Story({
            author: '650473d6c9a41d6089feee08',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
            ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dxi8uuyh5/image/upload/v1695566150/YelpCamp/ixmiycdlobn4dlxnftf4.jpg',
                    filename: 'YelpCamp/ixmiycdlobn4dlxnftf4'
                },
                {
                    url: 'https://res.cloudinary.com/dxi8uuyh5/image/upload/v1695143493/YelpCamp/fryko6rwksaeiljdulxe.jpg',
                    filename: 'YelpCamp/fryko6rwksaeiljdulxe'
            }
            ]
        })
        await story.save();
    }
}

seedDB()
.then(() => {
    mongoose.connection.close();
})