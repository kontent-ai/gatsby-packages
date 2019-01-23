# Gatsby source plugin for Kentico Cloud
[![npm version](https://badge.fury.io/js/gatsby-source-kentico-cloud.svg)](https://www.npmjs.com/package/gatsby-source-kentico-cloud)
[![Build Status](https://api.travis-ci.org/Kentico/gatsby-source-kentico-cloud.svg?branch=master)](https://travis-ci.org/Kentico/gatsby-source-kentico-cloud)
[![npm](https://img.shields.io/npm/dt/gatsby-source-kentico-cloud.svg)](https://www.npmjs.com/package/gatsby-source-kentico-cloud)
[![Maintainability](https://api.codeclimate.com/v1/badges/e247b74d31eaa41c3bda/maintainability)](https://codeclimate.com/github/Kentico/gatsby-source-kentico-cloud/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e247b74d31eaa41c3bda/test_coverage)](https://codeclimate.com/github/Kentico/gatsby-source-kentico-cloud/test_coverage)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)

This repo contains a [Gatsby v2 source plugin](https://www.gatsbyjs.org/docs/recipes/#sourcing-data) that retrieves data from the [Kentico Cloud](https://kenticocloud.com) Delivery API.

## How to run the code

You can use the plugin in any of the following ways:

### Install to you existing Gatsby project 
1. Install the [gatsby-source-kentico-cloud](https://www.npmjs.com/package/gatsby-source-kentico-cloud) NPM package,
```
npm install --save gatsby-source-kentico-cloud
```
2. Configure the plugin in `gatsby-config.js` file

The source plugin uses the [JavaScript SDK](https://github.com/Enngage/kentico-cloud-js) in the background. Put the [configuration object](https://github.com/Enngage/kentico-cloud-js/blob/master/doc/delivery.md#client-configuration) of the JS SDK into the `deliveryClientConfig` property of the [gatsby-config.js](https://github.com/Kentico/gatsby-starter-kentico-cloud/blob/master/gatsby-config.js) file.
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
          `en-US`,
          `es-ES`,
        ]
      }
    }
    ...
  ]
  ...
}
```
3. Run `gatsby develop` and data from Kentico Cloud are provided in Gatsby GraphQL model.
All Kentico Cloud content element values  reside inside of the `elements` property of `kenticoCloudItem` nodes.

### Scaffold your project using Gatsby Kentico Cloud starter site

Use the [gatsby-starter-kentico-cloud](https://github.com/Kentico/gatsby-starter-kentico-cloud) starter site that includes this source plugin,
* [Gatsby gallery](https://www.gatsbyjs.org/starters/Kentico/gatsby-starter-kentico-cloud)

## Features

The plugin creates GraphQL nodes for all Kentico Cloud content types, content items, and its language variants.

The node names are prefixed with `kenticoCloud`. More specifically, content type nodes are prefixed with `kenticoCloudType` and content items and their language variants are prefixed with `kenticoCloudItem`.

GraphQL nodes of content items contain the ordinary `system` and `elements` properties. However, the properties inside `elements` always have an internal structure that the aforementioned [JavaScript SDK](https://github.com/Enngage/kentico-cloud-js/blob/master/packages/delivery/lib/models/item/content-item.class.ts) produces with [some modifications](#js-sdk-vs-graphql-model-differences).

## JS SDK vs GraphQL model differences

#### Content item <-> content type relationships

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

#### Language variant relationships

This relationship is captured by the `otherLanguages` navigation property of all content item nodes. 

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

</details>
    
#### Linked items elements relationships

Each Linked items element does differ from classic JS SDK structure. They are replaced by [Gatsby GraphQL node references](https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship) that can be used to traverse to the nodes linked through the use of the *Linked items* element.

<details><summary>Example</summary>

Should a *Linked items* element in KC contain items of only *one* type, you'll be able to specify elements and other properties of that type directly (directly under the `related_project_references` in the following example). However, once you add linked items of multiple types, you'll have to specify their properties using the `... on [type name]` syntax (so called "inline fragments" in the GraphQL terminology).

The `related_project_refereces_nodes` will give you the full-fledged Gatsby GraphQL nodes with all additional properties and links.

> :bulb: Notice the encapsulation into the `... on Node` [GraphQL inline fragment](https://graphql.org/learn/queries/#inline-fragments). This prevent failing creating GraphQL model when this field does not contain i.e. Blog post (`KenticoCloudItemBlogpostReference`) linked item.

```
{
  allKenticoCloudItemProjectReference {
    edges {
      node {
        elements {
          related_project_references {
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
```

</details>


> Since v 3.0.0 it is possible to model circular dependency in Kentico Cloud and use this plugin at one time. When the circular dependency is detected during the GraphQL generation, warning is logged to the console and a flag `cycleDetected` is placed next to the `elements` and `system` property.

**NOTE: REWRITTEN UNTIL HERE**

### Rich text resolution 

Since [JS SDK](https://github.com/Enngage/kentico-cloud-js) could resolve [links](https://github.com/Kentico/kentico-cloud-js/blob/master/doc/delivery.md#url-slugs-links) and also [linked items and components](https://github.com/Kentico/kentico-cloud-js/blob/master/doc/delivery.md#resolving-content-items-and-components-in-rich-text-fields) in rich text elements by implementing the resolvers, Kentico Cloud Gatsby source plugin is enriching the [internal SDK structure](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/lib/models/item/content-item.class.ts) in GraphQL model by `resolvedHtml` property containing the resolved value.

`summary` rich text element example
```
{
  ...
    node {
      elements {
        summary {
          value // NORMAL value
          resolvedHtml // resolved output
        }
      }
    }
  ...
}
```

#### Content items in Rich text elements relationships

As with the previous example, all rich text properties with content items linked in the element also have an accompanying `_nodes` property.

    {
      allKenticoCloudItemBlogpostReference {
        edges {
          node {
            elements {
              name___teaser_image__name {
                value
              }
              summary {
                value
              }
              summary_nodes {
                system {
                  codename
                }
              }
            }
          }
        }
      }
    }

#### Reverse link relationships

All nodes have a `usedByContentItems` property that reflects the other nodes in which the given node is used as linked content in *Linked items* or *Rich text* elements.

## Development prerequisites

* [Node.js](https://nodejs.org/) with NPM installed

## Debugging

To get a smooth debugging experience, you can temporarily copy the `gatsby-source-kentico-cloud` [directory](https://github.com/Kentico/gatsby-source-kentico-cloud) of the source plugin to the `/plugins` directory of your site. Then, move the `gatsby-node.js` and `normalize.js` files from `/plugins/gatsby-source-kentico-cloud/src` to `/plugins/gatsby-source-kentico-cloud` (up one level).

## Troubleshooting

Gatsby's GraphQL libraries won't accept object properties with names starting with numbers. This conflicts with the way image assets and links are named in the Delivery API response (in the JS SDK output, respectively). Therefore, the names of properties with assets and links in Rich text are prefixed by the source plugin with `image-` and `link-` respectively.

    "images": {
      "image-79bd9e11-f643-4cd6-9ea5-d1be17cf7de2": {
        "image_id": "79bd9e11-f643-4cd6-9ea5-d1be17cf7de2",
        "description": null,
        "url": "https://assets-eu-01.kc-usercontent.com:443/5ac93d1e-567d-01e6-e3b7-ac435f77b907/f7a357f7-643a-4d2d-8078-0fc371914d25/clearing-cache-with-webhooks---blog-post-image@2x_t.png"
      },
      "image-d2b4bdb2-a586-45d8-9920-bc1dd6846498": {
        "image_id": "d2b4bdb2-a586-45d8-9920-bc1dd6846498",
        "description": null,
        "url": "https://assets-eu-01.kc-usercontent.com:443/5ac93d1e-567d-01e6-e3b7-ac435f77b907/36cb3d1b-1aa7-4809-9606-82c3c0f00b7f/fcyTulxr.jpg"
      }

Should you need to refer to the properties, just bear in mind the addition of the `image-` and `link-` prefix. In case of images, the GUID in the child `image_id` property is never prefixed or otherwise transformed.

## Further information

For more developer resources, visit the Kentico Cloud Developer Hub at https://developer.kenticocloud.com.

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/gatsby-source-kentico-cloud/blob/master/CONTRIBUTING.md) contributing page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/gatsby-source-kentico-cloud?pixel)
