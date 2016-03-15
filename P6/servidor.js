var fs = require('fs');		//Importamos el modulo file system
var net = require('net');		//Importamos el modulo net

		//Comprobamos si le hemos pasado 3 parámetros
if(process.argv.length != 3){
	console.log("Syntax error: node servidor.js filename");
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
			var contacto = {nombre:name,telf:tel};			//Objeto contacto con el nombre y el telefono
			fs.unlink(fichero);					//Borramos el archivo actual
			var contactoExistente = 0;			//Variable para comprobar si el contacto ya existe
			var error = 0;						//Variable para comprobar si ha habido algun error
			agenda.forEach(function(cont){		//Recorremos todos los contactos de agenda para ver si existe el contacto
				if(cont.nombre === name){		//Si ya existe el contacto, cambiamos su telefono y lo escribimos en el fichero
					contactoExistente = 1;
					cont.telf = tel;					//Cambio el telefono
					fs.appendFile(fichero, cont.nombre+", "+cont.telf+"\n", function(err){
						if(err){
							error = 1;
							throw "KO\n";
						}
					});
				}else{					//Todos los contactos que no coincidan y ya estuvieran, se escriben en el fichero
					fs.appendFile(fichero, cont.nombre+", "+cont.telf+"\n", function(err){
						if(err){
							error = 1;
							throw "KO\n";
						}
					});

				}
			});
			if(contactoExistente === 0){		//Si el contacto es nuevo, se añade a la agenda y se escribe en el fichero				
				agenda.push(contacto);
				fs.appendFile(fichero, contacto.nombre+", "+contacto.telf+"\n", function(err){
					if(err){
						error = 1;
						throw "KO\n";
					}
				});
			}
			if(error === 1){			//Comprobamos si ha habido algun error
				throw "KO\n";
			}else{
				socket.write("OK\n");
			}
		}else{				//Si no existe el fichero, lo creamos y escribimos el contacto, ademas de añadirlo a la agenda
			agenda.push(contacto);
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
			var existe = 0;				//Variable para comprobar si existe el contacto
			agenda.forEach(function(cont){		//Comprobamos si el nombre coincide con algun contacto que ya tengamos
				if(cont.nombre === name){
					existe = 1;
					socket.write(cont.telf+"\n");		//Devolvemos su telefono
				}
			});
			if(existe === 0){				//Si no existe el contacto, devolvemos KO
				socket.write("KO\n");
			}
		}
	})
}

			//Funcion que cierra la conexion de un socket
var quit = function(socket){
	socket.write("Cerrando...\n");
	var i = sockets.indexOf(socket);
	sockets.splice(i,1);			//Quitamos el socket del array de sockets
	socket.destroy();				//Cerramos el socket
}

			//Creamos el servidor
var server = net.createServer(function(socket){
	socket.write("Servidor creado, esperando instrucciones...\n");
	sockets.push(socket);				//Abrimos el socket
	socket.setEncoding("utf8");			//Establecemos que los datos van a estar en UTF-8

	fs.exists(fichero, function(exists){		//Comprobamos si ya existe el fichero
		if((exists)&&(agenda.length === 0)){
			fs.readFile(fichero, 'utf-8', function(err,data){		//Si existe lo leemos
				if(err){
					throw "KO\n";
				}else{
					var linea = data.split("\n");		//Separamos cada linea del fichero
					for(var i=0; i<linea.length; i++){
						var palabra = linea[i].split(", ");		//Separamos el nombre y el telefono de cada contacto
						var contacto = {nombre:palabra[0],telf:palabra[1]};		//Creamos cada objeto contacto
						if((contacto.nombre.match(/[a-zñáéíóú0-9]+/ig)!==null)&&(contacto.telf !== undefined)){
							agenda.push(contacto);					//Añadimos el contacto a la agenda
						}
					}
				}
			})
		}
	});

	socket.on('data',function(data){			//Funcion a realizar cuando hay datos en el socket
		var datos = data.trim();
		var comando = datos.split('"');			//Separamos el comando por palabras

									//Si la primera palabra es 'setTel', ejecutamos la funcion setTel(name,tel)
		if((datos.match(/^setTel/)!==null)&&(datos.match(/^setTel/)[0]==='setTel')){
			if(comando.length !== 3){			//Si el comando tiene algo distinto a dos parametros y el comando en si, error
				socket.write("KO\n");
			}else if((comando[1]===undefined)||(comando[2] ===undefined)){		//Si el primer y segundo parametro no estan definidos, error
				socket.write("KO\n");
			}else if(comando[1].match(/[a-zñáéíóú0-9]+/ig)===null){		//Si el primer parametro no tiene letras, error
				socket.write("KO\n");
			}else if((comando[2].match(/[0-9]+/)===null)||(comando[2].match(/[a-zñáéíóú]+/ig)!==null)){		//Si el segundo parametro no es un numero, error
				socket.write("KO\n");
			}else{
				setTel(comando[1], comando[2], socket);	
			}
									//Si la primera palabra es 'getTel', ejecutamos la funcion getTel(name)
		}else if((datos.match(/^getTel/)!==null)&&(datos.match(/^getTel/)[0]==='getTel')){
			if((comando.length !== 3)||(comando[2]!=='')){		//Si el comando tiene algo distinto a un parametro y el comando en si, error
				socket.write("KO\n");
			}else if(comando[1]===undefined){		//Si el parametro no esta definido, error
				socket.write("KO\n");
			}else if(comando[1].match(/[a-zñáéíóú0-9]+/ig)===null){		//Si el parametro no tiene letras, error
				socket.write("KO\n");
			}else{
				getTel(comando[1], socket);
			}	
									//Si la palabra es 'quit', ejecutamos la funcion quit()
		}else if((datos.match(/^quit$/)!==null)&&(datos.match(/^quit/)[0]==='quit')){
			if(comando.length !== 1){		//Si el comando tiene algo distinto al propio comando, error
				socket.write("KO\n");
			}else{
				quit(socket);
			}	
		}else{
			socket.write("KO\n");
		}
	});
});

server.listen(port);			//Escuchamos el socket
