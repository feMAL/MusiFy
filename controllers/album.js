'use strict'

var fs = require('fs');
var path = require('path');
var pagination = require('mongoose-pagination')

var Album = require('../models/album');
var Song = require('../models/song');

var getAlbum = (req,res) => {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path:'artist'}).exec((err,album) =>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!album){
                res.status(200).send({message: 'El Album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    })
}

var getAlbums = (req,res) => {
    var artistId = req.params.artistId;

    if (!artistId) {
        var find = Album.find().sort('title');
    }else {
        var find = Album.find({artist: artistId}).sort('year')
    }
    find.populate({path:'artist'}).exec((err,albums)=>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!albums){
                res.status(200).send({message: 'No hay albums para este artista'});
            }else{
                res.status(200).send({albums});
            }
        }
    })
}

var saveAlbum = (req,res) => {
    var album = new Album();

    var param = req.body;
    album.title = param.title;
    album.description = param.description;
    album.year = param.year;
    album.image = 'null';
    album.artist = param.artist


    album.save((err,albumStored)=>{
        if(err){
            res.status(500).send({message: 'error al guardar Registro'})
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se pudo guardar el album'})
            }else{
                res.status(200).send({album : albumStored})
            }
        }
    })
}

var updateAlbum = (req,res) => {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err,albumUpdated)=>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!albumUpdated){
                res.status(200).send({message: 'El Artista no existe'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    })
}

var deleteAlbum = ( req,res )=>{
    var albumId = req.params.id

    //Buscar y eliminar Artista
    Album.findByIdAndRemove(albumId,(err,albumRemoved) => { 
    if(err){
            res.status(500).send({message: 'Error al borrar Registro'})
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El Album no ha sido eliminado'});
            }else{
                Song.find({album: albumRemoved._id}).remove((err,songRemoved) => { 
                    if(err){
                        res.status(500).send({message: 'Error al borrar Registro'})
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'La cancion no ha sido eliminado'});
                        }else{
                            res.status(200).send({albumRemoved: albumRemoved });
                        }
                    }
                })
            }
        }
    })
}

var uploadImage = (req, res) =>{
    var albumId = req.params.id;
    var filename = "No subido";

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var filename = file_split[2]

		var ext_split = filename.split('\.');
		var ext_file = ext_split[1]

		if(ext_file =='png' || ext_file =='gif' || ext_file =='jpg' ){
			Album.findByIdAndUpdate(albumId, {image: filename}, (err,albumUpdated)=>{
				if(err){
					res.status(500).send({ message: "no se pudo actualizar el artista" })
				}else{
					if(!albumUpdated){
						res.status(404).send({ message: "No se ha podido actualizar el artista"});
					}else{
						res.status(200).send({artist:albumUpdated});
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

var getImageFile = (req, res) => {
	var imageFile = req.params.imageFile
	var path_file = './upload/albums/'+imageFile
	fs.exists(path_file,(exists)=>{
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No Existe la imagen'})
		}
	});
}



module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}