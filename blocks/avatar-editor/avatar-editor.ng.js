(function () {
  "use strict";

  angular.module("Ring.avatar-editor", []).
  /**
   * <avatar-editor ng-model="entity.iconUrl" on-select="uploadFile(name, data)" default="default-picture-uri" controls="editor"></avatar-editor>
   *
   * Input to select small images for later upload as DataURI. On-select attribute gets filename as <code>name</code>
   * and DataURIed file content as <code>data</code>.
   */
    directive("avatarEditor", [
      "$injector",
      function ($injector) {
        return {
          restrict: "E",
          scope: {
            model: "=ngModel",
            onSelect: "&",
            controls: "=?",
            "default": "@",
            ngDisabled: "="
          },
          templateUrl: "avatar-editor/avatar-editor.ng.html",
          controller: ["$scope", "$attrs", function ($scope, $attrs) {
            var ctrl = this;
            var fileInput, ngModelCtrl;
            var alert = $injector.has("alert") ? $injector.get("alert") : {error: angular.noop};

            if ("controls" in $attrs) {
              $scope.controlled = true;
            }

            ctrl.setNgModelCtrl = function (ngModel) {
              ngModelCtrl = ngModel;
            };

            function createFileLoadListener(file) {
              return function (readEvent) {
                var data = readEvent.target.result;
                var result = $scope.onSelect({name: file.name, data: data});
                if (result && result.then) {
                  result.then(function () {
                    $scope.model = data;
                  });
                } else if (result !== false) {
                  $scope.$apply(function () {
                    $scope.model = data;
                  });
                }
              };
            }

            ctrl.registerFileInput = function (input) {
              fileInput = input;
              fileInput.on("change", function (event) {
                var imageFileSelected = false;
                for (var i = 0; i < event.target.files.length; i++) {
                  var file = event.target.files[i];
                  if (file.type.indexOf("image/") === 0) {
                    imageFileSelected = true;
                    var reader = new FileReader();
                    reader.onload = createFileLoadListener(file);
                    reader.readAsDataURL(file);
                    break;
                  }
                }
                if (!imageFileSelected) {
                  alert.error("No image file was selected");
                }
              });
            };

            $scope.controls = {};

            $scope.controls.select = function () {
              if (!FileReader) {
                alert.error("Sorry, your browser doesn't support File API");
              } else {
                fileInput.on("click.avatar-editor", function (event) {
                  event.stopPropagation();
                });
                fileInput.click();
                fileInput.off("click.avatar-editor");
              }
            };

            $scope.controls.remove = function () {
              var data = "";
              var result = $scope.onSelect({name: data, data: data});
              if (result && result.then) {
                result.then(function () {
                  $scope.model = data;
                });
              } else if (result !== false) {
                $scope.model = data;
              }
            };
          }],
          require: ["ngModel", "avatarEditor"],
          link: function (scope, iElement, iAttrs, ctrls) {
            var ngModelCtrl = ctrls[0];
            var avatarEditorCtrl = ctrls[1];
            avatarEditorCtrl.setNgModelCtrl(ngModelCtrl);
          }
        };
      }
    ]).
    directive("ringAvatarEditorFileInput", [function () {
      return {
        restrict: "C",
        require: "^avatarEditor",
        link: function (scope, iElement, iAttrs, avatarEditorCtrl) {
          avatarEditorCtrl.registerFileInput(iElement);
        }
      };
    }]).
    // FIXME Temporary solution
    filter("ringAvatarEditorfixDataUriContentType", function () {
      return function (input) {
        var output = input;
        if (input) {
          output = input.replace(/^data:null;base64/g, "data:image/png;base64");
        }
        return output;
      };
    });
})();