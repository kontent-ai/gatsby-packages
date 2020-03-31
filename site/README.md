# Gatsby development site for Kentico Kontent packages

[![Netlify Status](https://api.netlify.com/api/v1/badges/f1a1ebfd-e0c7-4f52-9705-974e605fb8d4/deploy-status)](https://app.netlify.com/sites/gatsby-starter-kontent-hello-world/deploys)

[![Live demo](https://img.shields.io/badge/-Live%20Demo-brightgreen.svg)](https://gatsby-starter-kontent-hello-world.netlify.com/)

[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)

A site using for development purposes and code examples showcasing packages possibilities.

## Get started

:warning: Before running any of the following scripts locally ensure the site is using the latest commands

```sh
yarn # install all required packages
yarn build # build the latest version of the packages

```

### Develop site

```sh
yarn develop # runs `gatsby develop` command
```

### Lint code

```sh
yarn lint
```

### Build site

```sh
yarn build # runs `gatsby build` command
```

## Examples

The following examples are showcasing, how it is possible to use the Kontent packages. There are many possibilities that Gatsby offers to adjust the data you need before using them in the application.

All of the examples are in [examples.js](examples.js).

### URL resolution

  resolveUrls(api)

### Language variant relationships

  addLanguageLinks(api, "article")

### Content type -> Content Item resolution

  addKontentTypeItemsLink(api)

### Link showcasing where is the item used `usedByContentItems`

  linkUsedByContentItems(api, "article", "tag", "tags", "used_by_articles")

---
Based on [official Gatsby Hello World starter](https://github.com/gatsbyjs/gatsby-starter-hello-world).
