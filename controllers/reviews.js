const Review = require('../models/review');
const Coolplace = require('../models/coolplace');

module.exports.createReview = async (req, res) => {
    const coolplace = await Coolplace.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    coolplace.reviews.push(review) 
    await review.save()
    await coolplace.save();
    req.flash('success', 'You succefully posted a review')
    res.redirect(`/coolplaces/${req.params.id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Coolplace.findByIdAndUpdate(id, {$pull: { reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'You deleted a review')
    res.redirect(`/coolplaces/${id}`)
}
