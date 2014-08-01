exports.generate = function (scope) {

  // This generates a template using the newFormFields.template located in scaffold/templates
  // combined with modelAttributeNames to produce form fields for the new view derived from the model attributes
  var NEW_FORM_FIELDS_TEMPLATE = path.resolve(__dirname, './templates/newFormFields.template');
  NEW_FORM_FIELDS_TEMPLATE = fs.readFileSync(NEW_FORM_FIELDS_TEMPLATE, 'utf8');

  var compiledNewFormFields = _.template(NEW_FORM_FIELDS_TEMPLATE, {
    modelAttributeNames: scope.modelAttributeNames,
    id: scope.id,
    modelControllerName: scope.modelControllerName
  });

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
  });

  // This puts erb style delimeters 
  compiledNewFlash = compiledNewFlash.replace(/ERBstart/g, '<%');
  compiledNewFlash = compiledNewFlash.replace(/ERBend/g, '%>');

  // Add the compiled show form fields to the scope
  _.defaults(scope, {
    compiledNewFlash: compiledNewFlash
  });
};
