"use strict";

var App = angular.module('formApp',['ui.sortable']);

App.directive('groupedOptions', function() {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModel) {
            
            scope.$watch(
                function() {
                    console.log(ngModel);
                    return ngModel.$modelValue;
                }, function(newValue, oldValue){
                    var value = ngModel.$modelValue;
                    if (value instanceof Array) {
                        return;
                    }
                    var valueArr = value ? value.split('\n') : value;
                    if (!valueArr) {
                        return;
                    }
                    for (var i = 0; i < valueArr.length; i++) {
                        if (valueArr[i]){
                            valueArr[i] = {
                                id: '',
                                order: i,
                                label:  valueArr[i],
                                conditions: [],
                            }
                        }
                    }

                    var labels = [];
                    angular.forEach(ngModel.$modelValue, function(label) {
                        labels.push(label.label);
                    });
                    var result = labels;
                    ngModel.$setViewValue(result);

                    // function toUser(array) {                        
                    //     return array.join("\n");
                    // }

                    // ngModel.$parsers.push(result);
                    // ngModel.$formatters.push(toUser);
                }, true);


            // scope.$watch(
            //     function() {
            //         // var labels = [];
            //         // angular.forEach(ngModel.$modelValue, function(label) {
            //         //     labels.push(label.label);
            //         // });
            //         return ngModel.$modelValue;
            //     }, function(newValue, oldValue){
            //         var value = ngModel.$modelValue;
            //         if (value instanceof Array) {
            //             return;
            //         }
            //         var valueArr = value ? value.split('\n') : value;
            //         if (!valueArr) {
            //             return;
            //         }
            //         for (var i = 0; i < valueArr.length; i++) {
            //             if (valueArr[i]){
            //                 valueArr[i] = {
            //                     id: '',
            //                     order: i,
            //                     label:  valueArr[i],
            //                     conditions: [],
            //                 }
            //             }
            //         }
            //         var result = valueArr;
            //         ngModel.$setViewValue(result);
                // }, true);
        }
    }
});

App.controller('formCtrl', function($scope) {
    $scope.form = [
        { 
            id: 56, 
            order: 1, 
            label:'Quelles sont vos prétentions salariales ?', 
            type: 'text', 
            numeric: true, 
            required:false
        },

        {
            id: 25, 
            order: 2, 
            label:'Dans quelles régions êtes-vous mobile ?', 
            type: 'list', 
            checkbox: true, 
            autocomplete: false, 
            required: true,
            options:[
                {
                    id: 6, 
                    order: 1, 
                    label:"Ile-de-France", 
                    conditions: []
                },
                {
                    id: 9, 
                    order: 2, 
                    label: "Nord-Pas-de-Calais", 
                    conditions: []
                },
                {
                    id: 43, 
                    order: 3, 
                    label:"Rhône-Alpes", 
                    conditions: []
                },
            ]
        },

        {
            id: 12, 
            order: 3, 
            label: 'Dans quel département êtes-vous mobile ?', 
            type: 'list', 
            checkbox: true, 
            autocomplete: false, 
            required: true, 
            conditions: [
                {
                    id: 25,
                    label: 'Dans quelles régions êtes-vous mobile ?',
                    answers:[
                        {id: 6, label:"Ile-de-France"},
                        {id: 9, label:"Nord-Pas-de-Calais"}
                    ]
                },
            ], 
            options:[
                {
                    id: 3, 
                    order: 1, 
                    label:"Nord", 
                    conditions:[
                        {
                            id: 25,
                            label: 'Dans quelles régions êtes-vous mobile ?',
                            answers:[
                                {id: 9, label: "Nord-Pas-de-Calais"}
                            ]
                        }
                    ]
                },
                {
                    id: 5, 
                    order: 2, 
                    label:"Pas-de-Calais", 
                    conditions:[
                        {
                            id: 25,
                            label: 'Dans quelles régions êtes-vous mobile ?',
                            answers:[
                                {id: 9, label: "Nord-Pas-de-Calais"}
                            ]
                        }
                    ]
                },
            ]
        },

        {
            id: 16, 
            order: 4, 
            label: 'Quand êtes-vous disponible ?', 
            type: 'date', 
            nextmonth: true, 
            required: true, 
            options: []
        }
    ];

    $scope.optionLabels = function(question_id) {
        var optionsTextarea = [];
        angular.forEach($scope.form, function(question) {
            if (question_id == question.id) {
                angular.forEach(question.options, function(option) {
                    var new_option = { id: option.id, order: option.order, label: option.label, conditions: option.conditions };
                    // optionsTextarea.push(option.label);
                    optionsTextarea.push(new_option);
                });
            }
        });
        return optionsTextarea;
    }

    ///////////////////////////////////
    // Get index by object attribute //
    ///////////////////////////////////
    $scope.findByAttr = function(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
    }

    ///////////////////////////////////////////////
    // Only keep list type questions for selects //
    ///////////////////////////////////////////////
    $scope.onlyListQuestions = function() {
        var formSelect = [];
        angular.forEach($scope.form, function(question) {
            if (question.type == 'list') {
                formSelect.push(question);
            }
        });
        return formSelect;
    }

    ////////////////////
    // Add a question //
    ////////////////////
    $scope.addQuestion = function() {
        var id = $scope.form.length;
        $scope.form.push({
            id: id, 
            order: id, 
            label: '', 
            type: '', 
            required: true, 
            options: []
        });
        $scope.label = '';
    };

    ///////////////////////
    // Delete a question //
    ///////////////////////
    $scope.deleteQuestion = function(question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var index = $scope.form.indexOf(question);
                $scope.form.splice(index, 1);
            }
        });
    };

    ///////////////////////////////
    // Update the question type  //
    ///////////////////////////////
    $scope.uncheckAllSubtypes = function($event, question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                var currentType = $event.currentTarget.value;
                
                if (currentType == 'text') {
                    // remove other types attributes from the question object
                    delete $scope.form[question_index].nextmonth;
                    delete $scope.form[question_index].autocomplete;
                    delete $scope.form[question_index].checkbox;

                    // remove options
                    delete $scope.form[question_index].options;
                    
                    // add autocomplete and checkbox attributes with default value to false
                    $scope.form[question_index].autocomplete = false;
                    $scope.form[question_index].checkbox     = false;

                } else if (currentType == 'date') {
                    // remove other types attributes from the question object
                    delete $scope.form[question_index].numeric;
                    delete $scope.form[question_index].autocomplete;
                    delete $scope.form[question_index].checkbox;

                    // remove options
                    delete $scope.form[question_index].options;

                    // add nextmonth attribute with default value to false
                    $scope.form[question_index].nextmonth = false;

                } else {
                    // remove other types attributes from the question object
                    delete $scope.form[question_index].nextmonth;
                    delete $scope.form[question_index].numeric;

                    // add empty array of options
                    $scope.form[question_index].options = [];
                }
            }
        });
    }

    //////////////////////////////
    // Add a question condition //
    //////////////////////////////
    $scope.addQuestionCondition = function(question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                if (!$scope.form[question_index].conditions) {
                    $scope.form[question_index].conditions = [];
                }
                $scope.form[question_index].conditions.push({
                    id: '',
                    label: '',
                    answers: []
                });
            }
        });
    };

    /////////////////////////////////
    // Delete a question condition //
    /////////////////////////////////
    $scope.deleteQuestionCondition = function(question_id, condition_index) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].conditions.splice(condition_index, 1);
            }
        });
    }
    
    //////////////////////////////////////////
    // Update a question condition question //
    //////////////////////////////////////////
    $scope.updateQuestionCondition = function(question_id, condition_index, condition) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].conditions[condition_index].id      = condition.id;
                $scope.form[question_index].conditions[condition_index].label   = condition.label;
                $scope.form[question_index].conditions[condition_index].answers = [];
            }
        });
    }

    ////////////////////////////////////////
    // Update question conditions answers //
    ////////////////////////////////////////
    $scope.updateQuestionConditionAnswers = function(question_id, condition_index, condition_answers) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);

                // remove attributes from the object we don't need
                angular.forEach(condition_answers, function(condition_answer) {
                    delete condition_answer.order;
                    delete condition_answer.conditions;
                });
                
                $scope.form[question_index].conditions[condition_index].answers = condition_answers;
            }
        });
    }

    ///////////////////
    // Add an option //
    ///////////////////
    $scope.addOption = function(question_id, option) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                var option_index   = $scope.form[question_index].options.length;
                $scope.form[question_index].options.push({
                    id: option_index, 
                    order: option_index, 
                    label: option.label, 
                    conditions: []
                });
                option.label = '';
            }
        });
    };

    //////////////////////
    // Delete an option //
    //////////////////////
    $scope.deleteOption = function(question_id, option_index) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].options.splice(option_index, 1);
            }
        });
    };

    //////////////////////////////
    // Add an option condition  //
    //////////////////////////////
    $scope.addOptionCondition = function(question_id, option_index) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                if (!$scope.form[question_index].options[option_index].conditions) {
                    $scope.form[question_index].options[option_index].conditions = [];
                }
                $scope.form[question_index].options[option_index].conditions.push({
                    id: '',
                    label: '',
                });
            }
        });
    };

    ////////////////////////////////
    // Delete an option condition //
    ////////////////////////////////
    $scope.deleteOptionCondition = function(question_id, option_index, option_condition_index) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].options[option_index].conditions.splice(option_condition_index, 1);
            }
        });
    }

    /////////////////////////////////////////
    // Update an option condition question //
    /////////////////////////////////////////
    $scope.updateOptionCondition = function(question_id, option_index, option_condition_index, option_condition) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].options[option_index].conditions[option_condition_index].id    = option_condition.id;
                $scope.form[question_index].options[option_index].conditions[option_condition_index].label = option_condition.label;
                $scope.form[question_index].options[option_index].conditions[option_condition_index].answers = [];
            }
        });
    }

    /////////////////////////////////////
    // Update option condition answers //
    /////////////////////////////////////
    $scope.updateOptionConditionAnswers = function(question_id, option_index, option_condition_index, option_condition_answers) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                
                // remove attributes from the object we don't need
                angular.forEach(option_condition_answers, function(option_condition_answer) {
                    delete option_condition_answer.order;
                    delete option_condition_answer.conditions;
                });

                $scope.form[question_index].options[option_index].conditions[option_condition_index].answers = option_condition_answers;
            }
        });
    }


});
