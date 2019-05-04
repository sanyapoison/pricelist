BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;
	
	var Exportcsv = require('vue!./Exportcsv.vue');
	new Vue({
	    el: '#wraper',
	    components: {
	        Exportcsv: Exportcsv
	    }
	});	
});	