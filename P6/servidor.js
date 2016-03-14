var fs = require('fs');		//Importamos el modulo file system
var net = require('net');		//Importamos el modulo net

		//Comprobamos si le hemos pasado 3 parámetros
if(process.argv.length != 3){
	console.log("ERROR: Número de parámetros distinto a 3");
	process.exit();
}

var fichero = process.argv[2];		//Nombre del fichero con la agenda
var port = 8000;			//Puerto en el que vamos a ejecutar la aplicacion
var sockets = new Array();		//Array con los sockets
var agenda = new Array();		//Array con todos los contactos

			//Funcion que se ejecutara para añadir un contacto en la agenda
var setTel = function(name,tel,socket){
	fs.exists(fichero, function(exists){		//Comprobamos si existe el fichero donde vamos a guardar el contacto
		if(exists){
			var contacto = {nombre:name,telf:tel};
			fs.unlink(fichero);
			var contactoExistente = 0;
			var error = 0;
			agenda.forEach(function(cont){
				if(cont.nombre === name){
					contactoExistente = 1;
					cont.telf = tel;
					fs.appendFile(fichero, cont.nombre+", "+cont.telf+"\n", function(err){
						if(err){
							error = 1;
							throw "KO\n";
						}
					});
				}else{
					fs.appendFile(fichero, cont.nombre+", "+cont.telf+"\n", function(err){
						if(err){
							error = 1;
							throw "KO\n";
						}
					});
				}
			});
			if(contactoExistente === 0){
				agenda.push(contacto);
				fs.appendFile(fichero, contacto.nombre+", "+contacto.telf+"\n", function(err){
					if(err){
						error = 1;
						throw "KO\n";
					}
				});
			}
			if(error === 1){
				throw "KO\n";
			}else{
				socket.write("OK\n");
			}
		}else{					//Si no existe el fichero de la agenda, lo creamos y añadimos el contacto
			fs.writeFile(fichero, name+", "+tel+"\n", function(err){
				if(err){
					throw "KO\n";
				}else{
					socket.write("OK\n");
				}
			})
		}
	})
}

			//Funcion que se ejecuta para obtener el telefono de un contacto pasado como parametro
var getTel = function(name, socket){
	fs.exists(fichero, function(exists){		//Comprobamos que existe el fichero de la agenda
		if(exists){
			var existe = 0;
			agenda.forEach(function(cont){
				if(cont.nombre === name){
					existe = 1;
					socket.write(cont.telf+"\n");
				}
			});
			if(existe === 0){
				socket.write("KO\n");
			}
		}
	})
}

			//Funcion que cierra la conexion de un socket
var quit = function(socket){
	socket.write("Cerrando...\n");
	var i = sockets.indexOf(socket);
	sockets.splice(i,1);
}

			//Creamos el servidor
var server = net.createServer(function(socket){
	socket.write("Servidor creado\n");		//Después de crearlo, lo primero que hacemos es indicar que ha sido creado

	fs.exists(fichero, function(exists){
		if(exists){
			fs.readFile(fichero, 'utf-8', function(err,data){
				if(err){
					throw "KO\n";
				}else{
					var linea = data.split("\n");
					for(var i=0; i<linea.length; i++){
						var palabra = linea[i].split(", ");
						var contacto = {nombre:palabra[0],telf:palabra[1]};
						agenda.push(contacto);
					}
				}
			})
		}
	});

	sockets.push(socket);				//Abrimos el socket
	socket.setEncoding("utf8");			//Establecemos que los datos van a estar en UTF-8

	socket.on('data',function(data){			//Funcion a realizar cuando hay datos en el socket
		var datos = data.trim();
		var comando = datos.split('"');			//Separamos el comando por palabras

									//Si la primera palabra es 'setTel', ejecutamos la funcion setTel(name,tel)
		if((datos.match(/^setTel/)!==null)&&(datos.match(/^setTel/)[0]==='setTel')){		
			setTel(comando[1], comando[2], socket);	
									//Si la primera palabra es 'getTel', ejecutamos la funcion getTel(name)
		}else if((datos.match(/^getTel/)!==null)&&(datos.match(/^getTel/)[0]==='getTel')){		
			getTel(comando[1], socket);
									//Si la primera palabra es 'quit', ejecutamos la funcion quit()
		}else if((datos.match(/^quit/)!==null)&&(datos.match(/^quit/)[0]==='quit')){			
			quit(socket);
		}else{
			socket.write("KO\n");
		}
	});
});

server.listen(port);			//Escuchamos el socket
