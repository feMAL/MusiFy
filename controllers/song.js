'use strict'

var fs = require('fs');
var path = require('path');
var pagination = require('mongoose-pagination')

var Song = require('../models/song');

var getSong = (req,res) => {
    var songId = req.params.id;

    Song.findById(songId).populate({path:'album'}).exec((err,song) =>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!song){
                res.status(200).send({message: 'la cancion no existe'});
            }else{
                res.status(200).send({song});
            }
        }
    })
}

var getSongs = (req,res) => {
    var albumId = req.params.albumId;

    if (!albumId) {
        var find = Song.find().sort('name');
    }else {
        var find = Song.find({album: albumId}).sort('number')
    }
    find.populate( {
        path:'album', 
        populate: {
            path:'artist',
            model: 'Artist' } 
        } ).exec((err,song)=>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!song){
                res.status(200).send({message: 'No hay Canciones para este album'});
            }else{
                res.status(200).send({song});
            }
        }
    })
}

var saveSong = (req,res) => {
    var song = new Song();

    var param = req.body;
    song.number = param.number;
    song.name = param.name;
    song.duration = param.duration;
    song.file = 'null';
    song.album = param.album

    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message: 'error al guardar Registro'})
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se pudo guardar el album'})
            }else{
                res.status(200).send({song : songStored})
            }
        }
    })
}

var updateSong = (req,res) => {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err,songUpdated)=>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!songUpdated){
                res.status(200).send({message: 'El Artista no existe'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    })
}

var deleteSong = ( req,res )=>{
    var songId = req.params.id

    //Buscar y eliminar Artista
    Song.findByIdAndRemove(songId,(err,songRemoved) => { 
    if(err){
            res.status(500).send({message: 'Error al borrar Registro'})
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'La cancion no ha sido eliminada'});
            }else{
                res.status(200).send({songRemoved: songRemoved });
            }
        }
    })
}


var uploadFile = (req, res) =>{
    var songId = req.params.id;
    var filename = "No subido";

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var filename = file_split[2]

		var ext_split = filename.split('\.');
		var ext_file = ext_split[1]

		if(ext_file =='mp3' || ext_file =='ogg' ){
			Song.findByIdAndUpdate(songId, {file: filename}, (err,songUpload)=>{
				if(err){
					res.status(500).send({ message: "no se pudo actualizar el artista" })
				}else{
					if(!songUpload){
						res.status(404).send({ message: "No se ha podido actualizar el artista"});
					}else{
						res.status(200).send({song:songUpload});
					}
				}
			});
		}else{
			res.status(200).send({message: 'Extension de archivo no valido'})	
		}
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'})
	}
}

var getSongFile = (req, res) => {
	var songFile = req.params.file
	var path_file = './upload/songs/'+songFile
	fs.exists(path_file,(exists)=>{
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No Existe la imagen'})
		}
	});
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}