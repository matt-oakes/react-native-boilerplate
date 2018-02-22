# Matt Oakes' React Native Boilerplate

This is the boilerplate that [Matt Oakes](https://mattoakes.net) uses as a way to bring up new React Native projects.

**I do not recommend using this boilerplate for your own projects. Is it mainly for my own personal use and is not likely to meet your needs or be kept up-to-date. I recommend that you use one of the [official Ignite boilerplates](https://github.com/infinitered/ignite/blob/master/BOILERPLATES.md) instead.**

Currently includes:

**App Foundations**
* `react-native@0.52.0` - The cross platform foundations of the app.
* `react-navigation` - Handle navigation with integration with redux.
* `react-native-i18n` - Allows strings to be localised.
* `redux` - The main state management framework.
* `redux-persist` - Handles persisting and loading parts of the app state on load.
* `redux-saga` - Handles long running and complex flows of actions using generators.
* `reselect` - Allows selectors to be composed and memorized.

**Code Linting & Testing**
* `husky` - Runs code styling on commit and the tests on push to avoid errors being missed.
* `flow` - Adds type checking to the application.
* `prettier` - Automatically sets the code style.
* `eslint` - Lint checking the application and running prettier.
* `jest` - Main testing framework with mocking, spies, and expectations built-in.
* `storybook` - Component test cases with snapshot testing using storyshots.
* `remote-redux-devtools` - Allow inspecting and time travel for the redux state.
* `fetch-mock` - Allows mocking the network requests for testing.
* `enzyme` - Shallow component testing.
* `redux-saga-tester` - Test harness for redux sagas.
* `timekeeper` - Allows mocking of the current date and time.

## Quick Start

When you've installed the [Ignite CLI](https://github.com/infinitered/ignite), you can get started with this boilerplate like this:

```
ignite new MyLatestCreation --boilerplate matt-oakes-react-native-boilerplate
```
