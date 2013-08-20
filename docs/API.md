Ring API
========

@@TOC@@

# Syntax

## Import modules

Get root module

    var root = ring();

Get module

    var module = ring('module');

Invoke module method

    module.invoke('method', {
        key: 'value'
    });

or just

    module('method', {
        key: 'value'
    });

## Import methods

Get method

    var method = ring('module', 'method');

Invoke method

    method({
        key: 'value'
    });

All methods return `$.Deferred` if anything else isn't stated

## Events

### on
Subscribe on ring events on any modules.

    var root = ring();

    root.on(event, handler);

Subscribe on certain module events

    var module = ring('module');

    module.on(event, handler);


#### event — modules list
`String`

    '{module}:{method}:{done|fail|success}[::{namespace}]'
    '{module}:{customEvent}[::{namespace}]'

#### event — certain module
`String`

    '{method}:{done|fail|success}[::{namespace}]'
    '{customEvent}[::{namespace}]'

#### handler
`Function` (handler function) | `String` (method name)

### one
Subscribe on event for only one time

    var module = ring('module');

    module.one(event, handler);

### off
Unsubscribe from all or namespaced events

    var module = ring('module');

    module.off(event);


### trigger
Trigger ring event

    var module = ring('module');

    module.trigger(event);

#### event
`String`

Same as `on()` event param.

# Modules

## Root module
Default module, can be called with or without id

    var root = ring();

### config
Basic ring configuration. Returns actualized config.

**Returns** `Object`

    root('config', baseConfig)

#### baseConfig
    {
      "services": [
        {
          "current": "boolean",
          "id": "string",
          "homeUrl": "string",
          "name": "string",
          "applicationName": "string",
          "vendor": "string",
          "version": "string"
        }
      ],
      "user": {
        "id": "string",
        "name": "string",
        "avatar": {
          "puctureUrl": "string"
        }
      }
    }

### init
Init bunch of modules

    root('init', moduleList)

#### moduleList

    {
        "header": headerConfig,
        "menu": menuConfig,
        "footer": footerConfig
    }

### update
Update bunch of modules

    root('update', moduleList)

#### moduleList

    {
        "header": headerConfig,
        "menu": menuConfig,
        "footer": footerConfig
    }

### render
Render any avalaible template

**Returns** `String`

    root('render', templateName, data);

#### templateName
`String`

#### data
`Object`

#### add
Add module. Returns success.

**Returns** `Boolean`

    var root = ring();

    root('add', module, methods);

##### module
`String`

##### methods
`Object`

    {
      "method1": function() {

      },
      "method2": function() {
      
      }
    }

#### remove
Remove module. Returns success.

**Returns** `Boolean`

    var root = ring();

    root('remove', module);

##### module
`String`

## Header

    var header = ring('header');

### init

    header('init', config[, element[, method]])

#### config

`Object`

    {
        "services": [
            {
                "active": true,
                "label": "TeamCity",
                "url": "http://teamcity.jetbrains.com"
            },
            {
                "label": "YouTrack",
                "url": "//youtrack.jetbrains.com"
            }
        ],
        "user": {
            "name": "Display Name",
        },
        "personalLinks": [
            {
                "label": "Issues",
                "url": "/issues"
            },
            {
                "label": "Agile Board",
                "url": "/rest/agile"
            }
        ],
        "authLinks": {
            "login": {
                "label": "Log in",
                "url": "/login",
                "event": "{module}:{event}"
            },
            "anotherExampleAuthLink": {
                "label": "Example link with url only",
                "url": "/example",
            },
            "logout": {
                "label": "Log out",
                "event": "{module}:{event}"
            }
        }
    }


#### element
`jQuery` | `String` | `Node`

#### method
`String`

Possible values:

* append
* prepend
* before
* after
* replace

Default is **append**.

## Menu

    var menu = ring('menu');

### init

    menu('init', config[, element[, method]])

or

    var init = ring('menu', 'init');
    init(config)

#### config
`Object`

    {
      "type": "gradient",
      "left": {
        "projects": {
          "toggle": {
            "items": [
              {
                "className": "test-class",
                "label": "Issues",
                "title": "Tilte attribute content",
                "url": "/issues"
              },
              {
                "label": "Agile Board",
                "url": "/rest/agile"
              }
            ]
          },
          "label": "Projects"
        },
        "agents": {
          "counter": {
            "color": "red",
            "label": 125
          },
          "label": "Agents",
          "url": "/rest/reports"
        },
        "logo": {
          "order": 1,
          "image": "/blocks/header/tc.png",
          "url": "/dashboard"
        }
      },
      "right": {
        "search": {
          "type": "search",
          "url": "/search"
        },
        "cog": {
          "items": [
            {
              "label": "Issues",
              "url": "/issues"
            },
            {
              "label": "Agile Board",
              "url": "/rest/agile"
            }
          ],
          "type": "cog",
          "url": "/prefs"
        }
      }
    }

#### element
`jQuery` | `String` | `Node`

#### method
`String`

Possible values:

* append
* prepend
* before
* after

Default is **append**.

### update

    var update = ring('menu', 'update');
    update(path, configPart)

#### path
Dot-delimited string path to element

`String`

    'left.projects.counter'

#### configPart
Any part of initial config. Remove part using `null`.

`Object`

    {
        "counter": {
            "color": "dark",
            "label": 666
        }
    }

### setActive
Set menu item from left and right active by id

    var setActive = ring('menu', 'setActive');
    setActive(id)

#### id
`String`

## Footer

### init

    var init = ring('footer', 'init');
    init(config[, element[, method]])

#### config
`Object`

    {
      "left": {
        "upsource": {
          "label": "Upsource",
          "url": "/",
          "postfix": " by JetBrains"
        }
      },
      "center": {
        "copyright": {
          "label": "© 2000—2013 JetBrains. All rights reserved"
        }
      }
    }

#### element
`jQuery` | `String` | `Node`

#### method
`String`

Possible values:

* append
* prepend
* before
* after
* replace

Default is **append**.

### update

    var update = ring('footer', 'update');
    update(path, configPart)

#### path
Dot-delimited string path to element

`String`

    'items.left.projects.counter'

#### configPart
Any part of initial config.
Remove part using `null`.

`Object`

    {
        "counter": {
            "color": "dark",
            "label": 666
        }
    }


## Auth

### init

    var init = ring('auth', 'init');
    init(config)

#### config
`Object`

    {
        "clientId": "bbb54677-70fd-47b5-b3cf-c9eeb51212d0",
        "redirectUri": "http://localhost:8000",
        "serverUri": "http://localhost:8080/jetpass",
        "scope": "bbb54677-70fd-47b5-b3cf-c9eeb51212d0"
    }

### getToken
Return token or updates authorization if token is missing.

**Returns** `String`

### ajax
Get hub resourse using config authorization.

**Returns** `jqXHR` ([jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jqXHR))

    var ajax = ring('auth', 'ajax');
    ajax(path)

#### path
Path to Hub resource

`String`

    '/rest/services'

## Notifications (not implemented)

### push

    var push = ring('notifications', 'push');
    push(data)

#### data
`Object`

    [
        {
          "label": "Issues",
          "description": "Hello world"
          "url": "/issues",
          "image": "tc.png"
        },
        {
          "label": "Grill party",
          "event": "dance"
        }
    ]

### markRead
Mark all notifications as read

    var markRead = ring('notifications', 'markRead');
    markRead()

### flush
Remove all notifications

    var flush = ring('notifications', 'flush');
    flush()

## Dropdown

### show

    var show = ring('dropdown', 'show');
    show(data, target)

#### data
`Object` | `String` | `jQuery`

    {
        "items": [
            {
              "label": "Issues",
              "url": "/issues"
            },
            {
              "label": "Agile Board",
              "url": "/rest/agile"
            }
          ]
    }

#### target
`Node` | `jQuery`

### hide

    var hide = ring('dropdown', 'hide');
    hide()