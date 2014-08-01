exports.generate = function (scope) {

  // This generates a template using the showFormFields.template located in scaffold/templates
  // combined with modelAttributeNames to produce form fields for the show view derived from the model attributes
  var SHOW_FORM_FIELDS_TEMPLATE = path.resolve(__dirname, './templates/showFormFields.template');
  SHOW_FORM_FIELDS_TEMPLATE = fs.readFileSync(SHOW_FORM_FIELDS_TEMPLATE, 'utf8');

  var compiledShowFormFields = _.template(SHOW_FORM_FIELDS_TEMPLATE, {
    modelAttributeNames: scope.modelAttributeNames,
    id: scope.id,
    modelControllerName: scope.modelControllerName
  });

  // This puts erb style delimeters 
  compiledShowFormFields = compiledShowFormFields.replace(/ERBstart/g, '<%=');
  compiledShowFormFields = compiledShowFormFields.replace(/ERBend/g, '%>');

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
  });

  // This puts erb style delimeters 
  compiledShowEditLink = compiledShowEditLink.replace(/ERBstart/g, '<%=');
  compiledShowEditLink = compiledShowEditLink.replace(/ERBend/g, '%>');

  _.defaults(scope, {
    compiledShowEditLink: compiledShowEditLink
  });
};
