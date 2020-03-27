'use strict'

var express = require('express')
var songController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/authenticated')

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/songs'})

api.get('/songs/:albumId?',md_auth.ensureAuth,songController.getSongs);
api.get('/song/:id',md_auth.ensureAuth,songController.getSong);
api.post('/song',md_auth.ensureAuth,songController.saveSong);
api.put('/song/:id',md_auth.ensureAuth,songController.updateSong);
api.delete('/song/:id',md_auth.ensureAuth,songController.deleteSong);
api.post('/song-file/:id',[md_auth.ensureAuth, md_upload],songController.uploadFile);
api.get('/song-file/:file',songController.getSongFile);

module.exports = api;