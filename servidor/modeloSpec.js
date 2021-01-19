var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
      var juego;
      //var usr;
      var nick;

      beforeEach(function() {
          juego = new modelo.Juego(4, "test");
          //usr = new modelo.Usuario("pepe",juego);
          nick="pepe";
      });

      it("Comprobar los valores iniciales", function() {
          expect(Object.keys(juego.partidas).length).toEqual(0);
          expect(nick).toEqual("pepe");
          expect(juego).not.toBe(undefined);
      });

      it("Comprobar los valores de la partida", function() {
          codigo=juego.crearPartida(1, nick);
          expect(codigo).toEqual("fallo");
          codigo=juego.crearPartida(11, nick);
          expect(codigo).toEqual("fallo");
      });

      describe("cuando el usuario pepe crea una partida de 4 jugadores", function() {

          beforeEach(function() {
            nick = "pepe";
            codigo=juego.crearPartida(4, nick);
            fase = new modelo.Inicial();
            partida = juego.partidas[codigo];
          });

        it("el usr Pepe crea una partida de 4 jugadores", function() {
            expect(codigo).not.toBe(undefined);
            expect(partida.nickOwner==nick).toBe(true);
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


        it("El creador va a inicia la partida", function() {
          juego.unirAPartida(codigo, "pepe");
          expect(Object.keys(partida.usuarios).length==2).toBe(true);
          juego.unirAPartida(codigo, "pepe");
          expect(Object.keys(partida.usuarios).length==3).toBe(true);
          juego.unirAPartida(codigo, "pepe");
          expect(Object.keys(partida.usuarios).length==4).toBe(true);
          juego.iniciarPartida(codigo, nick);
          expect(partida.fase.nombre=="jugando").toBe(true);
        });

    describe("Creacion de 3 usuarios, uniones y abandonos", function() {
          beforeEach(function() {
            codigo=juego.crearPartida(4, nick);
            fase = new modelo.Inicial();
            partida = juego.partidas[codigo];
            usrpaloma = new modelo.Usuario("paloma",juego);
            usrluisita = new modelo.Usuario("luisita",juego);
            usramelia = new modelo.Usuario("amelia",juego);
          });


          it("Se crean 3 usuarios y se unen con el usr unirAPartida(codigo)", function() {
            juego.unirAPartida(codigo, "paloma");
            expect(Object.keys(partida.usuarios).length==2).toBe(true);
            juego.unirAPartida(codigo, "luisita");
            expect(Object.keys(partida.usuarios).length==3).toBe(true);
            juego.unirAPartida(codigo, "amelia");
            expect(Object.keys(partida.usuarios).length==4).toBe(true);
            expect(partida.usuarios["paloma"]).not.toBe(undefined);
            expect(partida.usuarios["luisita"]).not.toBe(undefined);
            expect(partida.usuarios["amelia"]).not.toBe(undefined);
            expect(partida.usuarios["paloma"].encargo).toEqual("ninguno");
            expect(partida.usuarios["luisita"].encargo).toEqual("ninguno");
            expect(partida.usuarios["amelia"].encargo).toEqual("ninguno");
          });


          it("3 usuarios de una partida sin iniciar quieren abandonar", function() {
            juego.unirAPartida(codigo, "paloma");
            expect(Object.keys(partida.usuarios).length==2).toBe(true);
            juego.unirAPartida(codigo, "luisita");
            expect(Object.keys(partida.usuarios).length==3).toBe(true);
            juego.unirAPartida(codigo, "amelia");
            expect(Object.keys(partida.usuarios).length==4).toBe(true);
            expect(partida.usuarios["paloma"]).not.toBe(undefined);
            expect(partida.usuarios["luisita"]).not.toBe(undefined);
            expect(partida.usuarios["amelia"]).not.toBe(undefined);
            expect(partida.usuarios["pepe"]).not.toBe(undefined);
            partida.usuarios["paloma"].abandonarPartida();
            expect(Object.keys(partida.usuarios).length==3).toBe(true);
            partida.usuarios["luisita"].abandonarPartida();
            expect(Object.keys(partida.usuarios).length==2).toBe(true);
            partida.usuarios["amelia"].abandonarPartida();
            expect(Object.keys(partida.usuarios).length==1).toBe(true);
            partida.usuarios["pepe"].abandonarPartida();
            expect(partida.usuarios["paloma"]).toBe(undefined);
            expect(partida.usuarios["luisita"]).toBe(undefined);
            expect(partida.usuarios["amelia"]).toBe(undefined);
            expect(partida.usuarios["pepe"]).toBe(undefined);
         
            expect(juego.partidas[codigo]).toBe(undefined);
          });


          it("3 usuarios de una partida ya iniciada la quieren abandonan", function() {
              juego.unirAPartida(codigo, "paloma");
              expect(Object.keys(partida.usuarios).length==2).toBe(true);
              juego.unirAPartida(codigo, "luisita");
              expect(Object.keys(partida.usuarios).length==3).toBe(true);
              juego.unirAPartida(codigo, "amelia");
              expect(Object.keys(partida.usuarios).length==4).toBe(true);
              expect(partida.usuarios["paloma"]).not.toBe(undefined);
              expect(partida.usuarios["luisita"]).not.toBe(undefined);
              expect(partida.usuarios["amelia"]).not.toBe(undefined);
              expect(partida.fase.nombre=="completado").toBe(true);
              juego.iniciarPartida(codigo, nick);
              expect(partida.fase.nombre=="jugando").toBe(true);
              expect(partida.usuarios["paloma"].encargo).not.toEqual("ninguno");
              expect(partida.usuarios["luisita"].encargo).not.toEqual("ninguno");
              expect(partida.usuarios["amelia"].encargo).not.toEqual("ninguno");
              partida.usuarios["paloma"].abandonarPartida();
              expect(Object.keys(partida.usuarios).length==3).toBe(true);
              partida.usuarios["luisita"].abandonarPartida();
              expect(partida.fase.nombre=="inicial").toBe(true);
              expect(Object.keys(partida.usuarios).length==2).toBe(true);
              partida.usuarios["amelia"].abandonarPartida();
              partida.usuarios["pepe"].abandonarPartida();
              expect(partida.numJugadores()).toEqual(0);
              juego.eliminarPartida(codigo);
              expect(juego.partidas[codigo]).toBe(undefined);
            });
        });
        
      describe("las votaciones",function(){
            beforeEach(function(){
              juego.unirAPartida(codigo, "ana");
              juego.unirAPartida(codigo, "isa");
              juego.unirAPartida(codigo, "tomas");
              juego.iniciarPartida(codigo, nick);

            });

              it("todos skipean",function(){
                var partida=juego.partidas[codigo];
                juego.echarVotacion(codigo, nick);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto(codigo, nick);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto(codigo, "ana");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto(codigo, "isa");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.saltarVoto(codigo, "tomas");
                expect(partida.fase.nombre).toEqual("jugando");
              })


              it("Se vota y se mata a un inocente",function(){
                var partida=juego.partidas[codigo];
                juego.echarVotacion(codigo, nick);
                partida.usuarios[nick].impostor=true;
                partida.usuarios["ana"].impostor=false;
                partida.usuarios["isa"].impostor=false;
                partida.usuarios["tomas"].impostor=false;
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, nick, "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "ana", "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "isa", "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "tomas", "tomas");
                expect(partida.usuarios["tomas"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("jugando");
              })


              it("Se vota y se mata a el impostor",function(){
                var partida=juego.partidas[codigo];
                juego.echarVotacion(codigo, nick);
                partida.usuarios[nick].impostor=true;
                partida.usuarios["ana"].impostor=false;
                partida.usuarios["isa"].impostor=false;
                partida.usuarios["tomas"].impostor=false;
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, nick, nick);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "ana", nick);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "isa", nick);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "tomas", nick);
                expect(partida.usuarios[nick].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("final");
                expect(partida.fase.ganadores).toEqual("ciudadanos");
              })


              it("Se votan a inocentes y gana el impostor",function(){
                var partida=juego.partidas[codigo];
                juego.echarVotacion(codigo, nick);
                partida.usuarios[nick].impostor=true;
                partida.usuarios["ana"].impostor=false;
                partida.usuarios["isa"].impostor=false;
                partida.usuarios["tomas"].impostor=false;
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, nick, "isa");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "ana", "isa");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "isa", "isa");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "tomas", "isa");
                expect(partida.usuarios["isa"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("jugando");
                juego.echarVotacion(codigo, nick);
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, nick, "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "ana", "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "isa", "tomas");
                expect(partida.fase.nombre).toEqual("votacion");
                juego.votar(codigo, "tomas", "tomas");
                expect(partida.todosHanVotado()).toBe(true);
                expect(partida.elegido).toEqual("tomas");
                expect(partida.usuarios["tomas"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("final");
                expect(partida.fase.ganadores).toEqual("impostores");
              })
      
              it("Ataca el impostor y mata a todos",function(){
                var partida=juego.partidas[codigo];
                partida.usuarios[nick].impostor=true;
                partida.usuarios["ana"].impostor=false;
                partida.usuarios["isa"].impostor=false;
                partida.usuarios["tomas"].impostor=false;
                expect(partida.fase.nombre).toEqual("jugando");
                juego.atacar(codigo, nick, "ana");
                expect(partida.usuarios["ana"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("jugando");
                juego.atacar(codigo, nick, "isa");
                expect(partida.usuarios["isa"].estado.nombre).toEqual("muerto");
                expect(partida.fase.nombre).toEqual("final");
                expect(partida.fase.ganadores).toEqual("impostores");
              })

              it("realizar tareas",function(){
                    var partida=juego.partidas[codigo];
                    expect(partida.obtenerPercentGlobal()).toEqual();
                    for(var i=0;i<9;i++){//10 tareas como max
                      for(var key in partida.usuarios){
                        partida.usuarios[key].realizarTarea();
                      }
                      expect(partida.fase.nombre).toEqual("jugando");
                      expect(partida.obtenerPercentGlobal()).toEqual(((i+1)*100)/10);
                    }
                    for(var key in partida.usuarios){
                        partida.usuarios[key].realizarTarea();
                    }
                    expect(partida.obtenerPercentGlobal()).toEqual(100);
                    expect(partida.fase.nombre).toEqual("final");
                    expect(partida.fase.ganadores).toEqual("ciudadanos");
             })

         });

    });

});