BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;
	
	var Exportxlsx = require('vue!./Exportxlsx.vue');
	new Vue({
	    el: '#wraper',
	    components: {
	        Exportxlsx: Exportxlsx
	    }
	});	
});	