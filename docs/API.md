Ring API
========

[toc]
# Syntax

## Operate module

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

## Operate method

Get method

    var method = ring('module', 'method');

    method({
        key: 'value'
    });

# Methods

All methods return `$.Deferred` if anything else isn't stated

# Modules

## Ring
Default module, can be called without id

    var modules = ring();

#### init
Init bunch of modules

    init(config)

##### config

    {
        "header": headerConfig,
        "menu": menuConfig,
        "footer": footerConfig
    }

#### render
Render any avalaible template

**Returns** `String`

    render(template, data)

##### template
`String`

##### data
`Object`

#### on
Subscribe on ring events:
* Any method fires events by scheme `{module}:{method}:{done|fail}`.
* And also custom events from config like `{module}:{eventName}`.

    on(event, handler)

##### event
`String`

##### handler
`Function`

#### trigger
Trigger ring event

    trigger(event)

##### event
`String`

## Header

#### init

    init(config)

#### config
If `auth: true` stated all other data will extend data fetched from Hub

`Object`

    {
        "auth": true,
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
                "event": "login"
            },
            "relogin": {
                "label": "Log in",
                "url": "/relogin",
            },
            "logout": {
                "label": "Log out",
                "event": "logout"
            }
        }
    }

## Menu

### init

    init(config)

#### config
`Object`

    {
      "type": "gradient",
      "left": {
        "projects": {
          "dropdown-toggle": {
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

### update

    update(path, configPart)

#### path
Dot-delimited string path to element

`String`

    'left.projects.counter'

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

### setActive
Set menu item from left and right active by id

    setActive(id)

#### id
`String`

## Footer

### init

    init(config)

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

### update

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

    init(config)

#### config
`Object`

    {
        "clientId": "bbb54677-70fd-47b5-b3cf-c9eeb51212d0",
        "redirectUri": "http://localhost:8000",
        "serverUri": "http://localhost:8080/jetpass",
        "scope": "bbb54677-70fd-47b5-b3cf-c9eeb51212d0"
    }

### ajax
`String`

    ajax(path)

#### path
Path to Hub resource

`String`

    '/rest/services'

## Notifications

### push

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

    markRead()

### flush
Remove all notifications

    flush()

## Dropdown

### show

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

    hide()