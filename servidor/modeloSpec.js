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
    expect(usr.nick).toEqual("pepe");
    expect(usr.juego).not.toBe(undefined);
  });

  it("Comprobar valores de la partida", function() {
    var codigo=juego.crearPartida(3,usr);
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
	    usr.iniciarPartida(codigo);
	    expect(partida.fase.nombre=="jugando").toBe(true);
	  	
	});

	describe("Creacion de 3 usuarios, uniones y abandonos", function() {
    	beforeEach(function() {
       	codigo=usr.crearPartida(4);
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
		    	partida.usuarios["gema"].abandonarPartida();
		    	partida.usuarios["paloma"].abandonarPartida();
		    	partida.usuarios["vero"].abandonarPartida();
		    	expect(partida.usuarios["gema"]).toBe(undefined);
		    	expect(partida.usuarios["paloma"]).toBe(undefined);
		    	expect(partida.usuarios["vero"]).toBe(undefined);
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
		    	usr.iniciarPartida();
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
				usr.iniciarPartida();
				usuarios = partida.codigo.usuarios;
				numImpostores = partida.numImpostoresVivos(); 
				impostor = partida.asignarImpostor();
				ciudadanos = partida.cuantosCiudadanosVivos();
			});

			it("Comprobación de que existe un impostor", function() {
				
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

		 //Pendiente pruebas de votaciones 
		 
		});
	}); 
});s