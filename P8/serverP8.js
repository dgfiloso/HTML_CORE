var express = require('express');
var path = require('path');

var app = express();

app.get('/preguntas',function(req,res){
	console.log("Mandando página asociada a GET /preguntas\n");
	res.send('<html><head><title>Preguntas</title><meta charset="utf-8"></head>'
		+		'<body>'
		+		'<h1>Preguntas</h1>'
		+		'<form method="get" action="/respuesta">'
		+			'¿Quién descubrió América?<br>'
		+			'<input type="hidden" name="id" value="amer">'
		+			'<input type="text" name="america"/><br>'
		+			'<input type="submit" value="Enviar"/>'
		+		'</form>'
		+		'<form method="get" action="/respuesta">'
		+			'¿Capital de Portugal?<br>'
		+			'<input type="hidden" name="id" value="port">'
		+			'<input type="text" name="portugal"/><br>'
		+			'<input type="submit" value="Enviar"/>'
		+		'</form>'
		+		'</body></html>');
	console.log("Página asociada a GET /preguntas enviada\n")
});

app.get('/respuesta',function(req,res){
	if(req.query.id === "amer"){
		console.log("Detectado id=amer\n");
		if(req.query.america === "Cristóbal Colón"){
			console.log("La respuesta es correcta, enviando página\n");
			res.send('<html><head><title>Respuestas</title><meta charset="utf-8"></head><body>'
				+		'<h1> Respuesta </h1>'
				+		'<p> Su respuesta ha sido "'+req.query.america+'" y es correcta </p>'
				+		'<p><a href="/preguntas"> Volver a la página inicial </a></p>'
				+		'</body></head>');
			console.log("Página enviada\n");
		}else{
			console.log("La respuesta es incorrecta, enviando página\n");
			res.send('<html><head><title>Respuestas</title><meta charset="utf-8"></head><body>'
				+		'<h1> Respuesta </h1>'
				+		'<p> Su respuesta ha sido "'+req.query.america+'" y es incorrecta </p>'
				+		'<p> La respuesta correcta es "Cristóbal Colón". </p>'
				+		'<p><a href="/preguntas"> Volver a la página inicial </a></p>'
				+		'</body></head>');
			console.log("Página enviada\n");
		}
	}else if(req.query.id === "port"){
		console.log("Detectado id=port\n");
		if(req.query.portugal === "Lisboa"){
			console.log("La respuesta es correcta, enviando página\n");
			res.send('<html><head><title>Respuestas</title><meta charset="utf-8"></head><body>'
				+		'<h1> Respuesta </h1>'
				+		'<p> Su respuesta ha sido "'+req.query.portugal+'" y es correcta </p>'
				+		'<p><a href="/preguntas"> Volver a la página inicial </a></p>'
				+		'</body></head>');
			console.log("Página enviada\n");
		}else{
			console.log("La respuesta es incorrecta, enviando página\n");
			res.send('<html><head><title>Respuestas</title><meta charset="utf-8"></head><body>'
				+		'<h1> Respuesta </h1>'
				+		'<p> Su respuesta ha sido "'+req.query.portugal+'" y es incorrecta </p>'
				+		'<p> La respuesta correcta es "Lisboa" </p>'
				+		'<p><a href="/preguntas"> Volver a la página inicial </a></p>'
				+		'</body></head>');
			console.log("Página enviada\n");
		}
	}
});

app.listen(8000);