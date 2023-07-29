import cloneDeep from '/node_modules/lodash-es/cloneDeep.js';
import concat from '/node_modules/lodash-es/concat.js';
import forEach from '/node_modules/lodash-es/forEach.js';
import maxBy from '/node_modules/lodash-es/maxBy.js';
import range from '/node_modules/lodash-es/range.js';
import uniq from '/node_modules/lodash-es/uniq.js';

var app = angular.module('revenueGroupApp', []);

app.controller('revenueGroupCtrl', function($scope) {
    $scope.revenueGroups = [];
    $scope.group = {
        name: '',
        description: '',
        special: false,
        rules: [],
        maxParameters: 0
    };
    $scope.fields = ["afff_sub_1", "afff_sub_2", "afff_sub_3", "afff_sub_4"];
    $scope.operators = ["is", "is not", "starts with", "ends with", "doesn't start with", "doesn't ends with", "contains", "doesn't contains"];
    
    //Form functions
    $scope.submitForm = function() {
        var group = {
            name: $scope.group.name,
            description: $scope.group.description,
            special: $scope.group.special,
            rules: [],
            maxParameters: 0
        };
    
        forEach($scope.group.rules, function(rule, index) {
            var formattedRule = {
              field: rule.field,
              operator: rule.operator,
              revenue: rule.revenue,
              ruleIndex: index + 1,
              parameters: cloneDeep(rule.parameters), // Copy the array to avoid reference issues
              allParameters: calculateAllParameters(rule.parameters)
            };
        
            group.rules = concat(group.rules, formattedRule)

            if (rule.parameters.length > group.maxParameters) {
                group.maxParameters = rule.parameters.length;
            }
        });
        $scope.revenueGroups = concat($scope.revenueGroups, group)
        $scope.group = {
            name: '',
            description: '',
            special: false,
            rules: [],
            maxParameters: 0
        };
        
        $scope.groupForm.$setPristine();
        $scope.groupForm.$setUntouched();
        $scope.resetForm();
    };

    $scope.resetForm = () => {
        $scope.group = {
            name: '',
            description: '',
            special: false,
            rules: [],
            maxParameters: 0
        };
        $scope.groupForm.$setPristine();
        $scope.groupForm.$setUntouched();
    };

    //Utilities
    $scope.getMaxParameters = function() {
        const maxParameters = maxBy($scope.revenueGroups, group => {
            return maxBy(group.rules, rule => rule.parameters.length).parameters.length;
        }).parameters.length;
    
        return range(maxParameters);
    };

    $scope.generateColumns = function(maxParameters) {
        return range(maxParameters);
    };

    function calculateAllParameters(parameters) {
        return uniq(parameters);
    }

    $scope.getParameterIndices = function (rule) {
        return range(rule.parameters.length);
    };

    //Add & delete functions
    $scope.addParameter = function (rule) {
        rule.parameters = concat(rule.parameters, '')
    };
    
    $scope.deleteParameter = function (rule, index) {
        rule.parameters.splice(index, 1);
    };

    $scope.addRule = function() {
        $scope.group.rules = concat($scope.group.rules, {
            ruleIndex: '',
            field: '',
            operator: '',
            parameters: [''],
            revenue: '',
            allParameters: []
        });
    }

    $scope.deleteRule = function(group, index) {
        group.rules.splice(index, 1);
    };

    $scope.deleteRules = function(index) {
        $scope.group.rules.splice(index, 1);
    };

    $scope.deleteRevenueGroup = function(index) {
        $scope.revenueGroups.splice(index, 1);
    };
});
