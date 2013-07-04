# Ring API
[toc]
## Syntax

### One module

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

### One method

Get method

    var method = ring('module', 'method');

    method({
        key: 'value'
    });

### Many modules

Run method on bunch of modules (useful for initial init)

Get modules

    var modules = ring('ring');

Or just

    var modules = ring();

Run method

    modules.invoke('method', {
        module1: {
            key: 'value'
        },
        module2: {
            key: 'value'
        }
    });

### One method, many modules

    var init = ring('ring', 'init');

    init({
        module1: {
            key: 'value'
        },
        module2: {
            key: 'value'
        }
    });

## Modules

### Header

##### init

    init(config)

##### config
If `auth: true` stated all other data will extend data fetched from Hub

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
                "url": "/login"
            },
            "logout": {
                "label": "Log out",
                "url": "/logout"
            }
        }
    }

### Menu

#### init

    init(config)

##### config

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

#### update

    update(path, configPart)

##### path
Dot-delimited string path to element

    'items.left.projects.counter'

##### configPart
Any part of initial config.
Remove part using `null`.

    {
        "counter": {
            "color": "dark",
            "label": 666
        }
    }

#### setActive
Set menu item from left and right active by id

    setActive(id)

##### id
    'cog'

### Auth

#### init

    init(config)

##### config

    {
        "clientId": "bbb54677-70fd-47b5-b3cf-c9eeb51212d0",
        "redirectUri": "http://localhost:8000",
        "serverUri": "http://localhost:8080/jetpass",
        "scope": "bbb54677-70fd-47b5-b3cf-c9eeb51212d0"
    }

#### ajax

    init(path)

##### path
Path to Hub resource

    '/rest/services'

## To be documented
 * footer
 * dropdown
 * notifications