exports.generate = function (scope) {
  // This generates the editFormFields template
  var EDIT_FORM_FIELDS_TEMPLATE = path.resolve(__dirname, './templates/editFormFields.template');
  EDIT_FORM_FIELDS_TEMPLATE = fs.readFileSync(EDIT_FORM_FIELDS_TEMPLATE, 'utf8');

  var compiledEditFormFields = _.template(EDIT_FORM_FIELDS_TEMPLATE, {
    modelAttributeNames: scope.modelAttributeNames,
    modelControllerName: scope.modelControllerName
  });

  // This puts erb style delimeters 
  compiledEditFormFields = compiledEditFormFields.replace(/ERBstart/g, '<%=');
  compiledEditFormFields = compiledEditFormFields.replace(/ERBend/g, '%>');

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
  });

  // This puts erb style delimeters 
  compiledEditFlash = compiledEditFlash.replace(/ERBstart/g, '<%');
  compiledEditFlash = compiledEditFlash.replace(/ERBend/g, '%>');

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
  compiledEditFormAction = compiledEditFormAction.replace(/ERBstart/g, '<%=');
  compiledEditFormAction = compiledEditFormAction.replace(/ERBend/g, '%>');

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
  });

  // This puts erb style delimeters 
  compiledEditShowLink = compiledEditShowLink.replace(/ERBstart/g, '<%=');
  compiledEditShowLink = compiledEditShowLink.replace(/ERBend/g, '%>');

  _.defaults(scope, {
    compiledEditShowLink: compiledEditShowLink
  });  

};
