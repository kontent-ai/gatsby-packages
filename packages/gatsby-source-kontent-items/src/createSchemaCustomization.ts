import { CustomPluginOptions, CustomCreateSchemaCustomizationArgs } from "./types";
import { loadAllKontentTypes } from "./client";
import * as fs from "fs";
import * as path from "path";
import {
  getKontentItemElementsSchemaTypeName,
  getKontentItemNodeTypeName,
  getSchemaNamingConfiguration,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType
} from "./naming";

const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs, pluginConfig: CustomPluginOptions): Promise<void> => {
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