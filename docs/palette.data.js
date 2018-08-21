window.source = {
  "title": "Palette",
  "url": "palette.html",
  "type": "scss",
  "content": "/**\n * @name Palette\n * @category Style-only\n * @description Defines the color palette used for tags and custom fields.\n * @example-file ./palette.examples.html\n */\n\n$ring-palette-white-text: #FFF;\n$ring-palette-grey-text: #444;\n\n$ring-palette-array: // [(background, text)]\n\n  // No color\n  transparent $ring-palette-grey-text,\n\n  // Brightness 1\n  #E6E6E6\t#888888,\n  #E6F6CF\t#4DA400,\n  #D8F7F3\t#45818E,\n  #E0F1FB\t#3D85C6,\n  #FCE5F1\t#DC5766,\n  #FFEE9C\t#B45F06,\n  #F7E9C1\t#B45F06,\n\n  // Brightness 2\n  #BABABA $ring-palette-grey-text,\n  #B7E281 $ring-palette-grey-text,\n  #92E1D5 $ring-palette-grey-text,\n  #A6E0FC $ring-palette-grey-text,\n  #FFC8EA $ring-palette-grey-text,\n  #FED74A $ring-palette-grey-text,\n  #E0C378 $ring-palette-grey-text,\n\n  // Brightness 3\n  #878787 $ring-palette-white-text,\n  #7DBD36 $ring-palette-white-text,\n  #25BEB2 $ring-palette-white-text,\n  #42A3DF $ring-palette-white-text,\n  #FF7BC3 $ring-palette-white-text,\n  #FF7123 $ring-palette-white-text,\n  #CE6700 $ring-palette-white-text,\n\n  // Brightness 4\n  #4D4D4D $ring-palette-white-text,\n  #409600 $ring-palette-white-text,\n  #2F9890 $ring-palette-white-text,\n  #0070E4 $ring-palette-white-text,\n  #DC0083 $ring-palette-white-text,\n  #E30000 $ring-palette-white-text,\n  #8D5100 $ring-palette-white-text,\n\n  // Brightness 5\n  #1A1A1A $ring-palette-white-text,\n  #246512 $ring-palette-white-text,\n  #00665E $ring-palette-white-text,\n  #0050A1 $ring-palette-white-text,\n  #900052 $ring-palette-white-text,\n  #8E1600 $ring-palette-white-text,\n  #553000 $ring-palette-white-text;\n\n@mixin ring-add-palette-colors {\n  $i: 0;\n  $brightness: 0;\n\n  @each $color in $ring-palette-array {\n    $background: nth($color, 1);\n    $text: nth($color, 2);\n\n    &_color-#{$i} {\n      background-color: $background;\n      color: $text;\n    }\n\n    @if $i > 0 {\n      $tone: ($i - 1) % 7;\n      &_tone-#{$tone}-#{$brightness} {\n        background-color: $background;\n        color: $text;\n      }\n\n      @if $tone == 6 {\n        $brightness: $brightness + 1;\n      }\n    }\n    $i: $i + 1;\n  }\n}\n\n.ring-palette {\n  @include ring-add-palette-colors();\n}\n",
  "examples": [
    {
      "name": "Palette",
      "url": "examples/palette/palette.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.palette\" ng-strict-di ng-controller=\"PaletteCtrl as paletteCtrl\" id=\"palette\">\n  <h4>ColorId</h4>\n  <div ng-repeat=\"i in paletteCtrl.arr5\" class=\"example\">\n    <div ng-repeat=\"j in paletteCtrl.arr7\"\n      ng-init=\"colorId = i * 7 + j + 1\"\n      ng-attr-class=\"ring-palette_color-{{colorId}}\">\n      Color {{colorId}}\n    </div>\n  </div>\n  <h4>ToneId and BrightnessId</h4>\n  <div class=\"example\" ng-repeat=\"toneId in paletteCtrl.arr7\">\n    <div><b>Tone {{toneId}}:</b></div>\n    <div ng-repeat=\"brightnessId in paletteCtrl.arr5\"\n      ng-attr-class=\"ring-palette_tone-{{toneId}}-{{brightnessId}}\">\n      Brightness {{brightnessId}}\n    </div>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.example) {\n  margin: 4px;\n}\n\n:global(.example) div {\n  width: 90px;\n  display: inline-block;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport '@jetbrains/ring-ui/components/palette/palette.scss';\n\nangular.module('Example.palette', []).\n  controller('PaletteCtrl', function () {\n    const xrange = num => [...Array(num)].map((val, index) => index);\n\n    this.arr5 = xrange(5);\n    this.arr7 = xrange(7);\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Defines the color palette used for tags and custom fields.",
  "attrs": {
    "name": "Palette",
    "category": "Style-only",
    "description": "Defines the color palette used for tags and custom fields.",
    "example-file": "./palette.examples.html"
  }
};