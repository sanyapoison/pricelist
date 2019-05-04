module.exports = {        
    data: function() {        
        return {    
            instruction: {
                list_sect:{
                    title: "Список доступных операций",
                }
            },
            selected_instruction: null,

            instruction_loading_show: false, 
        }        
    },

    methods: {
        resizeFrame: function(){
            var self = this;
            try{
                var curSize = BX24.getScrollSize();
                var minHeight = curSize.scrollHeight;

                if (minHeight < 400) minHeight = 400;
                BX24.resizeWindow(self.FrameWidth, minHeight);
                
                BX24.fitWindow();
            }
            catch(e){                
                if(self.instruction_loading_show){
                    self.instruction_loading_show = false;
                }
                console.log("error resizeFrame");
                console.log(e);
            }                            
        },  

        hasActiveClass: function(instruction){                 
            var self = this;  
            return  { 
                'active': self.selected_instruction == instruction,
            }
        }, 

        select_instruction: function(instruction){                 
            var self = this; 

            self.selected_instruction = instruction;        

            self.$nextTick(function () {
                self.resizeFrame();   
                self.instruction_loading_show = false;   
            });                
        }, 

        userIsAdmin: function(){
            return BX24.isAdmin();                            
        }, 

        isSelectedInstruction: function(instruction){                 
            var self = this;  

            return self.selected_instruction == instruction ? true : false; 
        },
	},
    
    /*
	ready: function(){  		        
        var self = this;                   
    },
    */    
}