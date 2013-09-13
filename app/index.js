'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator');


function ExpressSimpleGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('appname', {
    desc: 'create an express-app with name [appname]',
    type: Boolean,
    required: false,
    defaults: path.basename(process.cwd())
  });

  this.option('mvc', {
    desc: 'create a mvc express-app',
    type: Boolean,
    banner: 'yo express-simple --mvc',
    defaults: false
  });

  this.on('end', function () {
    console.log('finished yo..ing app :)');
    process.exit();
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ExpressSimpleGenerator, yeoman.generators.Base);

ExpressSimpleGenerator.prototype.askFor = function askFor() {
  var cb = this.async(),
      root = this;

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log('express-simple comes with normalize-css and jquery');

  var prompts = [{
    type: 'confirm',
    name: 'supportCssPreprocessor',
    message: 'Would you like to install any css preprocessor?',
    default: false
  },
  {
    type: 'list',
    name: 'cssPreprocessor',
    message: 'Select the css preprocessor you would like to use',
    default: 'less',
    choices: ['less', 'sass', 'stylus'],
    when: function (ansHash) {
      if (ansHash.supportCssPreprocessor) {
        return true;
      }
    }
  },
  {
    type: 'list',
    name: 'htmlEngine',
    message: 'Select the html engine you would like to use',
    default: 'jade',
    choices: ['jade', 'haml', 'underscore']
  },
  {
    type: 'list',
    name: 'db',
    message: 'Choose the database module you would like to use for your mvc app',
    default: 'mongoose',
    choices: ['mongoose', 'sequelize'],
    when: function () {
      if (root.options.mvc) {
        return true;
      }
    }
  }];

  this.prompt(prompts, function (props) {
    this.cssPreprocessor = props.supportCssPreprocessor ? props.cssPreprocessor : false;
    this.htmlEngine = props.htmlEngine;
    this.db = props.db || null;

    cb();
  }.bind(this));
};

ExpressSimpleGenerator.prototype.basicSetup = function basicSetup() {
  var ext = this.htmlEngine === 'underscore' ? 'html' : this.htmlEngine;

  this.mkdir('public' + (this.cssPreprocessor ? '/' + this.cssPreprocessor : ''));
  this.mkdir('public/bower_components');
  this.mkdir('public/img');
  this.mkdir('public/css');
  this.mkdir('public/js');

  this.mkdir('views');
  this.mkdir('routes');

  this.sourceRoot(path.join(__dirname, 'templates', '_template'));
  this.template('style.css', ('public/' + (this.cssPreprocessor ?
                this.cssPreprocessor + '/style.' + (this.cssPreprocessor === 'stylus' ?
                                                    'styl' : (this.cssPreprocessor === 'sass' ?
                                                              'scss': 'less')) : 'css/style.css')));
  this.template('index.html', 'views/index.' + ext);
  this.template('404.html', 'views/404.' + ext);
  this.template('index.js', 'routes/index.js');
  this.template('_bower.json', 'bower.json');
  this.template('_package.json', 'package.json');
  this.template('Gruntfile.js');
  if (!this.options.mvc) this.template('app.js');
};

ExpressSimpleGenerator.prototype.mvcSetup = function mvcSetup() {
  if (this.options.mvc) {
    this.sourceRoot(path.join(__dirname, 'templates', 'mvc'));
    this.mkdir('controllers');
    this.mkdir('views');
    this.mkdir('models');

    this.template('app.js');
    this.template('controller.js', 'controllers/index.js');
    this.template('model.js', 'models/index.js');
  }
};

ExpressSimpleGenerator.prototype.projectfiles = function projectfiles() {
  this.sourceRoot(path.join(__dirname, 'templates', 'common'));
  this.directory('.', '.');
};

ExpressSimpleGenerator.prototype.dependencies = function dependencies() {
  var cb = this.async();

  this.dep = '';

  if (this.db) {
    this.dep += this.db;
  }
  if (this.htmlEngine !== 'jade') {
    this.dep += ' consolidate';
  }

  this.dep += this.htmlEngine === 'haml' ? ' hamljs' : ' ' + this.htmlEngine;

  console.log('installing dependencies for %s ...', this.appname);

  this.npmInstall(this.dep, {save: true}, function (err) {
    if (err) {
      console.log('error installing dependencies :(', err);
      process.exit();
    }
    console.log('installed dependencies :)');
    cb();
  });
};

ExpressSimpleGenerator.prototype.devDep = function devDep() {
  var cb = this.async(),
      gruntTasks = ['jshint', 'uglify', 'cssmin', 'imagemin', 'watch'];

  this.gruntTasks = gruntTasks.map(function (task) {
    return 'grunt-contrib-' + task;
  });

  if (this.cssPreprocessor) {
    this.gruntTasks.push('grunt-'+ (this.cssPreprocessor === 'sass' ? 'sass' : 'contrib-' + this.cssPreprocessor));
  }

  this.gruntTasks.unshift('grunt');
  this.gruntTasks.join(' ');

  console.log('installing grunt dependencies for %s ...', this.appname);
  this.npmInstall(this.gruntTasks, {
    saveDev: true
  }, function (err) {
      if (err) {
        console.log('error installing grunt dependencies', err);
      }
      console.log('installed grunt dependencies :)');
      cb();
  });
};

ExpressSimpleGenerator.prototype.bower = function bower() {
  var cb = this.async();

  this.bowerDep = 'jquery normalize-css';

  console.log('installing bower packages for %s', this.appname);
  this.bowerInstall(this.bowerDep, {
    save: true
  }, function (err) {
    if (err) {
      console.log('error installing bower packages :(');
      process.exit();
    }
    console.log('finished installing bower packages :).');
    cb();
  });
};

module.exports = ExpressSimpleGenerator;
