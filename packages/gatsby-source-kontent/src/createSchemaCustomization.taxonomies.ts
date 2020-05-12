import { CustomCreateSchemaCustomizationArgs } from './types';
import { getKontentTaxonomiesSchemaNamingConfiguration } from './naming';

const createSchemaCustomization = async (
  api: CustomCreateSchemaCustomizationArgs,
): Promise<void> => {
  const schema = getKontentTaxonomiesSchemaNamingConfiguration();
  api.actions.createTypes(schema);
};

export { createSchemaCustomization as kontentTaxonomiesCreateSchemaCustomization };
