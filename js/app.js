"use strict";

var App = angular.module('formApp',['ui.sortable']);

App.controller('formCtrl', function($scope) {
    $scope.form = [
        {id:0, order:0, label:'Quelles sont vos prétentions salariales ?', type:'text', numeric: true, required:false},

        {
            id:1, 
            order:1, 
            label:'Dans quelles régions êtes-vous mobile ?', 
            type:'list', 
            checkbox: true, 
            autocomplete: true, 
            required:true,
            options:[
                {id:0, order:0, label:"Ile-de-France", conditions:[]},
                {id:1, order:1, label:"Nord-Pas-de-Calais", conditions:[]},
                {id:2, order:2, label:"Rhône-Alpes", conditions:[]},
            ]
        },

        {
            id:2, 
            order:2, 
            label:'Dans quel département êtes-vous mobile ?', 
            type:'list', 
            checkbox: true, 
            autocomplete: true, 
            required:true, 
            conditions: [
                {
                    id: 1,
                    label: 'Dans quelles régions êtes-vous mobile ?',
                    answers:[
                        {id: 0, label:"Ile-de-France"},
                        {id: 1, label:"Nord-Pas-de-Calais"}
                    ]
                },
            ], 
            options:[
                {
                    id:0, 
                    order:0, 
                    label:"Nord", 
                    conditions:[
                        {
                            id: 1,
                            label: 'Dans quelles régions êtes-vous mobile ?',
                            answers:[
                                {id: 1, label:"Nord-Pas-de-Calais"}
                            ]
                        }
                    ]
                },
                {
                    id:1, 
                    order:1, 
                    label:"Pas-de-Calais", 
                    conditions:[
                        {
                            id: 1,
                            label: 'Dans quelles régions êtes-vous mobile ?',
                            answers:[
                                {id: 1, label:"Nord-Pas-de-Calais"}
                            ]
                        }
                    ]
                },
            ]
        },
        // {id:3, order:3, label:'Quel est le secteur qui vous intéresse ?', type:'text', required:true, options:[]},
        // {id:4, order:4, label:'Quand êtes-vous disponible ?', type:'date', nextmonth:true, required:true, options:[]}
    ];

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

    $scope.deleteQuestion = function(question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var index = $scope.form.indexOf(question);
                $scope.form.splice(index, 1);
            }
        });
    };

    $scope.addQuestionCondition = function(question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].conditions.push({
                    id: '',
                    label: '',
                    answers: []
                });
            }
        });
    };

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

    $scope.updateQuestionConditionAnswers = function(question_id, condition_index, answers) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                $scope.form[question_index].conditions[condition_index].answers = answers;
            }
        });
    }

    $scope.deleteQuestionCondition = function(question_id, condition_index) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var index = $scope.form.indexOf(question);
                $scope.form[question_id].conditions.splice(condition_index, 1);
            }
        });
    }

    $scope.addOption = function(question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                var new_option_id  = $scope.form[question_index].options.length;
                $scope.form[question_index].options.push({
                    id: new_option_id, 
                    order: new_option_id, 
                    label: this.label, 
                    conditions:[]
                });
                this.label = '';
            }
        });
    };

    $scope.deleteOption = function(question_id, option_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                angular.forEach($scope.form[question_index].options, function(option) {
                    if (option.id == option_id) {
                        var index = $scope.form[question_index].options.indexOf(option);
                        $scope.form[question_index].options.splice(index, 1);
                    }
                });
            }
        });
    };

    $scope.uncheckAllSubtypes = function($event, question_id) {
        angular.forEach($scope.form, function(question) {
            if (question.id == question_id) {
                var question_index = $scope.form.indexOf(question);
                var currentType = $event.currentTarget.value;
                if (currentType == 'text') {
                    delete $scope.form[question_index].nextmonth;
                    delete $scope.form[question_index].autocomplete;
                    delete $scope.form[question_index].checkbox;
                    $scope.form[question_index].autocomplete = false;
                    $scope.form[question_index].checkbox = false;
                } else if (currentType == 'date') {
                    delete $scope.form[question_index].numeric;
                    delete $scope.form[question_index].autocomplete;
                    delete $scope.form[question_index].checkbox;
                    $scope.form[question_index].nextmonth = false;
                } else {
                    delete $scope.form[question_index].nextmonth;
                    delete $scope.form[question_index].numeric;
                    $scope.form[question_index].options = [];
                }
            }
        });
    }

});
