# Gatsby development site for Kentico Kontent packages

[![Netlify Status](https://api.netlify.com/api/v1/badges/6cd10788-de09-4275-b0c9-daad29733bc9/deploy-status)](https://app.netlify.com/sites/kontent-gatsby-packages/deploys)

[![Live demo](https://img.shields.io/badge/-Live%20Demo-brightgreen.svg)](https://kontent-gatsby-packages.netlify.app)

[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)

A site used for development purposes and code examples showcasing packages possibilities.

## Get started

:warning: Before running any of the following scripts locally ensure the site is using the latest commands

```sh
# In the root folder
yarn # install all required packages
yarn build # build the latest version of the packages

```

### Develop site

```sh
# open the /site folder
cd site
yarn develop # runs `gatsby develop` command
```

Now you could browse the site on <http://localhost:8000> and see GraphiQL explorer on <http://localhost:8000/___graphql>.

### Lint code

```sh
# open the /site folder
cd site
yarn lint
```

### Build site

```sh
# open the /site folder
cd site
yarn build # runs `gatsby build` command
```

## Examples

The following examples are showcasing, how it is possible to use the Kontent packages. There are many possibilities that Gatsby offers to adjust the data you need before using them in the application.

### Navigation example

See [/examples/navigation](../examples/navigation#readme) for the example.

### Rich text and URL slug resolution

See [/examples/resolution](../examples/resolution#readme) for the example.

### Relationships among Kontent GraphQL Nodes

See [/examples/relationships](../examples/relationships#readme) to see how it is possible to make a relationship among the data provided by the [Kontent source plugin](../packages/gatsby-source-kontent#readme).

### Image transformation

There are various ways to render an image on your site.
The best solution is to use [Kontent Image transformation API](https://docs.kontent.ai/reference/image-transformation) API for simple scenarios and [ImageElement](../packages/gatsby-kontent-components#readme) for more complex ones, because it allows to use full power of [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) support.

> See the ["author page"](./src/pages/author.js) as a showcase, how you could render the profile photo different way ([live preview](https://kontent-gatsby-packages.netlify.app/author)).

---

Based on [official Gatsby Hello World starter](https://github.com/gatsbyjs/gatsby-starter-hello-world).
