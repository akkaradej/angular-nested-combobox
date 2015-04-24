'use strict';

angular.module('ui.nested.combobox', [])
    .controller('NestedComboboxController', [
            '$scope', '$element', '$attrs', 
            function ($scope, $element, $attrs) {

        var that = this,
            oldMemberId = null;
        this.isOpen = false;
        this.currentMember = $scope.currentMember;
        this.filterBy = $scope.filterBy || {};
        this.placeholder = $scope.placeholder;

        $scope.$watch('controlDisabled', function (value) {
            that.controlDisabled = value;
        });

        $(document).bind('click', function(event){
            if(that.isOpen){
                var isClickedThisElement = $element.find(event.target).length > 0;
                if(isClickedThisElement){
                    return;
                }
                $scope.$apply(function(){
                    that.isOpen = false;
                });
            }
        });

        this.toggleOpen = function () {

            if (that.controlDisabled === 'true') {
                this.isOpen.status = false;
                return false;
            }

            this.isOpen = !this.isOpen;
        };

        this.selectValue = function (event, member) {

            if (oldMemberId === member.id) {
                return true;
            }

            $scope.changeEvent(member);
            $scope.currentMember = that.currentMember = member;
            oldMemberId = member.id;
        };

    }])
    .directive('nestedComboBox', function () {
        return {
            restrict: 'E',
            controller: 'NestedComboboxController',
            controllerAs: 'gs',
            replace: true,
            templateUrl: 'template/select-group.html',
            scope: {
                collection: '=',
                currentMember: '=',
                controlClass: '@',
                controlDisabled: '@',
                changeEvent: '=',
                filterBy: '=',
                placeholder: '@'
            }
        };
    })
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('template/select-group.html',
        '<div class="custom-select"   data-ng-disabled="gs.controlDisabled==\'true\'" data-ng-class="controlClass" data-ng-click="gs.toggleOpen()">'+
            '<p>{{gs.currentMember.name || gs.placeholder}}</p>'+
            '<span><i class="icon-sort-down"></i></span>'+
            '<div class="list" data-ng-show="gs.isOpen">'+
                '<ul>'+
                    '<li data-ng-class="{\'active\':!gs.currentMember}" ng-init="member=\'\'" ng-if="gs.placeholder">'+
                        '<div class="sub">'+
                            '<div class="overlay"></div>'+
                            '<a data-ng-click="gs.selectValue(e,member)"><span>{{gs.placeholder}}</span></a>'+
                        '</div>'+
                    '</li>'+
                    '<li data-ng-class="{\'active\':gs.currentMember.id === member.id}" data-ng-include="\'template/sub-level.html\'" data-ng-repeat="member in collection | filter: gs.filterBy"> </li>'+
                '</ul>'+
            '</div>'+
        '</div>'
        );

        $templateCache.put('template/sub-level.html',
        '<div class="sub">'+
            '<div class="overlay"></div>'+
            '<a data-ng-click="gs.selectValue(e,member)"><span>{{member.name}}</span></a>'+
        '</div>'+
        '<ul>'+
            '<li data-ng-class="{\'active\':gs.currentMember.id === member.id}" ng-repeat="member in member.childrens | filter: gs.filterBy" ng-include="\'template/sub-level.html\'"></li>'+
        '</ul>'
        );
    }]);