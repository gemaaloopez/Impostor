function ClienteWS(){
	this.socket=undefined;
	this.nick=undefined;
	this.codigo=undefined;

	this.ini=function(){
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}

	this.crearPartida=function(nick,numero){
		this.nick=nick;
		this.socket.emit("crearPartida",nick,numero);//{"nick":nick,"numero":numero}
	}
	this.unirAPartida=function(codigo,nick){
		this.nick=nick;
		this.socket.emit("unirAPartida",codigo,nick);
	}
	this.iniciarPartida=function(){
		this.socket.emit("iniciarPartida",this.codigo,this.nick);
	}
	this.listaPartidasDisponibles=function(){
		this.socket.emit("listaPartidasDisponibles");
	}
	this.listaPartidas=function(){
		this.socket.emit("listaPartidas");
	}
	this.lanzarVotacion=function(){
		this.socket.emit("lanzarVotacion", this.codigo, this.nick);
	}
	this.saltarVoto=function(){
		this.socket.emit("saltarVoto", this.codigo, this.nick);
	}
	this.vota=function(sospechoso){
		this.socket.emit("votar", this.codigo, this.nick, sospechoso);
	}
	this.obtenerEncargo=function(){
		this.socket.emit("obtenerEncargo", this.codigo, this.nick);
	}
	this.atacar=function(atacado){
		this.socket.emit("atacar", this.codigo, this.nick, atacado);
	}
	//servidor WS dentro del cliente
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function(){			
			console.log("conectado al servidor de WS");
		});
		this.socket.on('partidaCreada',function(data){
			console.log(data);
		});
		this.socket.on('unidoAPartida',function(data){
			console.log(data);
		});
		this.socket.on('nuevoJugador',function(nick){
			console.log(nick+" se une a la partida");
		});
		this.socket.on('partidaIniciada',function(fase){
			console.log("Partida en fase: "+fase);
		});
		this.socket.on('recibirListaPartidasDisponibles',function(lista){
			console.log(lista);
		});
		this.socket.on('recibirListaPartidas',function(lista){
			console.log(lista);
		});
		this.socket.on('votacion',function(data){
			console.log(data);
		});
		this.socket.on('finalVotacion',function(data){
			console.log(data);
		});
		this.socket.on('haVotado',function(data){
			console.log(data);
		});
		this.socket.on('recibirEncargo',function(data){
			console.log(data);
		});
		this.socket.on('muereInocente',function(data){
			console.log(data);
		});
		this.socket.on('final',function(data){
			console.log(data);
		});
		this.socket.on('recibirListaParticipantes',function(lista){
			console.log(lista);
			cw.mostrarParticipantes(lista);
		});
	}

	this.ini();
}

function pruebasWS(codigo){
	var ws2=new ClienteWS();
	var ws3=new ClienteWS();
	var ws4=new ClienteWS();
	var codigo= ws.codigo;

	ws2.unirAPartida(codigo,"palomi");
	ws3.unirAPartida(codigo,"palomita");
	ws4.unirAPartida(codigo,"pa");
}

function saltarVotos(){
	ws.saltarVoto();
	ws2.saltarVoto();
	ws3.saltarVoto();
	ws4.saltarVoto();
}

function votar(){
	ws.votar("palomi");
	ws2.votar("palomi");
	ws3.votar("palomi");
	ws4.votar("palomi");
}

function obtenerEncargos(){
	ws.obtenerEncargo();
	ws2.obtenerEncargo();
	ws3.obtenerEncargo();
	ws4.obtenerEncargo();
}