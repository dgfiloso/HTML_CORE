var fs = require('fs');		//Importamos el modulo file system
var net = require('net');		//Importamos el modulo net

		//Comprobamos si tenemos le hemos pasado 3 parámetros
if(process.argv.length != 3){
	console.log("ERROR: Número de parámetros mayor a 3");
	process.exit();
}

var fichero = process.argv[2];
var port = 8000;

var setTel = function(name,tel){
	fs.exists(fichero, function(exists){
		if(exists){
			fs.readFile(fichero, function(err,data){
				if(err){
					throw "KO";
				}else{
					var linea = data.split("\n");
					for(var i=0; i<linea.length; i++){
						var palabra = linea[i].split(" ");
						var nombre = name.split(" ");
						for(var j=0; j<palabra.length; j++){
							if((palabra[0] == nombre[0])&&(palabra[1] == nombre[1])){
									//Cambiar el telefono
							}else{
								fs.appendFile(fichero, name+", "+tel+"\n", function(err){
									if(err){
										throw "KO";
									}else{
										socket.write("OK");
									}
								})
							}
						}
					}
				}
			})		
		}else{
			fs.writeFile(fichero, name+" , "+tel+"\n", function(err){
				if(err){
					throw "KO";
				}else{
					socket.write("OK");
				}
			})
		}
	})
}

var getTel = function(name){
	fs.exists(fichero, function(exists){
		if(exists){
			fs.readFile(fichero, function(err,data){
				if(err){
					throw "KO";
				}else{
					var linea = data.split("\n");
					for(var i=0; linea.length; i++){
						var palabra = linea[i]-split(" ");
						var nombre = name.split(" ");
						if((nombre[0]==palabra[0])&&(nombre[1]==palabra[1])){
							socket.write(palabra[3]);
						}else{
							socket.write("KO");
						}
					}
				}
			})
		}
	})
}

var quit = function(socket){
	var i = sockets.indexOf(socket);
	socket.splice(i,1);
}

var server = net.createServer(function(socket){
	socket.write("Servidor creado");

	socket.push(socket)

	socket.on('data',function(err,d){
		var comando = data.split(" ");
		if(data.match(/^setTel/)=='setTel'){
			setTel(comando[1]+" "+comando[2], comando[3]);
		}else if(data.match(/^getTel/)=='getTel'){
			getTel(comando[1]+" "+comando[2]);
		}else if(data.match(/^quit/)=='quit'){
			quit(socket);
		}else{
			throw err;
		}

	});
});

server.listen(port);
