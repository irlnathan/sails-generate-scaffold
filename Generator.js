/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
_.defaults = require('merge-defaults');
_.str = require('underscore.string');

_.pluck = require('underscore').pluck;
my_template = _.template;
_.template = function(arg1, arg2) {
    return my_template(arg1)(arg2);
}

/**
 * sails-generate-scaffold
 *
 * Usage:
 * `sails generate scaffold`
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
      return cb( new Error('Please provide a name for this scaffold.') );
    }

    // scope.rootPath is the base path for this generator
    //
    // e.g. if this generator specified the target:
    // './Foobar.md': { copy: 'Foobar.md' }
    //
    // And someone ran this generator from `/Users/dbowie/sailsStuff`,
    // then `/Users/dbowie/sailsStuff/Foobar.md` would be created.
    if (!scope.rootPath) {
      return cb( INVALID_SCOPE_VARIABLE('rootPath') );
    }

    // Attach defaults
    _.defaults(scope, {

      // $sails generate scaffold user  --> id returns User
      id: _.str.capitalize(scope.args[0]),

      // $sails generate scaffold user  --> modelControllerName returns user
      modelControllerName: scope.args[0],

      actions: [],

      // $sails generate scaffold user  name:string email:email --> scope.args.slice(1) returns ['name:string','email:email']
      attributes: scope.args.slice(1)
    });

    //Get the optional model attributes and validate them
    var attributes = scope.attributes;
    var invalidAttributes = [];

    attributes = _.map(attributes, function(attribute, i) {

      var parts = attribute.split(':');

      if (parts[1] === undefined) parts[1] = 'string';

      // Handle invalidAttributes
      if (!parts[1] || !parts[0]) {
        invalidAttributes.push(
          'Invalid attribute notation:   "' + attribute + '"');
        return;
      }
      return {
        name: parts[0],
        type: parts[1]
      };

    });

    // Add the optional model attributes to the scope
    _.defaults(scope, {
      modelAttributes: attributes
    });

    // Pluck just the name values
    var modelAttributeNames = _.pluck(scope.modelAttributes, 'name');

    // Add the optional model attribute names to the scope
    _.defaults(scope, {
      modelAttributeNames: modelAttributeNames
    });   

/**

                    __      ___            _______                   _       _       
                    \ \    / (_)          |__   __|                 | |     | |      
  _ __   _____      _\ \  / / _  _____      _| | ___ _ __ ___  _ __ | | __ _| |_ ___ 
 | '_ \ / _ \ \ /\ / /\ \/ / | |/ _ \ \ /\ / / |/ _ \ '_ ` _ \| '_ \| |/ _` | __/ _ \
 | | | |  __/\ V  V /  \  /  | |  __/\ V  V /| |  __/ | | | | | |_) | | (_| | ||  __/
 |_| |_|\___| \_/\_/    \/   |_|\___| \_/\_/ |_|\___|_| |_| |_| .__/|_|\__,_|\__\___|
                                                              | |                    
                                                              |_|                    

**/                                          

    // This generates a template using the newFormFields.template located in scaffold/templates
    // combined with modelAttributeNames to produce form fields for the new view derived from the model attributes
    var NEW_FORM_FIELDS_TEMPLATE = path.resolve(__dirname, './templates/newFormFields.template');
    NEW_FORM_FIELDS_TEMPLATE = fs.readFileSync(NEW_FORM_FIELDS_TEMPLATE, 'utf8');

    var compiledNewFormFields = _.template(NEW_FORM_FIELDS_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
    })

    // Add the compiled new form fields to the scope
    _.defaults(scope, {
      compiledNewFormFields: compiledNewFormFields
    });    

    //This generates a template using newFlash.template
    var NEW_FLASH_TEMPLATE = path.resolve(__dirname, './templates/newFlash.template');
    NEW_FLASH_TEMPLATE = fs.readFileSync(NEW_FLASH_TEMPLATE, 'utf8'); 

    var compiledNewFlash = _.template(NEW_FLASH_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
    })

    // This puts erb style delimeters 
    compiledNewFlash = compiledNewFlash.replace(/ERBstart/g, '<%')
    compiledNewFlash = compiledNewFlash.replace(/ERBend/g, '%>')

    // Add the compiled show form fields to the scope
    _.defaults(scope, {
      compiledNewFlash: compiledNewFlash
    });

/**

      _                 __      ___            _______                   _       _       
     | |                \ \    / (_)          |__   __|                 | |     | |      
  ___| |__   _____      _\ \  / / _  _____      _| | ___ _ __ ___  _ __ | | __ _| |_ ___ 
 / __| '_ \ / _ \ \ /\ / /\ \/ / | |/ _ \ \ /\ / / |/ _ \ '_ ` _ \| '_ \| |/ _` | __/ _ \
 \__ \ | | | (_) \ V  V /  \  /  | |  __/\ V  V /| |  __/ | | | | | |_) | | (_| | ||  __/
 |___/_| |_|\___/ \_/\_/    \/   |_|\___| \_/\_/ |_|\___|_| |_| |_| .__/|_|\__,_|\__\___|
                                                                  | |                    
                                                                  |_|                    
**/     


    // This generates a template using the showFormFields.template located in scaffold/templates
    // combined with modelAttributeNames to produce form fields for the show view derived from the model attributes
    var SHOW_FORM_FIELDS_TEMPLATE = path.resolve(__dirname, './templates/showFormFields.template');
    SHOW_FORM_FIELDS_TEMPLATE = fs.readFileSync(SHOW_FORM_FIELDS_TEMPLATE, 'utf8');

    var compiledShowFormFields = _.template(SHOW_FORM_FIELDS_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
    })

    // This puts erb style delimeters 
    compiledShowFormFields = compiledShowFormFields.replace(/ERBstart/g, '<%=')
    compiledShowFormFields = compiledShowFormFields.replace(/ERBend/g, '%>')

    // Add the compiled show form fields to the scope
    _.defaults(scope, {
      compiledShowFormFields: compiledShowFormFields
    }); 

    // This generates a template using the showEditLink.template located in scaffold/templates
    var SHOW_EDIT_LINK_TEMPLATE = path.resolve(__dirname, './templates/showEditLink.template');
    SHOW_EDIT_LINK_TEMPLATE = fs.readFileSync(SHOW_EDIT_LINK_TEMPLATE, 'utf8');

    var compiledShowEditLink = _.template(SHOW_EDIT_LINK_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
    })

    // This puts erb style delimeters 
    compiledShowEditLink = compiledShowEditLink.replace(/ERBstart/g, '<%=')
    compiledShowEditLink = compiledShowEditLink.replace(/ERBend/g, '%>')

    _.defaults(scope, {
      compiledShowEditLink: compiledShowEditLink
    });

/**

  _           _         __      ___            _______                   _       _       
 (_)         | |        \ \    / (_)          |__   __|                 | |     | |      
  _ _ __   __| | _____  _\ \  / / _  _____      _| | ___ _ __ ___  _ __ | | __ _| |_ ___ 
 | | '_ \ / _` |/ _ \ \/ /\ \/ / | |/ _ \ \ /\ / / |/ _ \ '_ ` _ \| '_ \| |/ _` | __/ _ \
 | | | | | (_| |  __/>  <  \  /  | |  __/\ V  V /| |  __/ | | | | | |_) | | (_| | ||  __/
 |_|_| |_|\__,_|\___/_/\_\  \/   |_|\___| \_/\_/ |_|\___|_| |_| |_| .__/|_|\__,_|\__\___|
                                                                  | |                    
                                                                  |_|                                        
**/ 

    // This generates the table index headings using indexTableHeadings.template located in scaffold/templates
    var INDEX_TABLE_HEADINGS_TEMPLATE = path.resolve(__dirname, './templates/indexTableHeadings.template');
    INDEX_TABLE_HEADINGS_TEMPLATE = fs.readFileSync(INDEX_TABLE_HEADINGS_TEMPLATE, 'utf8');

    var compiledIndexTableHeadings = _.template(INDEX_TABLE_HEADINGS_TEMPLATE, {
        modelAttributeNames: scope.modelAttributeNames,
        id: scope.id,
        modelControllerName: scope.modelControllerName
    })

    _.defaults(scope, {
        compiledIndexTableHeadings: compiledIndexTableHeadings
    });

    // This generates a template using the indexTableData.template located in scaffold/templates
    // combined with modelAttributeNames to create an index.ejs view
    var INDEX_TABLE_DATA_TEMPLATE = path.resolve(__dirname, './templates/indexTableData.template');
    INDEX_TABLE_DATA_TEMPLATE = fs.readFileSync(INDEX_TABLE_DATA_TEMPLATE, 'utf8');

    var compiledIndexTableData = _.template(INDEX_TABLE_DATA_TEMPLATE, {
        modelAttributeNames: scope.modelAttributeNames,
        id: scope.id,
        modelControllerName: scope.modelControllerName,
        compiledIndexTableHeadings: scope.compiledIndexTableHeadings
    })


    _.defaults(scope, {
        modelControllerNamePluralized: scope.modelControllerName + 's'
    }); 

    // This puts erb style delimeters 
    compiledIndexTableData = compiledIndexTableData.replace(/ERBstart/g, '<%=')
    compiledIndexTableData = compiledIndexTableData.replace(/ERBend/g, '%>')

    // Add the compiled show form fields to the scope
    _.defaults(scope, {
      compiledIndexTableData: compiledIndexTableData
    }); 

    // This generates the indexForEach template
    var INDEX_FOR_EACH_TEMPLATE = path.resolve(__dirname, './templates/indexForEach.template');
    INDEX_FOR_EACH_TEMPLATE = fs.readFileSync(INDEX_FOR_EACH_TEMPLATE, 'utf8');

    var compiledIndexForEach = _.template(INDEX_FOR_EACH_TEMPLATE, {
      compiledIndexTableData: compiledIndexTableData,
      modelControllerNamePluralized: scope.modelControllerNamePluralized,
      modelControllerName: scope.modelControllerName
    });

    // This puts erb style delimeters 
    compiledIndexForEach = compiledIndexForEach.replace(/ERBstart/g, '<%')
    compiledIndexForEach = compiledIndexForEach.replace(/ERBend/g, '%>')

    _.defaults(scope, {
      compiledIndexForEach: compiledIndexForEach
    });

/**

           _ _ ___      ___            _______                   _       _       
          | (_) \ \    / (_)          |__   __|                 | |     | |      
   ___  __| |_| |\ \  / / _  _____      _| | ___ _ __ ___  _ __ | | __ _| |_ ___ 
  / _ \/ _` | | __\ \/ / | |/ _ \ \ /\ / / |/ _ \ '_ ` _ \| '_ \| |/ _` | __/ _ \
 |  __/ (_| | | |_ \  /  | |  __/\ V  V /| |  __/ | | | | | |_) | | (_| | ||  __/
  \___|\__,_|_|\__| \/   |_|\___| \_/\_/ |_|\___|_| |_| |_| .__/|_|\__,_|\__\___|
                                                          | |                    
                                                          |_|                    

**/ 

    // This generates the editFormFields template
    var EDIT_FORM_FIELDS_TEMPLATE = path.resolve(__dirname, './templates/editFormFields.template');
    EDIT_FORM_FIELDS_TEMPLATE = fs.readFileSync(EDIT_FORM_FIELDS_TEMPLATE, 'utf8');

    var compiledEditFormFields = _.template(EDIT_FORM_FIELDS_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      modelControllerName: scope.modelControllerName
    });

    // This puts erb style delimeters 
    compiledEditFormFields = compiledEditFormFields.replace(/ERBstart/g, '<%=')
    compiledEditFormFields = compiledEditFormFields.replace(/ERBend/g, '%>')

    _.defaults(scope, {
      compiledEditFormFields: compiledEditFormFields
    });

    //This generates a template using editFlash.template
    var EDIT_FLASH_TEMPLATE = path.resolve(__dirname, './templates/editFlash.template');
    EDIT_FLASH_TEMPLATE = fs.readFileSync(EDIT_FLASH_TEMPLATE, 'utf8'); 

    var compiledEditFlash = _.template(EDIT_FLASH_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
    })

    // This puts erb style delimeters 
    compiledEditFlash = compiledEditFlash.replace(/ERBstart/g, '<%')
    compiledEditFlash = compiledEditFlash.replace(/ERBend/g, '%>')

    // Add the compiled show form fields to the scope
    _.defaults(scope, {
      compiledEditFlash: compiledEditFlash
    });

    // This generates the editFormAction template
    var EDIT_FORM_ACTION_TEMPLATE = path.resolve(__dirname, './templates/editFormAction.template');
    EDIT_FORM_ACTION_TEMPLATE = fs.readFileSync(EDIT_FORM_ACTION_TEMPLATE, 'utf8');

    var compiledEditFormAction = _.template(EDIT_FORM_ACTION_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      modelControllerName: scope.modelControllerName
    });

    // This puts erb style delimeters 
    compiledEditFormAction = compiledEditFormAction.replace(/ERBstart/g, '<%=')
    compiledEditFormAction = compiledEditFormAction.replace(/ERBend/g, '%>')

    _.defaults(scope, {
      compiledEditFormAction: compiledEditFormAction
    }); 

    // This generates a template using the editShowLink.template located in scaffold/templates
    var EDIT_SHOW_LINK_TEMPLATE = path.resolve(__dirname, './templates/editShowLink.template');
    EDIT_SHOW_LINK_TEMPLATE = fs.readFileSync(EDIT_SHOW_LINK_TEMPLATE, 'utf8');

    var compiledEditShowLink = _.template(EDIT_SHOW_LINK_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
    })

    // This puts erb style delimeters 
    compiledEditShowLink = compiledEditShowLink.replace(/ERBstart/g, '<%=')
    compiledEditShowLink = compiledEditShowLink.replace(/ERBend/g, '%>')

    _.defaults(scope, {
      compiledEditShowLink: compiledEditShowLink
    });  

/**
             _   _          _______                   _       _       
            | | (_)        |__   __|                 | |     | |      
   __ _  ___| |_ _  ___  _ __ | | ___ _ __ ___  _ __ | | __ _| |_ ___ 
  / _` |/ __| __| |/ _ \| '_ \| |/ _ \ '_ ` _ \| '_ \| |/ _` | __/ _ \
 | (_| | (__| |_| | (_) | | | | |  __/ | | | | | |_) | | (_| | ||  __/
  \__,_|\___|\__|_|\___/|_| |_|_|\___|_| |_| |_| .__/|_|\__,_|\__\___|
                                               | |                    
                                               |_|                                                                                            
**/  

    // This generates a template using the actionParamObject.template located in scaffold/templates
    // to produce a the params to include.
    var ACTION_PARAM_OBJECT_TEMPLATE = path.resolve(__dirname, './templates/actionParamObject.template');
    ACTION_PARAM_OBJECT_TEMPLATE = fs.readFileSync(ACTION_PARAM_OBJECT_TEMPLATE, 'utf8');

    var compliledActionParamObject = _.template(ACTION_PARAM_OBJECT_TEMPLATE, {
        modelAttributeNames: scope.modelAttributeNames,
        id: scope.id,
        modelControllerName: scope.modelControllerName
    })  

    // This generates a template using the actionUpdateParamObject.template
    var ACTION_UPDATE_PARAM_OBJECT_TEMPLATE = path.resolve(__dirname, './templates/actionUpdateParamObject.template');
    ACTION_UPDATE_PARAM_OBJECT_TEMPLATE = fs.readFileSync(ACTION_UPDATE_PARAM_OBJECT_TEMPLATE, 'utf8');

    var compliledActionUpdateParamObject = _.template(ACTION_UPDATE_PARAM_OBJECT_TEMPLATE, {
        modelAttributeNames: scope.modelAttributeNames,
        id: scope.id,
        modelControllerName: scope.modelControllerName
    }) 

    
    // This generates a template using the action.template located in scaffold/templates
    // combined with CRUD actions to produce a controller.
    var ACTION_TEMPLATE = path.resolve(__dirname, './templates/action.template');
    ACTION_TEMPLATE = fs.readFileSync(ACTION_TEMPLATE, 'utf8');

    var compliledActions = _.template(ACTION_TEMPLATE, {
        compliledActionParamObject: compliledActionParamObject,
        compliledActionUpdateParamObject: compliledActionUpdateParamObject,
        id: scope.id,
        modelControllerName: scope.modelControllerName,
    })

    scope.actionFns = [compliledActions]

    // This generates a template using the homePageEJS.template located in scaffold/templates
    var HOMEPAGE_EJS_TEMPLATE = path.resolve(__dirname, './templates/homePageEJS.template');
    HOMEPAGE_EJS_TEMPLATE = fs.readFileSync(HOMEPAGE_EJS_TEMPLATE, 'utf8');

    var compliledHomePageEJS = _.template(HOMEPAGE_EJS_TEMPLATE, {});  

    // This puts erb style delimeters 
    compliledHomePageEJS = compliledHomePageEJS.replace(/ERBstart=/g, '<%=')
    compliledHomePageEJS = compliledHomePageEJS.replace(/ERBstart/g, '<%')
    compliledHomePageEJS = compliledHomePageEJS.replace(/ERBend/g, '%>')

    _.defaults(scope, {
      compliledHomePageEJS: compliledHomePageEJS
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
  templatesDirectory: require('path').resolve(__dirname, './templates')
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
  var DEFAULT_MESSAGE =
  'Issue encountered in generator "scaffold":\n'+
  'Missing required scope variable: `%s`"\n' +
  'If you are the author of `sails-generate-scaffold`, please resolve this '+
  'issue and publish a new patch release.';

  message = (message || DEFAULT_MESSAGE) + (details ? '\n'+details : '');
  message = util.inspect(message, varname);

  return new Error(message);
}
