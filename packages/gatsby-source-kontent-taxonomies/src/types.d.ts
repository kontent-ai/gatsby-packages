import { PluginOptions, CreateSchemaCustomizationArgs, NodeInput } from "gatsby";

/**
 * The plugin options.
 */
interface CustomPluginOptions extends PluginOptions {
  projectId: string;
}

interface CustomCreateSchemaCustomizationArgs extends CreateSchemaCustomizationArgs {
  schema: {
    buildObjectType: Function;
  };
}

interface PluginNamingConfiguration {
  prefix: string;
}

interface KontentTaxonomy extends NodeInput {
  system: {
    id: string;
    name: string;
    codename: string;
    last_modified: date;
  };
  terms: KontentTaxonomyTerm[];
}

interface KontentTaxonomyTerm {
  name: string;
  codename: string;
  terms: KontentTaxonomyTerm[];
}

