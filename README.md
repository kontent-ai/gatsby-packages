# Gatsby source plugin for Kentico Cloud

[![Build Status](https://api.travis-ci.org/Kentico/gatsby-source-kentico-cloud.svg?branch=master)](https://travis-ci.org/Kentico/gatsby-source-kentico-cloud)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)

This repo contains the [source plugin](https://www.gatsbyjs.org/docs/recipes/#sourcing-data) that gets data off of [Kentico Cloud](https://kenticocloud.com) Delivery API.

## How to run the code

You can use the plugin in any of the following ways:

* Install the [gatsby-source-kentico-cloud](https://www.npmjs.com/package/gatsby-source-kentico-cloud) NPM package into your Gatsby site via `npm install --save gatsby-source-kentico-cloud`.
* (Comming soon) Use the [gatsby-starter-kentico-cloud](https://github.com/Kentico/gatsby-starter-kentico-cloud) starter site, which has the NPM package installed.

### Features

The plugin creates GraphQL nodes of all Kentico Cloud content types, content items and their language variants.

Names of nodes are prefixed with `KenticoCloud`. More specifically, the content type nodes are prefixed with `KenticoCloudType`, whereas the content items and their language variants have the `KenticoCloudItem` prefix.

The plugin creates the below relationships among all Kentico Cloud nodes. You can test them in the GraphiQL environment of your Gatsby app.

#### Content item <-> content type relationships

The relationship is captured in the `contentItems` navigation property of all content type nodes. In all content item nodes, it can be found in the `contentType` navigation property.

You can use the GraphiQL interface to experiment with the data structures produced by the source plugin. For instance, you can fetch content items of type `kenticoCloudItemProjectReference` and use the `contentType` navigation property to get the full list of elements of the underlying content type. Like so:

    {
      allKenticoCloudItemProjectReference {
        edges {
          node {
            name___teaser_image__name {
              value
            }
            contentType {
              elements {
                codename
              }
            }
          }
        }
      }
    }

#### Language variants relationships

This relationship is captured by `otherLanguages` navigation property of all content item nodes. For instance, you can get names of content items of type `kenticoCloudItemSpeakingEngagement` in their default language as well as in other languages. All in one go:

    {
      allKenticoCloudItemSpeakingEngagement {
        edges {
          node {
            name {
              value
            }
            otherLanguages {
              name {
                value
              }
            }
          }
        }
      }
    }
    
#### Modular content elements relationships

Each modular content property is accompanied by a sibling property suffixed with `_nodes` that can be used to traverse to linked nodes of modular content items.

    {
      allKenticoCloudItemProjectReference {
        edges {
          node {
            related_project_references {
              name___teaser_image__name {
                value
              }
            }
            related_project_references_nodes {
              name___teaser_image__name {
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

#### Reverse link relationships

All nodes have a `usedByContentItems` property that reflects in which this node is used as modular content.

## Development prerequisites

* [Node.js](https://nodejs.org/) with NPM installed

### Troubleshooting

In case you encounter the following error:

`GraphQL Error Unknown field 'system' on type '...'`

just rebuild the site using `npm run develop` or `gatsby develop` (should you have Gatsby CLI installed).

This [error](https://github.com/gatsbyjs/gatsby/issues/8053) occurs rather randomly; mostly due to issues with building of the internal schema. If it cannot be solved by rebuilding with `npm run develop` or raising the `version` field in the [package.json](https://github.com/Kentico/gatsby-source-kentico-cloud/blob/master/package.json) of the source plugin, then you should look for other root causes (not related to [building of the schema](https://github.com/gatsbyjs/gatsby/issues/2674#issuecomment-340510736)).

## Further information

For more developer resources, visit the Kentico Cloud Developer Hub at https://developer.kenticocloud.com.

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/gatsby-source-kentico-cloud/blob/master/CONTRIBUTING.md) contributing page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/gatsby-source-kentico-cloud?pixel)
