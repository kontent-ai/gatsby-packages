import * as fs from "fs";
import * as path from "path";
import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const SYSTEM_IDENTIFIER = "system";
const ELEMENT_IDENTIFIER = "element";
const VALUE_IDENTIFIER = "value";
const MULTI_ELEMENT_IDENTIFIER = `${ELEMENT_IDENTIFIER}s`;
const LANGUAGE_LINK_EXTENSION_IDENTIFIER = 'language_link';

const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent${CONNECTOR}item`,
};

/**
 * Retrieve ID string Gatsby CreateNodeId method for specified Kontent item language variant.
 * @param codename Codename because modular content is using them for linking items
 * @param preferredLanguage Preferred language of the language variant.
 * @param config Optional parameter with extra configuration.
 */
const getKontentItemNodeStringForId = (codename: string, preferredLanguage: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${preferredLanguage}${CONNECTOR}${codename}`;

const getKontentItemNodeTypeName = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}`

const getKontentItemInterfaceName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}`;

const getKontentItemSystemElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${SYSTEM_IDENTIFIER}`;

const getKontentItemElementTypeNameByType = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}${CONNECTOR}${VALUE_IDENTIFIER}`;

const getKontentItemElementValueTypeNameByType = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}`;

const getKontentItemElementsSchemaTypeName = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}${CONNECTOR}${MULTI_ELEMENT_IDENTIFIER}`;

const getKontentItemLanguageLinkExtensionName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${LANGUAGE_LINK_EXTENSION_IDENTIFIER}`;

const getSchemaNamingConfiguration = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string => {
  const template = fs.readFileSync(path.join(__dirname, "template.schema.gql"), "utf8");

  return template
    .replace(/__KONTENT_ITEM_INTERFACE__/g, getKontentItemInterfaceName(config))
    .replace(/__KONTENT_ITEM_SYSTEM_TYPE__/g, getKontentItemSystemElementTypeName(config))
    // elements
    .replace(/__KONTENT_ITEM_TEXT_ELEMENT__/g, getKontentItemElementTypeNameByType('text', config))
    .replace(/__KONTENT_ITEM_RICH_TEXT_ELEMENT__/g, getKontentItemElementTypeNameByType('rich_text', config))
    .replace(/__KONTENT_ITEM_NUMBER_ELEMENT__/g, getKontentItemElementTypeNameByType('number', config))
    .replace(/__KONTENT_ITEM_MULTIPLE_CHOICE_ELEMENT__/g, getKontentItemElementTypeNameByType('multiple_choice', config))
    .replace(/__KONTENT_ITEM_DATE_TIME_ELEMENT__/g, getKontentItemElementTypeNameByType('date_time', config))
    .replace(/__KONTENT_ITEM_ASSET_ELEMENT__/g, getKontentItemElementTypeNameByType('asset', config))
    .replace(/__KONTENT_ITEM_MODULAR_CONTENT_ELEMENT__/g, getKontentItemElementTypeNameByType('modular_content', config))
    .replace(/__KONTENT_ITEM_CUSTOM_ELEMENT_ELEMENT__/g, getKontentItemElementTypeNameByType('custom', config))
    .replace(/__KONTENT_ITEM_TAXONOMY_ELEMENT__/g, getKontentItemElementTypeNameByType('taxonomy', config))
    .replace(/__KONTENT_ITEM_URL_SLUG_ELEMENT__/g, getKontentItemElementTypeNameByType('url_slug', config))
    // element values
    .replace(/__KONTENT_ELEMENT_MULTIPLE_CHOICE_VALUE__/g, getKontentItemElementValueTypeNameByType('multiple_choice', config))
    .replace(/__KONTENT_ELEMENT_ASSET_VALUE__/g, getKontentItemElementValueTypeNameByType('asset', config))
    .replace(/__KONTENT_ELEMENT_TAXONOMY_VALUE__/g, getKontentItemElementValueTypeNameByType('taxonomy', config))
    .replace(/__KONTENT_ELEMENT_RICH_TEXT_IMAGE_VALUE__/g, `${getKontentItemElementValueTypeNameByType('rich_text', config)}${CONNECTOR}link`)
    .replace(/__KONTENT_ELEMENT_RICH_TEXT_LINK_VALUE__/g, `${getKontentItemElementValueTypeNameByType('rich_text', config)}${CONNECTOR}image`)
    // extensions
    .replace(/__KONTENT_ITEM_LANGUAGE_EXTENSION__/g, getKontentItemLanguageLinkExtensionName(config));
}



export {
  getKontentItemNodeStringForId,
  getKontentItemNodeTypeName,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemElementsSchemaTypeName,
  getSchemaNamingConfiguration,
  getKontentItemLanguageLinkExtensionName
}