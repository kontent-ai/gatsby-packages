import { CustomPluginOptions, CustomCreateSchemaCustomizationArgs, KontentItem, KontentType, KontentTypeElementsObject } from "./types";
import { loadAllKontentTypes } from "./client";

import {
  getKontentItemElementsSchemaTypeName,
  getKontentItemNodeTypeName,
  getKontentItemsSchemaNamingConfiguration,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemNodeStringForId,
  getKontentItemLanguageLinkExtensionName
} from "./naming";


const getLanguageLinkExtension = (api: CustomCreateSchemaCustomizationArgs): object => ({
  name: getKontentItemLanguageLinkExtensionName(),
  extend: (): object => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve(source: any, _args: any, context: any): Promise<KontentItem[]> {
      const kontentItemNode = context.nodeModel.findRootNodeAncestor(source);
      const nodesCodeNames = source.value as string[];
      const nodesLanguage = kontentItemNode.preferred_language;
      const nodeIds = nodesCodeNames.map(codename => {
        // the method is the same as used on sourceNodes for getting id string input
        const stringForId = getKontentItemNodeStringForId(codename, nodesLanguage);
        // But this method automatically creates namespaced 
        // now it is fine - because we are still in the same source plugin
        // but this approach could not be used outside (in the website/other plugin)
        return api.createNodeId(stringForId);
      });
      const linkedItems = context.nodeModel.getNodesByIds({
        ids: nodeIds,
        type: getKontentItemInterfaceName()
      });
      return linkedItems;
    },
  })
});

const getElementFieldsDefinitionForType = (type: KontentType): { [key: string]: { type: string } } => {
  const elementFields: {
    [key: string]: {
      type: string;
    };
  } = {};

  for (const elementKey in type.elements) {
    if (Object.prototype.hasOwnProperty.call(type.elements, elementKey)) {
      const element = (type.elements as KontentTypeElementsObject)[elementKey];
      const elementType = getKontentItemElementTypeNameByType(element.type);
      if (elementType !== '') {
        elementFields[elementKey] = {
          type: elementType
        };
      }
    }
  }

  return elementFields;
}


const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs, pluginConfig: CustomPluginOptions): Promise<void> => {

  const languageExtension = getLanguageLinkExtension(api);
  api.actions.createFieldExtension(languageExtension, { name: "TODO: will be done optional in next gatsby release" });

  const baseSchemaTypes = getKontentItemsSchemaNamingConfiguration();
  api.actions.createTypes(baseSchemaTypes);

  const types = await loadAllKontentTypes(pluginConfig.projectId);
  for (const type of types) {

    const kontentItemElementsTypeName = getKontentItemElementsSchemaTypeName(type.system.codename)
    const elementsTypeDef = api.schema.buildObjectType({
      name: kontentItemElementsTypeName,
      fields: getElementFieldsDefinitionForType(type),
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
  createSchemaCustomization as kontentItemsCreateSchemaCustomization
}

