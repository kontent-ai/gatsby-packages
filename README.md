# Gatsby Kontent Packages

![build](https://github.com/Kentico/gatsby-source-kontent/workflows/build/badge.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)

Monorepo with Gatsby Kontent packages.

The repository contains the development site (`/site`) that could automatically load packages (`packages`) thanks to [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

## Content

### Packages

|                                 Package                                 | Summary                                                                         |                                                                        Version                                                                         |
| :---------------------------------------------------------------------: | :------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------: |
| [Gatsby Source Kontent Plugin](/packages/gatsby-source-kontent#readme)  | plugin providing data from Kentico Kontent REST API to Gatsby GraphQL model     |     [![npm version](https://badge.fury.io/js/%40kentico%2Fgatsby-source-kontent.svg)](https://badge.fury.io/js/%40kentico%2Fgatsby-source-kontent)     |
| [Gatsby Kontent Components](/packages/gatsby-kontent-components#readme) | package containing React components useful when processing Kontent data to site | [![npm version](https://badge.fury.io/js/%40kentico%2Fgatsby-kontent-components.svg)](https://badge.fury.io/js/%40kentico%2Fgatsby-kontent-components) |

### Site

- [Development Site](/site#readme) - Site using for development purposes and code examples showcasing packages possibilities

### Examples

#### Navigation showcase

- [Navigation showcase](/examples/navigation#readme) - Showcase including the navigation best practices. Description, how to do the content modeling with all benefits of the modular content as well as have tree-based menu structure.

## Development

### Prerequisites

- [Nodejs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/) - **[npm](https://www.npmjs.com/) is not supported for development**, because of workspaces support lack.

> It is completely OK to use npm as a package manager in your application, npm is not supported just the packages development.

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

### How to publish new version

If you have the rights to publish packages, just use [`lerna`](https://github.com/lerna/lerna/tree/master/commands/publish#readme) and specify the version when prompted. All the changes made by lerna are automatically committed.

A typical scenario is when everything is ready and you want to publish the version, just use command.

```sh
npx lerna publish --tag-version-prefix=''
```

That should summarize the publish information and prompt you to define the version number and acknowledge the publish. Once everything is OK and you acknowledge the publish:

- the new version is published to npm
- `<YOUR VERSION>` is set to [`lerna.json`'s `version`](lerna.json)
- commit with this change (and package.json files version changes) is pushed to the repository
  - commit also contains tag `<YOUR VERSION>` that could be used for creating GitHub release if you want

:bulb: If you want to test out the beta version first (which is recommended) use following command and if everything is OK, release another patch version as the final version.

```sh
npx lerna publish --tag-version-prefix='' --dist-tag=beta
```

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/kontent-gatsby-packages?pixel)
