(function() {

  'use strict';

  /**
   * Controllers
   */

  angular.module('app').controller('simpleController', function($scope) {

    /**
     * Metawidget config.
     */

    var _tableLayout = new metawidget.layout.HeadingTagLayoutDecorator({
      delegate: new metawidget.layout.TableLayout({
        tableStyleClass: "table-form",
        columnStyleClasses: ["table-label-column", "table-component-column", "table-required-column"],
        footerStyleClass: "buttons"
      })
    });

    $scope.metawidgetConfigM = {




      /**
       * Use JSON Schema to display mother part.
       * There are three elements, including name, address, and city.
       */

      inspector: new metawidget.inspector.JsonSchemaInspector( {
        properties: {
          name: {
            type: 'string',
            placeholder: 'Please enter the name',
            required: true
          },
          address: {
            type: 'string',
            placeholder: 'Please enter the address',
          },
          city: {
            type: 'string',
            placeholder: 'Please enter the city'
          }
        }
      } ),


      /**
       * instantiate the custom directive by custom WidgetBuilder .
       */

      widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder([

        function(elementName, attributes, mw) {

          // Editable tables

          if (attributes.type === 'array' && !metawidget.util.isTrueOrTrueString(attributes.readOnly)) {

            var typeAndNames = metawidget.util.splitPath(mw.path);

            if (typeAndNames.names === undefined) {
              typeAndNames.names = [];
            }

            if( elementName === 'property' ) {
              typeAndNames.names.push(attributes.name);
            }

            typeAndNames.names.push('0');

            var inspectionResult = mw.inspect(mw.toInspect, typeAndNames.type, typeAndNames.names);
            var inspectionResultProperties = metawidget.util.getSortedInspectionResultProperties(inspectionResult);
            var columns = '';
            var columnsLabel = '';

            for (var loop = 0, length = inspectionResultProperties.length; loop < length; loop++) {

              var columnAttribute = inspectionResultProperties[loop];



              if (metawidget.util.isTrueOrTrueString(columnAttribute.hidden)) {
                continue;
              }

              if (columns !== '') {
                columns += ',';
              }
              columns += columnAttribute.name;
              columnsLabel += columnAttribute.label;
            }

            $scope.rowSchemaId = $scope.rowSchemaId || 0;
            $scope.rowSchemaId++;
            var rowSchemaKey = 'rowSchema' + $scope.rowSchemaId;
            $scope[rowSchemaKey] = inspectionResult;

            var newPath = mw.path;

            if( elementName === 'property' ) {
              newPath += attributes.name;
            }

            var widget = $('<table>').attr('edit-table', '').attr('columns', columns).attr('ng-model', newPath).attr('schema', rowSchemaKey);
            return widget[0];
          }
        },
        new metawidget.widgetbuilder.HtmlWidgetBuilder()
      ]),
      addWidgetProcessors: [new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor()],
      layout: _tableLayout


    }

    $scope.metawidgetConfigC = {




      /**
       * Use JSON Schema to describe an array's metadata even though it's empty.
       * Each child's name and age will be recorded.
       */

      inspector: new metawidget.inspector.JsonSchemaInspector({
        type: 'array',
        items: {
          properties: {
            name: {
              type: 'string',
              label: "Name",
              placeholder: "Please enter the name"
            },
            age: {
              type: 'number',
              label: "Age",
              placeholder: "Please enter the age"
            }
          }
        }
      }),


      /**
       * instantiate the custom directive by custom WidgetBuilder .
       */

      widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder([

        function(elementName, attributes, mw) {

          // Editable tables

          if (attributes.type === 'array' && !metawidget.util.isTrueOrTrueString(attributes.readOnly)) {

            var typeAndNames = metawidget.util.splitPath(mw.path);

            if (typeAndNames.names === undefined) {
              typeAndNames.names = [];
            }

            if( elementName === 'property' ) {
              typeAndNames.names.push(attributes.name);
            }
            typeAndNames.names.push('0');

            var inspectionResult = mw.inspect(mw.toInspect, typeAndNames.type, typeAndNames.names);
            var inspectionResultProperties = metawidget.util.getSortedInspectionResultProperties(inspectionResult);
            var columns = '';
            var columnsLabel = '';

            for (var loop = 0, length = inspectionResultProperties.length; loop < length; loop++) {

              var columnAttribute = inspectionResultProperties[loop];



              if (metawidget.util.isTrueOrTrueString(columnAttribute.hidden)) {
                continue;
              }

              if (columns !== '') {
                columns += ',';
              }
              columns += columnAttribute.name;
              columnsLabel += columnAttribute.label;
            }

            $scope.rowSchemaId = $scope.rowSchemaId || 0;
            $scope.rowSchemaId++;
            var rowSchemaKey = 'rowSchema' + $scope.rowSchemaId;
            $scope[rowSchemaKey] = inspectionResult;

            var newPath = mw.path;

            if( elementName === 'property' ) {
              newPath += attributes.name;
            }

            var widget = $('<table>').attr('edit-table', '').attr('columns', columns).attr('ng-model', newPath).attr('schema', rowSchemaKey);
            return widget[0];
          }
        },
        new metawidget.widgetbuilder.HtmlWidgetBuilder()
      ]),
      addWidgetProcessors: [new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor()],
      layout: _tableLayout


    }

    /**
     * this is the way to display mother and children
     */
    $scope.save = function() {
      //display mother's information
      console.log("Mother: ");
      console.log("\tName: " + $scope.mother.name)
      console.log("\tAddress: " + $scope.mother.address)
      console.log("\tCity: " + $scope.mother.city)

      //traverse children
      var len = $scope.children.length;

      for (var i = 0; i < len; i++) {
        console.log("\tChild " + (i + 1) + ": ")
        console.log("\t\tName: " + $scope.children[i].name)
        console.log("\t\tAge: " + $scope.children[i].age)
      }
    }

    /**
     * init children's model
     * @type {[{}]}
     */
    $scope.children = [{}];

    //THIS IS A WORKAROUND - ADDING MY JSON RESULT TO AN OBJECT FORMATTED LIKE METAWIDGET EXPECTS
    $scope.readOnly = true;
  });
})();