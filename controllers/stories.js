const Story = require('../models/story');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
    const stories = await Story.find({});
    res.render('stories/index', {stories})
}

module.exports.renderNewForm = (req, res) => {
    res.render('stories/new');
}

module.exports.createStory = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.story.location,
        limit: 1,
    }).send()
    const story = new Story(req.body.story);
    story.geometry = geoData.body.features[0].geometry;
    story.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    story.author = req.user._id
    await story.save();
    // console.log(story)
    req.flash('success', 'Sucessfully made a new story!');
    res.redirect(`/stories/${story._id}`)
}

module.exports.showStory = async (req, res) => {
    const story = await Story.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!story) {
        req.flash('error', 'Cannot find that story');
        return res.redirect('/stories')
    }
    res.render('stories/show', {story});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const story = await Story.findById(req.params.id);
    if (!story) {
        req.flash('error', 'Cannot find that story');
        return res.redirect('/stories')
    }
    res.render('stories/edit', {story});
}

module.exports.updateStory = async (req, res) => {
    const {id} = req.params;
    console.log(req.body);
    const story = await Story.findByIdAndUpdate(id, { ...req.body.story });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    story.images.push(...imgs);
    await story.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    await story.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    console.log(story)
    }
    req.flash('success', 'Sucessfully updated story!');
    res.redirect(`/stories/${story._id}`)
}

module.exports.deleteStory = async (req, res) => {
    const {id} = req.params;
    await Story.findByIdAndDelete(id);
    req.flash('success', 'Deleted story :(');
    res.redirect('/stories');
}