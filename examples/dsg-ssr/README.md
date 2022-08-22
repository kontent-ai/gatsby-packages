# Gatsby DSG and SSR Example

[![Netlify Status](https://api.netlify.com/api/v1/badges/b71c750d-4c9f-4a8f-9484-bafa7c2ce019/deploy-status)](https://app.netlify.com/sites/kontent-gatsby-example-dsg-ssr/deploys)

The following example sites are showcasing the possibilities of [Static Site Generation](https://v4.gatsbyjs.com/docs/how-to/rendering-options/using-deferred-static-generation/) and [Server side Rendering](https://v4.gatsbyjs.com/docs/how-to/rendering-options/using-server-side-rendering/).

## Get started

⚠ Before running any of the following scripts locally ensure the site is using the latest dependencies

```sh
# In the root folder of this repo
yarn # install all required packages
yarn build # build the latest version of the local packages
```

### Develop site

```sh
# open the /example/dsg-ssr folder
cd examples/dsg-ssr
yarn develop # runs `gatsby develop` command
```

Now you could browse the site on <http://localhost:8000> and see GraphiQL explorer on <http://localhost:8000/___graphql>.

## Content modeling

This section explains how the content is modeled. You could follow to the next section ["Import the content to your on Kontent.ai project"](#Import-site-content-to-your-Kontent-project) and explore the models on your own as well as the sample data based on it. Or you could create models manually to familiarize yourself with the Kontent.ai user interface.

Once you create the content models, you could create content items based on these and the site would be capable to handle the content and render it.

### Kontent.ai content models

Kontent.ai project contains a simple article content base. There is just one content type `Article`. Kontent.ai project is using two languages `en-US` and `cs-CZ` for possible extendability in the future.

#### Article content type

This content type - `Article item` - has following structure:

- Title - **Text** element
- Content - **Text** element
- Date - **Date & Title** element
- Slug - **URL slug** element - auto-generated from title

This content type represents an article, first four elements (`Title`, `Content`, and `Date`) are meant to be used for some sample content that should be displayed on site. The `Content` element is set to simple text because of simplicity. Rich text element type possibilities are described in [Resolution example](../resolution#readme). The `Slug` element is used to route registration.

## Features

Following features are described on simple real-life use cases.

There are two listing-detail examples on the site that are able to display content based on the content type `Article`. The first listing is using the [Static Site Generation](https://v4.gatsbyjs.com/docs/how-to/rendering-options/using-deferred-static-generation/) feature and the second listing-detail showcase is using the [Server side Rendering](https://v4.gatsbyjs.com/docs/how-to/rendering-options/using-server-side-rendering/) feature.

If you run `yarn run build:dsg-ssr` command in the root of this monorepo (after `yarn install` for installing all required dependencies) you will get this as a part of the output:

```plain
Pages

┌ src/pages/index.js
│ └   /
├ src/pages/dsg-listing/index.js
│ └   /dsg-listing/
├ src/pages/ssr-listing/index.js
│ └   /ssr-listing/
├ src/pages/dsg-listing/{kontentItemArticle.elements__slug__value}.js
│ ├ D /dsg-listing/a-brief-history-of-typography/
│ └ D ...4 more pages available
└ src/pages/ssr-listing/{kontentItemArticle.elements__slug__value}.js
  ├ ∞ /ssr-listing/a-brief-history-of-typography/
  └ ∞ ...4 more pages available

  ╭────────────────────────────────────────────────────────────────╮
  │                                                                │
  │   (SSG) Generated at build time                                │
  │ D (DSG) Deferred static generation - page generated at runtime │
  │ ∞ (SSR) Server-side renders at runtime (uses getServerData)    │
  │ λ (Function) Gatsby function                                   │
  │                                                                │
  ╰────────────────────────────────────────────────────────────────╯
```

This overview summarized in what mode were the pages set up to be rendered.

### Static site generation

Static site regeneration is using collection routes from [Gatsby file system routing](https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/) to fetch the articles from example Kontent.ai project. The DSG article detail component module exports config objects defining the page HTML should be generated after the request (data are still fetched at build time).

```js
export async function config() {
  return () => {
    return {
      defer: true,
    }
  }
}
```

> See [DSG Article detail page component](./src/pages/dsg-listing/{kontentItemArticle.elements__slug__value}.js) for the implementation.

### Server side rendering

Server side rendering is completely isolated from Gatsby GraphQL model when generating the page. The data is fetched at the request time. In this example, Kontent.ai Graphql API is used as a source of article content. ANd it is being fetch by standard [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```js
export async function getServerData(context) {
  try {
    const response = await fetch(`https://graphql.kontent.ai/${projectId}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `
        query ssrArticleQuery($slug: String!, $language: String!) {
          article_All(where: {slug: {eq: $slug}}, limit: 1, languageFilter: {languageCodename: $language}) {
            items {
              title
              date
              content
            }
          }
        }`,
        variables: {
          slug: context.params.elements__slug__value,
          language: language,
        },
      }),
    }).then(res => res.json())

    return {
      props: response.data.article_All.items[0],
    }
  } catch (error) {
    return {
      status: 500,
      headers: {},
      props: {},
    }
  }
}
```

> See [SSR Article detail page component](./src/pages/ssr-listing/{kontentItemArticle.elements__slug__value}.js) for the implementation.

## Import site content to your Kontent.ai project

If you want to import content types with the sample content in your own empty project, you could use following guide:

1. Go to [app.kontent.ai](https://app.kontent.ai) and [create an empty project](https://docs.kontent.ai/tutorials/set-up-kontent/projects/manage-projects#a-creating-projects)
1. Go to "Project Settings", select API keys and copy `Project ID`
1. Install [Kontent.ai Backup Manager](https://github.com/kontent-ai/backup-manager-js) and import data to newly created project from [`kontent-backup.zip`](./kontent-backup.zip) file (place appropriate values for `apiKey` and `projectId` arguments):

   ```sh
   npm i -g @kontent-ai/backup-manager

   kbm --action=restore --apiKey=<Management API key> --projectId=<Project ID> --zipFilename=kontent-backup
   ```

1. Go to your Kontent.ai project and [publish all the imported items](https://docs.kontent.ai/tutorials/write-and-collaborate/publish-your-work/publish-content-items).

### Connect the site to a custom project

Open the `gatsby-config.js` file and set the following properties for `@kontent-ai/gatsby-source` plugin:

- `projectId` from _Project settings > API keys > Delivery API > Project ID_
- `languageCodenames` from _Project settings > Localization_
