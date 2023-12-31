const mongoose = require('mongoose');
const { findOneAndDelete } = require('./review');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const CoolplaceSchema = new Schema({
    title: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    location: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CoolplaceSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong>
        <a href='/coolplaces/${this._id}'>${this.title}</a>
    </strong>
    <p>${this.description.substring(0,30)}...</p>`
})

CoolplaceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Coolplace', CoolplaceSchema);
