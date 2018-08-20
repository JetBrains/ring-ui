window.source = {
  "title": "Storage",
  "url": "storage.html",
  "type": "js",
  "content": "import LocalStorage from './storage__local';\nimport FallbackStorage from './storage__fallback';\n\n/**\n * @name Storage\n * @category Utilities\n * @tags Ring UI Language\n * @description Provides a façade to localStorage/sessionStorage/cookies.\n * @example\n   <example name=\"Storage\">\n    <file name=\"index.html\">\n      <div>\n        Stored value = <span id=\"stored-value\"></span>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import Storage from '@jetbrains/ring-ui/components/storage/storage';\n\n      const STORAGE_KEY = 'storage-example-key';\n      const storage = new Storage();\n\n      const infoNode = document.getElementById('stored-value');\n\n      async function init() {\n       const storedValue = await storage.get(STORAGE_KEY);\n       if (!storedValue) {\n         const generatedValue = Math.random().toString();\n         await storage.set(STORAGE_KEY, generatedValue);\n         infoNode.innerText = generatedValue;\n       } else {\n         infoNode.innerText = storedValue;\n       }\n      }\n      init();\n    </file>\n   </example>\n */\n\n/**\n * @constructor\n * @extends {LocalStorage}\n */\nlet Storage = LocalStorage;\n\n// Using try/catch here because of IE10+ protected mode and other browsers' quirks\n// See https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js\ntry {\n  const temp = 'testStorage';\n  localStorage.setItem(temp, temp);\n  localStorage.removeItem(temp);\n} catch (e) {\n  Storage = FallbackStorage;\n}\n\nconst ActualStorage = Storage;\nexport default ActualStorage;\n",
  "examples": [
    {
      "name": "Storage",
      "url": "examples/storage/storage.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div>\n  Stored value = <span id=\"stored-value\"></span>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport Storage from '@jetbrains/ring-ui/components/storage/storage';\n\nconst STORAGE_KEY = 'storage-example-key';\nconst storage = new Storage();\n\nconst infoNode = document.getElementById('stored-value');\n\nasync function init() {\n const storedValue = await storage.get(STORAGE_KEY);\n if (!storedValue) {\n   const generatedValue = Math.random().toString();\n   await storage.set(STORAGE_KEY, generatedValue);\n   infoNode.innerText = generatedValue;\n } else {\n   infoNode.innerText = storedValue;\n }\n}\ninit();\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides a façade to localStorage/sessionStorage/cookies.",
  "attrs": {
    "name": "Storage",
    "category": "Utilities",
    "tags": "Ring UI Language",
    "description": "Provides a façade to localStorage/sessionStorage/cookies.",
    "example": "   <example name=\"Storage\">\n    <file name=\"index.html\">\n      <div>\n        Stored value = <span id=\"stored-value\"></span>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import Storage from '@jetbrains/ring-ui/components/storage/storage';\n\n      const STORAGE_KEY = 'storage-example-key';\n      const storage = new Storage();\n\n      const infoNode = document.getElementById('stored-value');\n\n      async function init() {\n       const storedValue = await storage.get(STORAGE_KEY);\n       if (!storedValue) {\n         const generatedValue = Math.random().toString();\n         await storage.set(STORAGE_KEY, generatedValue);\n         infoNode.innerText = generatedValue;\n       } else {\n         infoNode.innerText = storedValue;\n       }\n      }\n      init();\n    </file>\n   </example>"
  }
};