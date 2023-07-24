const Coolplace = require('../models/coolplace');
const ExpressError = require('../utils/ExpressError');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken:  mapBoxToken});
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
    const coolplaces = await Coolplace.find({})
    res.render('coolplaces/index', {coolplaces})
}

module.exports.renderNewForm = (req, res) => {
    res.render('coolplaces/new')
}

module.exports.createCoolplace = async (req, res, next) => {
    if (!req.body.coolplace ) throw new ExpressError('Invalid Campground Data', 400);
    
    const geoData = await geocoder.forwardGeocode({
        query: req.body.coolplace.location,
        limit: 1
    })
    .send()

    const coolplace = new Coolplace(req.body.coolplace)
    coolplace.geometry = geoData.body.features[0].geometry
    coolplace.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    coolplace.author = req.user._id;
    await coolplace.save()
    req.flash('success', 'You made a new coolplace')
    res.redirect(`/coolplaces/${coolplace._id}`)
}

module.exports.showCoolplace = async (req, res) => {
    const coolplace = await Coolplace.findById(req.params.id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author')
    console.log(coolplace.images)

    if (!coolplace){
        req.flash('error', 'Coolplace does not exist.')
        return res.redirect('/coolplaces')
    }
    res.render('coolplaces/show', {coolplace})
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const coolplace = await Coolplace.findById(id)
    if (!coolplace){
        req.flash('error', 'Coolplace does not exist.')
        return res.redirect('/coolplaces')
    }
    res.render('coolplaces/edit', {coolplace})
}

module.exports.updateCoolplace = async (req, res) => {
    const {id} = req.params
    const coolplace = await Coolplace.findByIdAndUpdate(id, req.body.coolplace)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    coolplace.images.push(...imgs);
    await coolplace.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await coolplace.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'You updated a coolplace')
    res.redirect(`/coolplaces/${coolplace._id}`)
}

module.exports.deleteCoolplace = async (req, res) => {
    const {id} = req.params
    await Coolplace.findByIdAndDelete(id)
    req.flash('success', 'You deleted a coolplace')
    res.redirect('/coolplaces')
}