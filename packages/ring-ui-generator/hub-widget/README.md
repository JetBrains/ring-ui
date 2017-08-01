# Getting Started
1. Install [`Yeoman`][1] and Ring UI generator: 

    npm install -g yo generator-ring-ui
2. Go to the root directory of your widget (create one if necessary) and run

    yo ring-ui:hub-widget

    Enter widget name (defaults to current directory name), widget description, and author and let Yeoman create project files and install all the dependencies.

3. Your project is ready to be developed. The following commands are available:
    - `npm test`  to launch karma tests
    - `npm start` to run a local development server
    - `npm run lint` to lint your code (JS and CSS)
    - `npm run stylelint` to lint CSS only
    - `npm run build` to generate a production bundle (into `dist` folder)
    - `npm run create-component` to create a new component template with styles and tests
    - `npm run ci-test` to launch karma tests and use TeamCity reporter

4. To check your widget go to the widget playground page located at `/dashboard/widgets-playground`, i.e. if your server is `https://hub.jetbrains.com`, you should open `https://hub.jetbrains.com/dashboard/widgets-playground`

There’s a problem with local dev-server and hub running over secure HTTPS: all major browsers block insecure scripts. However, Chrome allows to add exception, just click security notification in the address bar (the one saying "The page is trying to load scripts from unauthenticated sources") and click "Load unsafe scripts" button

[1]: http://yeoman.io/