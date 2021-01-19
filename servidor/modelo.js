function Juego(min){
	this.maximo=10;
	this.min=min;
	this.partidas={};

	this.unirAPartida=function(codigo,nick){
		let nickJugador= "fallo";
		if (this.partidas[codigo] && codigo !=undefined && nick!=undefined){
			nickJugador=this.partidas[codigo].agregarUsuario(nick);
		}
		//console.log(res);
		return nickJugador;
	}

	this.eliminarPartida=function(codigo){
		delete this.partidas[codigo];
	}
	this.numeroValido=function(num) {
		return num >= this.min && num<= this.maximo;
	}
	this.crearPartida=function(num,owner){
		let codigo="fallo";
		if(this.numeroValido(num)){ //!this.partidas[codigo] &&
				codigo=this.obtenerCodigo();
				this.partidas[codigo]=new Partida(num,owner,codigo,this);
				var fase=this.partidas[codigo].fase.nombre;
				//this.cad.insertarPartida({"codigo":codigo,"nick":owner,"numeroJugadores":num,"fase":fase}, function(res){})
		}else{
			console.log("acabas de superar el limite de partidipantes, lo siento ");
		}
		return codigo;
	}

	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
	this.obtenerCodigoDePartida = function(partidas, p) {
        return Object.keys(partidas).find(codigo => partidas[codigo] === p);
	}
	this.obtenerOwner = function(codigo) {
        let owner = "fallo";

        if(codigo != undefined && this.partidas[codigo]) {
            owner = this.partidas[codigo].nickOwner;
        }

        return owner;
    }

	this.listarPartidasDisponibles=function(){
		var lista = [];
		var huecos = 0;
		var maximo=0;
		var owner="";
		for (var key in this.partidas){
			let partida = this.partidas[key];
			huecos=partida.obtenerHuecos();
			owner= partida.nickOwner;
			if(huecos>0){
				lista.push({"codigo":key,"huecos":huecos,"owner":this.partidas[key].nickOwner,"maximo":this.partidas[key].maximo})
			}
		}
		return lista;
	}

	this.listarPartidas=function(){
		let lista = [];
		let huecos = 0;
		for (var key in this.partidas){
			let partida = this.partidas[key];
			let owner=this.partidas[key].nickOwner;
			lista.push({"codigo":key,"owner":owner})
		}
		return lista;
		}

	this.iniciarPartida=function(codigo, nick){
		console.log(codigo, nick, this.partidas)
		var owner=this.partidas[codigo].nickOwner;
		if(nick==owner){
			this.partidas[codigo].iniciarPartida();
		}
	}

	this.mandarVotacion=function(codigo, nick){
		var usr=this.partidas[codigo].usuarios[nick];
		this.reiniciarContadores(codigo);
		usr.mandarVotacion();
	}

	this.saltarVoto=function(codigo, nick, sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		usr.votar(sospechoso); 
	}

	this.votar=function(codigo, nick, sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partida[codigo].obtenerUsuario(nick);
		usr.vota(sospechoso);
	}
	this.obtenerEncargo=function(codigo,nick){
		var res={};
		var encargo=this.partidas[codigo].usuarios[nick].encargo;
		var impostor=this.partidas[codigo].usuarios[nick].impostor;
		res={"nick":nick,"encargo":encargo,"impostor":impostor};
		return res;
	}

	this.reiniciarContadores=function(codigo){
		if(this.partidas[codigo])
		this.partidas[codigo].reiniciarContadores();
	}

	this.atacar=function(codigo, nick, atacado){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partida[codigo].obtenerUsuario(nick);
		usr.atacar(atacado);
	}
	this.listarParticipantes=function(codigo){
		var lista = [];
		var partida = this.partidas[codigo];
		if (partida){
			lista = partida.devolverNicks();
		}
		return lista
	}
	this.obtenerListaJugadores=function(){
		var lista=[];
		for (var key in this.usuarios){
			lista.push({"nick":key, "numJugador":numero});
		}
		return lista;//Objetc.key(this.usuarios);
	}
	

	this.realizarTarea=function(codigo,nick){
		this.partidas[codigo].realizarTarea(nick);
		realizado = this.partidas[codigo].usuarios[nick].realizado;
		estadoRealizado = this.partidas[codigo].usuarios[nick].estadoRealizado;
		encargo = this.partidas[codigo].usuarios[nick].realizado;
		res={"encargo":encargo, "realizado":realizado, "estadoRealizado":estadoRealizado};
		return res;
	}

	this.obtenerPercentTarea=function(codigo, nick){
		return this.partidas[codigo].usuarios[nick].obtenerPercentTarea(nick);
	}

	this.obtenerPercentGlobal=function(codigo){
		return this.partidas[codigo].obtenerPercentGlobal();
	}

}

//FUNCIOOOOOON PARTIDAAAAAAAAAAAAAA
function Partida(num,owner,codigo,juego){
	this.juego=juego;
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.usuarios={};
	this.encargos=["jardines","calles","mobiliario","basuras"];
	this.elegido="no hay nadie elegido";

	this.agregarUsuario=function(nick){
		return this.fase.agregarUsuario(nick,this)
	}

	this.puedeAgregarUsuario=function(nick){
		let nuevo = nick;
		let contador = 1;
		while (this.usuarios[nuevo]){
			nuevo = nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		this.usuarios[nuevo].partida = this;
		var numero=this.numJugadores()-1;
		if(this.comprobarMinimo()){
			this.fase=new Completado();
			//this.
		}
		this.usuarios[nuevo].numJugador = numero;
		if (this.comprobarMinimo()){
		 	this.fase=new Completado();
		}
		return {"codigo":this.codigo,"nick":nuevo,"numJugador":numero};
	}	

	this.obtenerUsuario=function(nick){
		return this.usuarios[nick]
	}

	this.numJugadores=function(){
		return Object.keys(this.usuarios).length
	}

	this.comprobarMinimo=function () {
		return Object.keys(this.usuarios).length >= this.juego.min;
	}

	this.comprobarMaximo=function () {
		return Object.keys(this.usuarios).length < this.maximo
	}
	this.obtenerListaJugadores=function(){
		var lista=[];
		for (var key in this.usuarios){
			lista.push({"nick":key, "numJugador":numero});
		}
		return lista;//Objetc.key(this.usuarios);
	}
	this.obtenerHuecos=function(){
		return this.maximo - Object.keys(this.usuarios).length
	}
	this.comprobarMinimo=function(){
		return Object.keys(this.usuarios).length>=4
	}
	this.comprobarMaximo=function(){
		return Object.keys(this.usuarios).length<this.maximo
	}
	this.iniciarPartida=function(){
		this.fase.iniciarPartida(this);
	}

	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}

	this.puedeAbandonarPartida=function(nick){
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()){
			this.fase=new Inicial();
		}
		console.log("PP " +this.juego);
		if (this.numJugadores()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
	}

	this.eliminarUsuario=function(nick) {
		delete this.usuarios[nick];
	}

	this.puedeIniciarPartida=function() {
		this.asignarEncargos();
		this.asignarImpostor();
		this.fase=new Jugando();
	}

	this.asignarEncargos=function(){
		for(var usr in this.usuarios){
			i=0;
			this.usuarios[usr].encargo=this.encargos[i];
			i++;
		}
	}

	this.asignarImpostor=function(){
		this.nicks=Object.keys(this.usuarios);
		this.usuarios[this.nicks[randomInt(0,this.nicks.length)]].asignarImpostor();
	}

	this.atacar=function(nick){
		if(this.usuarios[nick]){
			this.fase.atacar(nick,this);
		}else{
			console.log("ese usuario no existe");
		}
		
	}

	this.puedeAtacar=function(nick){
		this.usuarios[nick].esAtacado();
	}
	this.numCiudadanos=function(){
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false){
				i++;
			}
		}
		return i
	}
    this.numCiudadanosVivos=function(){
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false && this.usuarios[usr].estadoVivo()){
				i++;
			}
		}
		return i
	}
	
	this.numImpostoresVivos=function(){
		var i=0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estadoVivo()){
				i++;
			}
		}
		return i
	}

	this.localizarImpostor=function(){
		var i=0;
		var impostor;
		for(var usr in this.usuarios){
				if (this.usuarios[usr].impostor == true && this.usuarios[usr].estadoVivo()){
						impostor = this.usuarios[usr];
				}
		}
		return impostor
	}

	this.vota=function(nick){
		this.fase.vota(nick, this);
	}

	this.puedeVotar=function(nick){
		this.usuarios[nick].haVotado();
		this.comprobarVotacion();
	}

	this.jugadorConMasVotos=function(){
		var masVotos="No hay nadie más votado";
		var votos =0;

		for(var usr in this.usuarios){
			console.log(usr + ' ' + this.usuarios[usr].votos + ' ' + votos)
				if(this.usuarios[usr].votos > votos && this.usuarios[usr].estado.nombre == "vivo"){
					votos = this.usuarios[usr].votos;
					masVotos = this.usuarios[usr];
				}
		}
		return masVotos
	}
	this.eliminarAlMasVotado=function(){
		this.fase.eliminarAlMasVotado(this);
	}
	this.puedeEliminarMasVotado=function(){
		this.comprobarVotacion();
	}
	this.iniciarVotacion=function(){
		this.fase.iniciarVotacion(this);
	}

	this.puedeIniciarVotacion=function(){
		this.fase = new Votacion();
	}


	this.listaHanVotado=function(){
		var lista=[];
		for(var key in this.usuarios){
			//if (this.usuarios[key].estado.nombre=="vivo"&& this.)
			lista.push(key);
		}

		return lista;
	}

	this.reiniciarContadores=function(){
		this.elegido="No hay nadie elegido"
		for(var usr in this.usuarios){
			if (this.usuarios[usr].estadoVivo()){
				this.usuarios[usr].skip = false;
				this.usuarios[usr].votos = 0;
				this.usuarios[usr].haVotado = false;
			}
		}
	}
	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartidaImpostores();
		}
		else if (this.gananCiudadanos()){
			this.finPartidaCiudadanos();
		}
		else{
			this.fase = new Jugando();
		}
	}
	this.comprobarVotacion=function(){
		if (this.todosHanVotado()){
			let elegido=this.jugadorMasVotado();
			if (elegido && elegido.votos>this.numeroSkips()){
				this.elegido=elegido.nick;
				elegido.esAtacado();
				//this.puedeAtacar(elegido.nick);
			}
			this.finalVotacion();
		}
	}
	this.finalVotacion=function(){
		this.fase=new Jugando();
		this.comprobarFinal();
	}

	this.numImpostoresVivos=function(){
		var i=0;
		for (var usr in this.usuarios) {
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre=="vivo"){
				i++;
			}
		}
		return i;
	}
	this.gananImpostores=function(){
		return this.numImpostoresVivos() >= this.numCiudadanosVivos()
		//(en caso cierto: cambiar fase a Final)
	}
	this.gananCiudadanos=function(){
		return this.numImpostoresVivos() == 0
		//comprobar que numero impostores vivos es 0
	}
	this.masVotado=function(){
		let votado="no hay nadie mas votado";
		//faltan cosas
	}
	this.numeroSkips=function(){
		//numero de usuarios que han hecho skip
		//recorre usuarios vivos, incrementar contador si skip de ese 
		//usuario es true.
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].skip == true && this.usuarios[usr].estadoVivo()){
				i++;
			}
		}
		return i
	}

	
	this.finPartidaImpostores=function(){
		this.fase = new Final();
		this.fase.ganadores = "impostores";
	}
	this.finPartidaCiudadanos=function(){
		this.fase = new Final();
		this.fase.ganadores = "ciudadanos";
	}

	this.devolverPartidasLibres=function(){
		this.fase.devolverPartidasLibres(this);
	}
	this.puedeDevolverPartidasLibres=function(){
		if(this.obtenerHuecos() > 0){
			return this
		}
	}
	this.todosHanVotado=function(){
		let res=true;
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoVivo() && !this.usuarios[key].haVotado){
				res=false;
				break;
			}
		}
		return res
	}
	this.listaHanVotado=function(){
		var lista=[];
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoVivo() && this.usuarios[key].haVotado){
				lista.push(key);
			}
		}
		return lista;
	}
	this.devolverNicks=function(){
		var lista=[];
		for(var key in this.usuarios){
			lista.push({"nick":key});
		}
		return lista;
	}
	this.obtenerListaJugadoresVivos=function(){
		var lista=[]
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoVivo()){
				var numero = this.usuarios[key].numJugador;
				lista.push({nick:key, numJugador:numero});
			}
		}
		return lista;
	}

	
	this.realizarTarea=function(nick){
		this.fase.realizarTarea(nick, this);
	}
	this.puedeRealizarTarea=function(nick){
		this.usuarios[nick].realizarTarea();
	}
	this.tareaTerminada=function(){
		if(this.comprobarTareasTerminadas()){
			this.finPartidaCiudadanos();
			console.log("Se han realizado todas las tareas por lo que termina el juego, ENHORABUENA");
		}
	}
	this.comprobarTareasTerminadas=function(){
		let resultado=true;
		for(var key in this.usuarios){
			if(this.usuarios[key].estadoRealizado == false){
				resultado=false;
				break;
			}
		}
		return resultado
	}

	this.obtenerPercentTarea=function(nick){
		return this.usuarios[nick].obtenerPercentTarea();
	}

	this.obtenerPercentGlobal=function(){
		var total = 0;
		for (var key in this.usuarios){
			total = total+this.obtenerPercentTarea(key);
		}
		total = total/this.numJugadores();
		return total;
	}



	this.agregarUsuario(owner);

}

	
function Inicial(){
	this.nombre="inicial";

	this.agregarUsuario=function(nick,partida){
		nombre = partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}
		return nombre	
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}
	this.atacar=function(nick,partida){
	}
	this.vota=function(nick, partida){

	}
	this.empezarVotacion=function(partida){

	}
	
	this.quitarAlMasVotado=function(partida){

	}
	this.skipr=function(usr){

	}
	this.devuelvePartidasLibres=function(partida){
		partida.puedeDevolverPartidasLibres();
	}
	this.realizarTarea=function(nick){
	}

}

function Completado(){
	this.nombre="completado";

	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
	}
	this.agregarUsuario=function(nick,partida){
		console.log('completado')
		if(partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}else{
			console.log("Lo siento partida llena");
		}
	}

	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}

	this.atacar=function(nick,partida){
	}

	this.vota=function(nick, partida){
	}

	this.empezarVotacion=function(partida){
	}

	this.quitarAlMasVotado=function(partida){
	}

	this.skipr=function(usr){
	}

	this.devuelvePartidasLibres=function(partida){
		partida.puedeDevolverPartidasLibres();
	}
	this.realizarTarea=function(nick){

	}
}

function Jugando(){
	this.nombre="jugando";

	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}

	this.iniciarPartida=function(partida){
	}

	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}

	this.atacar=function(nick,partida){
		partida.puedeAtacar(nick);
	}

	this.mandarVotacion=function(partida){
		partida.seAbreVotacion();
	}

	this.vota=function(nick, partida){

	}

	this.empezarVotacion=function(partida){
		partida.puedeIniciarVotacion();

	}

	this.quitarAlMasVotado=function(partida){

	}

	this.skipr=function(usr){

	}

	this.devuelvePartidasLibres=function(partida){
		
	}
	this.realizarTarea=function(nick, partida){
		partida.puedeRealizarTarea(nick);
	}
}

function Final(){
	this.nombre="final";
	this.ganadores="ninguno";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
		
	}
	this.atacar=function(nick,partida){
	}
	this.vota=function(nick, partida){

	}
	this.empezarVotacion=function(partida){

	}
	this.quitarAlMasVotado=function(partida){

	}
	this.skipr=function(usr){

	}
	this.devuelvePartidasLibres=function(partida){
	
	}
	this.realizarTarea=function(nick){

	}

}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.skip = false;
	this.votos = 0;
	this.numJugador=false;
	this.partida;
	this.estado = new Vivo();
	this.impostor=false;
	this.encargo="ninguno";
	this.realizado=0;
	this.estadoRealizado=false;
	this.maximoTareas=10;
	this.estadoRealizado=false;	

	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.estadoVivo=function(){
		return this.estado.estadoVivo();
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numJugadores <= 0){m
			console.log(this.nick," era el ultimo jugador de la partida");
		
		}
	}
	//this.unirAPartida=function(cod){
	//	this.partida = this.juego.unirAPartida(cod, this.nick);
	//}

	this.atacar=function(nick){
		if(this.impostor && nick!=this.nick){
			this.estado.atacar(nick, this.partida);
		}
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this, this.partida);
	}
	this.vota=function(nick){
		this.estado.vota(nick, this.partida, this);
	}
	this.haVotado=function(){
		this.estado.haVotado(this);
	}
	this.empezarVotacion=function(){
		this.estado.empezarVotacion(this);
	}
	this.mandarVotacion=function(){
		this.partida.mandarVotacion();
	}
	this.skipr=function(){
		this.partida.fase.skipr(this);
	}
	this.puedeSkipr=function(){
		this.skip = true;
		this.haVotado=true;
		this.partida.comprobarVotacion();
	}
	this.realizarTarea=function(){
		if(!this.impostor){
			this.realizado = this.realizado + 1;
			if (this.realizado >= this.maximoTarea){
				this.estadoRealizado = true;
				this.partida.tareaTerminada();
			}
			console.log("usuario: "+this.nick+" realiza "+this.encargo+" realizada numero: "+this.realizado+" estadoRealizado: "+this.estadoRealizado+"");
		}

	}
	this.asignarImpostor=function(){
		this.impostor = true;
		this.estadoRealizado = true;
		this.realizado = this.maximoTarea;
	}
	this.obtenerPercentTarea=function(){
		return ((this.realizado*100)/this.maximoTarea)
		
	}

}

function Vivo(){
	this.nombre="vivo";
	this.atacar=function(nick,partida){
		partida.atacar(nick);
	}
	this.esAtacado=function(atacado, partida){
		atacado.estado = new Muerto();
		partida.comprobarFinal();
	}
	this.vota=function(nick, partida, votante){
		votante.haVotado = true;
		partida.vota(nick);
	}
	this.haVotado=function(votado){
		votado.votos++;
	}
	this.mandarVotacion=function(usuario){
		usuario.empezarVotacion(this);
	}
	
	this.skipr=function(usr){
		usr.puedeSkipr();
	}
	this.estadoVivo=function(){
		return true;
	}

}

function Muerto(){
	this.nombre="muerto";

	this.atacar=function(nick,partida){
		//un muerto no podrá atacar
	}

	this.esAtacado=function(atacado, partida){
		//no se puede atacar a un muerto
	}

	this.vota=function(nick, partida, votante){
		//los muertos no pueden votar
	}

	this.haVotado=function(votado){
		//no se puede votar a muertos
	}

	this.mandarVotacion=function(usuario){
		// muerto no puede hacer nada
	}

	this.skipr=function(usr){

	}
	this.estadoVivo=function(){
		return false;
	}
}

function Votacion(){
	this.nombre="votacion";

	this.agregarUsuario=function(nick,partida){

	}

	this.iniciarPartida=function(partida){

	}

	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);
	}

	this.atacar=function(nick, partida){

	}

	this.vota=function(nick, partida){
		partida.puedeVotar(nick);
	}

	this.empezarVotacion=function(partida){

	}

	this.quitarAlMasVotado=function(partida){
		partida.puedeQuitarAlMasVotado();
	}

	this.skipr=function(usr){
		usr.estado.skipr(usr);
	}

	this.devuelvePartidasLibres=function(partida){
		
	}
	this.realizarTarea=function(nick){
	
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function numeroValido(num) {
	if(!(num<4 || num>10)){
		return true;
	}else{
		return false;
	}
}


/*

function inicio(){
	juego=new Juego();
	var usr=new Usuario("pepe",juego);
	var codigo=usr.crearPartida(4);
	if (codigo != "Error"){
		juego.unirAPartida(codigo,"luis");
		juego.unirAPartida(codigo,"luisa");
		juego.unirAPartida(codigo,"luisito");
		usr.iniciarPartida();
	}
	*/

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Inicial=Inicial;