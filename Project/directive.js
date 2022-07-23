( function() {

	'use strict';

	/**
	 * Angular directive for an editable table.
	 */
	angular.module( 'app' ).directive( 'editTable', [ '$compile', '$parse', '$http', function( $compile, $parse, $http ) {

        return {

            restrict: 'A',

            scope: {
                ngModel: '=',
                readOnly: '=',
                schema: '='
            },

            link: function (scope, element, attrs) {

            },

            compile: function( table, attrs ) {

                // postLink function
                return function( scope, table, attrs ) {

                    table.attr( 'class', 'table table-striped table-bordered table-hover' );
                    var columns = attrs.columns.split( ',' );

                    // thead
                    var tr = $( '<tr>' );
                    var thead = $( '<thead>' );
                    var tbody = $( '<tbody>' );
                    table.append( thead.append( tr ) );

                    for ( var loop = 0, length = columns.length; loop < length; loop++ ) {
                        var  col = columns[loop];
                        tr.append( $( '<th>' ).css( 'width', 100 / columns.length + '%' ).text( scope.schema.properties[col].label ) );
                    }

                    tr.append( $( '<th ng-show="!readOnly" style="width: 1%">' ) );

                    // tbody
                    var tr1 = $( '<tr ng-repeat="row in ngModel">' );
                    var tr2 = $( '<tr ng-show="!readOnly">' );

                    for ( var loop = 0, length = columns.length; loop < length; loop++ ) {

                        var columnMetawidget = $( '<metawidget ng-model="row.' + columns[loop] + '" config="metawidgetConfig">' );
                        tr1.append( $( '<td>' ).append( columnMetawidget ) );

                        if ( attrs.editTable !== 'add-only' ) {
                            var footerMetawidget = $( '<metawidget ng-model="newRow.' + columns[loop] + '" config="metawidgetConfig">' );
                            tr2.append( $( '<td>' ).append( footerMetawidget ) );
                        }
                    }

                    // When displaying Remove, that row could be removed. If that row is not removed, it will be displayed
                    tr1.append( $( '<td ng-show="!readOnly" class="pointer-on-hover" ng-click="remove( row )"><div><span style="color: red; font-size: 18px">&nbsp;Remove</span></div></td>' ) );

                    // When displaying Update, that row could be updated. If that row is not updated, it will not be displayed
                    tr2.append( $( '<td ng-show="!readOnly" class="pointer-on-hover" ng-click="add()"><div><span style="color: limegreen; font-size: 18px">&nbsp;Upload</span></div></td>' ) );

                    // Compile
                    scope.metawidgetConfig = {
                        inspector: new metawidget.inspector.JsonSchemaInspector( scope.schema ),
                        addWidgetProcessors: [ new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor() ],
                        layout: new metawidget.layout.SimpleLayout()
                    };

                    var tbody = $( '<tbody>' );
                    table.append( tbody.append( tr1 ).append( tr2 ) );
                    $compile( thead )( scope );
                    $compile( tbody )( scope );

                    // Internal model

                    scope.newRow = {};

                    scope.add = function() {

                        scope.ngModel.push( angular.copy( scope.newRow ) );
                        scope.newRow = {};
                    }

                    scope.remove = function( row ) {

                        scope.ngModel.splice( scope.ngModel.indexOf( row ), 1 );
                    }
                }
            }
        };
    } ] )
} )();