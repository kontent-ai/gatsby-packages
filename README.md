# Gatsby source plugin for Kentico Cloud
[![npm version](https://badge.fury.io/js/gatsby-source-kentico-cloud.svg)](https://www.npmjs.com/package/gatsby-source-kentico-cloud)
[![Build Status](https://api.travis-ci.org/Kentico/gatsby-source-kentico-cloud.svg?branch=master)](https://travis-ci.org/Kentico/gatsby-source-kentico-cloud)
[![npm](https://img.shields.io/npm/dt/gatsby-source-kentico-cloud.svg)](https://www.npmjs.com/package/gatsby-source-kentico-cloud)
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
              	name
                codename
                type
              }
            }
          }
        }
      }
    }

This kind of relationship comes handy when no content item has a particular element populated with data. In that case Gatsby won't recognize that element and won't include it in its internal schema. Neither the (null) value nor the name of the element will be visible through the `kenticoCloudItem` GraphQL nodes. Tapping into the related `kenticoCloudType` GraphQL node might be a proper fallback mechanism.

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
    
#### Linked items elements relationships

Each Linked items property is accompanied by a sibling property suffixed with `_nodes` that can be used to traverse to the nodes linked through the use of the *Linked items* element.

    {
      allKenticoCloudItemProjectReference {
        edges {
          node {
            elements {
              related_project_references {
                system {
                  codename
                }
              }
              related_project_references_nodes {
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

Under the `related_project_references` you'd find just the original data served by our [JS SDK](https://github.com/Enngage/kentico-cloud-js). Conversely, the `related_project_refereces_nodes` will give you the full-fledged Gatsby GraphQL nodes with all additional properties and links.

Should a *Linked items* element in KC contain items of only *one* type, you'll be able to specify elements and other properties of that type directly (directly under the `related_project_references_nodes` in the above example). However, once you add linked items of multiple types, you'll have to specify their properties using the `... on [type name]` syntax (so called "inline fragments" in the GraphQL terminology).

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

## Troubleshooting

Currently, the plugin exhibits an [issue with nodes of multiple types](https://github.com/gatsbyjs/gatsby/issues/9154) in foreign key relationships (`___NODE`). In practice, only content items of one content type can be put into a particular *Linked items* element or *Rich text* element. We're in touch with Gatsby Inc. and work towards resolving that issue soon.

Gatsby's GraphQL libraries won't accept object properties with names starting with numbers. This conflicts with the way image assets are named in the Delivery API response (in the JS SDK output, respectively). Therefore, the names of assets are prefixed by the source plugin with `image-`.

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

Should you need to refer to the properties, just bear in mind the addition of the `image-` suffix. The GUID in the child `image_id` property is never prefixed or otherwise transformed.

## Further information

For more developer resources, visit the Kentico Cloud Developer Hub at https://developer.kenticocloud.com.

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/gatsby-source-kentico-cloud/blob/master/CONTRIBUTING.md) contributing page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/gatsby-source-kentico-cloud?pixel)
