// Karma configuration
// Generated on Tue Nov 15 2016 11:59:51 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    basePath: './',

    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/karma-read-json/karma-read-json.js',
      'src/**/*.module.js',
      'src/**/*.js',
      {pattern: 'src/**/fixtures/*.json', included: false}
    ],

    autoWatch: false,
    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],


  });
};

