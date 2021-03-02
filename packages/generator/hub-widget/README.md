# Getting Started
1. Install [`Yeoman`][1] and Ring UI generator: 

    ```
    npm install -g yo @jetbrains/generator-ring-ui
    ```
    
2. Change to the root directory of your widget (create one if necessary) and run

    ```
    yo @jetbrains/ring-ui:hub-widget
    ```

    Enter the name of the widget (defaults to current directory name), widget description, and author, and let Yeoman create project files and install all the dependencies.

3. Your project is ready to be developed. The following commands are available:
    - `npm test` to launch karma tests
    - `npm start` to run a local development server
    - `npm run lint` to lint your code (JS and CSS)
    - `npm run stylelint` to lint CSS only
    - `npm run build` to generate a production bundle (will be available under `dist`)
    - `npm run create-component` to create a new component template with styles and tests
    - `npm run ci-test` to launch karma tests and report the results to TeamCity

4. To check your widget, go to the widget playground page located at `<your_hub_server>/dashboard/widgets-playground`.

You may encounter the following problem when using a local development server together with Hub running over HTTPS: all major browsers block insecure scripts. 
In Chrome you can add a security exception: click the security notification in the address bar (the one saying "The page is trying to load scripts from unauthenticated sources") and 
press the "Load unsafe scripts" button. Similar workarounds are available in other browsers as well.

[1]: http://yeoman.io/
