'use strict'

var fs = require('fs');
var path = require('path');
var pagination = require('mongoose-pagination')

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var getArtist = (req,res) => {
    var artistId = req.params.id;

    Artist.findById(artistId, (err,artist)=>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!artist){
                res.status(200).send({message: 'El Artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    })
}

var updateArtist = (req,res) => {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err,artistUpdated)=>{
        if(err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!artistUpdated){
                res.status(200).send({message: 'El Artista no existe'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    })
}

var getArtists = (req, res) =>{
    if (req.params.page)
    {
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, tot)=>{
        if (err){
            res.status(200).send({message: 'error en la aplicacion'});
        }else{
            if(!artists){
                res.status(200).send({message: 'error en la aplicacion'});
            }else{
                return res.status(200).send({
                    pages : tot,
                    artists: artists
                 })
            }
        }

    });
}

var saveArtist = (req,res) => {
    var artist = new Artist();

    var param = req.body;
    artist.name = param.name;
    artist.description = param.description
    artist.image = 'null'

    artist.save((err,artistStored)=>{
        if(err){
            res.status(500).send({message: 'error al guardar Registro'})
        }else{
            if(!artistStored){
                res.status(404).send({message: 'No se pudo guardar el artista'})
            }else{
                res.status(200).send({artist : artistStored})
            }
        }
    })
}

var deleteArtist = ( req,res )=>{
    var artistId = req.params.id

    //Buscar y eliminar Artista
    Artist.findByIdAndRemove(artistId, (err,artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al borrar Registro'})
        }else{  
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{
                //Buscar y eliminar Albums del artista eliminado
                Album.find({artists: artistRemoved._id}).remove((err,albumRemoved) => { 
                    if(err){
                        res.status(500).send({message: 'Error al borrar Registro'})
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'El Album no ha sido eliminado'});
                        }else{
                            Song.find({artists: albumRemoved._id}).remove((err,songRemoved) => { 
                                if(err){
                                    res.status(500).send({message: 'Error al borrar Registro'})
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message: 'La cancion no ha sido eliminado'});
                                    }else{
                                        res.status(200).send({artistRemoved: artistRemoved });
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

var uploadImage = (req, res) =>{
    var artistId = req.params.id;
    var filename = "No subido";

	if(req.files){
		console.log(req.files)
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var filename = file_split[2]

		var ext_split = filename.split('\.');
		var ext_file = ext_split[1]

		if(ext_file =='png' || ext_file =='gif' || ext_file =='jpg' ){
			Artist.findByIdAndUpdate(artistId, {image: filename}, (err,artistUpdated)=>{
				if(err){
					res.status(500).send({ message: "no se pudo actualizar el artista" })
				}else{
					if(!artistUpdated){
						res.status(404).send({ message: "No se ha podido actualizar el artista"});
					}else{
						res.status(200).send({artist:artistUpdated});
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
	var path_file = './upload/artists/'+imageFile
	fs.exists(path_file,(exists)=>{
		if(exists){
			res.sendFile(path.resolve(path_file))
		}else{
			res.status(200).send({message: 'No Existe la imagen'})
		}
	});
}


module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}