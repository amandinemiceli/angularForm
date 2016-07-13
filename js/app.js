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
        {id:4, order:4, label:'Quand êtes-vous disponible ?', type:'date', nextmonth:true, required:true, options:[]}
    ];

    $scope.addQuestion = function() {
        var id = $scope.form.length;
        $scope.form.push({id: id, order: id, label: $scope.label, type: 'list', required: true, options: []});
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

    $scope.addCondition = function(question_id) {
        console.log(question_id);
    };

    $scope.$watch('country', function(newVal) {
        if (newVal) $scope.cities = ['Los Angeles', 'San Francisco'];
    });
    $scope.$watch('city', function(newVal) {
        if (newVal) $scope.suburbs = ['SOMA', 'Richmond', 'Sunset'];
    });

    $scope.addOption = function(question_id) {
        var new_option_id = $scope.form[question_id].options.length;
        var option_obj    = {id: new_option_id, order: new_option_id, label: this.label, conditions:[]};
        $scope.form[question_id].options.push(option_obj);
        this.label = '';
    };

    $scope.deleteOption = function(question_id, option_id) {
        angular.forEach($scope.form[question_id].options, function(option) {
            if (option.id == option_id) {
                var index = $scope.form[question_id].options.indexOf(option);
                $scope.form[question_id].options.splice(index, 1);
            }
        });
    };

    $scope.uncheckAllSubtypes = function($event, question_id) {
        var currentType = $event.currentTarget.value;
        if (currentType == 'text') {
            delete $scope.form[question_id].nextmonth;
            delete $scope.form[question_id].autocomplete;
            delete $scope.form[question_id].checkbox;
            $scope.form[question_id].autocomplete = false;
            $scope.form[question_id].checkbox = false;
        } else if (currentType == 'date') {
            delete $scope.form[question_id].numeric;
            delete $scope.form[question_id].autocomplete;
            delete $scope.form[question_id].checkbox;
            $scope.form[question_id].nextmonth = false;
        } else {
            delete $scope.form[question_id].nextmonth;
            delete $scope.form[question_id].numeric;
            $scope.form[question_id].options = [];
        }
    }

    // form.archive = function() {
    //     var oldTodos = form.questions;
    //     form.questions = [];
    //     angular.forEach(oldTodos, function(todo) {
    //         if (!todo.done) form.questions.push(todo);
    //     });
    // };

    // form.sortQuestion = {
    //     containment : "parent",//Dont let the user drag outside the parent
    //     cursor : "move",//Change the cursor icon on drag
    //     tolerance : "pointer"//Read http://api.jqueryui.com/sortable/#option-tolerance
    // };

    // var elem = document.querySelector('.js-switch');
    // var init = new Switchery(elem);
});
