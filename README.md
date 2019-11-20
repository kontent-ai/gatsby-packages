# Gatsby source plugin for Kentico Kontent

[![Gatsby plugin library](https://img.shields.io/badge/Gatsby%20plugin%20library-%23663399.svg)](https://www.gatsbyjs.org/packages/@kentico/gatsby-source-kontent)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)

[![npm version](https://badge.fury.io/js/%40kentico%2Fgatsby-source-kontent.svg)](https://badge.fury.io/js/%40kentico%2Fgatsby-source-kontent)
[![Build Status](https://api.travis-ci.com/Kentico/gatsby-source-kontent.svg?branch=master)](https://travis-ci.com/Kentico/gatsby-source-kontent)
[![npm](https://img.shields.io/npm/dt/%40kentico%2Fgatsby-source-kontent.svg)](https://www.npmjs.com/package/@kentico/gatsby-source-kontent)
[![Maintainability](https://api.codeclimate.com/v1/badges/d7938a5343f835709527/maintainability)](https://codeclimate.com/github/Kentico/gatsby-source-kontent/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d7938a5343f835709527/test_coverage)](https://codeclimate.com/github/Kentico/gatsby-source-kontent/test_coverage)

> :warning: This version is still in beta phase, it is possible that some adjustments might cause other breaking changes. For  previous version snapshots see [Previous versions](#Previous-versions) section.

This repo contains a [Gatsby (v2) source plugin](https://www.gatsbyjs.org/docs/recipes/#5-sourcing-data) that retrieves data from the [Kentico Kontent](https://kontent.ai) Delivery API.

## Get started

You can use the plugin in any of the following ways:

### A) Use the Kentico Kontent sourcing guide

If you are new to the Gatsby ecosystem. The best way to start with using Gatsby & Kentico Kontent is to follow the official [sourcing guide for Kentico Kontent](https://www.gatsbyjs.org/docs/sourcing-from-kentico-kontent/). To learn more about sourcing from headless CMSs see the [Gatsby docs overview page](https://www.gatsbyjs.org/docs/headless-cms/).

### B) Install the plugin in your existing Gatsby project

1. Install the [@kentico/gatsby-source-kontent](https://www.npmjs.com/package/@kentico/gatsby-source-kontent) NPM package.

    ```sh
    npm install --save @kentico/gatsby-source-kontent
    ```

1. Configure the plugin in `gatsby-config.js` file.

    > The source plugin uses the [Kentico Kontent SDK](https://github.com/Kentico/kontent-delivery-sdk-js/tree/v8.0.0#kentico-kontent-delivery-sdk) in the background.

    * `deliveryClientConfig`* - [Kentico Kontent client configuration object](https://github.com/Kentico/kontent-delivery-sdk-js/blob/v8.0.0/DOCS.md#client-configuration) of the JS SDK (like Preview API, Secure API, etc.).
    * `languageCodenames`* - array of language codenames that defines [what languages a configured for the project](https://docs.kontent.ai/tutorials/develop-apps/get-content/getting-localized-content?tech=javascript#section-project-languages) - the first one is considered as the **default one**. Initial "Getting started" project has configured just one language `default`.
    * `enableLogging` - enable logging of the source plugin. Turned off by default.
    * `includeRawContent` - allows to include `internal.content` property as a part fo the GraphlQL model. Turned off by default.

      \* required property

    **Configuration object**

    ```javascript
    module.exports = {
      ...
      plugins: [
        ...
        {
          resolve: `@kentico/gatsby-source-kontent`,
          options: {
            deliveryClientConfig: { // Configuration object
              projectId: `XXX`,
              typeResolvers: []
            },
            languageCodenames: [ // example configuration
              `default`, // default language
            ]
          }
        }
        ...
      ]
      ...
    }
    ```

1. Run `gatsby develop` and data from Kentico Kontent are provided in Gatsby GraphQL model.
All Kentico Kontent content element values reside inside of the `elements` property of `KontentItem` nodes.

### C) Scaffold your project using the Gatsby Kentico Kontent starter site

Use the [gatsby-starter-kontent](https://github.com/Kentico/gatsby-starter-kontent) starter site, which includes this source plugin.

* [Gatsby gallery](https://www.gatsbyjs.org/starters/Kentico/gatsby-starter-kontent/)

## Features

The plugin creates GraphQL nodes for all Kentico Kontent content types, content items, and its language variants.

The node names are prefixed with `Kontent`. More specifically, content type nodes are prefixed by `KontentType` and content items and their language variants are prefixed with `KontentItem`.

GraphQL nodes of content items contain the ordinary `system` and `elements` properties. However, the properties inside `elements` always have an internal structure that the aforementioned [Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/lib/models/item/content-item.class.ts) produces with **modifications** described in following subsections.

GraphQL nodes of content items contain the ordinary `system` and `elements` properties. However, the properties inside `elements` always have an internal structure that the aforementioned [Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js/blob/v8.0.0/lib/models/item/item-models.ts#L85) produces with **modifications** described in following section.

### Content item <-> content type relationships

This relationship is captured in the `contentItems` navigation property of all `KontentType` nodes. In the opposite direction, in all `KontentItem` nodes, it can be found in the `contentType` navigation property.

<details><summary>Example</summary>

You can use the [GraphiQL](https://github.com/graphql/graphiql) interface to experiment with the data structures produced by the source plugin. For instance, you can fetch a content item of the *Project reference* type (by querying `allKontentItemProjectReference`) and use the `contentType` navigation property to get a full list of all of the elements in the underlying content type. Like so:

```gql
{
  allKontentItemProjectReference {
    nodes {
      elements {
        name___teaser_image__name {
          value
        }
      }
      contentType {
        elements {
          name
          codename
          type
        }
      }
    }
  }
}
```

</details>

### Language fallbacks

Gatsby source plugin is including GraphQL nodes by the language fallbacks configuration. As a part of that, there is a `prefered_language` property allowing to distinguish whether the fallback has been used or not.If the fallback is used `prefered language` is set to the desired language codename, but `system.language` value is using the actual culture that has been used (the fallback one). If the values are same, fallback is was not used.

### Language variant relationships

This relationship is captured by the `otherLanguages` navigation property of all content item nodes in other language.

<details><summary>Example</summary>

For instance, you can get the names of all content items of the *Speaking engagement* type (by querying `KontentItemSpeakingEngagement`) in their default language as well as other languages all at once:

```gql
{
  allKontentItemSpeakingEngagement (filter: {preferred_language: {eq: "default"}}) {
    nodes {
      elements {
        name {
          value
        }
      }
      otherLanguages {
        elements {
          name {
            value
          }
        }
      }
    }
  }
}
```

returns in case of two languages

```json
{
  "data": {
    "allKontentItemSpeakingEngagement": {
      "nodes": [
        {
          "elements": {
            "name": "Speaking engagement"
          },
          "otherLanguages": [
            {
              "elements": {
                "name": "Hablando de compromiso"
              }
            }
          ]
        }
      ]
    }
  }
}
```

</details>

> [Other Languages](https://github.com/Kentico/gatsby-source-kontent/issues/84) are not automatically generated [using Schema API](docs/UPGRADE.md#schema-definition-api--all-items-query).

### Linked items elements relationships

Each Linked items element does differ from classic JS SDK structure. They are replaced by [Gatsby GraphQL node references](https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship) that can be used to traverse to the nodes linked through the use of the *Linked items* element.

<details><summary>Example</summary>

Should a *Linked items* element in KC contain items of only *one* type, you'll be able to specify elements and other properties of that type directly (under the `related_project_references.linked_items` in the following example). However, once you add linked items of multiple types, you'll have to specify their properties using the `... on [type name]` syntax (so called "inline fragments" in the GraphQL terminology).

The `related_project_refereces.linked_items` will give you the full-fledged Gatsby GraphQL nodes with all additional properties and links.

```gql
{
  allKontentItemProjectReference {
    nodes {
      elements {
        related_project_references {
          name
          type
          itemCodenames
          linked_items {
            ... on KontentItemBlogpostReference {
              elements {
                title {
                  value
                }
              }
            }
            ... on KontentItemProjectReference {
              elements {
                project_name {
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

</details>

> :bulb: When you are modelling linked items, make sure you have no element with the same codename of different type. In case you had some, they would be omitted from the model and the following warning is logged during model generation.

```plain
KontentItemArticle.elements.related_articles.linked_items[].elements.manufacturer.value:
 - type: array<object> # THIS IS CHECK BOX ELEMENT
   value: [ { name: 'Aerobie', codename: 'aerobie' } ]
 - type: string # THIS IS TEXT ELEMENT
   value: 'Hario'
```

### Custom element parting support

Custom element is now supported including [custom element models definition](https://github.com/Kentico/kontent-delivery-sdk-js/blob/v8.0.0/DOCS.md#using-custom-models-for-custom-elements). SO besides of the raw value property `value` it is possible to parse it and include it in the GraphQL model.

> External properties are not automatically generated [using Schema API](docs/UPGRADE.md#schema-definition-api--all-items-query).

### Rich text resolution

With following features, it is possible to resolve rich text [into the HTML string](#embedded-JS-SDK-resolution), that could be injected to the site. For more complex scenarios, it is possible to use the raw `value` property in combination with [`linked_items`](#content-items-in-rich-text-elements-relationships), [`links`](#links-in-rich-text-elements), and [`images`](#images-in-rich-text-elements) property.

#### Embedded JS SDK resolution

Since [Kentico Kontent Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js/#kentico-kontent-delivery-sdk) could resolve [links](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#url-slugs-links) and also [linked items and components](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/DOCS.md#resolving-content-items-and-components-in-rich-text-elements) in rich text elements by implementing the resolvers, Kentico Kontent Gatsby source plugin is enriching the rich text elements in GraphQL model by `resolvedData` property containing `html` property with the resolved value and for the url slug elements, there is a `resolvedUrl` property containing resolved link from the link resolver.

<details><summary>`summary` rich text element example</summary>

```gql
{
  ...
    node {
      elements {
        summary {
          value // NORMAL value
          resolvedData {
            html // resolved output
            linkedItemCodenames // only inline liked items codenames
            componentCodenames // only content component codenames
          }
          linkedItemCodenames // inline linked items + content components codenames
        }
      }
    }
  ...
}
```

</details>

#### Content items and components in Rich text elements

As with the previous example, all rich text element containing [inline content items](https://docs.kontent.ai/tutorials/write-and-collaborate/structure-your-content/structuring-editorial-articles-with-components#a-using-content-items-in-the-rich-text-element) or [components](https://docs.kontent.ai/tutorials/write-and-collaborate/structure-your-content/structuring-editorial-articles-with-components#a-using-components-in-the-rich-text-element) have an accompanying `linked_items` property which is referencing them.

<details><summary>Example</summary>

```gql
{
  allKontentItemBlogpostReference {
    nodes {
      elements {
        summary {
          value
          linked_items {
          ... on KontentItemBlogpostReference {
            elements {
              title {
                value
              }
            }
          }
        }
      }
    }
  }
}
```

</details>

#### Links in Rich text elements

All rich text properties with content items linked in the element also have an accompanying `links` property.
<details><summary>Example</summary>

```gql
{
  allKontentItemBlogpostReference {
    nodes {
      elements {
        summary {
          value
          links {
            codename
            linkId
            type
            urlSlug
          }
        }
      }
    }
  }
}
```

</details>

#### Images in Rich text elements

All rich text properties with content items linked in the element also have an accompanying `images` property.

<details><summary>Example</summary>

```gql
{
  allKontentItemBlogpostReference {
    nodes {
      elements {
        summary {
          value
          images {
            imageId
            description
            url
            width
            height
          }
        }
      }
    }
  }
}
```

</details>

> [Resolved Data in Rich text elements](https://github.com/Kentico/gatsby-source-kontent/issues/85) are not automatically generated [using Schema API](docs/UPGRADE.md#schema-definition-api--all-items-query).

### Reverse link relationships

All nodes have a `usedByContentItems` property that reflects the other nodes in which the given node is used as linked content in *Linked items* or *Rich text* elements.

### All items queries

There are two queries (`allKontentItem` and `kontentItem`) allows to load content items from unified endpoint regardless of type.

<details><summary>Example</summary>

```gql
query {
  allKontentItem {
    nodes {
      system {
        type
        name
      }
    }
  }
}
```

Response

```json
{
  "data": {
    "allKontentItem": {
      "nodes": [
        {
          "system": {
            "type": "about_us",
            "name": "About us"
          }
        },
        {
          "system": {
            "type": "fact_about_us",
            "name": "How we roast our coffees"
          }
        },
        {
          "system": {
            "type": "fact_about_us",
            "name": "How we source our coffees"
          }
        },
        ...
      ]
    }
  }
}
```

</details>

## Development prerequisites

* [Node.js](https://nodejs.org/) with NPM installed

## Debugging

To get a smooth debugging experience, you can temporarily copy the content of this repository [directory](https://github.com/Kentico/gatsby-source-kontent) of the source plugin to the `/plugins/@kentico/gatsby-source-kontent` directory of your project and run `npm install` and `npm run build` there. Then your project would use this local source plugin. Or you could configure [local plugin manually](https://www.gatsbyjs.org/docs/loading-plugins-from-your-local-plugins-folder/).

*Note:* It might be necessary to remove */.cache*, */node_modules*, */package-lock.json* and *run npm* install again.

## Troubleshoot

When you change the structure of the data, or the data itself and then `gatsby develop`, or `gatsby build` command raise an error about the Gatsby presumes the old data structure. Try to remove `.cache` folder and run the command again, it is quite usual that Gatsby is caching the information about the content structure and does not clear it.

## Further information

To see upgrade instructions see [Upgrade section](/docs/UPGRADE.md).

For more developer resources, visit the [Kentico Kontent Docs](https://docs.kontent.ai).

### Running projects

* [Kentico Developer Community Site](https://kentico.github.io) [[source code](https://github.com/Kentico/kentico.github.io/tree/source)]
* [Kentico Advantage](https://advantage.kentico.com/) [[source code](https://github.com/Kentico/kentico-advantage/tree/source)]
* [Richard Shackleton's Personal portfolio and blog website](https://rshackleton.co.uk/) [[source code](https://github.com/rshackleton/rshackleton.co.uk)]
* [Aaron Collier's Czech Theather site](https://czechtheater.cz/) [[source code](https://github.com/CollierCZ/czechtheater)]
* [Ilesh Mistry's personal blog site](https://www.ileshmistry.com/)
* [Matt Nield's personal blog site](https://www.mattnield.co.uk) [[Source code](https://github.com/mattnield/mattnield-gatsby)]

### Guides and blog posts

* [Sourcing from Kentico Kontent](https://www.gatsbyjs.org/docs/sourcing-from-kontent/)
* [Kentico Cloud & Gatsby Take You Beyond Static Websites](https://www.gatsbyjs.org/blog/2018-12-19-kentico-cloud-and-gatsby-take-you-beyond-static-websites/)
* [Rendering Kentico Kontent linked content items with React components in Gatsby](https://rshackleton.co.uk/articles/rendering-kentico-cloud-linked-content-items-with-react-components-in-gatsby) by [@rshackleton](https://github.com/rshackleton)
* [Automated builds with Netlify and Kentico Kontent webhooks](https://rshackleton.co.uk/articles/automated-builds-with-netlify-and-kentico-cloud-webhooks) by [@rshackleton](https://github.com/rshackleton)
* [Learning about Gatsby schema customisation with Kontent.ai](https://rshackleton.co.uk/articles/learning-about-gatsby-schema-customisation-with-kontent-ai) by [@rshackleton](https://github.com/rshackleton)

### Previous versions

* For version 2 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v2).
* For version 3 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v3).

## Feedback & Contributing

Check out the [contributing](/CONTRIBUTING.md) page to see the best places for file issues, to start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/gatsby-source-kontent?pixel)
