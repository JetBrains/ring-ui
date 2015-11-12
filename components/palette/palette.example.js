/**
 * @name Palette
 * @description Palette is used for tags and custom-fields
 * @example
 <example name="Palette">
   <file name="index.html">
    <div ng-app="Example.palette" ng-controller="PaletteCtrl as paletteCtrl">
      <h4>ColorId</h4>
      <div ng-repeat="i in paletteCtrl.arr5" class="example">
        <div ng-repeat="j in paletteCtrl.arr7"
             ng-init="colorId = i * 7 + j"
             ng-attr-class="ring-palette_color-{{colorId}}">
          Color {{colorId}}
        </div>
      </div>
      <h4>ToneId and BrightnessId</h4>
      <div class="example" ng-repeat="toneId in paletteCtrl.arr7">
        <div><b>Tone {{toneId}}:</b></div>
        <div ng-repeat="brightnessId in paletteCtrl.arr5"
             ng-attr-class="ring-palette_tone-{{toneId}}-{{brightnessId}}">
          Brightness {{brightnessId}}
        </div>
      </div>
    </div>
   </file>
   <file name="index.scss" webpack="true">
      .example {
        margin: 4px;
        div {
          width: 90px;
          display: inline-block;
        }
      }
   </file>
   <file name="index.js" webpack="true">
      require('angular');
      require('ring-ui/components/palette/palette.scss');
      require('./index.scss');

      angular.module('Example.palette', [])
        .controller('PaletteCtrl', function() {
          function xrange(num) {
            var arr = new Array(num);
            for (var i = 0; i < arr.length; ++i) {
              arr[i] = i;
            }
            return arr;
          }
          this.arr5 = xrange(5);
          this.arr7 = xrange(7);
        });
   </file>
 </example>
 */
