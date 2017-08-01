## Hub-Widget
The widget is ready to be developed. The following commands are available:

  - `npm test`  to launch karma tests
  - `npm start` to run a local development server
  - `npm run lint` to lint your code (JS and CSS)
  - `npm run stylelint` to lint CSS only
  - `npm run build` to generate a production bundle (into `dist` folder)
  - `npm run ci-test` to launch karma tests and use TeamCity reporter

To check your widget go to the widget playground page located at `/dashboard/widgets-playground`, i.e. if your server is `https://hub.jetbrains.com`, you should open `https://hub.jetbrains.com/dashboard/widgets-playground`

There’s a problem with local dev-server and hub running over secure HTTPS: all major browsers block insecure scripts. However, Chrome allows to add exception, just click security notification in the address bar (the one saying "The page is trying to load scripts from unauthenticated sources") and click "Load unsafe scripts" button

## Development kick-start
Demo widget is capable of showing a welcome message and switching to configuration mode to select font color.

This kick-start shows how to add text input to the widget's configuration and use its value in the welcome message.

All the changes are going to happen in the `app.js` file.

First of all, we import `Input` component from Ring UI

    import Input from '@jetbrains/ring-ui/components/input/input';
just like  `Select` component is imported.

Configuration mode is rendered by `renderConfiguration` function, so add an instance of the `Input` there, right after `Select` component

    <Input
      label="What is your name?"
    />
To show a placeholder in an empty input `label` prop is used.

In case dev server is not launched yet, run `yarn start`, open widget playground (`/dashboard/widgets-playground`), paste dev server URL there (e.g. `http://localhost:9010/`) and reload widget by clicking the corresponding button.

Now input with placeholder should appear in the configuration mode of the widget.

To store widget's value in its state, we add `onChange` prop

    <Input
      label="What is your name?"
      onChange={this.changeName}
    />

and implement `changeName` handler

    changeName = e => this.setState({
      username: e.target.value
    });
To see saved value in the input we get it from state in the very beginning of the `renderConfiguration` function altogether with `selectedColor`

    const {selectedColor, username} = this.state;

and pass this value into the `Input` as `value` prop:

    `value={username}`
Now our `Input` looks like

    <Input
          label="What is your name?"
          value={username}
          onChange={this.changeName}
        />

The problem now is that the input's value is not saved and not used in widget itself, let's fix it by editing `saveConfig` method to extract username from the state and save it to the config:

    const {selectedColor, username} = this.state;
    await this.props.dashboardApi.storeConfig({selectedColor, username});

Finally, we use value from config to display it in our widget in the `render` method 

    const {username, selectedColor, isConfiguring} = this.state;
and then use this value as argument to the `sayHello` call

    <h1 style={{color: selectedColor.key}}>{sayHello()}</h1>

Now we can hit "Reload widget" and check if everything works!

[1]: http://yeoman.io/
