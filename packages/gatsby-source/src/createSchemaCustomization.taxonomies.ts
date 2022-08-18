import { CreateSchemaCustomizationArgs } from 'gatsby';
import { getKontentTaxonomiesSchemaNamingConfiguration } from './naming';

const createSchemaCustomization = async (
  api: CreateSchemaCustomizationArgs,
): Promise<void> => {
  const schema = getKontentTaxonomiesSchemaNamingConfiguration();
  api.actions.createTypes(schema);
};

export { createSchemaCustomization as kontentTaxonomiesCreateSchemaCustomization };
