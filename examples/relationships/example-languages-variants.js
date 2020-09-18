const {
  getKontentItemNodeTypeName,
} = require("@kentico/gatsby-source-kontent")

const linkLanguageVariants = (api, typeCodename) => {
  const {
    actions: { createTypes },
    schema,
  } = api

  // i.e. article -> kontent_item_article
  const type = getKontentItemNodeTypeName(typeCodename)

  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      fallback_used: {
        type: "Boolean",
        // https://www.gatsbyjs.org/docs/schema-customization/
        resolve: (source) => {
          return source.preferred_language !== source.system.language
        },
      },
      other_languages: {
        type: `[${type}]`,
        // https://www.gatsbyjs.org/docs/schema-customization/
        resolve: async (source, _args, context, _info) => {
          const pluginInfo = await context.nodeModel.runQuery({
            query: {
              filter: {
                name: {
                  eq: "@kentico/gatsby-source-kontent",
                },
              },
            },
            type: "SitePlugin",
            firstOnly: true,
          })

          const otherLanguageCodenames = pluginInfo.pluginOptions.languageCodenames.filter(
            lang => lang !== source.system.language // filter out the actual language variants
          )

          const promises = otherLanguageCodenames.map(otherLanguage => context.nodeModel.runQuery({
            query: {
              filter: {
                system: {
                  codename: {
                    eq: source.system.codename,
                  },
                  // It is possible to skip this filter, if you want to include the fallback nodes to the other_languages property
                  language: {
                    eq: otherLanguage
                  }
                },
                preferred_language: {
                  eq: otherLanguage,
                },
              },
            },
            type: type,
            firstOnly: true,
          }))

          const otherLanguageNodes = await Promise
            .all(promises);
          return otherLanguageNodes
            .filter(item => item != null);
        },
      },
    },
  })
  createTypes(extendedType)
}

module.exports = {
  linkLanguageVariants,
}
