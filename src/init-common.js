//load modules required
var clc = require('./colors'),
  shelljs = require('shelljs'),
  async = require('async'),
  fs = require('fs'),
  mergePkg = require('merge-pkg');
var currentStep = 1;
var app = {
  //add lint config to project
  addLintConfigFiles: function(callback) {
    console.log(clc.info(currentStep++ + '. add lint config'));
    try {
      var resourcesPath = '/../resources/' + app.options.path + '/';
      shelljs.cp('-rf', __dirname + resourcesPath + '\.*', './');
      // shelljs.cp('-rf', __dirname + resourcesPath + '*', './');
      console.log(clc.notice('lint config added'));
      callback();
    } catch (err) {
      callback(new Error('failed to add lint config:\n' + err.message));
    }
  },

  // merge package.json
  mergePackages: function(callback) {
    try {
      var resourcesPath = '/../resources/' + app.options.path + '/';
      var resPkg = fs.readFileSync(__dirname + resourcesPath + 'package.json', 'utf-8');
      var proPkg = fs.readFileSync('./package.json', 'utf-8');
      var destPkg = mergePkg(JSON.parse(proPkg), JSON.parse(resPkg));

      fs.writeFileSync('./package.json', JSON.stringify(destPkg, null, 2));
      console.log(clc.notice('package.json update successfully'));
      callback();
    } catch(err) {
      callback(new Error('failed to update package.json file: \n' + err.message));
    }
    
  },

  //install project npm dependencies
  installDependencies: function(callback) {
    console.log(clc.info(currentStep++ + '. install node modules'));
    try {
      shelljs.exec('npm install', {
        async: false
      });
      console.log(clc.notice('project dependencies installed successfully'));
      callback();
    } catch (err) {
      callback(new Error('failed to install project dependencies'));
    }
  },

  //finished init
  initFinished: function(callback) {
    console.log(clc.info(currentStep++ + '. lint config setting finished!'));
    console.log('***************************');
    console.log('$ npm/yarn install');
    console.log('$ npm run eslint');
    console.log('***************************');
    callback();
  },
};

module.exports = {
  init: function(options) {
    app.options = options || {};

    var commonWaterFall = [
      app.addLintConfigFiles,

      app.mergePackages,
      
      // app.installDependencies,
      
      app.initFinished
    ];

    async.waterfall(commonWaterFall, function(err, rs) {
      if (err) {
        console.log(clc.error(err.message));
        return;
      }
    });
  }
};