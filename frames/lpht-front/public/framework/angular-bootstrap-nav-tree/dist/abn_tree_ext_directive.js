'use strict';
angular.module('angularBootstrapNavTreeExt',['angularBootstrapNavTree']).config(['$provide', function($provide) {
  $provide.decorator('abnTreeDirective', function($delegate) {
    var directive = $delegate[0];
    directive.template = "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">\n  <li ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\" ng-animate=\"'abn-tree-animate'\" ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'') + ' ' +row.classes.join(' ')\" class=\"abn-tree-row\"><a ng-click=\"user_clicks_branch(row.branch)\"><i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon\"> </i><span class=\"indented tree-label\" ng-bind-html=\"row.label\"> </span></a></li>\n</ul>";
    return $delegate;
  });
}]);
