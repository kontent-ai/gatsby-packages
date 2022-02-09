# Gatsby DSG and SSR Example

// TODO
[![Netlify Status](https://api.netlify.com/api/v1/badges/27d162a0-612b-4d8f-8382-40eee4f6b5d9/deploy-status)](https://app.netlify.com/sites/kontent-gatsby-example-relationships/deploys)

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

This section explains how the content is modeled. You could follow to the next section ["Import the content to your on Kontent project"](#Import-site-content-to-your-Kontent-project) and explore the models on your own as well as the sample data based on it. Or you could create models manually to familiarize yourself with the Kontent user interface.

Once you create the content models, you could create content items based on these and the site would be capable to handle the content and render it.

### Kontent content models

Kontent project contains a simple article content base. There is just one content type `Article`. Kontent project is using two languages `en-US` and `cs-CZ` for possible extendability in the future.

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

### Static site generation

### Server side rendering

#### Implementation details

// TODO

As mentioned, to [`createSchemaCustomization`](https://www.gatsbyjs.com/docs/node-apis/#createSchemaCustomization) method is used to create a relationships. In this case the method used to link language variants is named `linkLanguageVariants` and [this is its source code](./example-languages-variants.js). This method basically using `buildObjectType` method to extend the type specified by the method argument. The GraphQL type name is generated from content type codename using `getKontentItemNodeTypeName` method from source plugin.

Method responsible for filling the fields with data is a called `resolve`. For `fallback_used` it is pretty straightforward, but for `other_languages` it [is more complicated](./example-languages-variants.js#L27). Take a look to the code comments for possible modifications that changes what data is being retrieved to the field.

Once you extend the schema, it is possible to query the data using GraphQL like that:

```gql
{
  allKontentItemArticle {
    nodes {
      fallback_used
      preferred_language
      system {
        language
        codename
      }
      elements {
        title {
          value
        }
      }
      other_languages {
        fallback_used
        preferred_language
        system {
          language
          codename
        }
        elements {
          title {
            value
          }
        }
      }
    }
  }
}
```

## Import site content to your Kontent project

If you want to import content types with the sample content in your own empty project, you could use following guide:

1. Go to [app.kontent.ai](https://app.kontent.ai) and [create an empty project](https://docs.kontent.ai/tutorials/set-up-kontent/projects/manage-projects#a-creating-projects)
1. Go to "Project Settings", select API keys and copy `Project ID`
1. Install [Kontent Backup Manager](https://github.com/Kentico/kontent-backup-manager-js) and import data to newly created project from [`kontent-backup.zip`](./kontent-backup.zip) file (place appropriate values for `apiKey` and `projectId` arguments):

   ```sh
   npm i -g @kentico/kontent-backup-manager@3.2.1

   kbm --action=restore --apiKey=<Management API key> --projectId=<Project ID> --zipFilename=kontent-backup
   ```

1. Go to your Kontent project and [publish all the imported items](https://docs.kontent.ai/tutorials/write-and-collaborate/publish-your-work/publish-content-items).

### Connect the site to a custom project

Open the `gatsby-config.js` file and set the following properties for `@kentico/gatsby-source-kontent` plugin:

- `projectId` from *Project settings > API keys > Delivery API > Project ID*
- `languageCodenames` from *Project settings > Localization*
