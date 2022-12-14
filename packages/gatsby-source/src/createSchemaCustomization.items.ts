import { CreateSchemaCustomizationArgs } from 'gatsby';
import {
  CustomPluginOptions,
  KontentItemInput,
  KontentType,
  KontentTypeElementsObject,
  KontentTypeItemObjectDefinition,
} from './types';
import { loadAllKontentTypesCached } from './client';

import {
  getKontentItemElementsSchemaTypeName,
  getKontentItemNodeTypeName,
  getKontentItemsSchemaNamingConfiguration,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemLanguageLinkExtensionName,
  PREFERRED_LANGUAGE_IDENTIFIER,
} from './naming';

const getLanguageLinkExtension = (): object => ({
  name: getKontentItemLanguageLinkExtensionName(),
  extend: (): object => ({
    async resolve(
      source: { value?: string[]; modular_content?: string[]; type: string },
      _args: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any,
    ): Promise<KontentItemInput[]> {
      const nodesCodeNames =
        source.type === 'modular_content'
          ? (source.value as string[])
          : (source.modular_content as string[]);

      if (nodesCodeNames.length === 0) {
        return [];
      }

      const kontentItemNode = context.nodeModel.findRootNodeAncestor(source);
      const nodesLanguage = kontentItemNode[PREFERRED_LANGUAGE_IDENTIFIER];

      const promises = nodesCodeNames.map(codename =>
        context.nodeModel.findOne({
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
  api: CreateSchemaCustomizationArgs,
  pluginConfig: CustomPluginOptions,
): Promise<void> => {
  // TODO check https://github.com/gatsbyjs/gatsby/pull/14610/files/5c50c435ab49884b6d854cd07f20efd95d1e5f52#diff-29de3acf9ce1010435f2b2f0043dba8cR252
  // failing for update run
  const languageExtension = getLanguageLinkExtension();
  api.actions.createFieldExtension(languageExtension);

  const baseSchemaTypes = getKontentItemsSchemaNamingConfiguration();
  api.actions.createTypes(baseSchemaTypes);

  const types = await loadAllKontentTypesCached(pluginConfig, api.cache);
  for (const type of types) {
    const kontentItemElementsTypeName = getKontentItemElementsSchemaTypeName(
      type.system.codename,
    );

    const elementsFieldDefinition = getElementFieldsDefinitionForType(type)
    const typeContainsElements = Object.keys(elementsFieldDefinition).length > 0;
    if (typeContainsElements) {
      const elementsTypeDef = api.schema.buildObjectType({
        name: kontentItemElementsTypeName,
        fields: elementsFieldDefinition,
        extensions: {
          infer: false
        }
      });
      api.actions.createTypes(elementsTypeDef);
    }

    const typeName = getKontentItemNodeTypeName(type.system.codename);
    const systemElementsTypeName = getKontentItemSystemElementTypeName();
    const typeInterfaceName = getKontentItemInterfaceName();
    const typeItemObjectDefinition: KontentTypeItemObjectDefinition = {
      name: typeName,
      fields: {
        system: `${systemElementsTypeName}!`,
        elements: kontentItemElementsTypeName,
        [PREFERRED_LANGUAGE_IDENTIFIER]: 'String!',
      },
      interfaces: ['Node', typeInterfaceName],
      infer: false,
    };
    if (!typeContainsElements) {
      delete typeItemObjectDefinition.fields.elements;
    }
    const typeItemDef = api.schema.buildObjectType(typeItemObjectDefinition);
    api.actions.createTypes(typeItemDef);
  }
};

export { createSchemaCustomization as kontentItemsCreateSchemaCustomization };
