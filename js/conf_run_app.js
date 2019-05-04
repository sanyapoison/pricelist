try{   
	$.getJSON( "conf/conf.json", function( conf ) {
		try{
			$.getJSON( "conf/langs/"+conf.language.default+".json", function( lang ) {
				try{
					var vue_app = new Vue({
					  	el: '#app'
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

function resizeFrame(){
	try{
		var curSize = BX24.getScrollSize();
		minHeight = curSize.scrollHeight;

		if (minHeight < 400) minHeight = 400;
		BX24.resizeWindow(this.FrameWidth, minHeight);
	    
	    BX24.fitWindow();
	    console.log("resizeWindow");
	}
	catch(e){
		console.log("error resizeFrame");
		console.log(e);
	}  	    
}