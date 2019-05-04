try{   
	$.getJSON( "conf/conf.json", function( conf ) {
		try{
			$.getJSON( "conf/langs/"+conf.language.default+".json", function( lang ) {
				try{
					var vue_install_app = new Vue({
					  	el: '#install_app',
					  	data: {
					    	install_title: lang.install_title,
					    	install_description: lang.install_description,
					  	}
					});
					
					$(document).ready(function(){ 
						$("html").show();
					}); 	
				}			   
				catch(e){
					console.log("error load location");
					console.log(e);						
				}					
			})
		  	.done(function(lang) {
		    	console.log( "second success load location" );			    
		  	})
		  	.fail(function(lang) {
		    	console.log( "error load location json" );
		    	console.log( error );
		  	})
		  	.always(function(lang) {
		    	console.log( "complete load location" );
		  	});				
		}			
		catch(e){
			console.log("error load location");
			console.log(e);
		} 
    });
    	          
}
catch(e){
	console.log("error load configuration");
	console.log(e);
}   