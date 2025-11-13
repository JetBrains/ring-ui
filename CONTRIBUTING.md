### Environment setup

1. (macOS only) Install Xcode Command Line Tools: `xcode-select --install`
2. Install GIT-LFS https://git-lfs.com/
3. Install Node.js@16 (with NPM@8). We suggest using [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n) for Node version management
4. Run `npm install`

### Available commands

To start the server: `npm start` (runs the webpack dev server on http://localhost:9999)

To run tests: `npm test`

To lint code: `npm run lint`

To build production files: `npm run build`

### Component dependency graph for Ring UI 8.0 refactoring

Make refactoring easier by visualizing component dependencies and tracking Ring UI 8.0 migration progress:

```bash
npm run components-graph
```

Opens `components-graph/components-graph.html` with an interactive graph showing component relationships and refactoring status.

**After component refactoring:** 

- Add the component name to `migrated-components.json` to mark it as refactored.
- Or just use the **refactor-component** skill to do it automatically


### Settings

By default, documentation is built using the `development` environment. Use the `--env.production` flag to switch it to `production`. Environment has an effect on source map generation. It also affects the following parameters:

 * **port**
 * **host**
 * **hub** (Hub server URI)
 * **clientId** (Ring UI service client ID in Hub)

### Working with Git and pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and include the YouTrack issue when available. Example: `refactor(components): RG-XXXX Commit title`.
  - The scope in parentheses may be any high-level area you touched (e.g., `components`, `eslint`, `deps`, `teamcity`, `storybook`, ...)
  - For convenience, you may install a [WebStorm plugin](https://plugins.jetbrains.com/plugin/13389-conventional-commit) that helps enforce the Conventional Commits format.
- Prefer squash merges for pull requests when the branch history contains many small sequential or fix commits. The ideal state is 1 task = 1 commit.
- Avoid force-pushing to your branch once someone has started reviewing it. Exceptions:
  - You need to rebase onto `master`
  - You need to make just a quick fix to the latest commit
  - **[After all reviews, just before merging]** You want to manually squash some commits (e.g., fix-ups)
- Do not merge other people’s PRs.



### Beta versions and hotfixes

When we start developing a new major version, we make a branch with name `develop-x.0` and make changes. 
Beta builds could be published by [this configuration](https://teamcity.jetbrains.com/buildConfiguration/JetBrainsUi_RingUi_PublishNext?mode=builds) (you need to pick branch youself!)
When version is ready, we
1. Make a branch from `master` with name `release-x.x` (current version) and put it for like LTE
2. Merge `develop-x.0` into `master` and publish new version

When hotfixes needs to be delivered in old branches, one need to commit fix into that `release-x.x` branch, 
merge `release-x.x -> master` and publish it 
via [this configuration](https://teamcity.jetbrains.com/buildConfiguration/JetBrainsUi_RingUi_PublishHotfixRelease?mode=builds).


### Visual regression testing

Run the development server with `npm start` before executing the commands listed below*

Ring UI uses [Testplane](https://github.com/gemini-testing/testplane) for visual regression testing. Testplane works by taking screenshots and comparing them to existing reference images. 

We use [BrowserStack](https://www.browserstack.com/) as a cloud Selenium grid. In order to use it on your local machine, you need to have a BrowserStack account. 
Credentials can be gathered on [this page](https://www.browserstack.com/accounts/settings).

**If you don't have credentials, ask project contributors how can you get them.**

Set your username and access token as environment variables:
```
export BROWSERSTACK_NAME=yourlogin
export BROWSERSTACK_KEY=yourkey
```
 
 Or prepend these variables before your commands:
 `BROWSERSTACK_NAME=**** BROWSERSTACK_KEY=**** npm run screenshots-test`

After you make some visual changes, run `npm run screenshots-test` to make sure there are no regressions.

To update the reference images for a certain component (for example, `alert`):
`npm run screenshots-gather -- -- --grep Components/Alert`.

### Accessibility audit

It is very important for web components to be accessible for everyone. We have some accessibility tests set up.

To check current status on CI you may check [teamcity configuration](https://teamcity.jetbrains.com/buildConfiguration/JetBrainsUi_RingUi_A11yAudit).

To run tests locally, run `npm run a11y-audit`. Also, there is "Accessibility" tab on storybook pages, 
so every component could be inspected via running storybook (`npm start`) and then checking this tab.

### Updating color variables from Figma

- Go to https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI--Internal-?m=auto&node-id=1-58
- In "Plugins" tab, find and run "variables2css"
- Select "Theme/Light" and "Theme/Dark"
- In "Config", select "Type": "Json" and "Color": "hex"
- Click "Generate" and then "Copy"
- Paste the copied text into `/design-tokens.json`
- Run `npm run update-styles`

### Creating a new Story

1. Copy the base story template: [template.stories.tsx](.storybook/template/template.stories.tsx)

2. Rename it to your component (e.g. `button.stories.tsx`) and adjust imports and metadata.

Storybook will automatically generate docs with an example, import section, and props table.  
If you need a custom documentation layout (extra sections, guidelines, etc.),  
use [template.mdx](.storybook/template/template.mdx) as a starting point.


