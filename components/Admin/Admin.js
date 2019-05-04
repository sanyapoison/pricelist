module.exports = {        
    data: function() {        
        return {                     
            admin: {
                add_panel: {
                    title: "Добавить таблицу",                                                             
                    add_button:{
                        title: "Добавить"
                    },

                    input_entity: {
                        name: "ENTITY",
                        placeholder: "Код таблицы",
                        type: "text"
                    },

                    input_name: {
                        name: "NAME",
                        placeholder: "Название таблицы",
                        type: "text"                       
                    },                   
                },

                list_table_panel: {
                    title: "Список таблиц",
                },

                edit_table_panel: {
                    title: "Редактировать свойства таблицы",
                    input_name: {
                        label: "Имя",
                        name: "NAME",
                        placeholder: "Название таблицы",
                        type: "text"
                    },    
                    update_button:{
                        title: "Сохранить"
                    },
                },   
                
                add_table_properties_panel: {
                    title: "Добавить новый столбец",                                                               
                    add_button:{
                        title: "Добавить"
                    },

                    input_propery: {
                        name: "PROPERTY",
                        placeholder: "Код столбца",
                        type: "text"
                    },

                    input_name: {
                        name: "NAME",
                        placeholder: "Название столбца",
                        type: "text"
                    },

                    input_sort: {
                        name: "SORT",
                        placeholder: "Сортировка",
                        type: "number"
                    },                   
                }, 

                list_table_properties_panel: {
                    title: "Структура таблицы"
                },

                edit_table_properties_panel: {
                    title: "Редактировать столбец таблицы",
                    input_name: {
                        label: "Имя",
                        name: "NAME",
                        placeholder: "Название столбца",
                        type: "text"
                    },

                    input_sort: {
                        name: "SORT",
                        placeholder: "Сортировка",
                        type: "number"
                    },
                    update_button:{
                        title: "Сохранить"
                    },
                },                                                     
            },
            
            input_add_table_entity: "",
            input_add_table_name: "",               
            input_add_table_name_valedate: false,

            input_update_table_name: "",
            input_update_table_name_valedate: false,  

            input_add_items_property: "",
            input_add_items_name: "",
            input_add_items_name_valedate: false,  
            input_add_items_sort: "",
            input_add_items_sort_valedate: false,  

            input_update_items_name: "",
            input_update_items_name_valedate: false, 
            input_update_items_sort: "",
            input_update_items_sort_valedate: false, 

            admin_list_entitys: [],  
            admin_list_entity_properties: [],  
            
            admin_loading_show: false,
            
            current_select_admin_table: null, 
            current_select_admin_property: null,           
        }        
    },

    methods: {
        resizeFrame: function(){
            try{
                var curSize = BX24.getScrollSize();
                var minHeight = curSize.scrollHeight;

                if (minHeight < 400) minHeight = 400;
                BX24.resizeWindow(this.FrameWidth, minHeight);
                
                BX24.fitWindow();
            }
            catch(e){
                if(self.admin_loading_show){
                    self.admin_loading_show = false;
                }
                console.log("error resizeFrame");
                console.log(e);
            } 
        },

        toTranslit: function(text) {
            return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
            function (all, ch, space, words, i) {
                if (space || words) {
                    return space ? '_' : '';
                }
                var code = ch.charCodeAt(0),
                    index = code == 1025 || code == 1105 ? 0 :
                        code > 1071 ? code - 1071 : code - 1039,
                    t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
                        'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
                        'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
                        'shch', '', 'y', '', 'e', 'yu', 'ya'
                    ]; 
                return t[index];
            });
        },

        hasActiveClass: function (entity) {           
            var self = this;
            return  { 
                'list-group-item-active': self.current_select_admin_table.ENTITY == entity.ENTITY,
            }
        },

        hasActiveClassTable: function (entity) {           
            var self = this;
            return  { 
                'active': self.current_select_admin_table.ENTITY == entity.ENTITY,
            }
        },

        update_list_entity: function(method){
        	var self = this;                
			BX24.callMethod(
	           'entity.get',
	            {},
	            function(data){
	                if (data.error()){
	                    self.admin_loading_show = false;
                        alert(data.error_description());   
	                }
	                else{
                        self.admin_list_entitys = data.answer.result;                         
                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.admin_loading_show = false;   
                        });                         
	                }
	            }
	        );
        },

        hashCode: function(s){
            var hash = s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
            return hash > 0 ? hash : hash * (-1); 
        },

        add_admin_entity: function(){ 
            var self = this;           

            if(self.input_add_table_name === ""){
                self.input_add_table_name_valedate = true;
            }
            else{
                self.input_add_table_name_valedate = false;
                self.input_add_table_entity = "ent_" + self.hashCode(self.toTranslit(self.input_add_table_name));
            }

            if(!self.input_add_table_name_valedate){ 
                self.admin_loading_show = true;                 
                BX24.callMethod(
                    'entity.add', 
                    {
                        'ENTITY': self.input_add_table_entity, 
                        'NAME': self.input_add_table_name, 
                        'ACCESS': {U1:'W',AU:'R'}
                    },
                    function(data){
						if (data.error()){
							self.admin_loading_show = false;
                            alert(data.error_description());
						}
						else{
							self.update_list_entity("add_untity");	
						}

						self.input_add_table_entity = "";
                        self.input_add_table_name = "";
                    }
                );
            }
        },

        delete_admin_entity: function (entity) {
            var self = this;
            self.admin_loading_show = true;         

            BX24.callMethod(
                'entity.delete', 
                {
                    'ENTITY': entity.ENTITY
                },
                function(data){
                    if (data.error()){
                        self.admin_loading_show = false;
                        alert(data.error_description());
                    }
                    else{  
                        if(self.current_select_admin_table != null){
                            if(self.current_select_admin_table.ENTITY == entity.ENTITY){
                                self.current_select_admin_table = null; 
                                self.current_select_admin_property = null;                                                       
                            }                                          
                        }

                        self.update_list_entity("delete_entity");                          
                    }
                }
            );            
        },
        
        edit_admin_entity: function (entity) {
            var self = this;                
                
            if( self.current_select_admin_table != null ){  
                if(self.current_select_admin_table.ENTITY != entity.ENTITY){
                    self.current_select_admin_table = entity; 
                    self.input_update_table_name = entity.NAME; 
                    self.admin_loading_show = true;
                    self.update_list_entity_properties("get_list"); 
                    self.current_select_admin_property = null;
                }
            }
            else{
                self.current_select_admin_table = entity; 
                self.input_update_table_name = entity.NAME; 
                self.admin_loading_show = true;
                self.update_list_entity_properties("get_list"); 
            }
        },  

        update_admin_entity: function () {
            var self = this;    
            if(self.input_update_table_name === ""){
                self.input_update_table_name_valedate = true;
            }
            else{
                self.input_update_table_name_valedate = false;
            }

            if(!self.input_update_table_name_valedate){ 
                self.admin_loading_show = true;                 
                BX24.callMethod(
                    'entity.update', 
                    {
                        'ENTITY': self.current_select_admin_table.ENTITY, 
                        'NAME': self.input_update_table_name, 
                        'ENTITY_NEW': "ent_" + self.hashCode(self.toTranslit(self.input_update_table_name)),
                    },
                    function(data){
                        if (data.error()){
                            self.admin_loading_show = false;
                            alert(data.error_description());
                        }
                        else{
                            self.current_select_admin_table.NAME = self.input_update_table_name;                                                    
                            self.update_list_entity("update_entity");  
                        }
                    }
                );
            }                                  
        }, 

        hasActivePropertyClass: function (property) {           
            var self = this;
            return  { 
                'list-group-item-active': self.current_select_admin_property.PROPERTY == property.PROPERTY,
            }
        },

        update_list_entity_properties: function(method){
            var self = this;                
            BX24.callMethod(
               'entity.item.property.get',
                {
                    'ENTITY': self.current_select_admin_table.ENTITY, 
                },
                function(data){
                    if (data.error()){
                        self.admin_loading_show = false;
                        alert(data.error_description());   
                    }
                    else{
                        self.admin_list_entity_properties = data.answer.result;                         
                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.admin_loading_show = false;   
                        });                         
                    }
                }
            );
        },

        add_admin_entity_items_property: function(){ 
            var self = this;           

            if(self.input_add_items_name === ""){
                self.input_add_items_name_valedate = true;
            }
            else{
                self.input_add_items_name_valedate = false;  
                self.input_add_items_property = "prp_" + self.hashCode(self.toTranslit(self.input_add_items_name)); 
            }

            if(self.input_add_items_sort === ""){
                self.input_add_items_sort_valedate = true;
            }
            else{
                self.input_add_items_sort_valedate = false;   
            }            
            
            if( !self.input_add_items_property_valedate && 
                !self.input_add_items_name_valedate && 
                !self.input_add_items_sort_valedate)
                { 
                self.admin_loading_show = true;                 
                BX24.callMethod(
                    'entity.item.property.add', 
                    {
                        'ENTITY': self.current_select_admin_table.ENTITY, 
                        'PROPERTY': self.input_add_items_property, 
                        'NAME': self.input_add_items_name, 
                        'TYPE': 'S',
                        'SORT': self.input_add_items_sort
                    },
                    function(data){                        
                        if (data.error()){
                            self.admin_loading_show = false;
                            alert(data.error_description());
                        }
                        else{
                            self.update_list_entity_properties("add_property");
                            self.input_add_items_property = "";
                            self.input_add_items_name = "";
                            self.input_add_items_sort = "";
                        }
                    }
                );
            }            
        },

        delete_admin_property: function (property) {
            var self = this;
            self.admin_loading_show = true;         

            BX24.callMethod(
                'entity.item.property.delete', 
                {
                    'ENTITY': self.current_select_admin_table.ENTITY,
                    'PROPERTY': property.PROPERTY,
                },
                function(data){
                    if (data.error()){
                        self.admin_loading_show = false;
                        alert(data.error_description());
                    }
                    else{  
                        if(self.current_select_admin_property != null){
                            if(self.current_select_admin_property.PROPERTY == property.PROPERTY){
                                self.current_select_admin_property = null;                            
                            }   
                        }
                                                               
                        self.update_list_entity_properties("delete_property");                          
                    }
                }
            );            
        },

        edit_admin_property: function (property) {
            var self = this;                
            self.current_select_admin_property = property;   
            self.input_update_items_name = property.NAME;                          
            self.input_update_items_sort = property.SORT;
        },

        update_admin_entity_items_property: function () {
            var self = this;    
            if(self.input_update_items_name === ""){
                self.input_update_items_name_valedate = true;
            }
            else{
                self.input_update_items_name_valedate = false;
            }

            if(self.input_update_items_sort === ""){
                self.input_update_items_sort_valedate = true;
            }
            else{
                self.input_update_items_sort_valedate = false;
            }

            if(!self.input_update_table_name_valedate && !self.input_update_items_sort_valedate){ 
                self.admin_loading_show = true;                 
                BX24.callMethod(
                    'entity.item.property.update', 
                    {
                        'ENTITY': self.current_select_admin_table.ENTITY,
                        'PROPERTY': self.current_select_admin_property.PROPERTY, 
                        'PROPERTY_NEW': "ent_" + self.hashCode(self.toTranslit(self.input_update_items_name)),
                        'NAME': self.input_update_items_name, 
                        'TYPE': 'S', 
                        'SORT': self.input_update_items_sort, 
                    },
                    function(data){
                        if (data.error()){
                            self.admin_loading_show = false;
                            alert(data.error_description());
                        }
                        else{
                            self.current_select_admin_property.NAME = self.input_update_items_name;                                                    
                            self.current_select_admin_property.SORT = self.input_update_items_sort;                                                                                
                            self.update_list_entity_properties("update_property");
                        }
                    }
                );
            }                                  
        },
	},

	ready: function(){  		        
        var self = this;
        self.admin_loading_show = true;
        this.update_list_entity("ready_admin");	                                
    },
}