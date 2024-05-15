const express = require('express');
const router = express.Router();
const stories = require('../controllers/stories')
const catchAsync = require('../Utilities/catchAsync');
const {isLoggedIn, isAuthor, validateStory} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const Story = require('../models/story');

router.route('/')
    .get(catchAsync(stories.index))
    .post(isLoggedIn, upload.array('image'),validateStory, catchAsync(stories.createStory));
 
router.get('/new', isLoggedIn, stories.renderNewForm);

router.route('/:id')
    .get(catchAsync(stories.showStory))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateStory, catchAsync(stories.updateStory))
    .delete(isLoggedIn, isAuthor, catchAsync (stories.deleteStory));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(stories.renderEditForm))

module.exports = router;