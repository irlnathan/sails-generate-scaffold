exports.generate = function (scope) {

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

};
