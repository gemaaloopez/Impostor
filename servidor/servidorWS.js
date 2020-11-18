var modelo=require("./modelo.js");

function ServidorWS(){
	this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
	this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero){
		        //var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,nick);	
				socket.join(codigo);	        			
				console.log('usuario: '+nick+" crea partida codigo: "+codigo);	
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick});		        		        
		    });
		    socket.on('unirAPartida',function(nick,codigo){
		    	//nick o codigo nulo
		    	var res=juego.unirAPartida(codigo,nick);
		    	socket.join(codigo);
		    	var owner=juego.partidas[codigo].nickOwner;
		  		console.log("Usuario "+nick+" se une a partida "+codigo);
		    	cli.enviarRemitente(socket,"unidoAPartida",{"codigo":codigo,"owner":owner});
		    	cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick);
		    });

		    socket.on('iniciarPartida',function(nick,codigo){
		    	//iniciar partida ToDo
				//controlar si nick es el owner de la partida desde modelo.js
				juego.iniciarPartida(codigo,nick);
				var fase = juego.partidas[codigo].fase.nombre;
				cli.enviarATodos(io,codigo,"partidaIniciada",fase);   
		    });
		    socket.on('listaPartidasDisponibles', function() {
				var lista = juego.listarPartidasDisponibles();
				cli.enviarRemitente(socket,"recibirListaPartidasDisponibles", lista);     		        
			});
			socket.on('listaPartidas', function() {
				var lista = juego.listarPartidas();
				cli.enviarRemitente(socket,"recibirListaPartidas", lista);     		        
			});
			socket.on('mandarVotacion', function(codigo, nick) {
				juego.mandarVotacion(codigo,nick);
				var fase=juego.partidas[codigo].fase.nombre;
				cli.enviarATodos(io,codigo,"votacion",fase);
			});
			socket.on('saltarVoto', function(codigo, nick) {
				var partida=juego.partidas[codigo];
				juego.saltarVoto(codigo,nick);
				if(partida.todosHanVotado()){
					var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
					cli.enviarATodos(io,codigo,"finalVotacion",data);
					//partida.reiniciarContadores();
				}
				else{
					//se envia la  lista de los que hayan votado
					cli.enviarATodos(io,codigo,"haVotado",partida.listaHanVotado());
				}
			});
			socket.on('votar', function(codigo, nick, sospechoso) {
				var partida=juego.partidas[codigo];
				juego.votar(codigo,nick,sospechoso);
				if(partida.todosHanVotado()){
					var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
					cli.enviarATodos(io,codigo,"finalVotacion",data);
				}
				else{
					cli.enviarATodos(io,codigo,"haVotado",partida.listaHanVotado());
				}
			});
			socket.on('obtenerEncargo', function(codigo, nick) {
				cli.enviarRemitente(socket,"recibirEncargo", juego.obtenerEncargo(codigo,nick));
			});
			socket.on('atacar', function(codigo, nick, atacado) {
				juego.atacar(codigo, nick, atacado);
				//var usr_atacado=juego.partidas[codigo].obtenerUsuario(atacado)
				//var data={"Atacado":atacado,"estado":usr_atacado.estado.nombre};
				var partida=juego.partidas[codigo];
				if (partida.fase.nombre == "final"){
					var data={"Fase":partida.fase.nombre,"Ganadores":partida.fase.ganadores};
					cli.enviarATodos(io,codigo,"ganaImpostor",data);
				}
					else{
				cli.enviarRemitente(socket,"muereInocente", partida.fase.nombre);
				}
			});
		});
	}
}

module.exports.ServidorWS=ServidorWS;