var util = require('util');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect:{    	
    	server:{
    		options:{
    			livereload:true,          
          hostname:'*',
    			base: 'src',
    			open: 'http://localhost:8000',
          middleware: function(connect,options,middlewares){
            middlewares.unshift(function(req,res,next){
              if(req.url !== "/echo") return next();

              var body ='';
              req.on('data',function(data){
                body += data;
              });
              req.on('end',function(){
                res.end(body);
              });              
            });
            return middlewares;
          }
    		}
    	}
    },
    watch:{
    		server:{
    			files:['src/**/*'],
    			options:{
    				livereload:true
    			}
    		}
    	}
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect','watch']);
};
