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

interface KontentTypeElementOption {
  name: string;
  codename: string;
}


interface KontentTypeElementsObject {
  [key: string]: KontentTypeElementArrayItem;
}

interface KontentTypeElementArrayItem {
  codename: string;
  name: string;
  type: string;
  taxonomy_group: string;
  options: KontentTypeElementOption[];
}

interface KontentType extends NodeInput {
  system: {
    id: string;
    name: string;
    codename: string;
    last_modified: date;
  };
  elements: KontentTypeElementsObject | KontentTypeElementArrayItem[];
}

