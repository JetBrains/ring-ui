window.source = {
  "title": "Tags Input Ng",
  "url": "tags-input-ng.html",
  "type": "js",
  "content": "/**\n * @name Tags Input Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Tags Input.\n * @example-file ./tags-input-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport TagsInput from '../tags-input/tags-input';\n\nexport default angularComponentFactory(TagsInput, 'TagsInput').name;\n",
  "examples": [
    {
      "name": "Tags Input Ng",
      "url": "examples/tags-input-ng/tags-input-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.tagsInput\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n  <rg-tags-input\n    tags=\"ctrl.tags\"\n    x-data-source=\"ctrl.dataSource\"\n    placeholder=\"'Type something'\"\n    on-add-tag=\"ctrl.onAddTag\"\n    on-remove-tag=\"ctrl.removeTag\"\n  ></rg-tags-input>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingTagsInput from '@jetbrains/ring-ui/components/tags-input-ng/tags-input-ng';\n\nangular.module('Example.tagsInput', [RingTagsInput]).\n  controller('ExampleCtrl', function ($q) {\n    this.tags = [\n      {key: 'test1', label: 'test1'},\n      {key: 'test2', label: 'test2'}\n    ];\n\n    this.dataSource = ({query}) => {\n      return $q.when([\n        {key: 'test3', label: 'test3'},\n        {key: 'test4', label: 'test4'}\n      ]);\n    };\n\n    this.onAddTag = ({tag}) => {\n      console.log('Add tag', tag);\n    };\n\n    this.removeTag = ({tag}) => {\n      console.log('Remove tag', tag);\n    };\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Tags Input.",
  "attrs": {
    "name": "Tags Input Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Tags Input.",
    "example-file": "./tags-input-ng.examples.html"
  }
};