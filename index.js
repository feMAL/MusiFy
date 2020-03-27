'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_node_db', { useNewUrlParser: true , useUnifiedTopology: true  }, (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("La base esta conectada");
		app.listen(port, function(){
			console.log("Servidor api rest de musica escuchando http://localhost:"+port);
		})
	}
});

module.exports = mongoose; 