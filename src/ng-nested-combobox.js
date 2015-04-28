'use strict';

angular.module('ui.nested.combobox', [])
    .controller('NestedComboboxController', [
            '$scope', '$element', '$attrs', 
            function ($scope, $element, $attrs) {

        var vm = this;
        var oldMember = null;

        vm.isOpen = false;
        vm.currentMember = $scope.currentMember;
        vm.filterBy = $scope.filterBy || {};
        vm.placeholder = $scope.placeholder;
        vm.toggleOpen = toggleOpen;
        vm.selectValue = selectValue;

        _trackControlDisabled();
        _setOnClickOutside();

        function _trackControlDisabled(){
            $scope.$watch('controlDisabled', function (value) {
                vm.controlDisabled = value;
            });
        }

        function _setOnClickOutside(){
            $(document).bind('click', function(event){
                if(vm.isOpen){
                    var isClickedvmElement = $element.find(event.target).length > 0;
                    if(isClickedvmElement){
                        return;
                    }
                    $scope.$apply(function(){
                        vm.isOpen = false;
                    });
                }
            });
        }

        function toggleOpen() {
            if(vm.controlDisabled === 'true') {
                vm.isOpen.status = false;
                return false;
            }
            vm.isOpen = !vm.isOpen;
        };

        function selectValue(event, member) {
            if (oldMember == member) {
                return true;
            }
            $scope.changeEvent(member, oldMember || vm.currentMember);
            $scope.currentMember = vm.currentMember = member;
            oldMember = member;
        };

    }])

    .directive('nestedComboBox', function () {
        return {
            restrict: 'E',
            controller: 'NestedComboboxController',
            controllerAs: 'vm',
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
        '<div class="custom-select"   data-ng-disabled="vm.controlDisabled==\'true\'" data-ng-class="controlClass" data-ng-click="vm.toggleOpen()">'+
            '<p>{{vm.currentMember.name || vm.placeholder}}</p>'+
            '<span><i class="icon-sort-down"></i></span>'+
            '<div class="list" data-ng-show="vm.isOpen">'+
                '<ul>'+
                    '<li data-ng-class="{\'active\':!vm.currentMember}" ng-init="member=\'\'" ng-if="vm.placeholder">'+
                        '<div class="node">'+
                            '<div class="overlay"></div>'+
                            '<a data-ng-click="vm.selectValue(e,member)"><span>{{vm.placeholder}}</span></a>'+
                        '</div>'+
                    '</li>'+
                    '<li class="root-level" data-ng-class="{\'active\':vm.currentMember.id === member.id}" data-ng-repeat="member in collection | filter: vm.filterBy">'+
                        '<div class="node">'+
                            '<div class="overlay"></div>'+
                            '<a data-ng-click="vm.selectValue(e,member)"><span>{{member.name}}</span></a>'+
                        '</div>'+
                        '<ul data-ng-include="\'template/sub-level.html\'"></ul>'+
                    '</li>'+
                '</ul>'+
            '</div>'+
        '</div>'
        );

        $templateCache.put('template/sub-level.html',
        '<li class="sub-level" data-ng-class="{\'active\':vm.currentMember.id === member.id}" ng-repeat="member in member.childrens | filter: vm.filterBy">'+
            '<div class="node">'+
                '<div class="overlay"></div>'+
                '<a data-ng-click="vm.selectValue(e,member)"><span>└ {{member.name}}</span></a>'+
            '</div>'+
            '<div data-ng-include="\'template/sub-level.html\'"></div>'+
        '</li>'
        );
    }]);