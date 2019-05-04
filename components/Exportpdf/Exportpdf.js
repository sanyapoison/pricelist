module.exports = {        
    data: function() {        
        return {    
            export:{
                list_table_panel: {
                    title: "Перед началом экспорта отметьте нужную таблицу и столбцы", 
                    button_select: "Выберите таблицу",                  
                    check_all: "Выбрать все",                  
                    btn_export: "Экспортировать",                    
                },
            },    

            export_loading_show: false,    

            export_list_entitys: {}, 
            export_list_entitys_selected: {}, 
            export_list_entitys_generate: {}, 
            export_name_file: "Прайс",

            selected_entity: null,

            buffer_items: [],
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
                if(self.export_loading_show){
                    self.export_loading_show = false;
                }
                console.log("error resizeFrame");
                console.log(e);
            }                            
        },                                            

        update_list_entity: function(method){
            var self = this;         
            self.export_loading_show = true;        
            BX24.callMethod(
               'entity.get',
                {},
                function(data){
                    if (data.error()){
                        self.export_loading_show = false;
                        alert(data.error_description());   
                    }
                    else{
                        if(data.answer.result.length){
                            self.list_properties(data.answer.result, data.answer.result.length, 0);
                        }

                        self.$nextTick(function () {
                            self.resizeFrame();   
                            self.export_loading_show = false;   
                        });                         
                    }
                }
            );
        },

        list_properties: function(entitys, count, index){               
            var self = this;       

            if(!(count < index+1)){
                self.export_loading_show = true;
                BX24.callMethod(
                   'entity.item.property.get',
                    {
                        'ENTITY': entitys[index].ENTITY, 
                    },
                    function(data){
                        if (data.error()){
                            self.export_loading_show = false;
                            alert(data.error_description());   
                        }
                        else{                                                
                            Vue.set(
                                self.export_list_entitys,
                                entitys[index].ENTITY,  
                                {
                                    export_entity: entitys[index],
                                    export_properties: data.answer.result  
                                }                                   
                            ); 

                            self.$nextTick(function () {
                                self.resizeFrame();   
                                self.export_loading_show = false;   
                            }); 

                            if(!(count < index+1)){
                                self.list_properties(entitys, count, index+1);
                            }                       
                        }
                    }
                );
            }                         
        },

        input_checked: function(selector){                  
            var self = this; 

            return self.$el.querySelector(selector).checked;              
        },

        check_entity: function(input){                  
            var self = this; 

            for (var prop_index in self.selected_entity.export_properties) {                           
                self.$el.querySelector(".export_entity_prop_"+self.selected_entity.export_entity.ENTITY+"_"+self.selected_entity.export_properties[prop_index].PROPERTY).checked = input.target.checked;                                       
            }      
        },

        check_entity_prop: function(input){                  
            var self = this; 

            self.$el.querySelector(".export_entity_"+self.selected_entity.export_entity.ENTITY).checked = false;           
        },  

        print_current_selected_entity: function(){                  
            var self = this;  

            return self.selected_entity == null ? self.export.list_table_panel.button_select : self.selected_entity.export_entity.NAME;         
        },

        select_entity: function(entity){                  
            var self = this;  

            self.selected_entity = entity;     
            
            self.$nextTick(function () {
                self.resizeFrame();   
                self.publick_loading_show = false;  

                if(self.selected_entity != null){     
                    self.$el.querySelector(".export_entity_"+self.selected_entity.export_entity.ENTITY).checked = false;              
                }                  
            });              
        }, 

        start_export: function(){                
            var self = this; 

            if(self.selected_entity != null){
                self.export_loading_show = true;

                self.export_list_entitys_selected = {};            
                self.export_list_entitys_generate = {};
                                                 
                var arr_props = [];

                for (var prop_index in self.selected_entity.export_properties) {           
                    if(self.input_checked(".export_entity_prop_"+self.selected_entity.export_entity.ENTITY+"_"+self.selected_entity.export_properties[prop_index].PROPERTY)){                    
                        arr_props.push(self.selected_entity.export_properties[prop_index]);
                    }                    
                }

                if(arr_props.length){
                    Vue.set(
                        self.export_list_entitys_selected,
                        self.selected_entity.export_entity.ENTITY,  
                        {
                            export_entity: self.selected_entity.export_entity,
                            export_properties: arr_props  
                        }                                   
                    );                     
                }
                

                self.exported_generate(self.export_list_entitys_selected, Object.keys(self.export_list_entitys_selected), 0); 
            }    
        },  

        exported_generate: function(list_entitys, list_keys, index_entity){                  
            var self = this;

            self.buffer_items = [];

            if(list_keys.length > index_entity){
                BX24.callMethod(
                    'entity.item.get', 
                    { 
                        ENTITY: list_entitys[list_keys[index_entity]].export_entity.ENTITY, 
                        SORT: {
                            ID: 'ASC'
                        }, 
                    }, 
                    function(data){
                        if (data.error()){
                            self.export_loading_show = false;
                            alert(data.error_description());   
                        }
                        else{  
                            self.buffer_items = self.buffer_items.concat(data.answer.result);  

                            if(data.more()){
                                data.next();
                            }
                            else{
                                if(list_keys.length > index_entity){
                                    Vue.set(
                                        self.export_list_entitys_generate,
                                        list_entitys[list_keys[index_entity]].export_entity.ENTITY,  
                                        {
                                            export_entity: list_entitys[list_keys[index_entity]].export_entity,
                                            export_properties: list_entitys[list_keys[index_entity]].export_properties,
                                            export_items: self.buffer_items,
                                        }                                   
                                    ); 

                                    self.exported_generate(list_entitys, list_keys, index_entity+1);
                                }
                                else{
                                    self.buffer_items = [];
                                    self.export_loading_show = false;
                                    self.convert_to_pdf();
                                }
                            }
                        }
                    }
                );              
            }
            else{
                self.buffer_items = [];
                self.export_loading_show = false;
                self.convert_to_pdf();            
            }                        
        },              

        convert_to_pdf: function(){                
            var self = this; 

            self.export_loading_show = true;

            var list_props = [];
            var list_widths = [];
            var list_items = [];
            var list_items_array = [];

            for (var ent_index in self.export_list_entitys_generate) { 
                list_props = [];
                list_widths = [];
                list_items_array = [];

                for (var prop_index in self.export_list_entitys_generate[ent_index].export_properties){
                    list_props.push(
                        {
                            text: self.export_list_entitys_generate[ent_index].export_properties[prop_index].NAME, 
                            colSpan: 1, 
                            alignment: 'left',
                            style: 'tableHeader',
                        }                        
                    );

                    list_widths.push("*");
                }

                list_items_array.push(list_props);

                for (var item_index in self.export_list_entitys_generate[ent_index].export_items){
                    list_items = [];
                    for (var prop_index in self.export_list_entitys_generate[ent_index].export_properties){
                        list_items.push(self.export_list_entitys_generate[ent_index].export_items[item_index].PROPERTY_VALUES[self.export_list_entitys_generate[ent_index].export_properties[prop_index].PROPERTY]);
                    }
                    list_items_array.push(list_items);
                }
            }                                                        
            list_widths.push("*");
            pdfMake.createPdf({
                pageSize:'A4',
                pageOrientation:'portrait', // landscape
                pageMargins:[50,30,0,60],

                content: [
                    { 
                        text: self.export_name_file+" "+self.selected_entity.export_entity.NAME, 
                        style: 'header' 
                    },
                    
                    {
                        table: {
                            headerRows: 1,
                            widths: list_widths,
                            body: list_items_array                            
                        },
                        layout: {
                            fillColor: function (i, node) {
                                return (i % 2 === 0) ? '#EEEEEE' : null;
                            }
                        },
                        style: 'tableBody'                        
                    },
                ],

                footer:function(currentPage,pageCount) {
                    return {
                        text: currentPage.toString() + ' из ' + pageCount,
                        alignment:'center',
                        style: 'footer' 
                    }
                },

                styles: {
                    header: {
                        fontSize: 24,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    }, 

                    footer: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 0, 0, 10],
                        alignment: 'center',
                    },

                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                        fillColor: '#b2d7f7',
                    },

                    tableBody: {
                        fontSize: 12,
                    }
                },                               
            }).download(self.export_name_file+": "+self.selected_entity.export_entity.NAME+".pdf");

            self.export_loading_show = false;               
        },
	},

	ready: function(){  		        
        var self = this; 
        self.update_list_entity("ready");                  
    },
}