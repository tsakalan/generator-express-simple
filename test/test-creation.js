/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;

// TODO: write more test for generator
describe('express-simple generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('express-simple:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files for mvc style app', function (done) {
    var expected = [
      // add files you expect to exist here.
       'public/stylus/styles.styl',
       'public/js/main.js',
       'views/index.hbs',
       'views/404.hbs',
       'routes/index.js',
       'controllers/index.js',
       'models/user.js',
       'bower.json',
       'package.json',
       'Gruntfile.js',
       'app.js',
       '.bowerrc',
       '.editorconfig',
       '.gitignore',
       '.jshintrc'
    ];

    helpers.mockPrompt(this.app, {
      'mvc': true,
      'cssPreprocessor': 'stylus',
      'viewEngine': 'hbs'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
