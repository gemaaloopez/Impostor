function ControlWeb($){

	this.mostrarCrearPartida=function(){
		var cadena='<div id="mostrarCP">';
		cadena=cadena+'<div class="form-group">';
		cadena=cadena+'<h3>Crear Partida</h3>';
		cadena=cadena+'<label for="nick">Nick:</label>';
		cadena=cadena+'<input value="player"  type="text" class="form-control" id="nick">';
		cadena=cadena+'</div>';
		cadena=cadena+'<div class="form-group">';
		cadena=cadena+'<label for="num">Numero:</label>';
		cadena=cadena+'<input value="4" type="number" class="form-control" id="num"  min="4" max="10">';
		cadena=cadena+'</div>';
		cadena=cadena+'<button type="button" id="btnCrear" class="btn btn-primary">Crear Partida</button>';
		cadena=cadena+'</div>';

		$('#crearPartida').append(cadena);

		$('#btnCrear').on('click',function(){
			var nick=$('#nick').val();
			var num=$("#num").val();
			if(nick != "" && num !=""){
				$("#mUAP").remove();
				$("#mostrarCP").remove();
				ws.crearPartida(nick,num);
			}
		});
	}

	this.mostrarEsperandoRival=function(lista){
		$('#mER').remove();
		var cadena='<div id="mER"><h3>Esperando rival</h3>';
		cadena=cadena+"<img src='cliente/img/loading.gif' class='img-responsive center-block'>";
		cadena=cadena+"</div>";

		if(ws.owner){
			cadena= cadena+ '<div>';
			cadena= cadena+ '<button type="button" class="btn btn-success" id="btnComenzar">INICIAR PARTIDA</button>';
		}
		cadena=cadena+"</div>";
		$('#esperando').append(cadena);

		$('#btnComenzar').on('click', function(){
			nick= ws.nick;
			codigo=ws.codigo;
			ws.iniciarPartida(nick,codigo);
			ws.listarParticipantes();
		});
	}

	this.mostrarUnirAPartida=function(lista){
		$('#mUAP').remove();
		var cadena='<div id="mUAP">';
		cadena=cadena+'<h3>Unirse a una Partida</h3>';
		cadena=cadena+ '<div class="list-group">';
		for(var i=0;i<lista.length;i++){
			var maximo=lista[i].maximo
			var numJugadores=maximo-(lista[i].huecos)
 			cadena=cadena+'<a href="#" value=" ' +lista[i].codigo+ ' " class="list-group-item">'+lista[i].codigo+'Host: '+lista[i].owner+' <span class="badge">'+numJugadores+'/'+maximo+'</span></a>';
 		}
 		cadena=cadena+'</div>';//cierra listGruop
 		cadena=cadena+ '<button type="button" id="btnUnir" class="btn btn-primary">Unir a Partida</button>';
 		cadena=cadena+'</div>';//cierra mUAP

 		$('#unirAPartida').append(cadena);

 		 var StoreValue = []; //Declare array
	    $(".list-group a").click(function(){
	        StoreValue = []; //clear array
	        StoreValue.push($(this).attr("value")); // add text to array
	    });


 		 $('#btnUnir').on('click',function(){
		  	var nick=$('#nick').val();
		  	var codigo=StoreValue[0];
		  	
		  	if(codigo!=null && nick!=""){
		  		$("#mUAP").remove();
		  		$('#mostrarCP').remove();
				ws.unirAPartida(codigo,nick);
			}
			else{
				ws.listaPartidasDisponibles();
			}
		  });
	}

	this.mostrarIniciarPartida=function(){
		$('#mIP').remove();
		var cadena='<div id="mostrarlaIP">';
		cadena=cadena+'</div>';
		cadena=cadena+'<button type="button" id="btnComenzar" class="btn btn-primary">Iniciar la Partida</button>';
		cadena=cadena+'</div>';

		$('#esperando').append(cadena);

		$('#btnComenzar').on('click',function(){
			ws.iniciarPartida();
		});
	}

	this.mostrarParticipantes=function(lista){
		$('#mP').remove();
		var cadena='<div id="mP">';
		cadena=cadena+'<h3>Listado Participantes</h3>';
		cadena=cadena+'<div class="list-group">';
		for(var i=0;i<lista.length;i++){
	  		cadena=cadena+'<li value="'+lista[i].nick+'" class="list-group-item">'+lista[i].nick+'</li>';
	  	}
		cadena=cadena+'</div>';
		cadena=cadena+'</div>';

		$('#uniendo').append(cadena);
	}

	this.actualizarJugadores=function(){
		ws.listarParticipantes();
	}

	this.actualizarPartidas=function(){
		ws.listaPartidasDisponibles();
	}
	this.limpiarLog=function(){
		$('#esperando').remove();
		$('#uniendo').remove();
	}
    this.limpiarJuego=function(){
		$('#mostrarRE').remove();
		$('#game-container').remove();
		var cadena='<div id="mostrarRE">';
		cadena=cadena+'<button type="button" id="btnReiniciar" class="btn btn-primary">REINICIAR</button>';
		cadena=cadena+'</div>';
		$('#bloqueCentral').append(cadena);

		$('#btnReiniciar').on('click',function(){
			location.reload();
			return false;
		});
	}

	this.mostrarModalSimple=function(msg){
		this.limpiarModal();
		var cadena="<p id='avisarImpostor'>"+msg+'</p>';
		$('#contenidoModal').append(cadena);
		$("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');
		$('#modalGeneral').modal("show");
	}

	this.mostrarModalTarea=function(cadenaTarea){
		this.limpiarModal();
		var cadena="<p id='tarea'>"+cadenaTarea+'</p>';
		$('#contenidoModal').append(cadena);
		$("#pie").append('<button type="button" id="cerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>');
		$('#modalGeneral').modal("show");
	}

	this.mostrarModalVotacion=function(lista){
		this.limpiarModal();
		var cadena = '<div id="votacion"><h3>Votacion</h3>';
		cadena=cadena+'<div class="input-group">';
		for(var i=0;i<lista.length;i++){
	  		cadena=cadena+'<div><input type="radio" name="optradio" value="'+lista[i].nick+'">'+lista[i].nick+'</div>';
	  	}
	  	cadena=cadena+'<div><input type="radio" name="optradio" value="-1">Saltar voto</div>'
		cadena=cadena+'</div>';
		$('#contenidoModal').append(cadena);
		$("#pie").append('<button type="button" id="votar" class="btn btn-secondary">Votar</button>');
		$('#modalGeneral').modal("show");

		var sospechoso=undefined;
		$('.input-group input').on('change', function() {
		   sospechoso=$('input[name=optradio]:checked', '.input-group').val();
		});

		$('#votar').on('click',function(){
			if(sospechoso!=-1){
				ws.votar(sospechoso);
			}
			else{
				ws.saltarVoto();
			}
		});
	}

	this.limpiarModal=function(){
		$('#avisarImpostor').remove();
		$('#tarea').remove();
		$("#cerrar").remove();
		$("#votacion").remove();
		$("#votar").remove();
	}

}