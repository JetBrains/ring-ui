---
collection: docs
title: Migrating to Ring UI 2.3.0
order: 3
---

### ES6, ES.Next, Babel
We now use many of ES6 (and even ES7) features, such as:

* let and const
* classes
* bind operator (::)
* Promises
* modules
* arrow functions
* and many more

Some of these features are not implemented in browsers yet,
so we use [Babel transpiler](https://babeljs.io/) to implement (or simulate) them.

* a full list of supported [ES6 features](https://babeljs.io/docs/learn-es2015/)
* about experimental [ES7 features](https://babeljs.io/docs/usage/experimental/)


### React
We now use ES6 class syntax. So a declaration of a new component now looks like:
```js
class MyComponent extends React.Component {
}
```

Instead of:
```js
var MyComponent = React.createClass({
});
```

In addition we have introduced an abstract Ring component that you can (and should!) inherit your components from:
```js
class MyComponent extends RingComponent {
}
```

That will give you some nice helper features.

Also we have upgraded React itself from 0.11 to 0.14 which brings more important changes.

Key changes:
* React package was splitted into two: **React** and **ReactDOM**
* **renderComponent** method was renamed to **render**
* Instead of **Component()** we now have to do **React.createElement(Component)**
* **setProps** was deprecated (you can use our own **rerender** method instead)
* **getDOMNode** was replaced with **ReactDOM.findDOMNode** (you also can use our own **node** property)
* **transferPropsTo** was deprecated and we can now use awesome spread operator **{...}** instead
* We do not use React mixins anymore (because it was an antipattern and because of incompatibility with ES6 classes).
Use other design patterns, such as inheritance, composition or decorator.
* React addons were separated into several packages (react-addons-create-fragment, react-addons-test-utils, etc.)
* The React team no longer supports the classSet addon and it has moved to a separate project [classnames](https://www.npmjs.com/package/classnames)
* **getInitialState** and **getDefaultProps** methods became instance properties: **state** and **defaultProps**

Full changes:
* [React 0.12](https://facebook.github.io/react/blog/2014/10/28/react-v0.12.html)
* [React 0.13](https://facebook.github.io/react/blog/2015/03/10/react-v0.13.html)
* [React 0.14](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html)

### RingComponent
RingComponent is a common abstract class for all of Ring UI React components.

It provides a static **factory** method to simplify React elements creation.
So you can do this:

```js
ReactDOM.render(MyComponent.factory({}), document.getElementById('container'));
```

Instead of:

```js
ReactDOM.render(React.createElement(MyComponent, {}), document.getElementById('container'));
```

Also RingComponent provides an instance method called **rerender** (which works like deprecated **setProps**)
as well as a **node** property (which can be used instead of deprecated **getDOMNode**).

RingComponent uses native React lifecycle methods to do some magic, so we decided our components will use our own shorthand lifecycle methods:

* willMount
* didMount
* willReceiveProps
* shouldUpdate
* willUpdate
* didUpdate
* willUnmount

Normally, you SHOULD NOT use native React lifecycle methods. If you try to override any of these methods, RingComponent will throw an exception.
If you're absolutely sure you need it, you can disable this check using static property **letOverrideLifecycleMethods**.

### RingComponentWithShortcuts
RingComponentWithShortcuts is an additional abstract class inherited from RingCompoent that
provides four new instance methods (and a little bit of dark magic) for using keyboard shortcuts.

* getUID
* toggleShortcuts
* setShortcutsEnabled
* shortcutsEnabled

### jQuery, mout, when.js & polyfills
We do not use **jQuery** and **when.js** anymore (and we hope to stop using **mout** too).
Instead, we now use standard DOM API capabilities (such as querySelector and getBoundingClientRect),
new shiny DOM4 features (matches, append, query)
and some ES6 features (Promises, Maps, Sets, etc.).

Some of these features are not implemented in browsers yet,
so we use [Babel transpiler](https://babeljs.io/) and [DOM4 polyfill](http://webreflection.github.io/dom4/) to implement (or simulate) them.

(Of course, we still have jqLite which is shipped with Angular, but we do not recommend using it, if possible).
