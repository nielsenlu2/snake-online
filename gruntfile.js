'use strict';

var client = require('./grunt/client.js');
var server = require('./grunt/server.js');
var testsuite = require('./grunt/testsuite.js');


module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            client: client.concat,
            server: server.concat,
            testsuite: testsuite.concat
            // TODO: audio
            // TODO: levels
        },
        gcc_rest: {
            client: client.gcc_rest,
            server: server.gcc_rest
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-gcc-rest');

    grunt.registerTask('client', ['concat:client', 'gcc_rest:client']);
    grunt.registerTask('server', ['concat:server', 'gcc_rest:server']);
    grunt.registerTask('testsuite', ['concat:testsuite']);
    grunt.registerTask('default', []);
};