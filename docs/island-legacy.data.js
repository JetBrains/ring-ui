window.source = {
  "title": "Island Legacy",
  "url": "island-legacy.html",
  "type": "scss",
  "content": "@import '../global/global';\n\n/**\n * @name Island Legacy\n * @category Style-only\n * @description Displays an island.\n * @example-file ./island-legacy.examples.html\n */\n\n.ring-island {\n  @include ring-font;\n\n  min-width: $ring-unit*25 - 2;\n\n  border: 1px solid;\n  border-color: rgba(0, 0, 0, 0.15);\n  border-radius: $ring-border-radius;\n\n  background-color: #FFF;\n  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .1);\n\n  &_stack-right {\n    border-right: none;\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n\n    box-shadow: none;\n  }\n\n  &_stack-left {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n\n    box-shadow: none;\n  }\n}\n\n.ring-island__header {\n  min-height: $ring-unit*3 - 2;\n  line-height: $ring-unit*3 - 2;\n\n  border-bottom: 1px solid #B4B4B4;\n  border-top-left-radius: $ring-border-radius;\n  border-top-right-radius: $ring-border-radius;\n\n  background-image: linear-gradient(to top, #EBEBEB, #FFF);\n}\n\n.ring-island__header-btn,\n.ring-island__header-button {\n  font-size: $ring-font-size-smaller;\n  float: right;\n\n  padding: 0 $ring-unit*2 - 1; // -1 to account for border\n\n  cursor: pointer;\n  user-select: none;\n\n  color: #6D6D6D;\n  border-left: 1px solid #B4B4B4;\n  text-shadow: #FFF 0 0 1px;\n\n  &:hover {\n    background: #E1E1E1 linear-gradient(to top, #E1E1E1, #FFF);\n  }\n\n  &:active {\n    background: #E4E4E4 none;\n    box-shadow: 0 0 4px 0 #D3D3D3 inset;\n  }\n\n  &:last-child {\n    border-top-right-radius: 3px;\n  }\n}\n\n.ring-island__title {\n  display: block;\n  float: left;\n\n  font-weight: bold;\n\n  padding: 0 $ring-unit*4;\n}\n\n.ring-island__content {\n  margin: $ring-unit*2 $ring-unit*4;\n}\n",
  "examples": [
    {
      "name": "Island in HTML/CSS",
      "url": "examples/island-legacy/island-in-html-css.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div class=\"ring-island\">\n    <div class=\"ring-island__content\">Content</div>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/island-legacy/island-legacy.scss';\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Island with a header",
      "url": "examples/island-legacy/island-with-a-header.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div class=\"ring-island\">\n    <div class=\"ring-island__header\">\n      <span class=\"ring-island__title\">Title</span>\n    </div>\n    <div class=\"ring-island__content\">Content</div>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/island-legacy/island-legacy.scss';\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Island with a header and buttons",
      "url": "examples/island-legacy/island-with-a-header-and-buttons.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  <div class=\"ring-island\">\n    <div class=\"ring-island__header\">\n      <span class=\"ring-island__title\">Title</span>\n      <span class=\"ring-island__header-button\">Button1</span>\n      <span class=\"ring-island__header-button\">Button2</span>\n    </div>\n    <div class=\"ring-island__content\">Content</div>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport '@jetbrains/ring-ui/components/island-legacy/island-legacy.scss';\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an island.",
  "attrs": {
    "name": "Island Legacy",
    "category": "Style-only",
    "description": "Displays an island.",
    "example-file": "./island-legacy.examples.html"
  }
};