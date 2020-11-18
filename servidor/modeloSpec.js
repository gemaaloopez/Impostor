var modelo=requiere("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
    juego = new modelo.Juego();
    usr = new modelo.Usuario("pepe",juego);
  });

  it("Comprobar valores iniciales", function() {
    expect(Object.keys(juego.partidas).length).toEqual(0);
    expect(nick).toEqual("pepe");
    expect(juego).not.toBe(undefined);
  });

  it("Comprobar valores de la partida", function() {
    	codigo=juego.crearPartida(3, nick);
		expect(codigo).toEqual("Error");
		codigo=juego.crearPartida(11, nick);
		expect(codigo).toEqual("Error");
  });  

  it("Comprobar datos de inicio", function(){
  	expect(Object.keys(juego.partidas).length).toEqual(0);
  	expect(usr.nick).toEqual("pepe");
  	expect(usr.juego).not.toBe(undefined);
  });

  it("Comprobar datos de la partida",function(){
	codigo=usr.crearPartida(3);
	expect(codigo).toEqual("Error");
	codigo=usr.crearPartida(11);
	expect(codigo).toEqual("Error");
  });

  describe("cuando el usuario pepe crea una partida", function() {
    beforeEach(function() {
       	codigo=usr.crearPartida(4);
		fase = new Inicial();
		partida = juego.partidas[codigo];
    });

  it("el usr Pepe crea una partida de 4 jugadores", function() {
		expect(codigo).not.toBe(undefined);
		expect(partida.nickOwner==usr.nick).toBe(true);
		expect(partida.fase.nombre=="inicial").toBe(true);
		expect(partida.maximo==4).toBe(true);
		expect(Object.keys(partida.usuarios).length==1).toBe(true);
	});

  it("3 usuario se unen mediante unirAPartida de partida", function() {
	    juego.unirAPartida(codigo, "pepe");
	    expect(Object.keys(partida.usuarios).length==2).toBe(true);
	    juego.unirAPartida(codigo, "pepe");
	    expect(Object.keys(partida.usuarios).length==3).toBe(true);
	    juego.unirAPartida(codigo, "pepe");
	    expect(Object.keys(partida.usuarios).length==4).toBe(true);
	    expect(partida.usuarios["pepe"]).not.toBe(undefined);
	    expect(partida.usuarios["pepe1"]).not.toBe(undefined);
	    expect(partida.usuarios["pepe2"]).not.toBe(undefined);
	    expect(partida.usuarios["pepe3"]).not.toBe(undefined);
	    expect(partida.usuarios["pepe4"]).toBe(undefined);
	});


   it("El creador inicia la partida", function() {
	    juego.unirAPartida(codigo, "pepe");
	    expect(Object.keys(partida.usuarios).length==2).toBe(true);
	    juego.unirAPartida(codigo, "pepe");
	    expect(Object.keys(partida.usuarios).length==3).toBe(true);
	    juego.unirAPartida(codigo, "pepe");
	    expect(Object.keys(partida.usuarios).length==4).toBe(true);
	    usr.iniciarPartida(codigo,nick);
	    expect(partida.fase.nombre=="jugando").toBe(true);
	  	
	});

	describe("Creacion de 3 usuarios, uniones y abandonos", function() {
    	beforeEach(function() {
       	codigo=usr.crearPartida(4, nick);
		fase = new modelo.Inicial();
		partida = juego.partidas[codigo];
		usrgema = new modelo.Usuario("gema",juego);
		usrpaloma = new modelo.Usuario("paloma",juego);
		usrvero = new modelo.Usuario("vero",juego);
    	});

		it("Se crean 3 usuarios y se unen con usr.unirAPartida(codigo)", function() {
		    juego.unirAPartida(codigo, "gema");
		    expect(Object.keys(partida.usuarios).length==2).toBe(true);
		    juego.unirAPartida(codigo, "paloma");
		    expect(Object.keys(partida.usuarios).length==3).toBe(true);
		   	juego.unirAPartida(codigo, "vero");
		    expect(Object.keys(partida.usuarios).length==4).toBe(true);
		    expect(partida.usuarios["gema"]).not.toBe(undefined);
		    expect(partida.usuarios["paloma"]).not.toBe(undefined);
		    expect(partida.usuarios["vero"]).not.toBe(undefined);

		    expect(partida.usuarios["gema"].encargo).toEqual("ninguno");
		    expect(partida.usuarios["paloma"].encargo).toEqual("ninguno");
		    expect(partida.usuarios["vero"].encargo).toEqual("ninguno");
		  	});

		   it("3 usuarios de una partida sin iniciar, la abandonan", function() {
		    	juego.unirAPartida(codigo, "gema");
		    	expect(Object.keys(partida.usuarios).length==2).toBe(true);
		    	juego.unirAPartida(codigo, "paloma");
		    	expect(Object.keys(partida.usuarios).length==3).toBe(true);
		    	juego.unirAPartida(codigo, "vero");
		    	expect(Object.keys(partida.usuarios).length==4).toBe(true);
		    	expect(partida.usuarios["gema"]).not.toBe(undefined);
		    	expect(partida.usuarios["paloma"]).not.toBe(undefined);
		    	expect(partida.usuarios["vero"]).not.toBe(undefined);
		    	expect(partida.usuarios["pepe"]).not.toBe(undefined);
		    	partida.usuarios["gema"].abandonarPartida();
		    	expect(Object.keys(partida.usuarios).length==3).toBe(true);
				partida.usuarios["paloma"].abandonarPartida();
				expect(Object.keys(partida.usuarios).length==2).toBe(true);
		    	partida.usuarios["vero"].abandonarPartida();
		    	expect(Object.keys(partida.usuarios).length==1).toBe(true);
		    	partida.usuarios["pepe"].abandonarPartida();
		    	expect(partida.usuarios["gema"]).toBe(undefined);
		    	expect(partida.usuarios["paloma"]).toBe(undefined);
		    	expect(partida.usuarios["vero"]).toBe(undefined);
		    	expect(partida.usuarios["pepe"]).toBe(undefined);

		    	expect(juego.partidas[codigo])-toBe(undefined);
		  	});

		   it("3 usuarios de una partida ya iniciada, la abandonan", function() {
		    	juego.unirAPartida(codigo, "gema");
		    	expect(Object.keys(partida.usuarios).length==2).toBe(true);
		    	juego.unirAPartida(codigo, "paloma");
		    	expect(Object.keys(partida.usuarios).length==3).toBe(true);
		    	juego.unirAPartida(codigo, "vero");
		    	expect(Object.keys(partida.usuarios).length==4).toBe(true);
		    	expect(partida.usuarios["gema"]).not.toBe(undefined);
		    	expect(partida.usuarios["paloma"]).not.toBe(undefined);
		    	expect(partida.usuarios["vero"]).not.toBe(undefined);
		    	expect(partida.fase.nombre=="completado").toBe(true);
		    	juego.iniciarPartida(codigo, nick);
		    	expect(partida.fase.nombre=="jugando").toBe(true);
		    	expect(partida.usuarios["gema"].encargo).not.toEqual("ninguno");
				expect(partida.usuarios["paloma"].encargo).not.toEqual("ninguno");
				expect(partida.usuarios["vero"].encargo).not.toEqual("ninguno");
		    	partida.usuarios["gema"].abandonarPartida();
		    	expect(Object.keys(partida.usuarios).length==3).toBe(true);
		    	partida.usuarios["paloma"].abandonarPartida();
		    	expect(partida.fase.nombre=="inicial").toBe(true);
		    	expect(Object.keys(partida.usuarios).length==2).toBe(true);
		    	partida.usuarios["vero"].abandonarPartida();
		    	partida.usuarios["pepe"].abandonarPartida();
		    	expect(partida.numJugadores()).toEqual(0);
		    	juego.eliminarPartida(codigo);
		    	expect(juego.partidas[codigo]).toBe(undefined);
		  	});

		 	it("Mientras estamos jugando la partida", function(){
		  	beforeEach(function() {
				juego.unirAPartida(codigo, "gema");
				juego.unirAPartida(codigo, "paloma");
				juego.unirAPartida(codigo, "vero");
				juego.iniciarPartida(codigo, nick);
				usuarios = partida.codigo.usuarios;
				numImpostores = partida.numImpostoresVivos(); 
				impostor = partida.identificarImpostor();
				ciudadanos = partida.cuantosCiudadanosVivos();
			});

		/*	it("Comprobación de que existe un impostor", function() {
				
				expect(numImpostores).not.toEqual(0);
			});

			it("Partida ganada por los impostores", function() {
				expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["gema"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["vero"].estado.nombre).toEqual("vivo");
				impostor = partida.asignarImpostor();
				impostor.atacar("pepe");
				impostor.atacar("gema");
				impostor.atacar("paloma");
				impostor.atacar("vero");
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("impostores");
			});

			it("La partida la ganan los impostores", function() {
				expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["gema"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["vero"].estado.nombre).toEqual("vivo");
				impostor = partida.identificarImpostor();
				impostor.atacar("pepe");
				impostor.atacar("gema");
				impostor.atacar("paloma");
				impostor.atacar("vero");
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("impostores");
			});

			it("Muere un ciudadano", function() {
				expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
				impostor.atacar(ciudadanos[0].nick); 
				expect(partida.usuarios[ciudadanos[0].nick].estado.nombre).toEqual("muerto");
			});
			it("Se realizan votaciones, ninguno vota, y nadie muere, se continua la jugada", function() {
				expect(partida.fase.nombre).toEqual("jugando");
				expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["gema"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["vero"].estado.nombre).toEqual("vivo");
				partida.empezarVotacion();
				expect(partida.fase.nombre).toEqual("votacion");
				partida.usuarios["pepe"].skipr();
				expect(partida.usuarios["pepe"].skip).toBe(true);
				partida.usuarios["gema"].skipr();
				expect(partida.usuarios["gema"].skip).toBe(true);
				partida.usuarios["paloma"].skipr();
				expect(partida.usuarios["paloma"].skip).toBe(true);
				partida.usuarios["vero"].skipr();
				expect(partida.usuarios["vero"].skip).toBe(true);
				expect(partida.numImpostoresVivos()).toEqual(1);
				expect(partida.numCiudadanosVivos()).toEqual(3);
				expect(partida.gananLosCiudadanos()).toBe(false);
				expect(partida.gananLosImpostores()).toBe(false);
				partida.quitarAlMasVotado();
				expect(partida.numImpostoresVivos()).toEqual(1);
				expect(partida.numCiudadanosVivos()).toEqual(3);
				expect(partida.gananLosCiudadanos()).toBe(false);
				expect(partida.gananLosImpostores()).toBe(false);
				expect(partida.fase.nombre).toEqual("jugando");
				expect(partida.usuarios["pepe"].skip).toBe(false);
				expect(partida.usuarios["gema"].skip).toBe(false);
				expect(partida.usuarios["paloma"].skip).toBe(false);
				expect(partida.usuarios["vero"].skip).toBe(false);
				expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["gema"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["vero"].estado.nombre).toEqual("vivo");
			});

			it("Se atrapa al impostor, la partida acabará y ganan los ciudadanos", function() {
				expect(partida.fase.nombre).toEqual("jugando");
				expect(partida.usuarios["pepe"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["gema"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["paloma"].estado.nombre).toEqual("vivo");
				expect(partida.usuarios["vero"].estado.nombre).toEqual("vivo");
				partida.empezarVotacion();
				expect(partida.fase.nombre).toEqual("votacion");
				ciudadanos[0].vota(impostor.nick);
				expect(ciudadanos[0].skip).toBe(false);
				expect(ciudadanos[0].haVotado).toBe(true);
				expect(impostor.votos).toEqual(1);
				ciudadanos[1].vota(impostor.nick);
				expect(ciudadanos[1].haVotado).toBe(true);
				expect(ciudadanos[1].skip).toBe(false);
				expect(impostor.votos).toEqual(2);
				ciudadanos[2].vota(impostor.nick);
				expect(ciudadanos[2].skip).toBe(false);
				expect(ciudadanos[2].haVotado).toBe(true);
				expect(impostor.votos).toEqual(3);
				expect(partida.numImpostoresVivos()).toEqual(1);
				expect(partida.numCiudadanosVivos()).toEqual(3);
				expect(partida.gananLosCiudadanos()).toBe(false);
				expect(partida.gananLosImpostores()).toBe(false);
				partida.quitarAlMasVotado();
				expect(partida.numImpostoresVivos()).toEqual(0);
				expect(partida.numCiudadanosVivos()).toEqual(3);
				expect(partida.gananLosCiudadanos()).toBe(true);
				expect(partida.gananLosImpostores()).toBe(false);
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("ciudadanos");
				expect(impostor.estado.nombre).toEqual("muerto");
			});
		*/	
		});	

		describe("las votaciones",function(){
			beforeEach(function(){
				juego.unirAPartida(codigo, "Jose");
				juego.unirAPartida(codigo, "Pedro");
				juego.unirAPartida(codigo, "Antonio");
				juego.iniciarPartida(codigo, nick);

			});

			it("todos skipean",function(){
				var partida=juego.partidas[codigo];
				juego.mandarVotacion(codigo, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto(codigo, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto(codigo, "Jose");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto(codigo, "Pedro");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.saltarVoto(codigo, "Antonio");
				expect(partida.fase.nombre).toEqual("jugando");
			})
			it("Se vota y mata a un inocente",function(){
				var partida=juego.partidas[codigo];
				juego.mandarVotacion(codigo, nick);
				partida.usuarios[nick].impostor=true;
				partida.usuarios["Jose"].impostor=false;
				partida.usuarios["Pedro"].impostor=false;
				partida.usuarios["Antonio"].impostor=false;
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, nick, "Antonio");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Jose", "Antonio");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Pedro", "Antonio");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Antonio", "Antonio");
				expect(partida.usuarios["Antonio"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("jugando");
			})
			it("Se vota y mata a un impostor",function(){
				var partida=juego.partidas[codigo];
				juego.lanzarVotacion(codigo, nick);
				partida.usuarios[nick].impostor=true;
				partida.usuarios["Jose"].impostor=false;
				partida.usuarios["Pedro"].impostor=false;
				partida.usuarios["Antonio"].impostor=false;
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, nick, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Jose", nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Pedro", nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Antonio", nick);
				expect(partida.usuarios[nick].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("ciudadanos");
			})
			it("Ataca el impostor y mata a todos",function(){
				var partida=juego.partidas[codigo];
				partida.usuarios[nick].impostor=true;
				partida.usuarios["Jose"].impostor=false;
				partida.usuarios["Pedro"].impostor=false;
				partida.usuarios["Antonio"].impostor=false;
				expect(partida.fase.nombre).toEqual("jugando");
				juego.atacar(codigo, nick, "Jose");
				expect(partida.usuarios["Jose"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("jugando");
				juego.atacar(codigo, nick, "Pedro");
				expect(partida.usuarios["Pedro"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("impostores");
			})
			it("Se vota y mata a un impostor, la partida acaba",function(){
				var partida=juego.partidas[codigo];
				juego.mandarVotacion(codigo, nick);
				partida.usuarios[nick].impostor=true;
				partida.usuarios["Jose"].impostor=false;
				partida.usuarios["Pedro"].impostor=false;
				partida.usuarios["Antonio"].impostor=false;
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, nick, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Jose", nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Pedro", nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Antonio", nick);
				expect(partida.usuarios[nick].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("ciudadanos");
			})
			it("Se vota a los inocentes y gana la partida el impostor",function(){
				var partida=juego.partidas[codigo];
				juego.mandarVotacion(codigo, nick);
				partida.usuarios[nick].impostor=true;
				partida.usuarios["Jose"].impostor=false;
				partida.usuarios["Pedro"].impostor=false;
				partida.usuarios["Antonio"].impostor=false;
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, nick, "Pedro");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Jose", "Pedro");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Pedro", "Pedro");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Antonio", "Pedro");
				expect(partida.usuarios["Pedro"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("jugando");
				juego.mandarVotacion(codigo, nick);
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, nick, "Antonio");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Jose", "Antonio");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Pedro", "Antonio");
				expect(partida.fase.nombre).toEqual("votacion");
				juego.votar(codigo, "Antonio", "Antonio");
				expect(partida.todosHanVotado()).toBe(true);
				expect(partida.elegido).toEqual("Antonio");
				expect(partida.usuarios["Antonio"].estado.nombre).toEqual("muerto");
				expect(partida.fase.nombre).toEqual("final");
				expect(partida.fase.ganadores).toEqual("impostores");
			})
			
		});


	});
});