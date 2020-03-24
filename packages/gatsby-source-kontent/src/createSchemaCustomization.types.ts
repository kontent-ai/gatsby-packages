import { CustomCreateSchemaCustomizationArgs } from "./types";
import { getKontentTypesSchemaNamingConfiguration } from "./naming";

const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs): Promise<void> => {
  const schema = getKontentTypesSchemaNamingConfiguration();
  api.actions.createTypes(schema);
};

export {
  createSchemaCustomization as kontentTypesCreateSchemaCustomization
}