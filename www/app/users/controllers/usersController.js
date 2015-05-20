'use strict';
angular.module('userModule').controller('userController', ['$q', '$scope', 'userService', 'defaultValuesConstant', 'authService', 'actionTypes', 'projectService', 'rolesService', 'UserRoleProjectClientModel', function ($q, $scope, userService, defaults, authService, actionTypes, projectService, rolesService, UserRoleProjectClientModel) {
    $scope.userObj = {};
}]);
angular.module('userModule').controller('userDeleteController', ['$q', '$scope', 'userService', 'defaultValuesConstant', 'authService', 'actionTypes', 'projectService', 'rolesService', 'UserRoleProjectClientModel', function ($q, $scope, userService, defaults, authService, actionTypes, projectService, rolesService, UserRoleProjectClientModel) {
    $scope.init = function(param){

        $scope.userDelete.data = param;
    };
    $scope.userDelete = {
        cancel:function(event){
            $scope.closeParentWindow($scope,event);
        },
        save:function(event){
            $scope.startLoader('userDelete');
            $scope.userDelete.data.UserRoleProjectClients = [];
            userService.editUserUpdateRoles($scope.userDelete.data).then(function (results) {
                $scope.closeParentWindow($scope,event,{removedItem:$scope.userDelete.data});
                $scope.resolveLoader('userDelete');
            }, function (error) {
                $scope.rejectLoader('userDelete');
                return null;
            });
        }
    };
}]);
angular.module('userModule').controller('userCreateController', ['$q', '$scope', 'userService', 'defaultValuesConstant', 'authService', 'actionTypes', 'projectService', 'rolesService', 'UserRoleProjectClientModel', function ($q, $scope, userService, defaults, authService, actionTypes, projectService, rolesService, UserRoleProjectClientModel) {
    $scope.init = function(param){
        $scope.userCreate.data = angular.copy(userService.userModelTemplate);
        createUserRoleMap($scope,$scope.userCreate.data);
        $scope.editingAccountOwner = false;
    };
    $scope.userCreate = {
        cancel: function (event) {
            $scope.closeParentWindow($scope,event);
        },
        save: function (event) {
            $scope.startLoader('userCreate');
            userService.createUser($scope.userCreate.data).then(function (createUserResult) {
                applyUserRoles($scope,createUserResult.data,UserRoleProjectClientModel);
                userService.editUserUpdateRoles(createUserResult.data).then(function (updateRolesResult) {
                    $scope.resolveLoader('userCreate');
                    $scope.closeParentWindow($scope,event,{addedItem:updateRolesResult.data});
                });
            }, function (error) {
                $scope.rejectLoader('userCreate');
                window.close();
                return null;
            });
        }
    };
}]);
angular.module('userModule').controller('userEditController', ['$q', '$scope', 'userService', 'defaultValuesConstant', 'authService', 'actionTypes', 'projectService', 'rolesService', 'UserRoleProjectClientModel', function ($q, $scope, userService, defaults, authService, actionTypes, projectService, rolesService, UserRoleProjectClientModel) {
    var data;
    $scope.init = function(param){
        data = param;
        $scope.userEdit.data = angular.copy(param);
        createUserRoleMap($scope,$scope.userEdit.data);
        $scope.editingAccountOwner = param.UserID == $scope.session.client.AccountOwnerUserID;
    };
    $scope.userEdit = {
        save:function (event) {
            $scope.startLoader('userEdit');
            applyUserRoles($scope,$scope.userEdit.data,UserRoleProjectClientModel);
            userService.editUserUpdateRoles($scope.userEdit.data).then(function (results) {
                $scope.resolveLoader('userEdit');
                $scope.closeParentWindow($scope,event,{removedItem:data, addedItem:results.data});
                //$scope.userView.refresh();
            }, function (error) {
                $scope.rejectLoader('userEdit');
                // Failure Action: get the error with error.data.message
                return null;
            });
        },
        cancel: function (event) {
            $scope.closeParentWindow($scope,event);
        },
        sendConfirmationEmail:function (e) {
            var dataItem = $scope.userEdit.data;
            var emailData = {
                Email: dataItem.Email,
                FirstName: dataItem.FirstName,
                LastName: dataItem.LastName
            };
            authService.resendConfirmationEmail(emailData).then(function (results) {
                showSuccessMessage("Email successfully resent", 1700);
            }, function (error) {
                // Failure Action: get the error with error.data.message
                showErrorMessage("There was a problem sending the email", 1700);
                return null;
            });
        }
    };
}]);
angular.module('userModule').controller('userViewController', ['$q', '$scope', 'userService', 'defaultValuesConstant', 'authService', 'actionTypes', 'projectService', 'rolesService', 'UserRoleProjectClientModel', function ($q, $scope, userService, defaults, authService, actionTypes, projectService, rolesService, UserRoleProjectClientModel) {
    var parameter;
    $scope.init = function(param){
        parameter = param;
        parameter.refresh = $scope.userView.refresh;
    };

    $scope.userView = {
        data: {},
        change:function(data) {
            $scope.userView.selectedData = data;
        },
        refresh: function (result) {
            $scope.startLoader('usersGrid');
            userService.getUsers().then(function (results) {
                $scope.userView.data = new kendo.data.DataSource(
                    {
                        data: results.data,
                        pageSize: 25,
                        sort: {field: "Email", dir: "asc"}
                    });
                $scope.resolveLoader('usersGrid');
                return results;
            });
        },
        title: "Users",
        onDataBound: function (scope) {
            if (parameter) parameter.grid = scope.userGrid;
        },
        columnsDefault: [
            {
                field: "Email",
                title: "Email",
                hidden: false,
                filterable: {
                    cell: {
                        operator: "contains"
                    }
                }
            },
            {
                field: "FirstName",
                title: "First Name",
                hidden: false,
                filterable: {
                    cell: {
                        operator: "contains"
                    }
                }
            },
            {
                field: "LastName",
                title: "Last Name",
                hidden: false,
                filterable: {
                    cell: {
                        operator: "contains"
                    }
                }
            },
            {
                field: "EmailVerified",
                title: "User Status",
                hidden: false,
                filterable: {
                    cell: {
                        operator: "contains"
                    }
                },
                template: (function (dataItem) {
                    var verified = dataItem.EmailVerified || false;

                    return verified ? 'Active' : 'Pending';
                })
            }
        ],
        options: {
            scrollable: {
                virtual: true
            },
            selectable: true,
            sortable: true,
            pageable: {
                numeric: false,
                previousNext: false,
                messages: {
                    display: "{2} Users"
                }
            },
            resizable: true,
            reorderable: true,
            columnMenu: false,
            filterable: {
                mode: "row"
            }
        }
    };
    $scope.userView.refresh();
}]);
var applyUserRoles = function (scope,user,URPCModel) {
    user.UserRoleProjectClients = [];
    var clientRole = angular.copy(URPCModel);
    clientRole.UserID = user.UserID;
    clientRole.RoleID = scope.roles.client.code;
    clientRole.ProjectID = null;
    clientRole.ClientID = scope.session.client.ClientID;
    clientRole.IsClientData = true;
    user.UserRoleProjectClients.push(clientRole);

    if (scope.session.user.hasBilling && scope.roles.client.billing) {
        var billingRole = angular.copy(URPCModel);
        billingRole.UserID = user.UserID;
        billingRole.RoleID = scope.session.roles.Billing.RoleID;
        billingRole.ProjectID = null;
        billingRole.ClientID = scope.session.client.ClientID;
        billingRole.IsClientData = true;
        user.UserRoleProjectClients.push(billingRole);
    }

    for (var projectIndex = 0; projectIndex < scope.session.clientProjects.length; projectIndex++) {
        var project = scope.session.clientProjects[projectIndex];

        if (scope.roles[project.ProjectID].code) {
            var projectRole = angular.copy(URPCModel);
            projectRole.UserID = user.UserID;
            projectRole.RoleID = scope.roles[project.ProjectID].code;
            projectRole.ProjectID = project.ProjectID;
            projectRole.ClientID = scope.session.client.ClientID;
            projectRole.IsClientData = false;
            user.UserRoleProjectClients.push(projectRole);
        }
    }
};
//TODO: Code improvement must be done here
var createUserRoleMap = function(scope,user){
    var client = scope.containsRole(user.UserRoleProjectClients, scope.session.roles.ClientAdministrator.RoleID);
    var billing = scope.containsRole(user.UserRoleProjectClients, scope.session.roles.Billing.RoleID);
    scope.roles = {
        client: {
            code: client?client.RoleID:'',
            billing: !(!billing)
        }
    };
    for (var projectIndex = 0; projectIndex < scope.session.clientProjects.length; projectIndex++) {
        var project = scope.session.clientProjects[projectIndex];
        var projectCode = '';

        if (scope.containsRole(user.UserRoleProjectClients, scope.session.roles.ProjectUser.RoleID, project.ProjectID)) {
            projectCode = scope.session.roles.ProjectUser.RoleID;
        }
        if (scope.containsRole(user.UserRoleProjectClients, scope.session.roles.ProjectAdministrator.RoleID, project.ProjectID)) {
            projectCode = scope.session.roles.ProjectAdministrator.RoleID;
        }

        scope.roles[project.ProjectID] = {
            code: projectCode
        };
    }
};