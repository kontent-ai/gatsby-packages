# Gatsby source plugin for Kentico Cloud

[![Build Status](https://api.travis-ci.org/Kentico/gatsby-source-kentico-cloud.svg?branch=master)](https://travis-ci.org/Kentico/gatsby-source-kentico-cloud)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)

This repo contains a [Gatsby v2 source plugin](https://www.gatsbyjs.org/docs/recipes/#sourcing-data) that retrieves data from the [Kentico Cloud](https://kenticocloud.com) Delivery API.

## How to run the code

You can use the plugin in any of the following ways:

* Install the [gatsby-source-kentico-cloud](https://www.npmjs.com/package/gatsby-source-kentico-cloud) NPM package in your Gatsby site via `npm install --save gatsby-source-kentico-cloud`.
* Use the [gatsby-starter-kentico-cloud](https://github.com/Kentico/gatsby-starter-kentico-cloud) starter site, which uses the NPM package.

### Features

**Breaking change: All Kentico Cloud content element values now reside inside of the `elements` property of `kenticoCloudItem` nodes.**

The plugin creates GraphQL nodes for all Kentico Cloud content types, content items, and language variants.

The node names are prefixed with `kenticoCloud`. More specifically, content type nodes are prefixed with `kenticoCloudType` and content items and their language variants are prefixed with `kenticoCloudItem`.

The plugin creates the following relationships among the Kentico Cloud nodes. You can test them in the GraphiQL environment of your Gatsby app (by going to `http://localhost:8000/___graphql` after starting your site's development server).

#### Content item <-> content type relationships

This relationship is captured in the `contentItems` navigation property of all `kenticoCloudType` nodes. In the opposite direction, in all `kenticoCloudItem` nodes, it can be found in the `contentType` navigation property.

You can use the GraphiQL interface to experiment with the data structures produced by the source plugin. For instance, you can fetch a content item of the *Project reference* type (by querying `allKenticoCloudItemProjectReference`) and use the `contentType` navigation property to get a full list of all of the elements in the underlying content type. Like so:

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
                name___teaser_image__name {
                  name
                }
              }
            }
          }
        }
      }
    }

This kind of relationship comes handy when no content item has a particular element populated with data. In that case Gatsby won't recognize that element and won't include it in its internal schema. Neither the (null) value nor the name of the element will be visible through the `kenticoCloudItem` GraphQL nodes. Tapping into the *type* GraphQL node might be a proper fallback mechanism.

#### Language variant relationships

This relationship is captured by the `otherLanguages` navigation property of all content item nodes. For instance, you can get the names of all content items of the *Speaking engagement* type (by querying `kenticoCloudItemSpeakingEngagement`) in their default language as well as other languages all at once:

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
    
#### Modular content elements relationships

Each modular content property is accompanied by a sibling property suffixed with `_nodes` that can be used to traverse to the nodes linked through the use of modular content.

    {
      allKenticoCloudItemProjectReference {
        edges {
          node {
            elements {
              related_project_references {
                value
              }
              related_project_references_nodes {
                ...
              }
            }
          }
        }
      }
    }

#### Modular content relationships in rich text

As with the previous example, all rich text properties with modular content also have an accompanying `_nodes` property.

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

All nodes have a `usedByContentItems` property that reflects the other nodes in which the given node is used as modular content.

## Development prerequisites

* [Node.js](https://nodejs.org/) with NPM installed

## Further information

For more developer resources, visit the Kentico Cloud Developer Hub at https://developer.kenticocloud.com.

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/gatsby-source-kentico-cloud/blob/master/CONTRIBUTING.md) contributing page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/gatsby-source-kentico-cloud?pixel)
