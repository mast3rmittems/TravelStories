const Story = require('../models/story');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const story = await Story.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    story.reviews.push(review);
    await review.save();
    await story.save();
    req.flash('success', 'Made a new review!');
    res.redirect(`/stories/${story._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Story.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review :(');
    res.redirect(`/stories/${id}`);
}