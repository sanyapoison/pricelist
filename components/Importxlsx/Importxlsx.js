module.exports = {        
    data: function() {        
        return {    
            import: {
                labels: {
                    file: "Файл для импорта",
                    all_data: "Импортировать всё",
                    //list_entitys: "Таблица для импорта",
                    struct: "Импортировать структуру",
                    data: "Импортировать данные",
                    list_sheets: "Импортируемая таблица",
                },

                buttons: {                   
                    btn_import: "Импортировать", 
                    btn_open: "Открыть",                    
                    btn_clear: "Очистить", 
                },   

                alerts: {
                    error_ext_file: "Неверный формат файла",
                    error_check_params: "Невыбранны параметры структуры и данных",
                    error_open_file: "Файл не открыт",
                    //error_null_selected_entity: "Не выбрана таблица",
                    error_null_selected_sheet: "Не выбран лист в файле",
                    success_import: "Импорт успешно завершен",
                }
            },    

            import_loading_show: false, 

            import_all_data: true,   

            import_list_entitys: [], 
            import_list_entitys_props_items: {}, 
            import_file: "",
            import_file_name: "",
            import_file_input: null,
            //selected_entity: null,
            import_struct_entity: true,
            import_data_entity: true,

            XLSX_file: null,
            export_list_sheets: [], 
            selected_sheet: null,

            import_buffer:{
                entity: null,
                properties: [],
                improt_properties: [],
                items_total: 0,                  
                batch_properties: [],                
                batch_items_json: [],                
                batch_item_bufer: {},                
                batch_items: [],                                              
            },

            import_batch: [],
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
                if(self.import_loading_show){
                    self.import_loading_show = false;
                }
                console.log("error resizeFrame");
                console.log(e);
            }                            
        },                                            

        hashCode: function(s){
        	var hash = s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
		  	return hash > 0 ? hash : hash * (-1); 
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

        isNumeric: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

		find: function(array, value) {
		  	if (array.indexOf) {
		    	return array.indexOf(value);
		  	}

		  	for (var i = 0; i < array.length; i++) {
		    	if (array[i] === value) return i;
		  	}

		  	return -1;
		},

        update_list_entity: function(method){
            var self = this;

            self.import_loading_show = true;        
            BX24.callMethod(
               'entity.get',
                {},
                function(data){
                    if (data.error()){
                        self.import_loading_show = false;
                        alert(data.error_description());   
                    }
                    else{
                        self.import_list_entitys=data.answer.result;

                        self.list_properties(data.answer.result, data.answer.result.length, 0);

                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.import_loading_show = false;   
                        });                         
                    }
                }
            );
        },

        list_properties: function(entitys, count, index){               
            var self = this;       

            if(!(count < index+1)){
                self.import_loading_show = true;
                BX24.callMethod(
                   'entity.item.property.get',
                    {
                        'ENTITY': entitys[index].ENTITY, 
                    },
                    function(data){
                        if (data.error()){
                            self.import_loading_show = false;
                            alert(data.error_description());   
                        }
                        else{                                                
                            Vue.set(
                                self.import_list_entitys_props_items,
                                entitys[index].ENTITY,  
                                {
                                    import_entity: entitys[index],
                                    import_properties: data.answer.result,  
                                    import_items_total: 0
                                }                                   
                            ); 

                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.import_loading_show = false;   
                            }); 

                            if(!(count < index+1)){
                                self.list_properties(entitys, count, index+1);
                            } 
                            else{
                            	self.entity_items_total(entitys, count, 0);
                            }                      
                        }
                    }
                );
            }
            else{
            	self.entity_items_total(entitys, count, 0);
            }                         
        },

        entity_items_total: function(entitys, count, index){               
            var self = this;       

            if(!(count < index+1)){
                self.import_loading_show = true;
                BX24.callMethod(
                   'entity.item.get',
                    {
                        'ENTITY': entitys[index].ENTITY, 
                    },
                    function(data){
                        if (data.error()){
                            self.import_loading_show = false;
                            alert(data.error_description());   
                        }
                        else{                                                
                            Vue.set(
                                self.import_list_entitys_props_items[entitys[index].ENTITY],
                                'import_items_total',  
                                data.answer.total                                   
                            ); 

                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.import_loading_show = false;   
                            }); 

                            if(!(count < index+1)){
                                self.entity_items_total(entitys, count, index+1);
                            }                    
                        }
                    }
                );
            }                         
        },

        isset_list_entytis: function(import_list_entitys){                 
            var self = this; 
            return import_list_entitys.length > 0 ? true : false;                              
        },

        clear_file: function(){                 
            var self = this; 
            self.import_file = '';
            self.import_file_name = '';
            self.XLSX_file = null;
            self.import_file_input = null;  
            self.export_list_sheets = [];
            self.$nextTick(function () {
                self.resizeFrame();   
                self.import_loading_show = false;   
            });                                      
        },

        /*
        entity_set_selected: function(entity){                 
            var self = this; 
            return entity.ENTITY == self.selected_entity ? true : false;                             
        },
        */

        sheet_set_selected: function(sheet){                 
            var self = this; 
            return sheet == self.selected_sheet ? true : false;                             
        },

        get_name_file_for_input: function(file){                 
            var self = this; 

        },    

        import_change_file: function(input){                 
            var self = this; 
            
            if(input.target.files.length){
                if((input.target.files[0].name).split('.').pop() == "xlsx" || (self.import_file_input[0].name).split('.').pop() == "XLSX"){
                    self.import_loading_show = true; 
                    self.import_file_input = input.target.files; 
                    self.import_file_name = self.import_file_input[0]["name"];
                    var reader = new FileReader();
                    reader.readAsBinaryString(self.import_file_input[0]);                 
                    reader.onload = function(e) {
                        var data = e.target.result;                       
                        self.XLSX_file = XLSX.read(data, {type:"binary"});   

                        self.export_list_sheets = self.XLSX_file.SheetNames; 

                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.import_loading_show = false;   
                        });                                            
                    }                               
                }
                else{
                    alert(self.import.alerts.error_ext_file);
                }       
            }                                        
        },

        start_import: function(){                 
            var self = this;              

            if(self.XLSX_file != null){
            	self.import_loading_show = true; 

                if(self.import_all_data){                    
                    self.import_batch = [];                        

                    self.XLSX_file.SheetNames.forEach(function (sheetName) {                            
                        // import_rows                    
                        self.import_buffer.improt_properties = [];                
                        self.import_buffer.batch_items = [];                                    
                        self.import_buffer.batch_items_json = [];  

                        self.import_buffer.batch_items_json = XLSX.utils.sheet_to_json(self.XLSX_file.Sheets[sheetName]);                                     
                        
                        for(var rowItem in self.import_buffer.batch_items_json){
                        	self.import_buffer.batch_item_bufer = {};

                            Object.keys(self.import_buffer.batch_items_json[rowItem]).forEach(function (columnItem) {  
                            	if(columnItem != "undefined" && columnItem != undefined && columnItem != ""){
	                            	if(self.find(self.import_buffer.improt_properties, columnItem) == -1){
	                            		self.import_buffer.improt_properties.push(columnItem);
	                            	}
	                            	self.import_buffer.batch_item_bufer["prp_" + self.hashCode(self.toTranslit(columnItem))] = self.import_buffer.batch_items_json[rowItem][columnItem];	                            	
	                            }	                            	                            	
                            });
                            
                        	self.import_buffer.batch_items.push(
                            	[
									'entity.item.add', 
									{
									    'ENTITY': ("ent_" + self.hashCode(self.toTranslit(sheetName))),
									    'DATE_ACTIVE_FROM': new Date(),
									    'NAME': "Imp" + (self.import_buffer.items_total+rowItem+1) + " [" + new Date() + "]",
									    'PROPERTY_VALUES': self.import_buffer.batch_item_bufer,
									    'SORT': self.import_buffer.items_total+rowItem+1,
									} 
                                ]
                            );  
                        }                        

                        if(self.import_buffer.batch_items.length){
	                        Vue.set(
	                            self.import_batch,
	                            ("ent_" + self.hashCode(self.toTranslit(sheetName))),
	                            {
	                                new_entity: null,
	                                batch_props: null,
	                                batch_items: null,
	                            }
	                        );

							Vue.set(
	                            self.import_batch[("ent_" + self.hashCode(self.toTranslit(sheetName)))],
	                            'batch_items',
	                            self.import_buffer.batch_items
	                        );	                     

	                        self.import_buffer.entity = null;
	                        self.import_buffer.properties = [];                                                                                               
	                        self.import_buffer.items_total = 0;    
	                        self.import_buffer.batch_properties = [];    

	                        if(self.import_list_entitys.find(entity => entity.ENTITY === ("ent_" + self.hashCode(self.toTranslit(sheetName)))) != undefined){
	                            self.import_buffer.entity = self.import_list_entitys.find(entity => entity.ENTITY === ("ent_" + self.hashCode(self.toTranslit(sheetName))));
	                            self.import_buffer.properties = self.import_list_entitys_props_items[self.import_buffer.entity.ENTITY].import_properties;
	                            self.import_buffer.items_total = self.import_list_entitys_props_items[self.import_buffer.entity.ENTITY].import_items_total;
	                 
								self.import_buffer.improt_properties.forEach(function (columnName) { 
	                                if(self.import_buffer.properties.find(property => property.PROPERTY === ("prp_" + self.hashCode(self.toTranslit(columnName))) ) == undefined){
	                                    self.import_buffer.batch_properties.push(
	                                    	[
	                                            'entity.item.property.add', 
	                                            {
	                                                'ENTITY': "ent_" + self.hashCode(self.toTranslit(sheetName)), 
	                                                'PROPERTY': ("prp_" + self.hashCode(self.toTranslit(columnName))), 
	                                                'NAME': columnName, 
	                                                'TYPE': 'S',
	                                            }
	                                        ]
	                                    );
	                                }                                
	                            });

                                Vue.set(
                                    self.import_batch[("ent_" + self.hashCode(self.toTranslit(sheetName)))],
                                    'new_entity',
                                    true                                
                                );

								if(self.import_buffer.batch_properties.length){
		                            Vue.set(
		                                self.import_batch[("ent_" + self.hashCode(self.toTranslit(sheetName)))],
		                                'batch_props',
		                                self.import_buffer.batch_properties
		                            );                                        
								}
								else{
		                            Vue.set(
		                                self.import_batch[("ent_" + self.hashCode(self.toTranslit(sheetName)))],
		                                'batch_props',
		                                true
		                            ); 									
								}
	                        }
	                        else{ 
	                            if(XLSX.utils.sheet_to_json(self.XLSX_file.Sheets[sheetName]).length){
	                                Vue.set(
	                                    self.import_batch[("ent_" + self.hashCode(self.toTranslit(sheetName)))],
	                                    'new_entity',
	                                    {
	                                        'ENTITY': ("ent_" + self.hashCode(self.toTranslit(sheetName))), 
	                                        'NAME': sheetName, 
	                                        'ACCESS': {U1:'W',AU:'R'}
	                                    }                                
	                                );
	                              
	                                self.import_buffer.improt_properties.forEach(function (columnName) {                                     
	                                    self.import_buffer.batch_properties.push(
	                                    	[
	                                            'entity.item.property.add', 
	                                            {
	                                                'ENTITY': ("ent_" + self.hashCode(self.toTranslit(sheetName))), 
	                                                'PROPERTY': ("prp_" + self.hashCode(self.toTranslit(columnName))), 
	                                                'NAME': columnName, 
	                                                'TYPE': 'S',
	                                            }
	                                        ]
	                                    );                                                                        
	                                });                                

									if(self.import_buffer.batch_properties.length){
			                            Vue.set(
			                                self.import_batch[("ent_" + self.hashCode(self.toTranslit(sheetName)))],
			                                'batch_props',
			                                self.import_buffer.batch_properties
			                            ); 		                                                                   
									}                                
	                            }
	                        }
	                    }    
                    });

                    self.generate_batch_query(Object.keys(self.import_batch), Object.keys(self.import_batch).length, 0);

                    self.import_loading_show = false;                             
                }
                else{
                    if(self.selected_sheet != null){
                        //if(self.selected_entity != null){
                        if(self.import_struct_entity || self.import_data_entity){
                            
                            self.import_batch = [];                        
                       
                            // import_rows                    
                            self.import_buffer.improt_properties = [];                
                            self.import_buffer.batch_items = [];                                    
                            self.import_buffer.batch_items_json = [];  

                            self.import_buffer.batch_items_json = XLSX.utils.sheet_to_json(self.XLSX_file.Sheets[self.selected_sheet]);                                                                 
                            
                            for(var rowItem in self.import_buffer.batch_items_json){
                                self.import_buffer.batch_item_bufer = {};

                                Object.keys(self.import_buffer.batch_items_json[rowItem]).forEach(function (columnItem) {  
                                    if(columnItem != "undefined" && columnItem != undefined && columnItem != ""){
                                        if(self.find(self.import_buffer.improt_properties, columnItem) == -1){
                                            self.import_buffer.improt_properties.push(columnItem);
                                        }
                                        self.import_buffer.batch_item_bufer["prp_" + self.hashCode(self.toTranslit(columnItem))] = self.import_buffer.batch_items_json[rowItem][columnItem];                                    
                                    }                                                                   
                                });
                            
                                if(self.import_data_entity){      
                                    self.import_buffer.batch_items.push(
                                        [
                                            'entity.item.add', 
                                            {
                                                'ENTITY': ("ent_" + self.hashCode(self.toTranslit(self.selected_sheet))),
                                                'DATE_ACTIVE_FROM': new Date(),
                                                'NAME': "Imp" + (self.import_buffer.items_total+rowItem+1) + " [" + new Date() + "]",
                                                'PROPERTY_VALUES': self.import_buffer.batch_item_bufer,
                                                'SORT': self.import_buffer.items_total+rowItem+1,
                                            } 
                                        ]
                                    );  
                                }    
                            }                        

                            if(self.import_buffer.batch_items.length || self.import_data_entity == false){
                                Vue.set(
                                    self.import_batch,
                                    ("ent_" + self.hashCode(self.toTranslit(self.selected_sheet))),
                                    {
                                        new_entity: null,
                                        batch_props: null,
                                        batch_items: null,
                                    }
                                );

                                Vue.set(
                                    self.import_batch[("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))],
                                    'batch_items',
                                    self.import_buffer.batch_items
                                );                       

                                self.import_buffer.entity = null;
                                self.import_buffer.properties = [];                                                                                               
                                self.import_buffer.items_total = 0;    
                                self.import_buffer.batch_properties = [];    

                                if(self.import_list_entitys.find(entity => entity.ENTITY === ("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))) != undefined){
                                    self.import_buffer.entity = self.import_list_entitys.find(entity => entity.ENTITY === ("ent_" + self.hashCode(self.toTranslit(self.selected_sheet))));
                                    self.import_buffer.properties = self.import_list_entitys_props_items[self.import_buffer.entity.ENTITY].import_properties;
                                    self.import_buffer.items_total = self.import_list_entitys_props_items[self.import_buffer.entity.ENTITY].import_items_total;
                         
                                    if(self.import_struct_entity){
                                        self.import_buffer.improt_properties.forEach(function (columnName) { 
                                            if(self.import_buffer.properties.find(property => property.PROPERTY === ("prp_" + self.hashCode(self.toTranslit(columnName))) ) == undefined){
                                                self.import_buffer.batch_properties.push(
                                                    [
                                                        'entity.item.property.add', 
                                                        {
                                                            'ENTITY': "ent_" + self.hashCode(self.toTranslit(self.selected_sheet)), 
                                                            'PROPERTY': ("prp_" + self.hashCode(self.toTranslit(columnName))), 
                                                            'NAME': columnName, 
                                                            'TYPE': 'S',
                                                        }
                                                    ]
                                                );
                                            }                                
                                        });
                                    }    

                                    Vue.set(
                                        self.import_batch[("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))],
                                        'new_entity',
                                        true                                
                                    );

                                    if(self.import_buffer.batch_properties.length){
                                        Vue.set(
                                            self.import_batch[("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))],
                                            'batch_props',
                                            self.import_buffer.batch_properties
                                        );                                        
                                    }
                                    else{
                                        Vue.set(
                                            self.import_batch[("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))],
                                            'batch_props',
                                            true
                                        );                                  
                                    }
                                }
                                else{ 
                                    if(XLSX.utils.sheet_to_json(self.XLSX_file.Sheets[self.selected_sheet]).length){
                                        Vue.set(
                                            self.import_batch[("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))],
                                            'new_entity',
                                            {
                                                'ENTITY': ("ent_" + self.hashCode(self.toTranslit(self.selected_sheet))), 
                                                'NAME': self.selected_sheet, 
                                                'ACCESS': {U1:'W',AU:'R'}
                                            }                                
                                        );

                                        if(self.import_struct_entity){
                                            self.import_buffer.improt_properties.forEach(function (columnName) {                                     
                                                self.import_buffer.batch_properties.push(
                                                    [
                                                        'entity.item.property.add', 
                                                        {
                                                            'ENTITY': ("ent_" + self.hashCode(self.toTranslit(self.selected_sheet))), 
                                                            'PROPERTY': ("prp_" + self.hashCode(self.toTranslit(columnName))), 
                                                            'NAME': columnName, 
                                                            'TYPE': 'S',
                                                        }
                                                    ]
                                                );                                                                        
                                            });                          
                                        }                                              

                                        if(self.import_buffer.batch_properties.length){
                                            Vue.set(
                                                self.import_batch[("ent_" + self.hashCode(self.toTranslit(self.selected_sheet)))],
                                                'batch_props',
                                                self.import_buffer.batch_properties
                                            );                                                                         
                                        }                                
                                    }
                                }
                            }    

                            self.generate_batch_query(Object.keys(self.import_batch), Object.keys(self.import_batch).length, 0);

                            self.import_loading_show = false;           

                        }
                        else{
                            alert(self.import.alerts.error_check_params);
                        } 
                        /*                                
                        }
                        else{
                            alert(self.import.alerts.error_null_selected_entity);
                        } 
                        */  
                        self.import_loading_show = false;                          
                    }
                    else{
                        alert(self.import.alerts.error_null_selected_sheet);
                    }
                    self.import_loading_show = false; 
                }

	            self.import_loading_show = false;   
            }
            else{
                alert(self.import.alerts.error_open_file);
            } 
            self.import_loading_show = false;    
        },

        generate_batch_query: function(keysTables, countTables, index){  		        
	        var self = this; 

	        if(countTables > index){		          

	        	self.import_loading_show = true;

	        	//console.log("import: " + keysTables[index]);	
	        		      	
				if(self.import_batch[keysTables[index]].new_entity != null && self.import_batch[keysTables[index]].new_entity != true){
			        //console.log("import_entity_new");
			        //console.log(self.import_batch[keysTables[index]].new_entity);
        			
        			self.import_entity_new(self.import_batch[keysTables[index]].new_entity, keysTables, countTables, index);
        		}
        		else if(self.import_batch[keysTables[index]].batch_props != null && self.import_batch[keysTables[index]].batch_props != true && self.import_batch[keysTables[index]].new_entity == true){
			        //console.log("import_entity_props");        			
		        	//console.log(self.import_batch[keysTables[index]].batch_props);

        			self.import_entity_props(self.import_batch[keysTables[index]].batch_props, keysTables, countTables, index);      				
        		}
	        	else if(self.import_batch[keysTables[index]].new_entity == true && self.import_batch[keysTables[index]].batch_props == true){
	        		//console.log("import_entity_items");				           	       				        
			        //console.log(self.import_batch[keysTables[index]].batch_items);		        		
	        		
	        		self.import_entity_items(self.import_batch[keysTables[index]].batch_items, keysTables, countTables, index);
	        	}	
	        	else{
	        		self.generate_batch_query(keysTables, countTables, index+1);
	        	}   

                self.import_loading_show = false;      		        			       		        	
	        } 
	        else{
	        	self.import_loading_show = false;
	        	self.clear_file();  
                alert(self.import.alerts.success_import);
	        }      		        
	    },

		import_entity_new: function(importEntity, keysTables, countTables, index){               
            var self = this;       

            if(self.import_all_data || self.import_struct_entity){
                self.import_loading_show = true;
         
    			BX24.callMethod(
                    'entity.add', 
                    importEntity,
                    function(data){
    					if (data.error()){
    						self.admin_loading_show = false;
                            alert(data.error_description());
    					}
    					else{
    						self.admin_loading_show = false;
    						self.import_batch[keysTables[index]].new_entity = true;
    						self.generate_batch_query(keysTables, countTables, index);
    					}
                    }
                );                                      
            }    
        },

		import_entity_props: function(batchProps, keysTables, countTables, index){               
            var self = this;       

			if(self.import_all_data || self.import_struct_entity){
                self.import_loading_show = true;

    			BX24.callBatch(
                    batchProps,
                    function(data){  
                    	console.log(data);
                        self.admin_loading_show = false;
    					self.import_batch[keysTables[index]].batch_props = true;
    					self.generate_batch_query(keysTables, countTables, index);
                    }
                );
            }                   		        	                            
        },

        import_entity_items: function(batchItems, keysTables, countTables, index){               
            var self = this;       

            if(self.import_all_data || self.import_data_entity){
                self.import_loading_show = true;

                //import_entity_items_batch(batchItems, keysTables, countTables, index, 0);

                /*
                BX24.callBatch(
                	batchItems, 
                    function(data){  
                        self.import_loading_show = false;   
                        self.generate_batch_query(keysTables, countTables, index+1);   	       
                    }
                );
                */	
            }            	 		                                                         
        },

        import_entity_items_batch: function(batchItems, keysTables, countTables, index, batch_index){               
            var self = this;       

            if(self.import_all_data || self.import_data_entity){
                self.import_loading_show = true;

                BX24.callBatch(
                	batchItems, 
                    function(data){  
                        self.import_loading_show = false;   
                        self.generate_batch_query(keysTables, countTables, index+1);   	       
                    }
                );	
            }            	 		                                                         
        },

	},

	ready: function(){  		        
        var self = this; 
        self.update_list_entity("ready");                  
    },
}