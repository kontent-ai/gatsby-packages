# Upgrade

## Upgrade guide `3.x.x` to `4.x.x`

This upgrade is mainly caused by upgrading [Kentico Kontent Javascript Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js) and adding new features.

### New Featuers

* Language fall backs

### Breaking changes

* Query names KenticoCloud -> Kontent
* prefered_language
* value in fields

### Delivery config

When configuring the Kentico Kontent Source plugin one of the properties to set is `deliveryClientConfig`. It is respecting the [`IDeliveryClientConfig`](https://github.com/Kentico/kontent-delivery-sdk-js/blob/master/UPGRADE.md#ideliveryclientconfig) interface from Kentico Kontent Delivery SDK.

#### Example

```javascript
module.exports = {
  ...
  plugins: [
    ...
    {
      resolve: `gatsby-source-kentico-cloud`,
      options: {
        deliveryClientConfig: { // Configuration object
          projectId: `XXX`,
          typeResolvers: [],
          previewApiKey: `YYY`,
          secureApiKey: `ZZZ`,
          globalQueryConfig:  {
            ...
            usePreviewMode: true, // uses preview mode
            useSecuredMode: false, // disabled secured mode
            ...
          },
        },
        languageCodenames: [ // example configuration
          `en-US`, // default language
          `es-ES`,
        ]
      }
    }
    ...
  ]
  ...
}
```

### Element value property unification

All of the elements types [has element property called `value`](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/UPGRADE.md#removal-of-type-specific-element-properties) not an element specific property.

Custom element is now supported including [custom element models definition](https://github.com/Kentico/kentico-cloud-js/blob/master/packages/delivery/DOCS.md#using-custom-models-for-custom-elements).
Image assets now contains [information about its resolution](https://docs.kontent.ai/reference/api-changelog#a-image-resolution-in-delivery-api).

#### Basic types

```gql
{
  allKontentBasicElementExample {
    nodes {
      elements {
        text_type {
          name
          type
          value
        }
        number_type {
          name
          type
          value
        }
        date_of_birth {
          name
          type
          value
        }
        multiple_choice_type {
          name
          type
          value {
            codename
            name
          }
        }
        asset_type {
          name
          type
          value {
            name
            size
            type
            url
            width
            height
          }
          ta {...}
        }
        custom_element_type {
          name
          type
          value
        }
      }
    }
  }
}
```

#### Linked items

Linked items are not directly under the element codename (`linked_items_type` in example). There are new fields `name`, `type` and `itemCodenames` plus the `value` containing GraphQL links to the linked items.

```gql
{
  allKontentLinkedItems {
    nodes {
      elements {
        linked_items_type {
          linked_items { // Gatsby Graphql node relationships
            ... on Node {
              ... on KontentSubItemExample {
                elements {
                  text_type {
                    name
                    type
                    value
                  }
                }
              }
            }
          }
          itemCodenames // array of the codenames
          name
          type
        }
      }
    }
  }
}
```

#### Rich text

Rich text elements internal structure was extended. The main difference is that `resolvedHtml` is now transfered `resolvedData.html`.

```gql
{
  allKontentRichTextExample {
    nodes {
      elements {
        rich_text_type {
          images {
            height
            imageId
            url
            width
          }
          linkedItemCodenames // array of the codenames
          linked_items {
            ... on Nodes {
              ... on KontentSubItemExample {
                elements {
                  text_type {
                    name
                    type
                    value
                  }
                }
              }
            }
          }
          links {
            codename
            linkId
            type
            urlSlug
          }
          name
          resolvedData {
            html
            linkedItemCodenames
            componentCodenames
          }
          type
          value
        }
      }
    }
  }
}
```

#### Assets

TODO

#### Custom elements

TODO
