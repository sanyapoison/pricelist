BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;
	if(BX24.isAdmin()){
		var Importcsv = require('vue!./Importcsv.vue');
		new Vue({
		    el: '#wraper',
		    components: {
		        Importcsv: Importcsv
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