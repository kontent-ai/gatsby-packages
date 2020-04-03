import {
  CustomPluginOptions,
  CustomCreateSchemaCustomizationArgs,
  KontentItem,
  KontentType,
  KontentTypeElementsObject,
} from './types';
import { loadAllKontentTypes } from './client';

import {
  getKontentItemElementsSchemaTypeName,
  getKontentItemNodeTypeName,
  getKontentItemsSchemaNamingConfiguration,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemLanguageLinkExtensionName,
  PREFERRED_LANGUAGE_IDENTIFIER
} from './naming';

const getLanguageLinkExtension = (): object => ({
  name: getKontentItemLanguageLinkExtensionName(),
  extend: (): object => ({
    async resolve(
      source: { value?: string[]; modular_content?: string[]; type: string },
      _args: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any,
    ): Promise<KontentItem[]> {
      const kontentItemNode = context.nodeModel.findRootNodeAncestor(source);
      const nodesCodeNames =
        source.type === 'modular_content'
          ? (source.value as string[])
          : (source.modular_content as string[]);
      const nodesLanguage = kontentItemNode[PREFERRED_LANGUAGE_IDENTIFIER];

      const promises = nodesCodeNames.map(codename =>
        context.nodeModel.runQuery({
          query: {
            filter: {
              system: {
                codename: {
                  eq: codename,
                },
              },
              [PREFERRED_LANGUAGE_IDENTIFIER]: {
                eq: nodesLanguage,
              },
            },
          },
          type: getKontentItemInterfaceName(),
          firstOnly: true,
        }),
      );

      const nodes = await Promise.all(promises);
      return nodes;
    },
  }),
});

const getElementFieldsDefinitionForType = (
  type: KontentType,
): { [key: string]: { type: string } } => {
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
          type: elementType,
        };
      }
    }
  }

  return elementFields;
};

const createSchemaCustomization = async (
  api: CustomCreateSchemaCustomizationArgs,
  pluginConfig: CustomPluginOptions,
): Promise<void> => {
  const languageExtension = getLanguageLinkExtension();
  api.actions.createFieldExtension(languageExtension);

  const baseSchemaTypes = getKontentItemsSchemaNamingConfiguration();
  api.actions.createTypes(baseSchemaTypes);

  const types = await loadAllKontentTypes(pluginConfig);
  for (const type of types) {
    const kontentItemElementsTypeName = getKontentItemElementsSchemaTypeName(
      type.system.codename,
    );
    const elementsTypeDef = api.schema.buildObjectType({
      name: kontentItemElementsTypeName,
      fields: getElementFieldsDefinitionForType(type),
      infer: false,
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
        [PREFERRED_LANGUAGE_IDENTIFIER]: 'String!',
      },
      interfaces: ['Node', typeInterfaceName],
      infer: false,
    });
    api.actions.createTypes(typeItemDef);
  }
};

export { createSchemaCustomization as kontentItemsCreateSchemaCustomization };
