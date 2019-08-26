# Gatsby source plugin for Kentico Cloud

[![Gatsby plugin library](https://img.shields.io/badge/Gatsby%20plugin%20library-%23663399.svg)](https://www.gatsbyjs.org/packages/gatsby-source-kentico-cloud)
[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-cloud)

[![npm version](https://badge.fury.io/js/gatsby-source-kentico-cloud.svg)](https://www.npmjs.com/package/gatsby-source-kentico-cloud)
[![Build Status](https://api.travis-ci.com/Kentico/gatsby-source-kentico-cloud.svg?branch=master)](https://travis-ci.com/Kentico/gatsby-source-kentico-cloud)
[![npm](https://img.shields.io/npm/dt/gatsby-source-kentico-cloud.svg)](https://www.npmjs.com/package/gatsby-source-kentico-cloud)
[![Maintainability](https://api.codeclimate.com/v1/badges/e247b74d31eaa41c3bda/maintainability)](https://codeclimate.com/github/Kentico/gatsby-source-kentico-cloud/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e247b74d31eaa41c3bda/test_coverage)](https://codeclimate.com/github/Kentico/gatsby-source-kentico-cloud/test_coverage)

This repo contains a [Gatsby (v2) source plugin](https://www.gatsbyjs.org/docs/recipes/#sourcing-data) that retrieves data from the [Kentico Cloud](https://kenticocloud.com) Delivery API.

## Get started

You can use the plugin in any of the following ways:

### A) Use the Kentico Cloud sourcing guide

If you are new to the Gatsby ecosystem. The best way to start with using Gatsby & Kentico Cloud is to follow the official [Sourcing guide for Kentico Cloud](https://www.gatsbyjs.org/docs/sourcing-from-kentico-cloud/). To learn more about from sourcing from headless CMSs see the [Gatsby docs overview page](https://www.gatsbyjs.org/docs/headless-cms/).

### B) Install plugin to your existing Gatsby project 
1. Install the [gatsby-source-kentico-cloud](https://www.npmjs.com/package/gatsby-source-kentico-cloud) NPM package,
```
npm install --save gatsby-source-kentico-cloud
```
2. Configure the plugin in `gatsby-config.js` file

> The source plugin uses the [Kentico Cloud SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery#kentico-cloud-delivery-sdk) in the background.

#### Configuration object ([example](https://github.com/Kentico/gatsby-starter-kentico-cloud/blob/master/gatsby-config.js))

   * `deliveryClientConfig`* - [Kentico Cloud client configuration object](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/DOCS.md#client-configuration) of the JS SDK (like Preview API, Secure API, etc.).
  * `languageCodenames`* - array of language codenames that defines [what languages a configured for the project](https://developer.kenticocloud.com/docs/localization#section-project-languages) - the first one is considered as the **default one**. Initial "Getting started" project has configured just one language `default`.

\* required property
```
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `gatsby-source-kentico-cloud`,
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
3. Run `gatsby develop` and data from Kentico Cloud are provided in Gatsby GraphQL model.
All Kentico Cloud content element values reside inside of the `elements` property of `kenticoCloudItem` nodes.

### C) Scaffold your project using Gatsby Kentico Cloud starter site

Use the [gatsby-starter-kentico-cloud](https://github.com/Kentico/gatsby-starter-kentico-cloud) starter site that includes this source plugin
* [Gatsby gallery](https://www.gatsbyjs.org/starters/Kentico/gatsby-starter-kentico-cloud)

## Features

The plugin creates GraphQL nodes for all Kentico Cloud content types, content items, and its language variants.

The node names are prefixed with `kenticoCloud`. More specifically, content type nodes are prefixed by `kenticoCloudType` and content items and their language variants are prefixed with `kenticoCloudItem`.

GraphQL nodes of content items contain the ordinary `system` and `elements` properties. However, the properties inside `elements` always have an internal structure that the aforementioned [Delivery SDK](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/lib/models/item/content-item.class.ts) produces with **modifications** described in following section.

### Content item <-> content type relationships

This relationship is captured in the `contentItems` navigation property of all `kenticoCloudType` nodes. In the opposite direction, in all `kenticoCloudItem` nodes, it can be found in the `contentType` navigation property.

<details><summary>Example</summary>

You can use the [GraphiQL](https://github.com/graphql/graphiql) interface to experiment with the data structures produced by the source plugin. For instance, you can fetch a content item of the *Project reference* type (by querying `allKenticoCloudItemProjectReference`) and use the `contentType` navigation property to get a full list of all of the elements in the underlying content type. Like so:

```
{
  allKenticoCloudItemProjectReference {
    edges {
      node {
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
}
```

</details>

### Language variant relationships

This relationship is captured by the `otherLanguages` navigation property of all content item nodes in other language. 

<details><summary>Example</summary>

For instance, you can get the names of all content items of the *Speaking engagement* type (by querying `kenticoCloudItemSpeakingEngagement`) in their default language as well as other languages all at once:

```
{
  allKenticoCloudItemSpeakingEngagement {
    edges {
      node {
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
}
```
returns in case of two languages 
```
{
  "data": {
    "allKenticoCloudItemSpeakingEngagement": {
      "edges": [
        {
          "node": {
            "elements": {
              "name": "Speaking engagement"
            }
            "otherLanguages": [
              {
                "elements": {
                  "name": "Hablando de compromiso"
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

</details>

### Linked items elements relationships

Each Linked items element does differ from classic JS SDK structure. They are replaced by [Gatsby GraphQL node references](https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship) that can be used to traverse to the nodes linked through the use of the *Linked items* element.

<details><summary>Example</summary>

Should a *Linked items* element in KC contain items of only *one* type, you'll be able to specify elements and other properties of that type directly (under the `related_project_references.linked_items` in the following example). However, once you add linked items of multiple types, you'll have to specify their properties using the `... on [type name]` syntax (so called "inline fragments" in the GraphQL terminology).

The `related_project_refereces.linked_items` will give you the full-fledged Gatsby GraphQL nodes with all additional properties and links.

> :bulb: Notice the encapsulation into the `... on Node` [GraphQL inline fragment](https://graphql.org/learn/queries/#inline-fragments). This prevent failing creating GraphQL model when this field does not contain i.e. Blog post (`KenticoCloudItemBlogpostReference`) linked item.

```gql
{
  allKenticoCloudItemProjectReference {
    edges {
      node {
        elements {
          related_project_references {
            name
            type
            itemCodenames
            linked_items {
              ... on Node {
                __typename
                ... on KenticoCloudItemBlogpostReference {
                  elements {
                    name___teaser_image__name {
                      value
                    }
                  }
                }
                ... on KenticoCloudItemProjectReference {
                  elements {
                    name___teaser_image__name {
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
  }
}
```

</details>

> :bulb: When you are modelling linked items, make sure you have no element with the same codename of different type. In case you had some, they would be omitted from the model and the following warning is logged during model generation.

```plain
KenticoCloudItemArticle.elements.related_articles.linked_items[].elements.manufacturer.value:
 - type: array<object> # THIS IS CHECK BOX ELEMENT
   value: [ { name: 'Aerobie', codename: 'aerobie' } ]
 - type: string # THIS IS TEXT ELEMENT
   value: 'Hario'
```

### Rich text resolution

With following features, it is possible to resolve rich text [into the HTML string](#embedded-JS-SDK-resolution), that could be injected to the site. For more complex scenarios, it is possible to use the raw `value` property in combination with [`linked_items`](#content-items-in-rich-text-elements-relationships), [`links`](#links-in-rich-text-elements), and [`images`](#images-in-rich-text-elements) property

#### Embedded JS SDK resolution

Since [Kentico Cloud Delivery SDK](https://github.com/Kentico/kentico-cloud-js/tree/master/packages/delivery#kentico-cloud-delivery-sdk) could resolve [links](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/DOCS.md#url-slugs-links) and also [linked items and components](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/DOCS.md#resolving-content-items-and-components-in-rich-text-elements) in rich text elements by implementing the resolvers, Kentico Cloud Gatsby source plugin is enriching the rich text elements in GraphQL model by `resolvedData` property containing `html` property with the resolved value and for the url slug elements, there is a `resolvedUrl` property containing resolved link from the link resolver.

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

As with the previous example, all rich text element containing [inline content items](https://docs.kenticocloud.com/tutorials/compose-and-link-content/components/structuring-editorial-articles-with-components#a-using-content-items-in-the-rich-text-element) or [components](https://docs.kenticocloud.com/tutorials/compose-and-link-content/components/structuring-editorial-articles-with-components#a-using-components-in-the-rich-text-element) have an accompanying `linked_items` property which is referencing them.

<details><summary>Example</summary>

```
{
  allKenticoCloudItemBlogpostReference {
    edges {
      node {
        elements {
          summary {
            value
            linked_items {
              ... on Node {
              __typename
              ... on KenticoCloudItemBlogpostReference {
                elements {
                  name___teaser_image__name {
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
}
```

</details>

#### Links in Rich text elements

All rich text properties with content items linked in the element also have an accompanying `links` property.
<details><summary>Example</summary>

```
{
  allKenticoCloudItemBlogpostReference {
    edges {
      node {
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
}
```

</details>

#### Images in Rich text elements

All rich text properties with content items linked in the element also have an accompanying `images` property.

<details><summary>Example</summary>

```gql
{
  allKenticoCloudItemBlogpostReference {
    edges {
      node {
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
}
```

</details>

### Reverse link relationships

All nodes have a `usedByContentItems` property that reflects the other nodes in which the given node is used as linked content in *Linked items* or *Rich text* elements.

## Development prerequisites

* [Node.js](https://nodejs.org/) with NPM installed

## Debugging

To get a smooth debugging experience, you can temporarily copy the `gatsby-source-kentico-cloud` [directory](https://github.com/Kentico/gatsby-source-kentico-cloud) of the source plugin to the `/plugins` directory of your project and run `npm install` and `npm run build` there. Then your project would use this local source plugin.

*Note:* It might be necessary to remove */.cache*, */node_modules*, */package-lock.json* and *run npm* install again.

## Troubleshoot

When you change the structure of the data, or the data itself and then `gatsby develop`, or `gatsby build` command raise an error about the Gatsby presumes the old data structure. Try to remove `.cache` folder and run the command again, it is quite usual that Gatsby is caching the information about the content structure and does not clear it.

## Further information

For more developer resources, visit the Kentico Cloud Developer Hub at https://developer.kenticocloud.com.

### Running projects

* [Kentico Developer Community Site](https://kentico.github.io) [[source code](https://github.com/Kentico/kentico.github.io/tree/source)]
* [Kentico Advantage](https://advantage.kentico.com/) [[source code](https://github.com/Kentico/kentico-advantage/tree/source)]
* [Richard Shackleton's Personal portfolio and blog website](https://rshackleton.co.uk/) [[source code](https://github.com/rshackleton/rshackleton.co.uk)]
* [Aaron Collier's Czech Theather site](https://czechtheater.cz/) [[source code](https://github.com/CollierCZ/czechtheater)]
* [Ilesh Mistry's personal blog site](https://www.ileshmistry.com/)
* [Matt Nield's personal blog site](https://www.mattnield.co.uk) [[Source code](https://github.com/mattnield/mattnield-gatsby)]

### Guides and blog posts

* [Sourcing from Kentico Cloud](https://www.gatsbyjs.org/docs/sourcing-from-kentico-cloud/)
* [Kentico Cloud & Gatsby Take You Beyond Static Websites](https://www.gatsbyjs.org/blog/2018-12-19-kentico-cloud-and-gatsby-take-you-beyond-static-websites/)
* [Rendering Kentico Cloud linked content items with React components in Gatsby](https://rshackleton.co.uk/articles/rendering-kentico-cloud-linked-content-items-with-react-components-in-gatsby) by [@rshackleton](https://github.com/rshackleton)
* [Automated builds with Netlify and Kentico Cloud webhooks](https://rshackleton.co.uk/articles/automated-builds-with-netlify-and-kentico-cloud-webhooks) by [@rshackleton](https://github.com/rshackleton)

### Previous versions

For version 2 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v2).
For version 3 use [this branch](https://github.com/Kentico/gatsby-source-kentico-cloud/tree/v3).

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/gatsby-source-kentico-cloud/blob/master/CONTRIBUTING.md) page to see the best places for file issues, to start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/gatsby-source-kentico-cloud?pixel)
