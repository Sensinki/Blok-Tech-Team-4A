module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin"); // Imagemin toegevoegd

  var JavaScriptObfuscator = require("javascript-obfuscator");

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      target: {
        files: [
          {
            expand: false,
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
            expand: false,
            cwd: "public/css",
            src: ["*.css"],
            dest: "build/css",
            ext: ".min.css",
          },
        ],
      },
    },

    imagemin: {
      target: {
        files: [
          {
            expand: false,
            cwd: "static/images", 
            src: ["**/*.{png,jpg,jpeg,svg}"], 
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

  grunt.registerTask("default", [
    "uglify",
    "cssmin",
    "obfuscate",
    "imagemin",
    "watch",
  ]); 
};
