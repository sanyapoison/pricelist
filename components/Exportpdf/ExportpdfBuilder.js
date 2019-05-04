BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;
	
	var Exportpdf = require('vue!./Exportpdf.vue');
	new Vue({
	    el: '#wraper',
	    components: {
	        Exportpdf: Exportpdf
	    }
	});	
});	