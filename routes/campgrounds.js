const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const { isLoggedIn,isAuthor, validateCampground } = require('../middleware');
const { redirect } = require('express/lib/response');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampgroud));
    .post(upload.single('image'), (req, res) => {
        res.send(req.body, req.file);
    })
    
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground ));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;