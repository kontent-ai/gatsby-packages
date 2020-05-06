# Gatsby source plugin for Kentico Kontent

## Description

(vNext) Source plugin for Kentico Kontent REST Delivery API.

This repo contains a [Gatsby (v2) source plugin](https://www.gatsbyjs.org/docs/recipes/sourcing-data) that retrieves data from the [Kentico Kontent](https://kontent.ai) REST Delivery API.

## How to install

Gatsby documentation uses `npm` for installation. This is the recommended approach for plugins as well.
This plugin does not need to use `yarn`, if want to use it in you project, see [the documentation for switching package managers](/docs/gatsby-cli/#how-to-change-your-default-package-manager-for-your-next-project).

1. Install the [@kentico/gatsby-source-kontent](https://www.npmjs.com/package/@kentico/gatsby-source-kontent) NPM package.

   ```sh
   npm install --save @kentico/gatsby-source-kontent
   ```

1. Configure the plugin in `gatsby-config.js` file.

   ```js
   module.exports = {
     plugins: [
       {
         resolve: '@kentico/gatsby-source-kontent',
         options: {
           projectId: '<ProjectID>', // Fill in your Project ID
           languageCodenames: [
             'default', // Languages in your project (Project settings -> Localization),
           ],
         },
       },
     ],
   };
   ```

## Available options

- `projectId`\* - \<`string`\> Project ID from Project settings -> API keys
- `languageCodenames`\* - \<`string[]`\> array of language codenames that defines [what languages a configured for the project](https://docs.kontent.ai/tutorials/develop-apps/get-content/getting-localized-content?tech=javascript#section-project-languages) - the first one is considered as the **default one**. Initial "Getting started" project has configured just one language `default`.
- `includeTaxonomies` - \<`boolean`\> include [taxonomies](#Querying-Kontent-Taxonomies) to GraphQL model. Turned off by default.
- `includeTypes` - \<`boolean`\> include [types](#Querying-Kontent-Types) to GraphQL model. Turned off by default.
- `authorizationKey` - \<`string`\> For preview/secured API key - depends on `usePreviewUrl` config. Consider using [dotenv](https://www.npmjs.com/package/dotenv) package for storing keys securely in environment variables.
- `usePreviewUrl` - \<`boolean`\> when `true`, "`preview-deliver.kontent.ai`" used as [primary domain for data source](https://docs.kontent.ai/reference/delivery-api#section/Production-vs.-Preview). Turned off by default.
- `proxy`:
  - `deliveryDomain` - \<`string`\> Base url used for all requests. Defaults to `deliver.kontent.ai`.
  - `previewDeliveryDomain` - \<`string`\> Base url used for preview requests. Defaults to `preview-deliver.kontent.ai`.
- `includeRawContent` - \<`boolean`\> allows to include `internal.content` property as a part fo the GraphQL model. Turned off by default.

  \* required property

Since the plugin is using [Gatsby Reporter](https://www.gatsbyjs.org/docs/node-api-helpers/#reporter) for error logging. You could [turn on `--verbose` option](https://github.com/gatsbyjs/gatsby/pull/19199/files) to see the whole error object. Be careful with these options, the output log could contain some sensitive data such as `authorizationKey`.

## Examples of usage

An example showing how to include this plugin in a site's `gatsby-config.js` file.

```js
module.exports = {
  plugins: [
    /// ...
    {
      resolve: '@kentico/gatsby-source-kontent',
      options: {
        projectId: '09fc0115-dd4d-00c7-5bd9-5f73836aee81', // Fill in your Project ID
        languageCodenames: [
          'default', // Or the languages in your project (Project settings -> Localization),
          'Another_language',
        ],
        includeTaxonomies: true, // opt-out by default
        includeTypes: true, // opt-out by default
        usePreviewUrl: true, // false by default
        authorizationKey: '<API KEY>', // for preview/secured API key - depends on `usePreviewUrl` setting - consider using environment variables to store the key securely
        includeRawContent: true, // opt-out by default - include `internal.content` property in the gatsby nodes
        proxy: {
          deliveryDomain: 'custom.delivery.kontent.my-proxy.com',
          previewDeliveryDomain: "custom.preview.delivery.kontent.my-proxy.com"
        }
      },
    },
    /// ...
  ],
};
```

The plugin creates GraphQL nodes for all Kentico Kontent taxonomies, content types, content items language variants.

The queries start with `kontentTaxonomy`, `kontentType`, or `kontentItem` prefix (respectively `allKontentTaxonomy`, `allKontentType`, or `allKontentItem`) and their type is `kontent_taxonomy_X`, `kontent_type_X`, or `kontent_item_X` where `X` is a codename of the `taxonomy`, `type`, or `item`.

> Look at the [How to query for data](#How-to-query-for-data) section for example queries.

GraphQL nodes produced by the source plugin provide the same structure as [Kontent Delivery REST API](https://docs.kontent.ai/reference/delivery-api), but there are alternations for better usability, you could find more detailed description in [Delivery API alternations](#Delivery-API-alternations) section

### Learning Resources

To see upgrade instructions see [Upgrade section](./docs/UPGRADE.md).

For more developer resources, visit the [Kentico Kontent Docs](https://docs.kontent.ai).

## Delivery API alternations

Some of the data from Kontent Delivery API requires to be altered or extended to be usable in Gatsby. There is a list of them with its description.

### Preferred language

Besides of `system.language` every Kontent item node contains the property `preferred_language` to distinguish which language version it represents. Using this property, it is easy to distinguish whether the language fallback is used. When `preferred_language` is not the same as `system.language`, Kontent item was not translated to `preferred_language` and the delivery API returned fallback language (`system.language`).

### Linked items as links

Each _linked items_ element in **linked items element** as well as in **rich text element** is using [Gatsby GraphQL node references](https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship) that can be used to traverse to the nodes linked through the use of the _Linked items_ element.

The resolution is using the `createFieldExtension` called `languageLink` that is resolving the codenames. [Embedded `@link` extension](https://www.gatsbyjs.org/docs/schema-customization/#foreign-key-fields) is not used because the links have to be resolved by `preferred_language` as well as `system.codename` equality and embedded link resolution allow using only one field to make the links out of the box.

Linked Items element

```gql
query PersonQuery {
  allKontentItemPerson {
    nodes {
      elements {
        friends {
          value {
            ... on kontent_item_person {
              id
              elements {
                name_and_surname {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Rich text element

```gql
query PersonQuery {
  allKontentItemPerson {
    nodes {
      elements {
        bio {
          modular_content { // inline linked items as well as content components
            ... on kontent_item_website {
              id
              elements {
                name {
                  value
                }
                url {
                  value
                }
              }
            }
          }
          value
        }
      }
    }
  }
}
```

### Rich text images and links

Kontent REST API returns images and links for Rich Text element in the form of the object, not as an array:

```json
{
  "bio": {
    "type": "rich_text",
    "name": "Bio",
    "images": {
      "fcf07d43-46d4-46ef-a58d-c7bf7a4aecb1": {
        "image_id": "fcf07d43-46d4-46ef-a58d-c7bf7a4aecb1",
        "description": null,
        "url": "https://assets-us-01.kc-usercontent.com:443/09fc0115-dd4d-00c7-5bd9-5f73836aee81/0faa87b4-9e1e-41b8-8b38-c107cbb35147/2.jpg",
        "width": 1600,
        "height": 1065
      }
    },
    "links": {
      "59002186-1886-48f3-b8ba-6f053b5cf777": {
        "codename": "developer_community_site",
        "type": "website",
        "url_slug": ""
      }
    },
    "modular_content": [],
    "value": "..."
  }
}
```

This wrapper transforms these objects into the arrays. In case of an image the ID of the image is already stored there, in case of link, the id of a link is moved to `linked_id` property. The query then looks like:

```gql
query PersonQuery {
  allKontentItemPerson {
    nodes {
      elements {
        bio {
          images {
            # Object transformed to array
            image_id
            url
            description
            height
            width
          }
          links {
            # Object transformed to array
            codename
            type
            url_slug
            link_id # Newly generated property from object keys
          }
        }
      }
    }
  }
}
```

### Types' `elements` property

Elements property is transformed from object to array.

This is the "Website" type sample. As you can see there is `element` property, which is an object in Kontent delivery REST API.

```json
{
  "system": {
    "id": "aeabe925-9221-4fb2-bc3a-2a91abc904fd",
    "name": "Website",
    "codename": "website",
    "last_modified": "2019-04-01T18:33:45.0353591Z"
  },
  "elements": {
    "url": {
      "type": "text",
      "name": "URL"
    },
    "name": {
      "type": "text",
      "name": "Name"
    },
    "description": {
      "type": "rich_text",
      "name": "Description"
    }
  }
}
```

And here is the example how the source plugin transforms the data.

Query

```gql
{
  kontentType(system: { name: { eq: "Website" } }) {
    system {
      codename
      id
      last_modified
      name
    }
    elements {
      name
      codename
      type
    }
  }
}
```

Result

```json
{
  "data": {
    "kontentType": {
      "system": {
        "codename": "website",
        "id": "aeabe925-9221-4fb2-bc3a-2a91abc904fd",
        "last_modified": "2019-04-01T18:33:45.0353591Z",
        "name": "Website"
      },
      "elements": [
        {
          "name": "URL",
          "codename": "url",
          "type": "text"
        },
        {
          "name": "Name",
          "codename": "name",
          "type": "text"
        },
        {
          "name": "Description",
          "codename": "description",
          "type": "rich_text"
        }
      ]
    }
  }
}
```

## How to query for data

This section should help you with the first queries. For further exploring it is recommended to use [GraphiQL explorer](https://www.gatsbyjs.org/docs/running-queries-with-graphiql/) available in gatsby development environment]. If you are using developer environment for the source plugin development, you could experiment according to the [How to develop locally section](#How-to-develop-locally)

### Querying Kontent Items

Example is showcasing how to query type `article`.
For rich text resolution resolution see [Rich text element component](../gatsby-kontent-components/README.md#Rich-text-element-component).
For url slug resolution see [Rich text element component](../../site/README.md#URL-slug-resolution).

```gql
query ArticleQueries {
  allKontentItemArticle(filter: { preferred_language: { eq: "en-US" } }) {
    # filtering articles in 'en-US' preferred language (see section `Preferred language` for more information)
    nodes {
      elements {
        title {
          value # title of article (text element)
        }
        content {
          # content element (rich text)
          value # plain html
          images {
            image_id
            url
            description
          }
          links {
            link_id
            url_slug
            codename
            type
          }
          modular_content {
            # inline linked items and components data
            ... on kontent_item_author {
              id
              elements {
                name {
                  value
                }
                avatar_image {
                  value {
                    url
                    description
                    name
                  }
                }
              }
            }
          }
        }
        tags {
          # tags element (linked items)
          value {
            ... on kontent_item_tag {
              elements {
                title {
                  value
                }
                slug {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Querying Kontent Types

To query content types it is required to opt-in this in plugin configuration by using `includeTypes` option in the [configuration.](#Available-options).

```gql
query Types {
  allKontentType {
    nodes {
      Type: system {
        # system information about the type
        name
        codename
      }
      elements {
        # type's elements information
        name
        codename
        type
        options {
          # filled in case the element is multiple choice
          codename
          name
        }
        taxonomy_group # filled in case the element is taxonomy
      }
    }
  }
}
```

### Querying Kontent Taxonomies

To query content types it is required to opt-in this in plugin configuration by using `includeTypes` option in the [configuration.](#Available-options).

```gql
query Taxonomies {
  allKontentTaxonomy {
    nodes {
      system { # system information about the type
        name
        codename
      }
      terms { # taxonomy terms
        codename
        name
        terms { # terms are nested according to the model
          codename
          name
          # terms ...
        }
      }
    }
  }
}
```

## How to integrate with Gatsby Cloud

If you choose to maintain you Gatsby site on [Gatsby Cloud](https://gatsbyjs.com), use will need to register two webhooks from Kentico Kontent Kontent to Gatsby Cloud. Follow [the tutorial](./docs/GATSBY-CLOUD.md) for more information. All webhook notification that are not mentioned in the tutorial will be ignored by the plugin.

Please note that change in taxonomies or content types require manual rebuild of the site, because these structural data affects GraphQL schema.

## How to run tests

The package is using [Jest](http://jest.org/) framework for testing.

To run all tests, there is an npm script prepared.

```sh
yarn test # run all tests in the repository
```

## How to develop locally

Use a [development site](../../site/README.md) in development mode. And start watch mode for this repository.

```sh
yarn watch
```

> To run complete development environment, follow the [debug section the master readme](../../README.md#development)

## Tracking usage

The package is including tracking header to the requests to Kentico Kontent, which helps to identify the adoption of the source plugin and helps to analyze what happened in case of error.
If you think that tracking should be optional feel free to raise the feature or pull request.

## Further information

To see upgrade instructions see [Upgrade section](./docs/UPGRADE.md).

For more developer resources, visit the [Kentico Kontent Docs](https://docs.kontent.ai).

### Running projects

- [Kentico Developer Community Site](https://kentico.github.io) [[source code](https://github.com/Kentico/kentico.github.io/tree/source)]
- [Kentico Advantage](https://advantage.kentico.com/) [[source code](https://github.com/Kentico/kentico-advantage/tree/source)]
- [Richard Shackleton's Personal portfolio and blog website](https://rshackleton.co.uk/) [[source code](https://github.com/rshackleton/rshackleton.co.uk)]
- [Aaron Collier's Czech Theather site](https://czechtheater.cz/) [[source code](https://github.com/CollierCZ/czechtheater)]
- [Ilesh Mistry's personal blog site](https://www.ileshmistry.com/)
- [Matt Nield's personal blog site](https://www.mattnield.co.uk) [[Source code](https://github.com/mattnield/mattnield-gatsby)]
- [NetConstruct agency website](https://www.netconstruct.com/)

### Guides and blog posts

- [Sourcing from Kentico Kontent](https://www.gatsbyjs.org/docs/sourcing-from-kontent/)
- [Kentico Cloud & Gatsby Take You Beyond Static Websites](https://www.gatsbyjs.org/blog/2018-12-19-kentico-cloud-and-gatsby-take-you-beyond-static-websites/) by [@ondrabus](https://github.com/ondrabus)
- [Using Gatsby with Kontent
](https://www.gatsbyjs.com/guides/kentico-kontent/)
- [Rendering Kentico Kontent linked content items with React components in Gatsby](https://rshackleton.co.uk/articles/rendering-kentico-cloud-linked-content-items-with-react-components-in-gatsby) by [@rshackleton](https://github.com/rshackleton)
- [Adding and retrieving localized strings from Kentico Kontent to GatsbyJS and GraphQL](https://www.gatsbyjs.org/blog/2019-08-13-localised-strings-from-kentico-cloud-gatsbyjs-graphql/)
- [Automated builds with Netlify and Kentico Kontent webhooks](https://rshackleton.co.uk/articles/automated-builds-with-netlify-and-kentico-cloud-webhooks) by [@rshackleton](https://github.com/rshackleton)
- [Learning about Gatsby schema customisation with Kontent.ai](https://rshackleton.co.uk/articles/learning-about-gatsby-schema-customisation-with-kontent-ai) by [@rshackleton](https://github.com/rshackleton)
- [Implementing search with Gatsby and Algolia](https://rshackleton.co.uk/articles/implementing-search-with-gatsby-and-algolia) by [@rshackleton](https://github.com/rshackleton)
- [Using Gatsby Image with Kentico Kontent](https://rshackleton.co.uk/articles/using-gatsby-image-with-kentico-kontent) by [@rshackleton](https://github.com/rshackleton)

### Previous versions

- For version 2 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v2).
- For version 3 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v3).
- For version 4 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v4).

## How to contribute

Check out the [contributing](/CONTRIBUTING.md) page to see the best places for file issues, to start discussions, and begin contributing.

- _Written according to [Gatsby plugin template](https://www.gatsbyjs.org/contributing/docs-templates/#plugin-readme-template)_
