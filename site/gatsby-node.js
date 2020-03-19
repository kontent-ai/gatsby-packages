const {
  getKontentItemInterfaceName
} = require("@simply007org/gatsby-source-kontent-items");


exports.createSchemaCustomization = (api) => {
  const { actions, schema } = api;
  const { createTypes } = actions;
  const typeDefs = [
    "type kontent_item_url_slug_element_value { resolvedUrl: String }",
    schema.buildObjectType({
      name: "kontent_item_url_slug_element_value",
      fields: {
        resolvedUrl: {
          type: "String",
          resolve: async (source, args, context, info) => {
            const kontentItemNode = context.nodeModel.findRootNodeAncestor(source);

            const linkedItemsCodenames = kontentItemNode.elements.friends.value;

            // Since source plugin is using the system codename,
            // you can use `runQuery`, or get all kontent nodes
            // with `getAllNodes` and manually find the linked item
            // nodes:
            const linkedItems = context.nodeModel
              .getAllNodes({ type: getKontentItemInterfaceName() })
              .filter(item =>
                linkedItemsCodenames.includes(item.system.codename)
                && item.preferred_language === kontentItemNode.preferred_language);

            // it is also possible tu use context.nodeModel.runQuery
            const linkedItems2 = await context.nodeModel
              .runQuery({
                query: {
                  filter: {
                    system: {
                      codename: {
                        in: linkedItemsCodenames
                      },
                    },
                    preferred_language: {
                      eq: kontentItemNode.preferred_language
                    }
                  },
                },
                type: getKontentItemInterfaceName(),
                firstOnly: false,
              });
            return "RESOLVED";
          },
        },
      },
    }),
  ]
  createTypes(typeDefs)
}