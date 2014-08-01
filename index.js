var lib = require('./lib');
var util = require('util');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
_.defaults = require('merge-defaults');

/**
 * sails-scaffolding
 *
 * Usage:
 * `sails generate scaffolding`
 *
 * @description Generates a scaffold
 * @help See http://links.sailsjs.org/docs/generators
 */

module.exports = {

  /**
   * `before()` is run before executing any of the `targets`
   * defined below.
   *
   * This is where we can validate user input, configure default
   * scope variables, get extra dependencies, and so on.
   *
   * @param  {Object} scope
   * @param  {Function} cb    [callback]
   */
  before: function (scope, cb) {

    // scope.args are the raw command line arguments.
    //
    // e.g. if someone runs:
    // $ sails generate scaffold user find create update
    // then `scope.args` would be `['user', 'find', 'create', 'update']`
    if (!scope.args[0]) {
      return cb( new TypeError('Please provide a name for this scaffold.') );
    }

    // scope.rootPath is the base path for this generator
    //
    // e.g. if this generator specified the target:
    // './Foobar.md': { copy: 'Foobar.md' }
    //
    // And someone ran this generator from `/Users/dbowie/sailsStuff`,
    // then `/Users/dbowie/sailsStuff/Foobar.md` would be created.
    if (!scope.rootPath) {
      return cb(INVALID_SCOPE_VARIABLE('rootPath') );
    }

    // Attach defaults
    _.defaults(scope, {

      // $sails generate scaffold user  --> id returns User
      id: scope.args,

      // $sails generate scaffold user  --> modelControllerName returns user
      modelControllerName: scope.args[0],

      actions: []
    });

    lib.indexViewTemplate.generate(scope);
    lib.newViewTemplate.generate(scope);
    lib.editViewTemplate.generate(scope);
    lib.showViewTemplate.generate(scope);
    lib.actionTemplate.generate(scope);

    // This generates a template using the homePageEJS.template located in scaffold/templates
    var HOMEPAGE_EJS_TEMPLATE = path.resolve(__dirname, './templates/homePageEJS.template');
    HOMEPAGE_EJS_TEMPLATE = fs.readFileSync(HOMEPAGE_EJS_TEMPLATE, 'utf8');

    var compiledHomePageEJS = _.template(HOMEPAGE_EJS_TEMPLATE, {});  

    // This puts erb style delimeters 
    compiledHomePageEJS = compiledHomePageEJS
      .replace(/ERBstart=/g, '<%=')
      .replace(/ERBstart/g, '<%')
      .replace(/ERBend/g, '%>');

    _.defaults(scope, {
      compiledHomePageEJS: compiledHomePageEJS
    });   

    // When finished, we trigger a callback with no error
    // to begin generating files/folders as specified by
    // the `targets` below.
    cb();
  },

  /**
   * The files/folders to generate.
   * @type {Object}
   */
  targets: {
    // Usage:
    // './path/to/destination.foo': { someHelper: opts }

    // Build up the model and controller files
    './': ['model', 'controller'],

    './assets/styles/custom.css': {template: {templatePath: 'customCSS.template', force: true } },
    './assets/styles/bootstrapScaffold.css': {template: {templatePath: 'bootstrapScaffoldCSS.template', force: true } },

    './views/homepage.ejs': {template: {templatePath: 'homePage.template', force: true } }, 
    './views/:id/new.ejs': {template: {templatePath: 'new.template', force: true } },
    './views/:id/show.ejs': {template: {templatePath: 'show.template', force: true } },
    './views/:id/index.ejs': {template: {templatePath: 'index.template', force: true } },
    './views/:id/edit.ejs': {template: {templatePath: 'edit.template', force: true } },

    './api/policies/flash.js': {template: {templatePath: 'flashPolicy.template', force: true} },

    './config/scaffold-policies.js': {template: {templatePath: 'policies.template', force: true} }    
  },

  /**
   * The absolute path to the `templates` for this generator
   * (for use with the `template` helper)
   *
   * @type {String}
   */
  templatesDirectory: path.resolve(__dirname, './templates')
};

/**
 * INVALID_SCOPE_VARIABLE()
 *
 * Helper method to put together a nice error about a missing or invalid
 * scope variable. We should always validate any required scope variables
 * to avoid inadvertently smashing someone's filesystem.
 *
 * @param {String} varname [the name of the missing/invalid scope variable]
 * @param {String} details [optional - additional details to display on the console]
 * @param {String} message [optional - override for the default message]
 * @return {Error}
 * @api private
 */
function INVALID_SCOPE_VARIABLE (varname, details, message) {
  var DEFAULT_MESSAGE = [
    'Issue encountered in generator "scaffolding":',
    'Missing required scope variable: `%s`',
    'If you are the author of `sails-scaffolding`, please resolve this issue and publish a new patch release.'
  ].join('\n');

  message = (message || DEFAULT_MESSAGE) + (details ? '\n'+details : '');
  message = util.inspect(message, varname);

  return new Error(message);
}
