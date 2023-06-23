module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin"); 

  var JavaScriptObfuscator = require("javascript-obfuscator");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      target: {
        files: [
          {
            expand: true,
            cwd: "public/js",
            src: ["*.js"],
            dest: "build/js",
            ext: ".min.js",
          },
        ],
      },
    },

    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: "public/css",
            src: ["*.css"],
            dest: "build/css",
            ext: ".min.css",
          },
        ],
      },
    },

    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: "static/images",
            src: ["**/*.{png,jpg,jpeg,svg,webp}"],
            dest: "build/images",
          },
        ],
      },
    },

    watch: {
      scripts: {
        files: ["public/js/*.js"],
        tasks: ["uglify", "obfuscate"],
        options: {
          livereload: true,
        },
      },
      styles: {
        files: ["public/css/*.css"],
        tasks: ["cssmin"],
        options: {
          livereload: true,
        },
      },
    },
  });

  grunt.registerTask("obfuscate", function () {
    var files = grunt.file.expand("build/js/*.min.js");

    files.forEach(function (file) {
      var sourceCode = grunt.file.read(file);
      var obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode);

      grunt.file.write(file, obfuscationResult.getObfuscatedCode());
    });

    grunt.log.writeln("JavaScript files obfuscated.");
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin");

  grunt.registerTask("default", [
    "uglify",
    "cssmin",
    "obfuscate",
    "imagemin",
    "watch",
  ]); 
};
