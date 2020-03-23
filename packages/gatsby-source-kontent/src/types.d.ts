import { PluginOptions, CreateSchemaCustomizationArgs, NodeInput } from "gatsby";

/**
 * The plugin options.
 */
interface CustomPluginOptions extends PluginOptions {
  projectId: string;
  languageCodenames: string[];
}

interface CustomCreateSchemaCustomizationArgs extends CreateSchemaCustomizationArgs {
  schema: {
    buildObjectType: Function;
  };
}

interface PluginNamingConfiguration {
  prefix: string;
}

interface KontentItemElement {
  name: string;
  type: string;
  value: string | number | string[];
  images: { [key: string]: RichTextElementImage } | RichTextElementImage[];
  links: { [key: string]: RichTextElementLink } | RichTextElementLink[];
  modular_content: string[];
}

interface RichTextElementImage {
  image_id: string;
  url: string;
  description: string;
  height: number;
  width: number;
}

interface RichTextElementLink {
  link_id: string;
  codename: string;
  type: string;
  urlSlug: string;
}

interface KontentItem extends NodeInput {
  system: {
    codename: string;
    id: string;
    language: string;
    last_modified: Date;
    name: string;
    type: string;
  };
  elements: KontentItemElement[];
  preferred_language: string;
}

interface KontentType {
  system: {
    id: string;
    name: string;
    codename: string;
    last_modified: date;
  };
  elements:
  {
    [key: string]: {
      name: string;
      type: string;
    };
  };
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