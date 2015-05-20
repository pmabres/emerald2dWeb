/**
 * Created by fmabres on 06/04/2015.
 *
 * Please see confluence page for instructions
 * https://cntech.atlassian.net/wiki/display/FPR/Validation+Directives
 * Description:
 *   This is the whole validation directives that take care of field validations.
 *   as needed, they can be added here independently.
 *   they all have the same behaviour.
 *   The main workflow is: An object is setup and then that object is added to a list of validators.
 *   Then that object will check on specific events that will check custom validation rules.
 *   object functions:
 *      check:This function is fired on blur or keyup when the fields are already blurred.
 *          It checks for a returning value of true or false in order to setup the validation.
 *      init:It fires before performing any check to provide intialization of controls
 *      onGroupCheck: It fires each time a field is checked it fires for all the objects that have the groupValidation set to true.
 *   object properties:
 *      description: A general description message that will be shown when valid state is false.
 *          (can be overriden)
 *      validateOn: This field can setup a custom action validation for the element (blur,keyup,click,etc)
 *      groupValidation:This property sets a field with group validation.
 *      hideTemplate: This won't show a template (displaying the invalid status) for the element
 *      noValidate: This won't validate the field for example submit button doesn't need validation.
 *
 */

/*

*   we have this main directive that is in charge of grouping all the directives
*   for group validation. Ex: The submit buttons need to all elements to be valid
*   in order to be enabled.
 */
angular.module('commonDirectivesModule').directive('validateGroup',[function(){
    return {
        //restrict:'E',
        link: function (scope, elem, attrs, ctrl) {
            var validation = [];
            validation.getValue = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].id == val) return this[i];
                }
            };
            validation.validateFields = function (caller) {
                for (var i = 0; i < this.length; i++) {
                    if (caller.id != this[i].id) {
                        this[i].pristine = false;
                        this[i].dirty = true;
                        this[i].blurred = true;
                        this[i].touched = true;
                        this[i].validate();
                    }
                }
            };
            validation.checkValidation = function () {
                this.isModelValid = true;
                for (var i = 0; i < this.length; i++) {
                    if (this[i].isValid == false && !this[i].groupValidation) {
                        this.isModelValid = false;
                        return;
                    }
                }
            };
            validation.isModelValid = true;
            elem.data('validation', validation);
            scope.$broadcast('addedValidation');
        }
    }
}]);
angular.module('commonDirectivesModule').directive('validateRequired', [function () {
    return {
        link: function (scope, elem, attrs) {
            var error = {
                id: attrs.validateRequired,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validateRequired",
                description: "This field is required",
                check: function (group) {
                    return elem.val();
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);
angular.module('commonDirectivesModule').directive('validateMaxLength', [function () {
    return {
        link: function (scope, elem, attrs) {
            if (!attrs.validateMaxLengthCount || isNaN(parseInt(attrs.validateMaxLengthCount)))
                attrs.validateMaxLengthCount = 10;

            var error = {
                id: attrs.validateMaxLength,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validateMaxLength",
                description: attrs.validateMaxLengthMessage || "Maximum length of the field is " + attrs.validateMaxLengthCount,
                check: function (group) {
                    return elem.val().length < attrs.validateMaxLengthCount;
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);
angular.module('commonDirectivesModule').directive('validateSubmit', [function () {
    return {
        link: function (scope, elem, attrs) {
            var error = {
                id: attrs.validateSubmit,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validateSubmit",
                description: "Submit Button",
                groupValidation: true,
                validateOn: "click",
                hideTemplate: true,
                noValidate: true,
                init: function () {
                    //elem.children().addClass('disabled');
                    //elem.addClass('disabled');
                },
                check: function (group, event) {
                    group.validateFields(this);
                    group.checkValidation();
                    if (!group.isModelValid) {
                        if(event)
                            event.stopImmediatePropagation();
                    }
                },
                onGroupCheck: function (group, caller) {
                    for (var i = 0; i < group.length; i++) {
                        if (group[i].showsError) break;
                    }
                    elem.children().removeClass('disabled');
                    elem.removeClass('disabled');
                    if (i < group.length) {
                        if (!group.isModelValid) {
                            elem.children().addClass('disabled');
                            elem.addClass('disabled');
                        }
                    }
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);

angular.module('commonDirectivesModule').directive('validateNumeric', [function () {
    return {
        link: function (scope, elem, attrs) {
            var error = {
                id: attrs.validateNumeric,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validateNumeric",
                description: "Numbers only.",
                check: function (group) {
                    return !isNaN(parseInt(elem.val()));
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);
//TODO: we can later separate the checks in phases so we can detect and print separate messages for validation
angular.module('commonDirectivesModule').directive('validatePassword', [function () {
    return {
        link: function (scope, elem, attrs) {
            var error = {
                id:attrs.validatePassword,
                element:elem,
                scope:scope,
                attrs:attrs,
                code:"validatePassword",
                description: "Minimum requirements: A combination of eight or more digits or characters.",
                check: function (group) {
                    //var pattern = /(?=^.{10,}$)(?=.*\d)(?![.\n])(?=.*[a-z])(?=.*[A-Z]).*$/;
                    var pattern = /(?=^.{8,}$).*$/;
                    return pattern.test(elem.val());
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);
angular.module('commonDirectivesModule').directive('validateDate', [function () {
    return {
        link: function (scope, elem, attrs) {
            var date = new Date();
            date = kendo.toString(kendo.parseDate(date, 'yyyy-MM-dd'), 'MM/dd/yyyy');
            var error = {
                id: attrs.validateDate,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validateDate",
                description: "Invalid date, " + date,
                check: function (group) {
                    if (elem.val().length >= 1) {
                        var pattern = new RegExp("^(1[0-2]|0?[1-9])/(3[01]|[12][0-9]|0?[1-9])/(?:[0-9]{4})?[0-9]{4}$");
                        return pattern.test(elem.val());
                    }
                    else {
                        return true;
                    }
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);
angular.module('commonDirectivesModule').directive('validateEmail', [function () {
    return {
        link: function (scope, elem, attrs) {
            var error = {
                id: attrs.validateEmail,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validateEmail",
                description: "Invalid Email Address.",
                check: function (group) {
                    var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                    return pattern.test(elem.val());
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);


angular.module('commonDirectivesModule').directive('validatePasswordMatch', ['$parse', function ($parse) {
    return {
        link: function (scope, elem, attrs) {
            var error = {
                id: attrs.validatePasswordMatch,
                element: elem,
                scope: scope,
                attrs: attrs,
                code: "validatePasswordMatch",
                description: "Passwords must match.",
                watch: [attrs.validatePasswordMatch],
                check: function (group) {
                    return elem.val() === $parse(attrs.validatePasswordMatch)(scope);
                }
            };
            addValidator(error);
            doValidation(error);
        }
    }
}]);
//TODO: we can later add support for custom checks and validations.
var doValidation = function (error) {
    var wrapTemplate = "<div></div>";
    var scope = error.scope;
    var elem = error.element;
    var attrs = error.attrs;
    error.pristine = true;
    error.dirty = false;
    error.blurred = false;
    error.touched = false;
    error.validate = function () {
        displayTemplate(validate());
    };
    var parent;
    var hasParent = false;
    var obj;
    var group;
    var $parse = angular.injector(['ng']).get('$parse');
    if (!hasParent) {
        hasParent = true;
        parent = elem.wrap(wrapTemplate).parent();
    }
    var valid = true;
    var hasInvalid = true;
    if (!error.validateOn) error.validateOn = "blur";
    elem.bind(error.validateOn, function (e) {
        if (e && e.keyCode == 9) return;
        displayTemplate(validate(e));
        checkGroup();
    });
    elem.bind("blur", function (e) {
        error.blurred = true;
    });
    elem.bind("focus", function (e) {
        error.touched = true;
    });
    elem.bind("keyup", function (e) {
        error.pristine = false;
        if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16) error.dirty = true;
        if (e && e.keyCode == 9) return;
        if (error.dirty && error.blurred && error.touched) {
            displayTemplate(validate(e));
            checkGroup();
        }
    });
    if (error.watch && error.watch.length) {
        for (var i = 0; i < error.watch.length; i++) {
            var value = error.watch[i];
            error.scope.$watch(function () {
                return $parse(value)(error.scope);
            }, function (val) {
                displayTemplate(validate());
                checkGroup();
            });
        }
    }
    var displayTemplate = function (valid) {
        if (error.hideTemplate) return;
        if (!error.dirty) return;
        if (!parent && hasParent) {
            parent = element.parent();
        }
        if (parent) {
            if (!obj && valid === false) {
                obj = $(error.template).appendTo(parent);
                error.showsError = true;
            }
            if (valid === true) {
                if (obj) {
                    obj.remove();
                    obj = false;
                    error.showsError = false;
                }
            }
        }
    };
    var validate = function (event) {
        valid = error.check(error.group, event);
        if (error.noValidate) return;
        error.isValid = !!valid;
        if (error.onValid && error.isValid) {
            if (angular.isString(error.onValid)) {
                $parse(error.onValid)(error.scope);
            } else {
                error.onValid();
            }
        }
        if (error.onInvalid && !error.isValid) {
            if (angular.isString(error.onInvalid)) {
                $parse(error.onInvalid)(error.scope);
            } else {
                error.onInvalid();
            }
        }
        return error.isValid;
    };
    var checkGroup = function () {
        if (error.group) {
            error.group.checkValidation();
            for (var i = 0; i < error.group.length; i++) {
                if (error.group[i].groupValidation) {
                    error.group[i].onGroupCheck(error.group, error);
                }
            }
        }
    };
    if (error.init) error.init();
};
var addValidator = function (error) {
    var id = 'velement' + Math.floor(Math.random() * 1000);
    if (!error.element.attr('id')) {
        error.element.attr('id', id);
    }
    if (!error.id) error.id = id;
    if (!error.hasOwnProperty('valid')) error.isValid = false;
    error.description = error.attrs.validateMessage || error.description || 'There has been an error';
    error.validateOn = error.attrs.validateOn || error.validateOn || "blur";
    error.template = error.attrs.validateTemplate || error.template || '<div class="alert has-error alert-danger text-left input-alert" role="alert">' + error.description + '</div>';
    var $http = angular.injector(['ng']).get('$http');
    if (error.attrs.validateTemplateUrl) {
        $http.get(error.attrs.validateTemplateUrl).success(function (data, status, headers, config) {
            error.template = data;
        });
    }
    error.onValid = error.attrs.onValid || error.onValid;
    error.onInvalid = error.attrs.onInvalid || error.onInvalid;
    var groupParent = $(error.element).closest('[validate-group]');
    if (groupParent.length) {
        error.scope.$watch(function () {
            return groupParent.data('validation');
        }, function (val) {
            if (val && !val.getValue(error.id)) {
                error.group = val;
                error.element.data('validation', error);
                val.push(error);
            }
        });
    }
};
var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
}