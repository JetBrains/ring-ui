## Developing a Hub widget
The following commands are available:

  - `npm test` to launch karma tests
  - `npm start` to run a local development server
  - `npm run lint` to lint your code (JS and CSS)
  - `npm run stylelint` to lint CSS only
  - `npm run build` to generate a production bundle (will be available under `dist`)
  - `npm run ci-test` to launch karma tests and report the results to TeamCity

To check your widget, go to the widget playground page located at `<your_hub_server>/dashboard/widgets-playground`.

You may encounter the following problem when using a local development server together with Hub running over HTTPS: all major browsers block insecure scripts. 
In Chrome you can add a security exception: click the security notification in the address bar (the one saying "The page is trying to load scripts from unauthenticated sources") and 
press the "Load unsafe scripts" button. Similar workarounds are available in other browsers as well.

## Introduction into widget development
The `app` folder contains a demo widget that shows a welcome message. Its configuration screen allows selecting the font color.

In this guide we'll show you how to add a new parameter to the configuration screen and use its value in the rendered widget.

Open the `app.js` file, all the changes will be made there.

First of all, import the `Input` component from Ring UI:

```
import Input from '@jetbrains/ring-ui/components/input/input';
```

Configuration screen is rendered by the `renderConfiguration` function. Let's put an input below the select:

```
<Input
  label="What is your name?"
/>
```

To set input's placeholder use the `label` property.

If you haven't launched the dev server yet, run `yarn start`, open the widget playground (`<your_hub_server>/dashboard/widgets-playground`), 
specify the URL of the dev server (e.g., `http://localhost:9010/`) and reload the widget by clicking the corresponding button.

An input we've just added should appear on the configuration screen of the widget.

To store the value of the input in the state of the widget, we add the `onChange` prop:

```
<Input
  label="What is your name?"
  onChange={this.changeName}
/>
```

and implement the `changeName` handler:

```
changeName = e => this.setState({
  username: e.target.value
});
```

To display the value we retrieve it from state in the very beginning of the `renderConfiguration` function together with `selectedColor`:

```
const {selectedColor, username} = this.state;
```

and pass the value into the `Input` as `value` prop:

```
value={username}
```

Our `Input` now looks like this:

```
<Input
  label="What is your name?"
  value={username}
  onChange={this.changeName}
/>
```

Now, we need to persist the value. To do so, Dashboard API comes in handy:

```
const {selectedColor, username} = this.state;
await this.props.dashboardApi.storeConfig({selectedColor, username});
```

Finally, we use the stored value in the `render` method of our widget: 

```
const {username, selectedColor, isConfiguring} = this.state;

...

<h1 style={{color: selectedColor.key}}>{sayHello(username)}</h1>
```

Now we can hit "Reload widget" and see if everything works!

[1]: http://yeoman.io/
