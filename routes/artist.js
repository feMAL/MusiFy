'use strict'

var express = require('express')
var artistController = require('../controllers/artist');

var api = express.Router();
var md_auth = require('../middlewares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/artists'})

api.get('/artists/:page?',md_auth.ensureAuth,artistController.getArtists);
api.get('/artist/:id',md_auth.ensureAuth,artistController.getArtist);
api.post('/artist',md_auth.ensureAuth,artistController.saveArtist);
api.put('/artist-update/:id',md_auth.ensureAuth,artistController.updateArtist);
api.delete('/artist-delete/:id',md_auth.ensureAuth,artistController.deleteArtist);
api.post('/artist-image-update/:id',[md_auth.ensureAuth, md_upload],artistController.uploadImage);
api.get('/artist-image/:imageFile',artistController.getImageFile)

module.exports = api