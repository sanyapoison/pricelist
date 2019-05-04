BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;
	if(BX24.isAdmin()){
		var Importxlsx = require('vue!./Importxlsx.vue');
		new Vue({
		    el: '#wraper',
		    components: {
		        Importxlsx: Importxlsx
		    }
		});	
	}
 	else{
 		new Vue({
 		    el: '#wraper',
 		    template: ' <div class="alert alert-danger">Вы не являетесь администратором</div>' 		    
 		});
 	}		
});	