function Juego(){
	this.partidas={};
	
	this.unirAPartida=function(cod, nick){
		if (this.partidas[cod]){
			this.partidas[cod].agregarUsuario(nick);
		}
		return cod;

	}

	this.eliminarPartida=function(cod){
		delete this.partidas[cod];
	}

	this.crearPartida=function(num,owner){
		if(numeroValido(num)){
			let codigo=this.obtenerCodigo();
				if (!this.partidas[codigo]){
					this.partidas[codigo]=new Partida(num,owner.nick,codigo);
					owner.partida=this.partidas[codigo];
				}
			return codigo;
		}else{
			
			let codigo = "Error";
			return codigo;
		}
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
	this.listarPartidasDisponibles=function(){
		var lista = [];
		var huecos = 0;
		for (var key in this.partidas){
			var partida = this.partidas[key];
			huecos=partida.obtenerHuecos();
			if(huecos>0){
				lista.push({"codigo":key,"huecos":huecos})
			}
		}
		return lista;
	}

	this.listarPartidas=function(){
		var lista = [];
		var huecos = 0;
		for (var key in this.partidas){
			var partida = this.partidas[key];
			var owner=this.partidas[key].nickOwner;
				lista.push({"codigo":key,"owner":owner})
			}
			return lista;
		}

	this.iniciarPartida=function(codigo, nick){
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

	this.saltarVoto=function(codigo, nick){
		var usr=this.partidas[codigo].usuarios[nick];
		usr.skipr(); 
	}

	this.votar=function(codigo, nick, sospechoso){
		var usr=this.partidas[codigo].usuarios[nick];
		//usr=this.partida[codigo].obtenerUsuario(nick);
		usr.votar(sospechoso);
	}
	this.obtenerEncargo=function(codigo,nick){
		var res={};
		var encargo=this.partidas[codigo].usuarios[nick].encargo;
		var impostor=this.partidas[codigo].usuarios[nick].impostor;
		res={"encargo":encargo,"impostor":impostor};
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


}

function Partida(num,owner,codigo, juego){
	this.juego=juego;
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.usuarios={};
	this.encargos=["jardines","calles","mobiliario","basuras"];
	this.elegido="no hay nadie elegido";

	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this)
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

	}
	this.obtenerUsuario=function(nick){
		return this.usuarios[nick]
	}

	this.numJugadores=function(){
		return Object.keys(this.usuarios).length
	}

	this.comprobarMinimo=function () {
		return Object.keys(this.usuarios).length >= 4
	}

	this.comprobarMaximo=function () {
		return Object.keys(this.usuarios).length < this.maximo
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
			i+1;
		}
	}
	this.asignarImpostor=function(){
		this.nicks=Object.keys(this.usuarios);
		this.usuarios[this.nicks[randomInt(0,this.nicks.length)]].impostor=true;
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
	this.numCiudadanosVivos=function(){
		var i = 0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == false && this.usuarios[usr].estado.nombre == "vivo"){
				i++;
			}
		}
		return i
	}
	this.numImpostoresVivos=function(){
		var i=0;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre == "vivo"){
				i++;
			}
		}
		return i
	} 
	this.identificarImpostor=function(){
		var i=0;
		var impostor;
		for(var usr in this.usuarios){
			if (this.usuarios[usr].impostor == true && this.usuarios[usr].estado.nombre == "vivo"){
				impostor = this.usuarios[usr];
			}
		}
		return impostor
	}

	this.vota=function(nick){
		this.fase.vota(nick, this);
	}

	this.dejaVotar=function(nick){
		this.usuarios[nick].haVotado();
		this.comprobarVotacion();
	}
	this.jugadorConMasVotos=function(){
		var masVotos="No hay nadie más votado";
		var votos =0;

		for(var usr in this.usuarios){
				if(this.usuarios[usr].votos > votos && this.usuarios[usr].estado.nombre == "vivo"){
					votos = this.usuarios[usr].votos;
					masVotos = this.usuarios[usr];
				}
		}return masVotos
	} 


	this.acabarVotacion=function(){
		this.finalVotacion();
	}
	this.seAbreVotacion= function(){
		this.fase = new Votacion();
	}
	this.empezarVotacion=function(){
		this.fase.empezarVotacion(this);
	}

	this.quitarAlMasVotado=function(){
	this.fase.quitarAlMasVotado(this);
	}
	this.cuantosCiudadanosVivos=function(){
		var i=0;
		for(var usr in this.usuarios){
			if(this.usuarios[usr].impostor == false && this.usuarios[usr].estado.nombre =="vivo"){
				i++;
			}
		}return i
	}
	this.gananLasPersonas=function(){
		return this.numImpostoresVivos ==0
	}
	this.gananLosImpostores=function(){
		return this.numImpostoresVivos() >= this.numCiudadanosVivos()
	}
	this.cuantosSkips=function(){
		var i=0;
		for(var usr in this.usuarios){
				if (this.usuarios[usr].skip == true && this.usuarios[usr].estado.nombre == "vivo"){
				i++;
			}
		}return i
	}

	this.finalDePartida=function(){
		this.fase = new Jugando();
	}
	this.finalVotacion=function(){
		this.fase = new Jugando();
		this.mirarSiEsFinal();
	}
	this.revisionVotacion=function(){
		let ganadorVotacion =this.jugadorConMasVotos();
		if (ganadorVotacion && ganadorVotacion.votos>this.cuantosSkips()){
				ganadorVotacion.esAtacado();
		}
	}
	this.reiniciarContador=function(){
		this.elegido="No hay nadie elegido"
		for(var usr in this.usuarios){
				if (this.usuarios[usr].estado.nombre == "vivo"){
				this.usuarios[usr].skip = false;
				this.usuarios[usr].votos = 0;
				this.usuarios[usr].haVotado = false;
			}
		}
	}
	this.mirarSiEsFinal=function(){
		if(this.gananLosImpostores()){
			this.finDeLaPartidaDelImpostor();
		}
		else if(this.gananLosCiudadanos()){
			this.finDeLaPartidaDeCiudadanos();
		}
		else{
			this.fase = new Jugando();
		}
	}

	this.finDeLaPartidaDeCiudadanos=function(){
		this.fase = new Final();
		this.fase.ganador = "ciudadanos";
	}
	this.finDeLaPartidaDelImpostor=function(){
		this.fase = new Final();
		this.fase.ganador = "impostor";
	}
	this.comprobarVotacion=function(){
		if(this.todosHanVotado()){
				let elegido = this.jugadorConMasVotos();
		if (elegido && elegido.votos>this.numeroSkips()){
				this.elegido= elegido.nick;
				elegido.esAtacado();
		}
		this.finalVotacion();
	}

}
	this.obtenerHuecos=function(){
		return this.maximo - Object.keys(this.usuarios).length
	}
	this.devuelvePartidasLibres=function(){
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
			if(this.usuarios[key].estado.nombre=="vivo" && !this.usuarios[key].haVotado){
				res=false;
				break;
			}
		}
		return res
	}
	this.listaHanVotado=function(){
		var lista=[];
		for(var key in this.usuarios){
			if(this.usuarios[key].estado.nombre=="vivo" && this.usuarios[key].haVotado){
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


	this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";

	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}		
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

}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){
		partida.puedeIniciarPartida();
	}
	this.agregarUsuario=function(nick,partida){
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

}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.skip = false;
	this.votos = 0;
	this.partida;
	this.estado = new Vivo();
	this.impostor=false;
	this.encargo="ninguno";
	
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
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
		this.estado.esAtacado(this);
	}
	this.vota=function(nick){
		if(nick!= this.nick) this.estado.vota(nick, this.partida, this);
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
}

function Vivo(){
	this.nombre="vivo";
	this.atacar=function(nick,partida){
		partida.atacar(nick);
	}
	this.esAtacado=function(atacado, partida){
		atacado.estado = new Muerto();
		partida.finalDePartida();
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
		partida.sePuedeVotar(nick);
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