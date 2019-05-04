const path = require('path');
const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: {        
        // Navbar: './components/Navbar/NavbarBuild.js',
        // Admin: './components/Admin/AdminBuilder.js',
        // Publick: './components/Publick/PublickBuilder.js',
        // Exportxlsx: './components/Exportxlsx/ExportxlsxBuilder.js',
        // Exportcsv: './components/Exportcsv/ExportcsvBuilder.js',
        // Exportpdf: './components/Exportpdf/ExportpdfBuilder.js',
        Importxlsx: './components/Importxlsx/ImportxlsxBuilder.js',
        // Importcsv: './components/Importcsv/ImportcsvBuilder.js',        
        // Instruction: './components/Instruction/InstructionBuilder.js',
    },
    
    output: {
        path: path.resolve(__dirname, './js/components/'),
        filename: '[name]Component.js'
    },
    
    plugins: [
        new WebpackShellPlugin({            
            onBuildEnd:['compile arhive']
        }),
        /*
	    new webpack.DefinePlugin({
	      	'process.env': {
	        	NODE_ENV: '"production"'
	      	},
	    }),        
        */
	]
    	
};