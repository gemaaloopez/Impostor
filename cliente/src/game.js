/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

function lanzarJuego(){
  game = new Phaser.Game(config);
}

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  let game;// = new Phaser.Game(config);
  let cursors;
  let player;
  //let player2;
  var jugadores=[];
  let showDebug = false;
  let camera;
  var worldLayer;
  let map;
  var crear;
  var spawnPoint;
  var recursos=[{frame:0,sprite:"chumi"},{frame:3,sprite:"gema"},{frame:6,sprite:"paco"},{frame:9,sprite:"palo"}]; //{id:8,nombre:"palo"}
  var remotos;
  var muertos;
  var followText;
  var followTextRemoto=[];
  var followTextRemotoMuerto;
  var tareasOn=true;
  var ataquesOn=true;
  var final=false;
  var capaTareas;
  function preload() {
    this.load.image("tiles", "cliente/assets/tilesets/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "cliente/assets/tilemaps/tuxemon-town.json");

    // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
    // the player animations (walking left, walking right, etc.) in one image. For more info see:
    //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
    // If you don't use an atlas, you can do the same thing with a spritesheet, see:
    //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
    //this.load.atlas("atlas", "cliente/assets/atlas/atlas.png", "cliente/assets/atlas/atlas.json");
    //this.load.spritesheet("gabe","cliente/assets/images/gabe.png",{frameWidth:24,frameHeight:24});
    //this.load.spritesheet("gabe","cliente/assets/images/male01-2.png",{frameWidth:32,frameHeight:32});
    this.load.spritesheet("varios","cliente/assets/images/personajes.png",{frameWidth:48,frameHeight:48});
  }

  function create() {
    crear=this;
    map = crear.make.tilemap({key:"map"});

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const decoracion = map.createStaticLayer("decoracion", tileset, 0, 0);
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
    worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    capaTareas = map.createStaticLayer("capaTareas", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    capaTareas.setCollisionByProperty({ collides: true });

    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);
    decoracion.setDepth(11);

    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

   
     const anims = crear.anims;
      anims.create({
        key: "chumi-left-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 12,
          end: 14,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims.create({
        key: "chumi-right-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 24,
          end: 26,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims.create({
        key: "chumi-front-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 0,
          end: 2,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims.create({
        key: "chumi-back-walk",
        frames: anims.generateFrameNames("gabe", {
          //prefix: "misa-left-walk.",
          start: 36,
          end: 38,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });

      const anims2 = crear.anims;
      anims2.create({
        key: "gema-left-walk",
        frames: anims.generateFrameNames("varios", {
          start: 15,
          end: 17,
        }),
        repeat: -1
      });
      anims2.create({
        key: "gema-right-walk",
        frames: anims.generateFrameNames("varios", {
          start: 27,
          end: 29,
        }),
        repeat: -1
      });
      anims2.create({
        key: "gema-front-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 3,
          end: 5,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims2.create({
        key: "gema-back-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 39,
          end: 41,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });

      const anims3 = crear.anims;
      anims3.create({
        key: "pepe-left-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 18,
          end: 20,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
  
      anims3.create({
        key: "pepe-right-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 30,
          end: 32,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims3.create({
        key: "pepe-front-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 6,
          end: 8,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims3.create({
        key: "pepe-back-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 42,
          end: 44,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
       const anims4 = crear.anims;
      anims4.create({
        key: "pablo-left-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 60,
          end: 62,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims4.create({
        key: "pablo-right-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 72,
          end: 74,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims4.create({
        key: "pablo-front-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 48,
          end: 50,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims4.create({
        key: "pablo-back-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 84,
          end: 86,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });

      const anims5 = crear.anims;
      anims5.create({
        key: "paco-left-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 63,
          end: 65,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims5.create({
        key: "paco-right-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 75,
          end: 77,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims5.create({
        key: "paco-front-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 51,
          end: 53,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims5.create({
        key: "paco-back-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 87,
          end: 89,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
          const anims6 = crear.anims;
      anims6.create({
        key: "palo-left-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 66,
          end: 68,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims6.create({
        key: "palo-right-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 78,
          end: 80,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims6.create({
        key: "palo-front-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 54,
          end: 56,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });
      anims6.create({
        key: "palo-back-walk",
        frames: anims.generateFrameNames("varios", {
          //prefix: "misa-left-walk.",
          start: 90,
          end: 92,
          //zeroPad: 3
        }),
        //frameRate: 10,
        repeat: -1
      });

    // const camera = this.cameras.main;
    // camera.startFollow(player);
    // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    cursors = crear.input.keyboard.createCursorKeys();
    remotos = crear.add.group();
    muertos = crear.add.group();
    teclaA=crear.input.keyboard.addKey('a');
    teclaV=crear.input.keyboard.addKey('v');
    teclaT=crear.input.keyboard.addKey('t');
    lanzarJugador(ws.nick,ws.numJugador,ws.numJugador);
    ws.estoyDentro();
    // Help text that has a "fixed" position on the screen
    // this.add
    //   .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
    //     font: "18px monospace",
    //     fill: "#000000",
    //     padding: { x: 20, y: 10 },
    //     backgroundColor: "#ffffff"
    //   })
    //   .setScrollFactor(0)
    //   .setDepth(30);

    // Debug graphics
    // this.input.keyboard.once("keydown_D", event => {
    //   // Turn on physics debugging to show player's hitbox
    //   this.physics.world.createDebugGraphic();

    //   // Create worldLayer collision graphic above the player, but below the help text
    //   const graphics = this.add
    //     .graphics()
    //     .setAlpha(0.75)
    //     .setDepth(20);
    //   worldLayer.renderDebug(graphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    //   });
    // });
  }

  function tareas(sprite,objeto){
    if(ws.encargo==objeto.properties.tarea && teclaT.isDown){
     tareasOn=false;
      console.log("realizar tarea"+ws.encargo);
     // ws.realizarTarea();//o hacer la llamada dentro del control web
      cw.mostrarModalTarea(ws.encargo);
    }
  }

  function lanzarJugador(nick,numJugador){
    var x=spawnPoint.x+numJugador*32+2;
      player = crear.physics.add.sprite(x, spawnPoint.y,"varios",recursos[numJugador].frame);    
      // Watch the player and worldLayer for collisions, for the duration of the scene:
      crear.physics.add.collider(player, worldLayer);
       crear.physics.add.collider(player,capaTareas, tareas,()=>{return tareasOn});
      //crear.physics.add.collider(player2, worldLayer);
      jugadores[nick] = player;
      jugadores[nick].nick = nick;
      jugadores[nick].numJugador = numJugador;
      camera = crear.cameras.main;
      camera.startFollow(player);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      camera.setZoom(2);
      //camera.setSize(200);
      this.followText = crear.add.text(0, 0, jugadores[nick].nick);

    }


  function lanzarJugadorRemoto(nick, numJugador){
    var x=spawnPoint.x+numJugador*32+2;
    var frame=recursos[numJugador].frame;
   jugadores[nick]=crear.physics.add.sprite(x+15*numJugador, spawnPoint.y,"varios",frame);   
    crear.physics.add.collider(jugadores[nick], worldLayer);
    jugadores[nick].nick = nick;
    jugadores[nick].numJugador = numJugador;
    remotos.add(jugadores[nick]);
    this.followTextRemoto[numJugador] = crear.add.text(0, 0, jugadores[nick].nick);
    
  }
    
  function crearColision(){
    if (crear && ws.impostor){
      crear.physics.add.overlap(player,remotos,kill,()=>{return ataquesOn});
    }
  }

  function kill(sprite, inocente){
    var nick = inocente.nick;
    if(teclaA.isDown){
      ataquesOn = false;
      ws.atacar(nick);
    }
  }

  function dibujarInocenteMuerto(inocente){
      var x=jugadores[inocente].x;
      var y =jugadores[inocente].y;
      var numJugador=jugadores[inocente].numJugador;

      var muerto=crear.physics.add.sprite(x,y,"muertos", recursos[numJugador].frame);
      muertos.add(muerto);
      crear.physics.add.overlap(player,muertos,votacion);
    }
  function votacion(sprite,muerto){
    if(teclaV.isDown){
      ws.mandarVotacion(); 
    }
  }
  

 function lanzarJugador(nick,numJugador){
    var x = spawnPoint.x+numJugador*32*2;
    player = crear.physics.add.sprite(x, spawnPoint.y,"varios",recursos[numJugador].frame);
    crear.physics.add.collider(player, worldLayer);
    crear.physics.add.collider(player, capaTareas, tareas,()=>{return tareasOn});
    jugadores[nick] = player;
    jugadores[nick].nick = nick;
    jugadores[nick].numJugador = numJugador;
    camera = crear.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2);
    this.followText = crear.add.text(0, 0, jugadores[nick].nick);


  }
  function lanzarJugadorRemoto(nick, numJugador){
    var x = spawnPoint.x+numJugador*32*2;
    console.log(numJugador)
    console.log(recursos)
    var frame = recursos[numJugador].frame;
    jugadores[nick]=crear.physics.add.sprite(x, spawnPoint.y,"varios",frame);   
    crear.physics.add.collider(jugadores[nick], worldLayer);
    jugadores[nick].nick = nick;
    jugadores[nick].numJugador = numJugador;
    remotos.add(jugadores[nick]);
    this.followTextRemoto[numJugador] = crear.add.text(0, 0, jugadores[nick].nick);
  }
  function mover(datos){

    var direccion=datos.direccion;
    var nick=datos.nick;
    var numJugador=datos.numJugador;
    var x= datos.x;
    var y= datos.y;
    var remoto=jugadores[nick];
    const speed = 175;

     // const prevVelocity = player.body.velocity.clone();
      const nombre=recursos[numJugador].sprite;
     if (remoto && !final){
    
        remoto.body.setVelocity(0);
        remoto.setX(x);
        remoto.setY(y);
        remoto.body.velocity.normalize().scale(speed);
      if (direccion=="left") {
        remoto.anims.play(nombre+"-left-walk", true);
      } else if (direccion=="right") {
        remoto.anims.play(nombre+"-right-walk", true);
      } else if (direccion=="up") {
        remoto.anims.play(nombre+"-back-walk", true);
      } else if (direccion=="down") {
        remoto.anims.play(nombre+"-front-walk", true);
      } else {
        remoto.anims.stop();
      }
    }
 }

   function finPartida(data){
    final=true;
    //remoto = undefined;
    cw.mostrarModalSimple("Fin de la partida... Ganan: "+data);
  }

 function update(time, delta) {

     const speed = 175;
  //const prevVelocity = player.body.velocity.clone();
    var direccion= "stop";
  const nombre=recursos[ws.numJugador].sprite;
  if(!final){
  // Stop any previous movement from the last frame
  player.body.setVelocity(0);
  //player2.body.setVelocity(0);

  

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
    direccion="left";
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
   direccion="right";
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
    direccion="up";
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
    direccion="down";
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
  ws.movimiento(direccion,player.body.x,player.body.y);
  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play(nombre+"-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play(nombre+"-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play(nombre+"-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play(nombre+"-front-walk", true);
  } else {
    player.anims.stop();

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);
  }
}


}
