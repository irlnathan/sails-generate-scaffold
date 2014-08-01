var _ = require('lodash');
var path = require('path');

exports.generate = function (scope) {

  // This generates a template using the actionParamObject.template located in scaffold/templates
  // to produce a the params to include.
  var ACTION_PARAM_OBJECT_TEMPLATE = path.resolve(__dirname, './templates/actionParamObject.template');
  ACTION_PARAM_OBJECT_TEMPLATE = fs.readFileSync(ACTION_PARAM_OBJECT_TEMPLATE, 'utf8');

  var compiledActionParamObject = _.template(ACTION_PARAM_OBJECT_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
  });

  // This generates a template using the actionUpdateParamObject.template
  var ACTION_UPDATE_PARAM_OBJECT_TEMPLATE = path.resolve(__dirname, './templates/actionUpdateParamObject.template');
  ACTION_UPDATE_PARAM_OBJECT_TEMPLATE = fs.readFileSync(ACTION_UPDATE_PARAM_OBJECT_TEMPLATE, 'utf8');

  var compiledActionUpdateParamObject = _.template(ACTION_UPDATE_PARAM_OBJECT_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
  });
  
  // This generates a template using the action.template located in scaffold/templates
  // combined with CRUD actions to produce a controller.
  var ACTION_TEMPLATE = path.resolve(__dirname, './templates/action.template');
  ACTION_TEMPLATE = fs.readFileSync(ACTION_TEMPLATE, 'utf8');

  var compiledActions = _.template(ACTION_TEMPLATE, {
      compiledActionParamObject: compiledActionParamObject,
      compiledActionUpdateParamObject: compiledActionUpdateParamObject,
      id: scope.id,
      modelControllerName: scope.modelControllerName,
  });

  scope.actionFns = [compiledActions];
};
