BX24.init(function(){	
	var Vue = require('vue');	
	Vue.config.debug = false;
	Vue.config.silent = true;

	var Instruction;

	if(BX24.isAdmin()){
		Instruction = require('vue!./Admin_Instruction.vue');		
	}	
	else{
		Instruction = require('vue!./Publick_Instruction.vue');		
	}

	new Vue({
	    el: '#wraper',
	    components: {
	        Instruction: Instruction
	    }
	});		
});	