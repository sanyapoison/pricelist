try{
	BX24.ready(function(){
	    BX24.init(function(){
	        bx_install_app.Install();
	    });
	});
}
catch(e){
	console.log("error init install procedure");
	console.log(e);
}	