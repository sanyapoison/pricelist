module.exports = {
    data: function() {
        return {
            navbar: {
            	brand: {
            		title: "Прайслист"            		
            	},
            	option:{
            		title: "Опции"
            	}
            },

            links: [
            	{
            		name: "Таблицы",
            		link: "index.html",
            		accsess: "public",
                    dropdown: {},
            	},
            	{
            		name: "Управление",
            		link: "control.html",
            		accsess: "admin",
                    dropdown: {},                    
            	},            	
                {
                    name: "Экспорт",
                    link: "#",
                    accsess: "public",
                    dropdown: [
                        {
                            name: "Экспорт в XLSX",
                            link: "export_xlsx.html",
                            accsess: "publick",                                        
                        },                                  
                        {
                            name: "Экспорт в CSV",
                            link: "export_csv.html",
                            accsess: "publick",                                        
                        },                   
                        {
                            name: "Экспорт в PDF",
                            link: "export_pdf.html",
                            accsess: "publick",                                        
                        },                                             
                    ], 
                },      
                {
                    name: "Импорт",
                    link: "#",
                    accsess: "admin",
                    dropdown: [
                        {
                            name: "Импорт из XLSX",
                            link: "import_xlsx.html",
                            accsess: "admin",                                        
                        },                                  
                        {
                            name: "Импорт из CSV",
                            link: "import_csv.html",
                            accsess: "admin",                                        
                        },                                                                
                    ],                    
                                                    
                },
                {
                    name: "Справка",
                    link: "#",
                    accsess: "publick",
                    dropdown: [
                        {
                            name: "Инструкция",
                            link: "instruction.html",
                            accsess: "publick",                                        
                        },   
                        /*                               
                        {
                            name: "О приложении",
                            link: "about_app.html",
                            accsess: "publick",                                        
                        },                                  
                        {
                            name: "Об авторе",
                            link: "about.html",
                            accsess: "publick",                                        
                        },  
                        */                                                                                       
                    ],                    
                                                    
                },                
            ]
        }
    },
	methods: {
	  	controlAdmin: function (links) {
	    	return links.filter(function (link) {
	      		if(link.accsess == "public"){
	      			return link;
	      		}
	      		else{	      			
	      			if(BX24.isAdmin()){
	      				return link;
	      			}	      			
	      		}
	    	});
	  	},

        show_dropdown: function (link) {
            return Object.keys(link.dropdown).length > 0;
        }, 

        show_dropdown_class: function (add_class, link) {
            return { add_class: Object.keys(link.dropdown).length > 0};
        }, 

        show_dropdown_data: function (data, link) {
            if(Object.keys(link.dropdown).length > 0){
                return data;
            }
        },                        
	}
}