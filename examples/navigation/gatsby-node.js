const { getKontentItemNodeTypeName } = require("@kentico/gatsby-source-kontent")

exports.createSchemaCustomization = async api => {
  const {
    actions: { createTypes },
    schema,
  } = api

  const type = getKontentItemNodeTypeName("navigation_item")

  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      url: {
        type: `String`,
        resolve: async (source, args, context, info) => {
          const allNavigationItems = await context.nodeModel.runQuery({
            query: {
              filter: {},
            },
            type: type,
            firstOnly: false,
          })

          const urlFragments = [source.elements.slug.value] // /about/small-gas/subsection/<-
          let parent
          let currentContextItem = source;

          do {
            // eslint-disable-next-line  no-loop-func
            parent = allNavigationItems.find(item =>
              item.preferred_language ===
              currentContextItem.preferred_language &&
              item.elements["subitems"].value.includes(
                currentContextItem.system.codename
              )
            )

            if (parent) {
              urlFragments.push(parent.elements.slug.value)
              currentContextItem = parent
            }
          } while (parent)

          urlFragments.reverse()
          return urlFragments[0] + urlFragments.slice(1).join("/")
        },
      },
    },
  })

  createTypes(extendedType)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    query TopLevelPages {
      allKontentItemNavigationItem {
        nodes {
          url
          elements {
            content_page {
              value {
                ... on kontent_item_content_page {
                  preferred_language
                  system {
                    codename
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  data.allKontentItemNavigationItem.nodes.forEach(page => {
    const contentPage = page.elements.content_page.value[0]
    createPage({
      path: page.url,
      component: require.resolve(`./src/templates/content-page.js`),
      context: {
        language: contentPage.preferred_language,
        codename: contentPage.system.codename,
      },
    })
  })
}
