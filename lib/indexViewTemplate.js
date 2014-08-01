var _ = require('lodash');
var fs = require('fs');
var path = require('path');

exports.generate = function (scope) {
  // This generates the table index headings using indexTableHeadings.template located in scaffold./templates
  var INDEX_TABLE_HEADINGS_TEMPLATE = path.resolve(__dirname, '../templates/indexTableHeadings.template');
  INDEX_TABLE_HEADINGS_TEMPLATE = fs.readFileSync(INDEX_TABLE_HEADINGS_TEMPLATE, 'utf8');

  var compiledIndexTableHeadings = _.template(INDEX_TABLE_HEADINGS_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName
  });

  _.defaults(scope, {
      compiledIndexTableHeadings: compiledIndexTableHeadings
  });

  // This generates a template using the indexTableData.template located in scaffold./templates
  // combined with modelAttributeNames to create an index.ejs view
  var INDEX_TABLE_DATA_TEMPLATE = path.resolve(__dirname, '../templates/indexTableData.template');
  INDEX_TABLE_DATA_TEMPLATE = fs.readFileSync(INDEX_TABLE_DATA_TEMPLATE, 'utf8');

  var compiledIndexTableData = _.template(INDEX_TABLE_DATA_TEMPLATE, {
      modelAttributeNames: scope.modelAttributeNames,
      id: scope.id,
      modelControllerName: scope.modelControllerName,
      compiledIndexTableHeadings: scope.compiledIndexTableHeadings
  });

  // This puts erb style delimeters 
  compiledIndexTableData = compiledIndexTableData
    .replace(/ERBstart/g, '<%=')
    .replace(/ERBend/g, '%>');

  // Add the compiled show form fields to the scope
  _.defaults(scope, {
    compiledIndexTableData: compiledIndexTableData
  }); 

  // This generates the indexForEach template
  var INDEX_FOR_EACH_TEMPLATE = path.resolve(__dirname, '../templates/indexForEach.template');
  INDEX_FOR_EACH_TEMPLATE = fs.readFileSync(INDEX_FOR_EACH_TEMPLATE, 'utf8');

  var compiledIndexForEach = _.template(INDEX_FOR_EACH_TEMPLATE, {
    compiledIndexTableData: compiledIndexTableData,
    modelControllerName: scope.modelControllerName
  });

  // This puts erb style delimeters 
  compiledIndexForEach = compiledIndexForEach
    .replace(/ERBstart/g, '<%')
    .replace(/ERBend/g, '%>');

  _.defaults(scope, {
    compiledIndexForEach: compiledIndexForEach
  });
};
