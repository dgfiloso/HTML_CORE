var fs = require('fs');		//Importamos el modulo file system
var net = require('net');		//Importamos el modulo net

		//Comprobamos si le hemos pasado 3 parámetros
if(process.argv.length != 3){
	console.log("ERROR: Número de parámetros distinto a 3");
	process.exit();
}

var fichero = process.argv[2];		//Nombre del fichero con la agenda
var port = 8000;			//Puerto en el que vamos a ejecutar la aplicacion

			//Funcion que se ejecutara para añadir un contacto en la agenda
var setTel = function(name,tel){
	fs.exists(fichero, function(exists){		//Comprobamos si existe el fichero donde vamos a guardar el contacto
		if(exists){
			fs.readFile(fichero, function(err,data){		//Si existe leemos el archivo para ver si ya tenemos el contacto
				if(err){
					throw "KO";			//Si no podemos abrir correctamente el fichero mandamos el mensaje KO
				}else{
					var linea = data.split("\n");		//Tomamos cada linea del fichero y la almacenamos en linea
					for(var i=0; i<linea.length; i++){			//Recorremos cada linea
						var palabra = linea[i].split(", ");		//Separamos el nombre del numero de telefono
						for(var j=0; j<palabra.length; j++){
							if(palabra[0] == name){				//Si el nombre ya esta guardado, cambiamos el telefono
									//Cambiar el telefono
							}else{
								fs.appendFile(fichero, name+", "+tel+"\n", function(err){		//Si el nombre no esta guardado, lo añadimos como contacto
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
		}else{					//Si no existe el fichero de la agenda, lo creamos y añadimos el contacto
			fs.writeFile(fichero, name+", "+tel+"\n", function(err){
				if(err){
					throw "KO";
				}else{
					socket.write("OK");
				}
			})
		}
	})
}

			//Funcion que se ejecuta para obtener el telefono de un contacto pasado como parametro
var getTel = function(name){
	fs.exists(fichero, function(exists){		//Comprobamos que existe el fichero de la agenda
		if(exists){
			fs.readFile(fichero, function(err,data){		//Si existe el fichero, lo leemos
				if(err){
					throw "KO";
				}else{
					var linea = data.split("\n");		//Separamos cada linea del fichero
					for(var i=0; linea.length; i++){		
						var palabra = linea[i].split(", ");		//Para cada linea, separamos el nombre del telefono
						if(name==palabra[0]){
							socket.write(palabra[1]);		//Si existe el contacto, devolvemos su telefono
						}else{
							socket.write("KO");
						}
					}
				}
			})
		}
	})
}

			//Funcion que cierra la conexion de un socket
var quit = function(socket){
	var i = sockets.indexOf(socket);
	socket.splice(i,1);
}

			//Creamos el servidor
var server = net.createServer(function(socket){
	socket.write("Servidor creado");		//Después de crearlo, lo primero que hacemos es indicar que ha sido creado

	socket.push(socket)				//Abrimos el socket

	socket.on('data',function(err,d){			//Funcion a realizar cuando hay datos en el socket
		var comando = data.split(" ");			//Separamos el comando por palabras
		if(data.match(/^setTel/)=='setTel'){		//Si la primera palabra es 'setTel', ejecutamos la funcion setTel(name,tel)
			setTel(comando[1]+" "+comando[2], comando[3]);		
		}else if(data.match(/^getTel/)=='getTel'){		//Si la primera palabra es 'getTel', ejecutamos la funcion getTel(name)
			getTel(comando[1]+" "+comando[2]);
		}else if(data.match(/^quit/)=='quit'){			//Si la primera palabra es 'quit', ejecutamos la funcion quit()
			quit(socket);
		}else{
			throw err;
		}

	});
});

server.listen(port);			//Escuchamos el socket
