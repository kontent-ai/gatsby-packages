const {
  getKontentItemNodeTypeName,
} = require("@simply007org/gatsby-source-kontent-simple")

const addLanguageLinks = (api, typeCodename) => {
  const {
    actions: { createTypes },
    schema,
  } = api

  // i.e. article -> kontent_item_article
  const type = getKontentItemNodeTypeName(typeCodename)

  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      other_languages: {
        type: `[${type}]`,
        // https://www.gatsbyjs.org/docs/schema-customization/
        resolve: async (source, args, context, info) => {
          const pluginInfo = await context.nodeModel.runQuery({
            query: {
              filter: {
                name: {
                  eq: "@simply007org/gatsby-source-kontent-simple",
                },
              },
            },
            type: "SitePlugin",
            firstOnly: true,
          })
          const languageCodenames = pluginInfo.pluginOptions.languageCodenames
          const otherLanguageCodenames = languageCodenames.filter(
            lang => lang !== source.preferred_language
          )

          // Including language fallback
          const otherLanguageNodes = await context.nodeModel.runQuery({
            query: {
              filter: {
                system: {
                  codename: {
                    eq: source.system.codename,
                  },
                },
                preferred_language: {
                  in: otherLanguageCodenames,
                },
              },
            },
            type: type,
            firstOnly: false,
          })

          return otherLanguageNodes
        },
      },
      fallback_used: {
        type: "Boolean",
        // https://www.gatsbyjs.org/docs/schema-customization/
        resolve: (source, args, context, info) => {
          return source.preferred_language !== source.system.language
        },
      },
    },
  })
  createTypes(extendedType)
}

module.exports = {
  addLanguageLinks,
}
