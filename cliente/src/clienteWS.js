function ClienteWS(){
	this.socket=undefined;
	this.nick=undefined;
	this.codigo=undefined;
	this.numJugador=undefined;

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
	this.estoyDentro=function(){
		this.socket.emit("estoyDentro",this.nick,this.codigo);
	}
	this.MandarVotacion=function(){
		this.socket.emit("mandarVotacion", this.codigo, this.nick);
	}
	this.saltarVoto=function(){
		this.socket.emit("saltarVoto", this.codigo, this.nick);
	}
	this.vota=function(sospechoso){
		this.socket.emit("vota", this.codigo, this.nick, sospechoso);
	}
	this.obtenerEncargo=function(){
		this.socket.emit("obtenerEncargo", this.codigo, this.nick);
	}
	this.atacar=function(atacado){
		this.socket.emit("atacar", this.codigo, this.nick, atacado);
	}
	this.listarParticipantes=function(){
		this.socket.emit("listarParticipantes", this.codigo);
	}
	this.movimiento=function(x,y){
		this.socket.emit("movimiento", this.codigo, this.nick, this.numJugador, x,y);
	}
	//servidor WS dentro del cliente
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function(){			
			console.log("conectado al servidor de WS");
		});
		this.socket.on('partidaCreada',function(data){
			cli.codigo = data.codigo;
			console.log(data);
			if(data.codigo!="Error"){
				cw.mostrarEsperandoRival();
				cw.mostrarIniciarPartida();
				cli.numJugador=0;
			}
		});
		this.socket.on('unidoAPartida',function(data){
			cli.codigo=data.codigo;
			cli.nick = data.nick;
			cli.numJugador = data.numJugador;
			console.log(data);
			cw.mostrarEsperandoRival();;
		});
		this.socket.on('nuevoJugador',function(nick){
			console.log(nick+" se une a la partida");
			cw.actualizarJugadores();
		});
		this.socket.on('partidaIniciada',function(fase){
			console.log("Partida está en fase: "+fase);
			lanzarJuego();
			cw.limpiarLog();
			cli.obtenerEncargo();
		});
		this.socket.on('esperando',function(fase){
			console.log("esperando: "+fase);
		});
		this.socket.on('recibirListaPartidasDisponibles',function(lista){
			console.log(lista);
			if (!cli.codigo){
				cw.mostrarUnirAPartida(lista);
			}
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
		this.socket.on('dibujarRemoto',function(lista){
			console.log(lista);
			for(var i=0;i<lista.length;i++){
				if(lista[i].nick!=cli.nick){
					lanzarJugadorRemoto(lista[i].nick,lista[i].numJugador);
				}
			}
		});
		this.socket.on('moverRemoto',function(datos){
			mover(datos.nick,datos.x,datos.y);
			//moverRemoto()
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