module.exports = {        
    data: function() {        
        return {    
            publick:{
                list_table_panel: {
                    title: "Список таблиц",                    
                },

                list_current_table_items_panel: {
                    count: "Записей",
                    button_add: "Добавить", 
                    search_placeholder: "Поиск",                   
                    search_title: "Укажите св-во",                      
                    delete_checked: "Удалить выбранные",                 
                    show_items_title: "Показывать",                 
                    page_label: "Страница",                 
                    page_label_of: "из",                 
                }, 

                modify_item: {
                    close_drop: "Не сохранять запись", 
                    save_drop: "Сохранить запись", 
                    edit_drop: "Изменить запись", 
                    delete_drop: "Удалить запись", 
                	delete: "Удалить запись ?", 
                }	            
            },

            publick_list_entitys: [], 
            publick_list_entitys_total: [], 

            publick_loading_show: false,

            current_select_publick_table: {
                publick_entity: null,
                publick_properties: null,
                publick_items: null,
                current_page: null,
                total_items: null,
                add_new_item: {},
                rules_add_item: [],
                edit_item: null,
                edit_item_prop: [],
                edit_item_prop_new: {},
                search_data: "", 
                search_prop: null,               
                rules_search_data: false,
                rules_search_prop: false,                                
                show_search_close: false,  
                checked_all_items: false,
                list_checked_items: {},
            }, 

            count_show_items: 50,
            /*
            list_count_show_items: {
                item1: 50,
                item2: 40,
                item3: 30,
                item4: 20,
                item5: 10,
            },
            */

            edit_mode: false,            
            search_mode: false,    

            checked_items_isset: false,        
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
                if(self.publick_loading_show){
                    self.publick_loading_show = false;
                }
                console.log("error resizeFrame");
                console.log(e);
            } 
        },

        hasActiveClass: function (entity) {           
            var self = this;
            return  { 
                'list-group-item-active': self.current_select_publick_table.publick_entity.ENTITY == entity.ENTITY,
            }
        },

        update_list_entity: function(method){
            var self = this;         
            self.publick_loading_show = true;        
            BX24.callMethod(
               'entity.get',
                {},
                function(data){
                    if (data.error()){
                        self.publick_loading_show = false;
                        alert(data.error_description());   
                    }
                    else{
                        self.publick_list_entitys = data.answer.result;                         
                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.publick_loading_show = false;   
                        });                         
                    }
                }
            );
        },

        select_entity: function (entity, mod) {
            var self = this;     

            if(self.edit_mode == false){   
                if( self.current_select_publick_table.publick_entity != null){  
                    if(self.current_select_publick_table.publick_entity.ENTITY != entity.ENTITY || mod == "update"){
                        self.publick_loading_show = true;

                        self.search_mode = false;
                        self.current_select_publick_table.search_data = "";
                        self.current_select_publick_table.search_prop = null;
                        
                        self.current_select_publick_table.rules_search_data = false; 
                        self.current_select_publick_table.rules_search_prop = false;                        
                        self.current_select_publick_table.show_search_close = false;
                        self.current_select_publick_table.checked_all_items = false;
                        self.current_select_publick_table.list_checked_items = {};

                        self.current_select_publick_table.publick_entity = entity; 
                        if(self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === entity.ENTITY) == undefined){
                            BX24.callMethod(
                               'entity.item.property.get',
                                {
                                    'ENTITY': entity.ENTITY, 
                                },
                                function(data){
                                    if (data.error()){
                                        self.publick_loading_show = false;
                                        alert(data.error_description());   
                                        return 0;
                                    }
                                    else{
                                        self.current_select_publick_table.publick_properties = data.answer.result;                         
                                        BX24.callMethod(
                                           'entity.item.get',
                                            {
                                                'ENTITY': entity.ENTITY, 
                                                'SORT': {
                                                    'DATE_ACTIVE_FROM': 'ASC', 
                                                    'ID': 'ASC'
                                                },
                                            },
                                            function(data){
                                                if (data.error()){
                                                    self.publick_loading_show = false;
                                                    alert(data.error_description());   
                                                }
                                                else{                                                
                                                    self.current_select_publick_table.publick_items = data.answer.result; 
                                                    self.current_select_publick_table.total_items = data.answer.total; 
                                                    self.current_select_publick_table.current_page = 0;
                                                    self.current_select_publick_table.rules_add_item = [];

    												for (var current_property_index in self.current_select_publick_table.publick_properties) {												   
    												   	Vue.set(
    												   		self.current_select_publick_table.rules_add_item,
    											   			self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,	
    											   			{
    												   			property_value: "",
    												   			property_no_valid: false,
    												   		}	
    												   	);											   
    												}

                                                    self.publick_list_entitys_total.push({
                                                        publick_entity: self.current_select_publick_table.publick_entity, 
                                                        publick_properties: self.current_select_publick_table.publick_properties,
                                                        publick_items: self.current_select_publick_table.publick_items,
                                                        current_page: 0,
                                                        total_items: self.current_select_publick_table.total_items,
                                                        count_page_items: self.count_show_items,
                                                    });

                                                    self.$nextTick(function () {
                                                        self.resizeFrame();   
                                                        self.publick_loading_show = false;   
                                                    });                         
                                                }
                                            }
                                        );                                                            
                                    }
                                }
                            );                        
                        }
                        else{
                            var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === entity.ENTITY);                        
                            self.current_select_publick_table.publick_properties = entity_total.publick_properties;
                            self.current_select_publick_table.publick_items = entity_total.publick_items; 
                            self.current_select_publick_table.current_page = entity_total.current_page; 
                            self.current_select_publick_table.total_items = entity_total.total_items; 

    	                    self.current_select_publick_table.rules_add_item = [];

    						for (var current_property_index in self.current_select_publick_table.publick_properties) {
    						   	Vue.set(
    						   		self.current_select_publick_table.rules_add_item,
    					   			self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,	
    					   			{
    						   			property_value: "",
    						   			property_no_valid: false,
    						   		}	
    						   	);	
    						}

                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.publick_loading_show = false;   
                            });                          
                        }
                    }
                }
                else{
                    self.current_select_publick_table.publick_entity = entity; 
                    if(self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === entity.ENTITY) == undefined){
                        BX24.callMethod(
                           'entity.item.property.get',
                            {
                                'ENTITY': entity.ENTITY, 
                            },
                            function(data){
                                if (data.error()){
                                    self.publick_loading_show = false;
                                    alert(data.error_description());   
                                    return 0;
                                }
                                else{
                                    self.current_select_publick_table.publick_properties = data.answer.result;                         
                                    BX24.callMethod(
                                       'entity.item.get',
                                        {
                                            'ENTITY': entity.ENTITY, 
                                            'SORT': {
                                                'DATE_ACTIVE_FROM': 'ASC', 
                                                'ID': 'ASC'
                                            },
                                        },
                                        function(data){
                                            if (data.error()){
                                                self.publick_loading_show = false;
                                                alert(data.error_description());   
                                            }
                                            else{                                            
                                                self.current_select_publick_table.publick_items = data.answer.result;  
                                                self.current_select_publick_table.total_items = data.answer.total;
                                                self.current_select_publick_table.current_page = 0;
    						                    self.current_select_publick_table.rules_add_item = [];

    											for (var current_property_index in self.current_select_publick_table.publick_properties) {											   
    											   	Vue.set(
    											   		self.current_select_publick_table.rules_add_item,
    										   			self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,	
    										   			{
    											   			property_value: "",
    											   			property_no_valid: false,
    											   		}	
    											   	);	
    											}

                                                self.publick_list_entitys_total.push({
                                                    publick_entity: self.current_select_publick_table.publick_entity, 
                                                    publick_properties: self.current_select_publick_table.publick_properties,
                                                    publick_items: self.current_select_publick_table.publick_items,
                                                    current_page: 0,
                                                    total_items: self.current_select_publick_table.total_items,
                                                    count_page_items: self.count_show_items,
                                                });     

                                                self.$nextTick(function () {
                                                    self.resizeFrame();   
                                                    self.publick_loading_show = false;   
                                                });                         
                                            }
                                        }
                                    );                                                            
                                }
                            }
                        );                        
                    }
                    else{
                        var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === entity.ENTITY);                        
                        
                        if(entity_total.count_page_items == self.count_show_items){
                            self.current_select_publick_table.publick_properties = entity_total.publick_properties;
                            self.current_select_publick_table.publick_items = entity_total.publick_items; 
                            self.current_select_publick_table.current_page = entity_total.current_page; 
                            self.current_select_publick_table.total_items = entity_total.total_items;

                            self.current_select_publick_table.rules_add_item = [];

        					for (var current_property_index in self.current_select_publick_table.publick_properties) {
        					   	Vue.set(
        					   		self.current_select_publick_table.rules_add_item,
        				   			self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,	
        				   			{
        					   			property_value: "",
        					   			property_no_valid: false,
        					   		}	
        					   	);	
        					}

                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.publick_loading_show = false;   
                            });  
                        }
                        else{
                            self.publick_loading_show = true;
                            BX24.callMethod(
                               'entity.item.get',
                                {
                                    'ENTITY': entity.ENTITY, 
                                    'SORT': {
                                        'DATE_ACTIVE_FROM': 'ASC', 
                                        'ID': 'ASC'
                                    },
                                },
                                function(data){
                                    if (data.error()){
                                        self.publick_loading_show = false;
                                        alert(data.error_description());   
                                    }
                                    else{                                            
                                        self.current_select_publick_table.publick_items = data.answer.result;  
                                        self.current_select_publick_table.total_items = data.answer.total;
                                        self.current_select_publick_table.current_page = 0;
                                        self.current_select_publick_table.rules_add_item = [];

                                        for (var current_property_index in self.current_select_publick_table.publick_properties) {                                             
                                            Vue.set(
                                                self.current_select_publick_table.rules_add_item,
                                                self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,  
                                                {
                                                    property_value: "",
                                                    property_no_valid: false,
                                                }   
                                            );  
                                        }

                                        Vue.set(
                                            self.publick_list_entitys_total,
                                            entity_total,  
                                            {
                                                publick_entity: self.current_select_publick_table.publick_entity, 
                                                publick_properties: self.current_select_publick_table.publick_properties,
                                                publick_items: self.current_select_publick_table.publick_items,
                                                current_page: 0,
                                                total_items: self.current_select_publick_table.total_items,
                                                count_page_items: self.count_show_items,
                                            }  
                                        );     

                                        self.$nextTick(function () {
                                            self.resizeFrame();   
                                            self.publick_loading_show = false;   
                                        });                         
                                    }
                                }
                            );                            
                        }                        
                    }                
                }
            }               
        },

        showCurrentTable: function(entity){
            var self = this;
            return  { 
                'show_current_table': self.current_select_publick_table.publick_entity != null,
            }
        },

        print_input_type_html: function(property){
            var self = this;
            if(self.userIsAdmin()){
                switch(property.TYPE){
                    case "S": 
                        return "text";
                    break;
                    case "N": 
                        return "number";
                    break; 
                    case "F": 
                        return "";
                    break;   
                    default: 
                        return "";
                    break;
                }
            }    
        },

        userIsAdmin: function(){
            return BX24.isAdmin();                            
        },  

        sync_value_of_model: function(input, rule){
            rule.property_value = input.target.value;			            
        },

		add_item: function(){
        	var self = this;            

        	if(self.userIsAdmin()){	        	
	        	var log_no_error = true;
	        	self.current_select_publick_table.add_new_item = {};
				for (var current_property_index in self.current_select_publick_table.publick_properties) {												   
		            if(self.current_select_publick_table.rules_add_item[self.current_select_publick_table.publick_properties[current_property_index].PROPERTY].property_value === ""){
						Vue.set(
					   		self.current_select_publick_table.rules_add_item[self.current_select_publick_table.publick_properties[current_property_index].PROPERTY],
				   			'property_no_valid',	
				   			true	
					   	);

						self.pub_add_class('#ref_input_add_prop_'+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY, "has-error");
		                
		                var log_no_error = false;
		            }
		            else{
		            	self.current_select_publick_table.add_new_item[self.current_select_publick_table.publick_properties[current_property_index].PROPERTY] = self.current_select_publick_table.rules_add_item[self.current_select_publick_table.publick_properties[current_property_index].PROPERTY].property_value;
						self.pub_remove_class('#ref_input_add_prop_'+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY, "has-error");		            	
		            }															   
				}            					 	            

				if(log_no_error){
					self.publick_loading_show = true;

					BX24.callMethod(
						'entity.item.add', 
						{
						    ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
						    DATE_ACTIVE_FROM: new Date(),
						    NAME: (parseInt(self.current_select_publick_table.total_items)+1) + " [" + new Date() + "]",
						    PROPERTY_VALUES: self.current_select_publick_table.add_new_item,
						    SORT: parseInt(self.current_select_publick_table.total_items)+1,
						},
						function(data){                            
                            if (data.error()){
                                self.publick_loading_show = false;
                                alert(data.error_description());   
                                return 0;
                            }
                            else{
                            	self.current_select_publick_table.add_new_item = {};
								for (var current_property_index in self.current_select_publick_table.publick_properties) {												   
						            
						            self.pub_clear_value('#ref_input_add_prop_'+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY+" input");		            							            															   
						            
						            Vue.set(
								   		self.current_select_publick_table.rules_add_item[self.current_select_publick_table.publick_properties[current_property_index].PROPERTY],
							   			'property_no_valid',	
							   			false	
								   	);
								   	
								   	Vue.set(
								   		self.current_select_publick_table.rules_add_item[self.current_select_publick_table.publick_properties[current_property_index].PROPERTY],
							   			'property_value',	
							   			''	
								   	);
								}   

								BX24.callMethod(
									'entity.item.get', 
									{
									   ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
									   SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
									   start: self.current_select_publick_table.current_page*self.count_show_items,
									}, 
									function(data){

										if (data.error()){
			                                self.publick_loading_show = false;
			                                alert(data.error_description());   
			                                return 0;
			                            }
			                            else{
			                            	self.current_select_publick_table.publick_items = data.answer.result; 
			                            	self.current_select_publick_table.total_items = data.answer.total; 
					                        
					                        var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === self.current_select_publick_table.publick_entity.ENTITY);                        
					                        entity_total.publick_items = self.current_select_publick_table.publick_items; 
					                        entity_total.total_items = self.current_select_publick_table.total_items; 	

						                    self.$nextTick(function () {
						                        self.resizeFrame();   
						                        self.publick_loading_show = false;   
						                    }); 	                            	
			                            }	
									}
								);	
                            }
                        }    
                    );
				}
				else{
					//console.log("error");
				}
			}
        },

        ref_input_add_item: function(property){
            return 'ref_input_add_prop_'+property;		            
        },
        
        pub_add_class: function(element_selector, class_add) {
        	var self = this;      
            
            //if ((self.$el.querySelector(element_selector).className.split(" ")).indexOf(class_add) == -1){ self.$el.querySelector(element_selector).className += (" " + class_add); }
                        
            if(self.$el.querySelector(element_selector).classList.contains(class_add) == false){ self.$el.querySelector(element_selector).classList.add(class_add); }
	    },	

        pub_remove_class: function(element_selector, class_remove) {
        	var self = this;
	    	
            //self.$el.querySelector(element_selector).className = self.$el.querySelector(element_selector).className.replace(class_remove, '');]
            
            self.$el.querySelector(element_selector).classList.remove(class_remove);
	    },	

        pub_clear_value: function(element_selector) {
        	var self = this;
	    	self.$el.querySelector(element_selector).value = "";
	    },

	    remove_item: function(item) {
        	var self = this;
        	if(self.userIsAdmin()){	        		    	 
	    	 	if(confirm(self.publick.modify_item.delete)){
	    	 		self.publick_loading_show = true;   
					BX24.callMethod(
						'entity.item.delete', 
						{
							ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
							ID: item.ID,
						}, 
						function(data){
							if (data.error()){
		                        self.publick_loading_show = false;
		                        alert(data.error_description());   
		                        return 0;
		                    }
		                    else{
		                    	
		                    	BX24.callMethod(
									'entity.item.get', 
									{
									   ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
									   SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
									   start: self.current_select_publick_table.current_page*self.count_show_items,
									}, 
									function(data){

										if (data.error()){
			                                self.publick_loading_show = false;
			                                alert(data.error_description());   
			                                return 0;
			                            }
			                            else{
			                            	self.current_select_publick_table.publick_items = data.answer.result; 
			                            	self.current_select_publick_table.total_items = data.answer.total; 
					                        var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === self.current_select_publick_table.publick_entity.ENTITY);                        
					                        entity_total.publick_items = self.current_select_publick_table.publick_items; 
					                        entity_total.total_items = self.current_select_publick_table.total_items; 	

						                    self.$nextTick(function () {
						                        self.resizeFrame();   
						                        self.publick_loading_show = false;   
						                    }); 	                            	
			                            }	
									}
								);                           	
		                    }	
						}
					);	
				} 
			}   	
	    },

        edit_item: function(item) {
            var self = this;

            if(self.userIsAdmin()){                          
                if(self.current_select_publick_table.edit_item == null){
                    self.current_select_publick_table.edit_item = item;
                    self.current_select_publick_table.edit_item_prop = item.PROPERTY_VALUES;
                    self.edit_mode = true;

                    self.pub_add_class('.row_data_entity_item_iden_'+item.ENTITY+'_'+item.ID, 'row_data_entity_item_edit');

                    for (var current_property_index in self.current_select_publick_table.publick_properties) {                                               
                        self.edit_cell_text_to_input(
                            ".item_data_entity_item_iden_"+item.ENTITY+'_'+item.ID+'_'+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,
                            self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,
                            self.current_select_publick_table.publick_properties[current_property_index].TYPE,
                            self.current_select_publick_table.publick_properties[current_property_index].NAME,
                            item.PROPERTY_VALUES
                        );    
                    }                    
                }    
            }       
        },

        edit_cell_text_to_input: function(selector, property_PROPERTY, property_TYPE, property_NAME, item_PROPERTIES) {
            var self = this;
            if(self.userIsAdmin()){  
                self.$el.querySelector(selector).innerHTML = '<div class="form-group" id="ref_input_edit_prop_'+property_PROPERTY+'"><input class="input_add form-control" placeholder="'+property_NAME+'" type="'+self.print_input_type_html(property_TYPE)+'" placeholder="edit_'+property_PROPERTY+'" value="'+item_PROPERTIES[property_PROPERTY]+'"></div>';
            }    
        },

        view_item_row: function(flag, edit_item, publick_entity_item) {
            var self = this;
            if(self.userIsAdmin()){  
                if(flag && (edit_item.ID == publick_entity_item.ID)){
                    return true;
                }
                else{
                    return false;
                }
            }
        },

        save_edit_item: function(item) {
            var self = this;
            if(self.userIsAdmin()){  

                var log_no_error = true;
                self.current_select_publick_table.edit_item_prop_new = {};

                for (var current_property_index in self.current_select_publick_table.publick_properties) {                                               
                    if(self.$el.querySelector("#ref_input_edit_prop_"+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY+" input").value == ""){
                        self.pub_add_class('#ref_input_edit_prop_'+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY, "has-error");                    
                        var log_no_error = false;
                    }    
                    else{
                        self.pub_remove_class('#ref_input_edit_prop_'+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY, "has-error");  

                        Vue.set(
                            self.current_select_publick_table.edit_item_prop_new,
                            self.current_select_publick_table.publick_properties[current_property_index].PROPERTY,
                            self.$el.querySelector("#ref_input_edit_prop_"+self.current_select_publick_table.publick_properties[current_property_index].PROPERTY+" input").value
                        );                                                    
                    }                     
                } 

                if(log_no_error){
                    self.publick_loading_show = true;   

                    BX24.callMethod(
                        'entity.item.update', 
                        {
                            ID: item.ID,
                            ENTITY: item.ENTITY,
                            PROPERTY_VALUES: self.current_select_publick_table.edit_item_prop_new,
                        },
                        function(data){
                            if (data.error()){
                                self.publick_loading_show = false;
                                alert(data.error_description());   
                                return 0;
                            }
                            else{
                                self.current_select_publick_table.edit_item = null;

                                BX24.callMethod(
                                    'entity.item.get', 
                                    {
                                       ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
                                       SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                                       start: self.current_select_publick_table.current_page*self.count_show_items,
                                    }, 
                                    function(data){
                                        self.edit_mode = false;
                                        
                                        if (data.error()){
                                            self.publick_loading_show = false;

                                            alert(data.error_description());   
                                            return 0;
                                        }
                                        else{
                                            self.current_select_publick_table.publick_items = data.answer.result; 
                                            self.current_select_publick_table.total_items = data.answer.total; 
                                            
                                            var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === self.current_select_publick_table.publick_entity.ENTITY);                        
                                            entity_total.publick_items = self.current_select_publick_table.publick_items; 
                                            entity_total.total_items = self.current_select_publick_table.total_items;   

                                            self.current_select_publick_table.edit_item = null;

                                            self.$nextTick(function () {
                                                self.resizeFrame();   
                                                self.publick_loading_show = false;   
                                            });                                     
                                        }   
                                    }
                                );  
                            }
                        }    
                    );                                     
                }    
            }    
        },

        close_edit_item: function(){                
            var self = this;  
                      
            self.publick_loading_show = true;   

            BX24.callMethod(
                'entity.item.get', 
                {
                   ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
                   SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                   start: self.current_select_publick_table.current_page*self.count_show_items,
                }, 
                function(data){
                    self.edit_mode = false;
                    
                    if (data.error()){
                        self.publick_loading_show = false;

                        alert(data.error_description());   
                        return 0;
                    }
                    else{
                        self.current_select_publick_table.publick_items = data.answer.result; 
                        self.current_select_publick_table.total_items = data.answer.total; 
                        
                        var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === self.current_select_publick_table.publick_entity.ENTITY);                        
                        entity_total.publick_items = self.current_select_publick_table.publick_items; 
                        entity_total.total_items = self.current_select_publick_table.total_items;   

                        self.current_select_publick_table.edit_item = null;

                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.publick_loading_show = false;   
                        });                                     
                    }   
                }
            );               
        },

        range_pagen: function(count_items){         
            try{
                var self = this; 

                if(count_items == null){
                    return 0;
                }

                var count_page_for_list = (Math.floor(parseInt(count_items)/self.count_show_items));

                if(parseInt(count_items) % self.count_show_items == 0){
                    count_page_for_list--;
                }

                count_page_for_list++;

                /*----------------------------------------*/

                /*
                self.current_select_publick_table.current_page;     //текущая страница
                count_page_for_list;                                //всего страниц или конечная страница
                iLeftLimit = 4;                                     // левый лимит
                iRightLimit = 5;                                    // правый лимит
                */

                return self.makePager(self.current_select_publick_table.current_page, count_page_for_list, 3, 4) ;

                /*----------------------------------------*/    
            }
            catch(e){
                console.log("range_pagen");
                console.log(e);
            }    
        },

        makePager: function(iCurr, iEnd, iLeft, iRight){
            var arr_pager = Array();

            if(iLeft+1+iRight > iEnd){
                for(var i=1; i<=iEnd; i++){
                    arr_pager.push(i);
                }                
            }

            else if(iCurr > iLeft && iCurr < (iEnd-iRight)){
                for(var i=iCurr-iLeft; i<=iCurr+iRight; i++){
                    arr_pager.push(i);
                }
            }

            else if(iCurr<=iLeft){
                for(var i=1; i<=iCurr+(iRight+(1+iLeft-iCurr)); i++){
                    arr_pager.push(i);
                }
            } 

            else{
                for(var i=iCurr-(iLeft+(iRight-(iEnd - iCurr))); i<=iEnd; i++){
                    arr_pager.push(i);
                }
            }

            return arr_pager;
        },

        pagen_is_active_page: function(current_page, page){ 
            if(current_page != null){
                return { 
                    'active': current_page == page,
                }              
            }            
        },

        print_current_page: function(current_page){ 
            return current_page != null ? current_page+1 : "?";
        },

        list_options_dropdown_menu_items_checked: function(){ 
            var self = this; 
            console.log(self.current_select_publick_table.list_checked_items);
            console.log(Object.keys(self.current_select_publick_table.list_checked_items).length);

            self.checked_items_isset = Object.keys(self.current_select_publick_table.list_checked_items).length ? true : false;
        },

        print_count_page: function(count_items){ 
            try{
                var self = this; 

                if(count_items == null){
                    return 1;
                }

                var count_page_for_list = (Math.floor(parseInt(count_items)/self.count_show_items));

                if(parseInt(count_items) % self.count_show_items == 0){
                    count_page_for_list--;
                }

                count_page_for_list++;

                if(count_page_for_list <= 0){
                    return 1;
                }

                return count_page_for_list;      
            }
            catch(e){
                console.log("print_count_page");
                console.log(e);
                return "?";
            }               
        },

        goto_page: function(pagen){ 
            try{
                var self = this;  

                self.current_select_publick_table.current_page = pagen;

                self.publick_loading_show = true;                  

                if(self.search_mode == true){
                    self.current_select_publick_table.rules_search_data = false; 

                    self.publick_loading_show = true; 
                    
                    var filter = {};

                    Vue.set(
                        filter,
                        "PROPERTY_" + self.current_select_publick_table.search_prop.PROPERTY,    
                        "%"+self.current_select_publick_table.search_data+"%"
                    );
                }

                BX24.callMethod(
                    'entity.item.get', 
                    {
                       ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
                       SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                       start: self.current_select_publick_table.current_page*self.count_show_items,
                       FILTER: filter,
                    }, 
                    function(data){
                        self.edit_mode = false;
                        if (data.error()){
                            self.publick_loading_show = false;

                            alert(data.error_description());   
                            return 0;
                        }
                        else{
                            self.current_select_publick_table.publick_items = data.answer.result; 
                            self.current_select_publick_table.total_items = data.answer.total; 
                            
                            if(self.search_mode == false){
                                var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === self.current_select_publick_table.publick_entity.ENTITY);                        
                                entity_total.publick_items = self.current_select_publick_table.publick_items; 
                                entity_total.total_items = self.current_select_publick_table.total_items; 
                                entity_total.current_page = self.current_select_publick_table.current_page;     
                            }

                            self.current_select_publick_table.edit_item = null;

                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.publick_loading_show = false;   
                            });                                     
                        }   
                    }
                );
            }
            catch(e){
                console.log("goto_page");
                console.log(e);
            }                              
        },

        print_current_prop_search: function(){                  
            var self = this;  

            return self.current_select_publick_table.search_prop == null ? self.publick.list_current_table_items_panel.search_title : self.current_select_publick_table.search_prop.NAME;         
        },

        set_prop_search_items: function(property){                  
            var self = this;   
            self.current_select_publick_table.search_prop = property;
            self.current_select_publick_table.rules_search_prop = false;
            self.current_select_publick_table.show_search_close = true;
            self.$nextTick(function () {
                self.resizeFrame();   
                self.publick_loading_show = false;   
            }); 
        },               

        search_items: function(){                  
            var self = this;  

            if(self.current_select_publick_table.search_data === ""){
                self.current_select_publick_table.rules_search_data = true;
            }
            else{
                self.current_select_publick_table.rules_search_data = false; 
            }

            if(self.current_select_publick_table.search_prop == null){
                self.current_select_publick_table.rules_search_prop = true;
            }
            else{
                self.current_select_publick_table.rules_search_prop = false; 
            }

            if(!self.current_select_publick_table.rules_search_data && !self.current_select_publick_table.rules_search_prop){               

                self.publick_loading_show = true; 
                self.search_mode = true;
                
                var filter = {};

                Vue.set(
                    filter,
                    "PROPERTY_" + self.current_select_publick_table.search_prop.PROPERTY,    
                    "%"+self.current_select_publick_table.search_data+"%"   
                );

                BX24.callMethod(
                    'entity.item.get', 
                    {
                        ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
                        SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                        FILTER: filter,
                    }, 
                    function(data){
                        self.edit_mode = false;
                        if (data.error()){
                            self.publick_loading_show = false;

                            alert(data.error_description());   
                            return 0;
                        }
                        else{
                            self.current_select_publick_table.publick_items = data.answer.result; 
                            self.current_select_publick_table.total_items = data.answer.total;                         
                            self.current_select_publick_table.current_page = 0;
                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.publick_loading_show = false;   
                            });                                     
                        }   
                    }
                );                
            }
            else{
                console.log("error");
                console.log(self.current_select_publick_table.search_data);
                console.log(self.current_select_publick_table.search_prop);                  
                console.log(self.current_select_publick_table.rules_search_data);
                console.log(self.current_select_publick_table.rules_search_prop);                
            }    
        },  

        close_search_items: function(){                 
            var self = this;         
            
            self.select_entity(self.current_select_publick_table.publick_entity, "update");      
        },   

        value_close_of_model: function(input){               
            var self = this;  

            self.current_select_publick_table.search_data = input.target.value;

            if(self.current_select_publick_table.search_data === ""){
                self.current_select_publick_table.rules_search_data = true;
            }
            else{
                self.current_select_publick_table.rules_search_data = false;                 
            }

            if(self.current_select_publick_table.search_data === "" && self.current_select_publick_table.search_prop == null){                
                self.current_select_publick_table.show_search_close = false;
            }
            else{
                self.current_select_publick_table.show_search_close = true;
            }            
            
            self.$nextTick(function () {
                self.resizeFrame();   
                self.publick_loading_show = false;   
            });              
        },

        checked_items_page: function(input){               
            var self = this;              
            for (var current_item_index in self.current_select_publick_table.publick_items) {                                                               
                if(input.target.checked){
                    self.$el.querySelector(".check_data_entity_item_iden_"+self.current_select_publick_table.publick_entity.ENTITY+"_"+self.current_select_publick_table.publick_items[current_item_index].ID).checked = true;
                    
                    
                    Vue.set(
                        self.current_select_publick_table.list_checked_items,
                        "el_"+self.current_select_publick_table.publick_items[current_item_index].ID,    
                        self.current_select_publick_table.publick_items[current_item_index].ID
                    );
                                        
                } 
                else{
                    self.$el.querySelector(".check_data_entity_item_iden_"+self.current_select_publick_table.publick_entity.ENTITY+"_"+self.current_select_publick_table.publick_items[current_item_index].ID).checked = false;
                    
                    Vue.delete(
                        self.current_select_publick_table.list_checked_items,
                        "el_"+self.current_select_publick_table.publick_items[current_item_index].ID
                    );          
                }                     
            }  

            self.$nextTick(function () {
                self.resizeFrame();   
                self.publick_loading_show = false;
                self.list_options_dropdown_menu_items_checked();   
            });                                       
        },  

        check_item: function(input, item){               
            var self = this;  
            if(input.target.checked){                
                Vue.set(
                    self.current_select_publick_table.list_checked_items,
                    "el_"+item.ID,    
                    item.ID
                );                
            }
            else{                
                Vue.delete(
                    self.current_select_publick_table.list_checked_items,
                    "el_"+item.ID
                );                
            } 

            self.$nextTick(function () {
                self.resizeFrame();   
                self.publick_loading_show = false; 
                self.list_options_dropdown_menu_items_checked();  
            });                                                               
        }, 

        remove_checked_items: function(){               
            var self = this;   
            var arBatchRemove = [];  

            for (var current_item_index in self.current_select_publick_table.list_checked_items) { 
                arBatchRemove.push(
                    [
                        'entity.item.delete', 
                        {
                            ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
                            ID: self.current_select_publick_table.list_checked_items[current_item_index] 
                        }
                    ]
                );  
            }

            self.current_select_publick_table.rules_search_data = false;                 
            self.current_select_publick_table.search_data = "";
            self.current_select_publick_table.search_prop = null;                
            self.current_select_publick_table.show_search_close = false;

            if(arBatchRemove.length){
                self.publick_loading_show = true;   
                BX24.callBatch(arBatchRemove, 
                    function(data){       
                        BX24.callMethod(
                            'entity.item.get', 
                            {
                                ENTITY: self.current_select_publick_table.publick_entity.ENTITY,
                                SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                                start: self.current_select_publick_table.current_page,
                            }, 
                            function(data){
                                self.edit_mode = false;
                                if (data.error()){
                                    self.publick_loading_show = false;

                                    alert(data.error_description());   
                                    return 0;
                                }
                                else{                                    

                                    self.current_select_publick_table.publick_items = data.answer.result; 
                                    self.current_select_publick_table.total_items = data.answer.total;   
                                
                                    var entity_total = self.publick_list_entitys_total.find(list_entity => list_entity.publick_entity.ENTITY === self.current_select_publick_table.publick_entity.ENTITY);                        
                                    entity_total.publick_items = self.current_select_publick_table.publick_items; 
                                    entity_total.total_items = self.current_select_publick_table.total_items; 
                                    entity_total.current_page = self.current_select_publick_table.current_page;                                     

                                    self.$nextTick(function () {
                                        self.resizeFrame();   
                                        self.publick_loading_show = false;   
                                    });                                     
                                }   
                            }
                        ); 
                                                  
                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.publick_loading_show = false;
                            self.current_select_publick_table.checked_all_items = false;
                            self.current_select_publick_table.list_checked_items = {};                              
                        });                                
                    }
                );                    
            }
        },  

        /*
        set_count_show_items: function(show_count){               
            var self = this;  

            self.count_show_items = show_count;    
            self.current_select_publick_table.current_page = 0;

            self.$nextTick(function () {
                self.resizeFrame();   
                self.publick_loading_show = false;                             
            });  

            self.select_entity(self.current_select_publick_table.publick_entity, "update");                     
        }, 

        slice_items_show: function(list_items){                  
            var self = this;
            list_items = list_items.slice((self.count_show_items)*(-1));
            console.log(list_items);
            return list_items
        },   
        */                                              
	},

	ready: function(){  		        
        var self = this;            
        self.update_list_entity("ready_publick");        
    },
}