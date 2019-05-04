BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;
	
	var Publick = require('vue!./Publick.vue');
	new Vue({
	    el: '#wraper',
	    components: {
	        Publick: Publick
	    }
	});	
});	