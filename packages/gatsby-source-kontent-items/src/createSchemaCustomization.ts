import { CustomPluginOptions, CustomCreateSchemaCustomizationArgs, KontentItem } from "./types";
import { loadAllKontentTypes } from "./client";
import * as fs from "fs";
import * as path from "path";
import {
  getKontentItemElementsSchemaTypeName,
  getKontentItemNodeTypeName,
  getSchemaNamingConfiguration,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemNodeStringForId
} from "./naming";

const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs, pluginConfig: CustomPluginOptions): Promise<void> => {

  api.actions.createFieldExtension({
    name: "languageLink",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extend(_options: unknown, _prevFieldConfig: unknown) {
      return {
        async resolve(
          source: { value: string[] },
          _args: unknown,
          context: {
            nodeModel: {
              findRootNodeAncestor: Function;
              getAllNodes: Function;
              runQuery: Function;
              getNodesByIds: Function;
            };
          }
        ): Promise<KontentItem[]> {
          const kontentItemNode = context.nodeModel.findRootNodeAncestor(source);

          const linkedItems = await context.nodeModel
            .runQuery({
              query: {
                filter: {
                  system: {
                    codename: {
                      in: source.value
                    },
                  },
                  "preferred_language": {
                    eq: kontentItemNode.preferred_language
                  }
                },
              },
              type: getKontentItemInterfaceName(),
              firstOnly: false,
            });



          const nodesCodeNames = source.value;
          const nodesLanguage = kontentItemNode.preferred_language;
          const nodeIds = nodesCodeNames.map(codename => {
            // the method is the same as used on sourceNodes for getting id string input
            const stringForId = getKontentItemNodeStringForId(codename, nodesLanguage);
            // But this method automatically creates namespaced 
            // now it is fine - because we are still in the same source plugin
            // but this approach could not be used outside (in the website/other plugin)
            return api.createNodeId(stringForId); 
          });

          const linkedItems2 = context.nodeModel.getNodesByIds({
            ids: nodeIds,
            type: getKontentItemInterfaceName()
          });

          
          return Promise.resolve(linkedItems);
        },
      }
    },
  }, { name: "test" });

  const baseSchemaTypesTemplate = fs.readFileSync(path.join(__dirname, "template.schema.gql"), "utf8");
  const baseSchemaTypes = getSchemaNamingConfiguration(baseSchemaTypesTemplate);
  api.actions.createTypes(baseSchemaTypes);

  const types = await loadAllKontentTypes(pluginConfig.projectId);

  for (const type of types) {

    const elementFields: { [key: string]: { type: string } } = {};
    for (const elementKey in type.elements) {
      if (Object.prototype.hasOwnProperty.call(type.elements, elementKey)) {
        const element = type.elements[elementKey];
        const elementType = getKontentItemElementTypeNameByType(element.type);
        if (elementType !== '') {
          elementFields[elementKey] = {
            type: elementType
          }
        }
      }
    }
    const kontentItemElementsTypeName = getKontentItemElementsSchemaTypeName(type.system.codename)
    const elementsTypeDef = api.schema.buildObjectType({
      name: kontentItemElementsTypeName,
      fields: elementFields,
      infer: false
    });
    api.actions.createTypes(elementsTypeDef);

    const typeName = getKontentItemNodeTypeName(type.system.codename);
    const systemElementsTypeName = getKontentItemSystemElementTypeName();
    const typeInterfaceName = getKontentItemInterfaceName();
    const typeItemDef = api.schema.buildObjectType({
      name: typeName,
      fields: {
        system: `${systemElementsTypeName}!`,
        elements: kontentItemElementsTypeName,
        ["preferred_language"]: 'String!',
      },
      interfaces: ['Node', typeInterfaceName],
      infer: false,
    });
    api.actions.createTypes(typeItemDef);
  }
};

export {
  createSchemaCustomization
}