# Gatsby Kontent Packages

![vNext build](https://github.com/Kentico/gatsby-source-kontent/workflows/vNext%20build/badge.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Monorepo with Gatsby Kontent packages.

The repository contains the development site (`/site`) that could automatically load packages (`packages`) thanks to [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

## Content

### Packages

- [Gatsby Source Kontent Plugin](/packages/gatsby-source-kontent#readme) - plugin providing data from Kentico Kontent REST API to Gatsby GraphQL model
- [Gatsby Kontent Components](/packages/gatsby-kontent-components#readme) - a package containing React components useful when processing Kontent data to site

### Site

- [Development Site](/site#readme) - Site using for development purposes and code examples showcasing packages possibilities

## Development

### Prerequisites

- [Nodejs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/) - **[npm](https://www.npmjs.com/) is not supported for development**, because of workspaces support lack.

### Install

1. Install packages

    ```sh
    yarn # install all npm dependencies in the repository
    ```

2. Start watch mode packages

    ```sh
    yarn watch # run watch mode through all packages source code
    ```

3. Run development site

    ```sh
    yarn develop:site # run `gatsby develop` command in the development site
    ```

Now you are good to go. You could start browsing <http://localhost:8000> for development site and <http://localhost:8000/___graphql> for [GraphiQL explorer](https://github.com/graphql/graphiql/blob/master/packages/graphiql/README.md).

### Tests

To run all tests, there is npm script prepared.

```sh
yarn test # run test script in all packages as well as in the development site
```

- Packages are using [Jest](http://jest.org/) framework for testing.

### Build

To build all of the packages as well as a development site, you could use one command.

  ```sh
  yarn build # run build script in all packages as well as in the development site
  ```

### Lint

To lint all of the packages as well as a development site, you could use one command.

  ```sh
  yarn lint # run lint script in all packages as well as in the development site
  ```

- Packages are using [ESLint](https://eslint.org/) with Typescript plugins for linting.

## Publishing

As a publishing framework, there is a [Lerna](https://github.com/lerna/lerna) framework set up. This package is using [Fixed/Locked mode](https://github.com/lerna/lerna#fixedlocked-mode-default). All minor and major changes should publish all packages, in case of patch version, it is up to developer decision.

### How to publish new (vNext) version

If you have the rights to publish packages, just use [`lerna publish`](https://github.com/lerna/lerna/tree/master/commands/publish#readme) with appropriate tags and then specify the version when prompted. All the changes made by lerna are automatically committed.

A typical scenario is when everything is ready and you want to publish the version, just use command.

```sh
yarn publish:vnext
```

That should summarize the publish information and prompt you to define the version number and acknowledge the publish. Once everything is OK and you acknowledge the publish:

- the new version is published to npm
- `<YOUR VERSION>` is set to [`lerna.json`'s `version`](lerna.json)
- commit with this change (and package.json files version changes) is pushed to the repository
  - commit also contains tag `<YOUR VERSION>` that could be used for creating GitHub release if you want
