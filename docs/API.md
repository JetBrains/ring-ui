Ring API
========

@@TOC@@

# Syntax

## Importing modules

Get the root module

    var root = ring();

Get module by name

    var module = ring('module');

Invoke module method

    module.invoke('method', {
        key: 'value'
    });

or simply

    module('method', {
        key: 'value'
    });

## Import methods

Get a method

    var method = ring('module', 'method');

Invoke method

    method({
        key: 'value'
    });

All methods return `$.Deferred` if not stated otherwise

## Events

### on
Subscribe to Ring events on any module.

    var root = ring();

    root.on(event, handler);

Subscribe to certain module events.

    var module = ring('module');

    module.on(event, handler);


#### event — modules list
`String`

    '{module}:{method}:{done|fail|success}[::{namespace}]'
    '{module}:{customEvent}[::{namespace}]'

#### event — specific module
`String`

    '{method}:{done|fail|success}[::{namespace}]'
    '{customEvent}[::{namespace}]'

#### handler
`Function` (handler function) | `String` (method name)

### one
Subscribe to an event, the handler is executed at most once per module

    var module = ring('module');

    module.one(event, handler);

### off
Remove an event handler

    var module = ring('module');

    module.off(event);

### wait
Returns a promise that will be fullfiled next time event fires

    var module = ring('module');

    module.wait(event);

### trigger
Trigger Ring event

    var module = ring('module');

    module.trigger(event);

#### event
`String`

Same as `on()` event param.

# Modules

## Root module
Default module, can be called with or without ID

    var root = ring();

### config
Basic Ring configuration. Returns the current configuration.

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
Initialize a list of modules

    root('init', moduleList)

#### moduleList

    {
        "header": headerConfig,
        "menu": menuConfig,
        "footer": footerConfig
    }

### update
Update a list of modules

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
            "attention": 1,
            "label": 125
          },
          "label": "Agents",
          "url": "/rest/reports"
        },
        "logo": {
          "order": 1,
          "image": "/blocks/header/tc.png",
          "url": "/dashboard"
        },
        "html": {
          "html": "<b>HTML item</i>"
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
Dot-delimited string that represents the path to an element

`String`

    'left.projects.counter'

#### configPart
Any part of initial config. To remove a part, pass `null`.

`Object`

    {
        "counter": {
            "attention": 0,
            "label": 666
        }
    }

### setActive
Mark a menu item as active by ID.

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

    footer: {
      left: [
        [{url: 'http://www.jetbrains.com/teamcity/?fromServer', label: 'TeamCity'}, 'by JetBrains'],
        'Enterprise 8.0.2 EAP (build 27448)'
      ],
      center: [
        [{copyright: 2000, label: ' JetBrains'}, {middot: 1}, 'All rights reserved'],
        {url: 'http://teamcity.jetbrains.com/showAgreement.html', label: 'License agreement', title: 'READ ME!'}
      ],
      right: [
        {url: '#', label: 'Feedback'}
      ]
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
Dot-delimited string that represents the path to an element

`String`

    'items.left.projects.counter'

#### configPart
Any part of initial config. To remove a part, pass `null`.

`Object`

    {
        "counter": {
            "attention": 0,
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
Returns token or updates authorization if token is missing.

**Returns** `String`

### getUser
Returns deferred logged in user.

**Returns** Deferred that resolves to [User](http://confluence.jetbrains.com/display/HUB/JSON+Scheme#JSONScheme-user)

### ajax
Get Hub resource using authorization config.

**Returns** `jqXHR` ([jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jqXHR))

    var ajax = ring('auth', 'ajax');
    ajax(path)

### get
Get cached resource using authorization config.

**Returns** `$.Deferred` | `jqXHR` ([jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jqXHR))


    var get = ring('auth', 'get');
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
          "description": "Hello world",
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

   [
      {
        "label": "Issues",
        "url": "/issues"
      },
      {
        "label": "Agile Board",
        "url": "/rest/agile"
      }
    ]

#### target
`Node` | `jQuery`

### hide

    var hide = ring('dropdown', 'hide');
    hide()

## Alerts
Alerts component is a way to notify user about something. There are four kinds
of Alerts: regular notification, error, warning and success.

There's an enumerable list of this types it could be accessed two ways: by
calling method <code>getAlertTypes</code> or by accessing to static property
<code>AlertType</code> of Alert class:

    AlertType.ERROR
    AlertType.MESSAGE
    AlertType.SUCCESS
    AlertType.WARNING

Module automatically creates stack of notifications. The purpose of this stack
is to manage multiple notifications. If some notifications needed to be shown,
module will add them into a queue and show them one by one.

Notifications could be added or removed.

When something happens with alert, its DOM-element fires event. There are two
kinds of events: show and hide. List of this events is also a static property
of Alert class.

    Alert.EventType.SHOW
    Alert.EventType.HIDE

Here's an example, how to manage show/hide events. Follwing example creates
first alert and then shows second one when first hides.

    var Alert = ring('alerts', 'getAlert');

    var notification = ring('alerts', 'add', 'Message', Alert.AlertType.MESSAGE, 1000);
    var callback = function() {
      ring('alerts', 'add', 'Previous message is hidden', Alert.AlertType.MESSAGE);
    };

    $(notification.getElement()).on(Alert.EventType.HIDE, callback)

### add
Adds new notification to queue and returns its instance. Takes three arguments:
message, type and optional lifetime.
<div><b>message</b> <i>{string}</i> —  text, which will be shown inside notification.</div>
<div><b>type</b> <i>{Alert.AlertType}</i> — value from enumerable list of available types of notification.
<div><b>opt_closeable</b> <i>{boolean=}</i> — optional parameter, which sets alert closeable or not. By default is true.</div>
<div><b>lifetime</b> <i>{number=}</i> — optional lifetime of notification in milliseconds. If this parameter is not passed, notification doesn't disappear, otherwise it will be hidden after defined time.</div>

    var AlertType = ring('alerts', 'getAlertTypes');
    var notification = ring('alerts', 'add', 'Hello world', AlertType.MESSAGE, true, 10000);

Returned instance might be needed to delete notification. Also, there are some
static properties of this class, which might be useful.

It is enumerable list of kinds of alerts, which might be used as IDs of kinds
of notification.

Another static property is enum of eventTypes, which is being fired on
notification DOM-element, when something happens. There are two types of events:
show and hide.

### getAlertTypes
Returns list of available types of alerts.

### getAlert
Returns <code>Alert</code> class.

### getAlerts
Returns class, which manages multiple <code>Alerts</code> stacks.

### remove
Takes one argument: instance of alert or its index in alerts stack. For
example, you could remove first notification by passing 0 to this method,
or you could remove certain alert by passing its instance.

<div><b>alert</b> <i>{Alert|number}</i> — instance or index of alert in stack.</div>

    var AlertType = ring('alerts', 'getAlertTypes');

    // Removal by passing instance.
    var notification = ring('alerts', 'add', 'Notification', AlertType.MESSAGE);
    ring.alerts('remove', notification);

    // Removal by passing index of alert.
    ring('alerts', 'add', 'Another notification', AlertType.MESSAGE);
    ring.alerts('remove', 0);

##Dialog

    var Dialog = ring('dialog', 'showDialog', 'Dialog message',
        ['array', 'of', 'buttons', 'captions'], 'Optional title',
        opt_closeable = true, opt_show = true)

### getDialog
Returns constructor of <code>Dialog</code> class.

### createDialog
Creates and returns instance of new <code>Dialog</code>.
<div><b>content</b> <i>{string}</i> — Content of dialog window.</div>
<div><b>opt_buttons</b> <i>{Array.<string>=}</i> — Optional array of buttons captions. If this argument is not passed, buttons will not be shown.</div>
<div><b>opt_title</b> <i>{string=}</i> — Optional dialog window title.</div>
<div><b>opt_closeable</b> <i>{boolean=}</i> — Whether this dialog can be closed.</div>
<div><b>opt_show</b> <i>{boolean=}</i> — Whether to show this dialog immediately.</div>

### on
Adds event handler for <code>Dialog</code> element.
<div><b>dialog</b> <i>{Dialog}</i></div>
<div><b>eventType</b> <i>{string|Dialog.EventType}</i></div>
<div><b>handler</b> <i>{function}</i></div>

### off
Removes event handler.
<div><b>dialog</b> <i>{Dialog}</i></div>
<div><b>opt_eventType</b> <i>{string|Dialog.EventType=}</i> — Optional event type. If not passed, all handlers for given instance of <code>Dialog</code> will be removed</div>
<div><b>opt_handler</b> <i>{function=}</i> — Optional handler. If not passed, all subscriptions to given eventType will be removed.</div>

### getEventTypes
Returns enumerable list of available event types for <code>Dialog</code>.
