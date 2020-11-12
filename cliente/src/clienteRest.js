function ClienteRest(){

this.crearPartida=function(nick,num,callback){
		$.getJSON("/crearPartida/"+nick+"/"+num,function(data){    
    		console.log(data);
    		callback(data);
    		//parar ruleta
		});
		//ruleta
	}
	this.unirAPartida=function(codigo, nick){
		$.getJSON("/unirAPartida/"+codigo+"/"+nick,function(data){    
    		console.log(data);
		});
	}
	this.listarPartidasDisponibles=function(){
		$.getJSON("/listarPartidas",function(lista){    
    		console.log(lista);
		});
	}
	this.iniciarPartida=function(nick, codigo){
		$.getJSON("/crearPartida/"+nick+"/"+codigo,function(data){    
    		console.log(data);
		});
	}
}	

	function pruebas(){
	var codigo=undefined;
	rest.crearPartida("pepe",3,function(data){
		codigo=data.codigo;		
	});
	rest.crearPartida("pepe",4,function(data){
		codigo=data.codigo;
		rest.unirAPartida(codigo,"palo");
		rest.unirAPartida(codigo,"palomi");
		rest.unirAPartida(codigo,"palomita");
		rest.unirAPartida(codigo,"pa");
	});
	rest.crearPartida("pepe",5,function(data){
		codigo=data.codigo;
		rest.unirAPartida(codigo,"palo");
		rest.unirAPartida(codigo,"palomi");
		rest.unirAPartida(codigo,"palomita");
		rest.unirAPartida(codigo,"pa");
	});
	
}