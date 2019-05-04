module.exports = {        
    data: function() {        
        return {    
            export:{
                list_table_panel: {
                    title: "Перед началом экспорта отметьте нужные таблицы и столбцы",                    
                    btn_export: "Экспортировать",                    
                },
                alerts: {
                    checked_null: "Невыбраны данные для экспорта",
                }
            },    

            export_loading_show: false,    

            export_list_entitys: {}, 
            export_list_entitys_selected: {}, 
            export_list_entitys_generate: {}, 
            export_name_file: "Прайс.xlsx",

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

        check_entity: function(input, entity_code){                  
            var self = this; 

            for (var prop_index in self.export_list_entitys[entity_code].export_properties) {                           
                self.$el.querySelector(".export_entity_prop_"+self.export_list_entitys[entity_code].export_entity.ENTITY+"_"+self.export_list_entitys[entity_code].export_properties[prop_index].PROPERTY).checked = input.target.checked;                                       
            }      
        },

        check_entity_prop: function(input, entity_code){                  
            var self = this; 

            self.$el.querySelector(".export_entity_"+self.export_list_entitys[entity_code].export_entity.ENTITY).checked = false;           
        },  

        start_export: function(){                
            var self = this; 

            self.export_loading_show = true;

            self.export_list_entitys_selected = {};            
            self.export_list_entitys_generate = {};

            for (var ent_index in self.export_list_entitys) {                                               
                var arr_props = [];

                for (var prop_index in self.export_list_entitys[ent_index].export_properties) {           
                    if(self.input_checked(".export_entity_prop_"+self.export_list_entitys[ent_index].export_entity.ENTITY+"_"+self.export_list_entitys[ent_index].export_properties[prop_index].PROPERTY)){                    
                        arr_props.push(self.export_list_entitys[ent_index].export_properties[prop_index]);
                    }                    
                }

                if(arr_props.length){
                    Vue.set(
                        self.export_list_entitys_selected,
                        self.export_list_entitys[ent_index].export_entity.ENTITY,  
                        {
                            export_entity: self.export_list_entitys[ent_index].export_entity,
                            export_properties: arr_props  
                        }                                   
                    );                     
                }
            }

            if(Object.keys(self.export_list_entitys_selected).length){
                self.exported_generate(self.export_list_entitys_selected, Object.keys(self.export_list_entitys_selected), 0); 
            }
            else{
                alert(self.export.alerts.checked_null);
                self.export_loading_show = false;
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
                                    self.convert_to_xlsx();
                                }
                            }
                        }
                    }
                );              
            }
            else{
                self.buffer_items = [];
                self.export_loading_show = false;
                self.convert_to_xlsx();            
            }                        
        },              

        convert_to_xlsx: function(){                
            var self = this; 

            self.export_loading_show = true;

            var wb = new Workbook();

            var list_props = [];
            var list_items = [];
            var list_items_array = [];

            for (var ent_index in self.export_list_entitys_generate) {  
                wb.SheetNames.push(self.export_list_entitys_generate[ent_index].export_entity.NAME);

                list_props = [];
                list_items_array = [];

                for (var prop_index in self.export_list_entitys_generate[ent_index].export_properties){
                    list_props.push(self.export_list_entitys_generate[ent_index].export_properties[prop_index].NAME);
                }

                list_items_array.push(list_props);

                for (var item_index in self.export_list_entitys_generate[ent_index].export_items){
                    list_items = [];
                    for (var prop_index in self.export_list_entitys_generate[ent_index].export_properties){
                        list_items.push(self.export_list_entitys_generate[ent_index].export_items[item_index].PROPERTY_VALUES[self.export_list_entitys_generate[ent_index].export_properties[prop_index].PROPERTY]);
                    }
                    list_items_array.push(list_items);
                }

                wb.Sheets[self.export_list_entitys_generate[ent_index].export_entity.NAME] = sheet_from_array_of_arrays(list_items_array);                                         
            }

            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), self.export_name_file);

            self.export_loading_show = false;               
        },
	},

	ready: function(){  		        
        var self = this; 
        self.update_list_entity("ready");                  
    },
}

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
            
            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            
            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}