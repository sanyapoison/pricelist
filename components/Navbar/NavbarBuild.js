BX24.init(function(){
	var Vue = require('vue')
	Vue.config.debug = false;
	Vue.config.silent = true;
	var Navbar = require('vue!./Navbar.vue')

	new Vue({
	    el: '#navbar',
	    components: {
	        Navbar: Navbar
	    }
	});
});	