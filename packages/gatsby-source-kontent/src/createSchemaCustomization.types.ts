import { CreateSchemaCustomizationArgs } from 'gatsby';
import { getKontentTypesSchemaNamingConfiguration } from './naming';

const createSchemaCustomization = async (
  api: CreateSchemaCustomizationArgs,
): Promise<void> => {
  const schema = getKontentTypesSchemaNamingConfiguration();
  api.actions.createTypes(schema);
};

export { createSchemaCustomization as kontentTypesCreateSchemaCustomization };
