import {
  PluginOptions,
  CreateSchemaCustomizationArgs,
  NodeInput,
} from 'gatsby';
import { PREFERRED_LANGUAGE_IDENTIFIER } from './naming';

/**
 * The plugin options.
 */
interface CustomPluginOptions extends PluginOptions {
  projectId: string;
  languageCodenames: string[];
  includeTypes: boolean = false;
  includeTaxonomies: boolean = false;
  authorizationKey: string = null; // consider using https://www.npmjs.com/package/dotenv for storing the key
  usePreviewUrl: boolean = false;
  proxy: {
    deliveryDomain: string;
    previewDeliveryDomain: string;
  };
  includeRawContent: boolean = false;
}

interface CustomCreateSchemaCustomizationArgs
  extends CreateSchemaCustomizationArgs {
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
  [PREFERRED_LANGUAGE_IDENTIFIER]: string;
}

interface KontentTaxonomy extends NodeInput {
  system: {
    id: string;
    name: string;
    codename: string;
    last_modified: Date;
  };
  terms: KontentTaxonomyTerm[];
}

interface KontentTaxonomyTerm {
  name: string;
  codename: string;
  terms: KontentTaxonomyTerm[];
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
