var modelo=require("./modelo.js");

function ServidorWS(){
	this.enviarRemitente=function(socket,mens,datos){
		//console.log('mens: ' + mens + ' datos: ' + datos)
        socket.emit(mens,datos);
    }

	this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }

    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };

    this.enviarGlobal=function(socket,mensaje,datos){
		//console.log('mensaje: ' + mensaje + ' datos: ' + datos)
        socket.broadcast.emit(mensaje,datos);
    };

	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero){
		        //var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,nick);
				socket.join(codigo);	
				console.log('Usuario '+nick+" CREA partida "+codigo+".");	
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick});		        		        
				var lista = juego.listarPartidasDisponibles();
				cli.enviarGlobal(socket,"recibirListaPartidasDisponibles",lista);	    
		    });

		    socket.on('unirAPartida',function(codigo, nick){
	    		codigo = codigo.slice(1, 7)
	    		var res=juego.unirAPartida(codigo,nick);
	    		console.log(res)
				socket.join(codigo);
				var owner = juego.partidas[codigo].nickOwner;
				console.log('el usuario: '+nick+" se une a partida: "+codigo);
				cli.enviarRemitente(socket,"unidoAPartida",res);
				cli.enviarATodosMenosRemitente(socket,codigo,"nuevoJugador",nick);
				var lista = juego.listarPartidasDisponibles();
				cli.enviarGlobal(socket,"recibirListaPartidasDisponibles",lista);
	    });

		    socket.on('iniciarPartida',function(codigo, nick){
		    	//iniciar partida ToDo
				//controlar si nick es el owner de la partida desde modelo.js
				juego.iniciarPartida(codigo,nick);
				var fase = juego.partidas[codigo].fase.nombre;
				if(fase == "jugando"){
					cli.enviarATodos(io, codigo, "partidaIniciada",fase.nombre);
				}
				else{
					cli.enviarRemitente(socket,"esperando", fase.nombre);
				}
		    });

		    socket.on('listaPartidasDisponibles', function() {
				var lista = juego.listarPartidasDisponibles();
				cli.enviarRemitente(socket,"recibirListaPartidasDisponibles", lista);     		        
			});

			socket.on('listaPartidas', function() {
				var lista = juego.listarPartidas();
				cli.enviarRemitente(socket,"recibirListaPartidas", lista);     		        
			});
			socket.on('listaJugadores', function(codigo) {
                var lista = juego.listarParticipantes(codigo);
                cli.enviarRemitente(socket, "recibirListaJugadores", lista);
            });
			
			socket.on('estoyDentro', function(nick,codigo) {
				var lista = juego.listarParticipantes(codigo);
				cli.enviarRemitente(socket,"dibujarRemoto", lista);       
			});

			socket.on('movimiento',function(datos){
			cli.enviarATodosMenosRemitente(socket,datos.codigo,"moverRemoto",datos);
			});

			socket.on('mandarVotacion', function(codigo, nick) {
				var partida=juego.partidas[codigo];
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

			socket.on("votar",function(codigo,nick,sospechoso){
			var partida=juego.partidas[codigo];
			juego.votar(codigo,nick,sospechoso);
			if (partida.todosHanVotado()){
				 	var resultado=partida.finalVotacion();
                    var elegido=resultado.elegido; // elegido es un obj Usuario
                    var msgVotacion = resultado.msgVotacion;
                    var msgEstadoPartida = resultado.msgEstadoPartida;
                    var finalPartida=resultado.finalPartida;
                    var mensaje=msgVotacion + " " + msgEstadoPartida;
                    
				var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
				cli.enviarATodos(io, codigo,"finalVotacion",data);	
			}
			else{
				cli.enviarATodos(io, codigo,"haVotado",partida.listaHanVotado());		    	
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
				var fase = partida.fase.nombre;
				cli.enviarATodos(io,codigo,"muereInocente",atacado);
				cli.enviarRemitente(socket,"hasAtacado",partida.fase.nombre);
				if (partida.fase.nombre == "final"){
					var data={"Fase":partida.fase.nombre,"Ganadores":partida.fase.ganadores};
				    cli.enviarATodos(io,codigo,"final",data);
				}
			});

			socket.on('listarParticipantes', function(codigo) {
			var lista = juego.listarParticipantes(codigo);
			cli.enviarRemitente(socket,"recibirListaParticipantes", lista);     		        
			});
			socket.on('estoyDentro', function(nick,codigo) {
			//var usr=juego.obtenerJugador(nick,codigo);
			// var numero=juego.partidas[codigo].usuarios[nick].numJugador;
			// var datos = {nick:nick,numJugador:numero};
			// cli.enviarATodosMenosRemitente(socket,codigo,"dibujarRemoto",datos); 
			var lista = juego.listarParticipantes(codigo);
			cli.enviarRemitente(socket,"dibujarRemoto", lista);       
		    });
		    socket.on('movimiento', function( nick,codigo, numJugador,direccion, x,y) {
			var datos ={direccion:direccion, nick:nick,numJugador:numJugador,x:x,y:y};
			cli.enviarATodosMenosRemitente(socket,codigo,"moverRemoto",datos);
		    });




			socket.on('realizarTarea', function(codigo, nick, encargo) {
				res = juego.realizarTarea(codigo,nick);
				var partida=juego.partidas[codigo];
				if (partida.fase.nombre == "final"){
					var data={"Fase":partida.fase.nombre,"Ganadores":partida.fase.ganadores};
					cli.enviarATodos(io,codigo,"final",data);
				}
				//obtener porcentaje para dibujar algo (global o local)
				percentGlobal = juego.obtenerPercentGlobal(codigo);
				percentLocal = juego.obtenerPercentTarea(codigo, nick);
				var datos = {percentGlobal:percentGlobal, percentLocal:percentLocal}
				cli.enviarRemitente(socket,"realizandoTarea", datos);
			});
		});
	}
}

module.exports.ServidorWS=ServidorWS;