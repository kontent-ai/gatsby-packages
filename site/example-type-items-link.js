const {
  getKontentTypeTypeName,
  getKontentItemInterfaceName,
} = require("@kentico/gatsby-source-kontent")

const addKontentTypeItemsLink = async api => {
  const {
    actions: { createTypes },
    schema,
  } = api

  const type = getKontentTypeTypeName()
  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      content_items: {
        type: `[${getKontentItemInterfaceName()}]`,
        // https://www.gatsbyjs.org/docs/schema-customization/
        resolve: async (source, args, context, info) => {
          const linkedContentItems = await context.nodeModel.runQuery({
            query: {
              filter: {
                system: {
                  type: {
                    eq: source.system.codename,
                  },
                },
              },
            },
            type: getKontentItemInterfaceName(),
            firstOnly: false,
          })
          return linkedContentItems
        },
      },
    },
  })

  createTypes(extendedType)
}

module.exports = {
  addKontentTypeItemsLink,
}
