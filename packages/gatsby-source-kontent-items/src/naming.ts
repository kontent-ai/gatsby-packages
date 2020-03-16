import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const SYSTEM_IDENTIFIER = "system";
const ELEMENT_IDENTIFIER = "element";
const MULTI_ELEMENT_IDENTIFIER = `${ELEMENT_IDENTIFIER}s`;

const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent${CONNECTOR}item`,
};

const getKontentItemNodeStringForId = (id: string, preferredLanguage: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${preferredLanguage}${CONNECTOR}${id}`;

const getKontentItemNodeTypeName = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}`

const getKontentItemInterfaceName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}`;

const getKontentItemSystemElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${SYSTEM_IDENTIFIER}`;

const getKontentItemElementTypeNameByType = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}${CONNECTOR}${ELEMENT_IDENTIFIER}`;

const getKontentItemElementsSchemaTypeName = (type: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${type}${CONNECTOR}${MULTI_ELEMENT_IDENTIFIER}`;

const getSchemaNamingConfiguration = (template: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  template
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
    .replace(/__KONTENT_ITEM_URL_SLUG_ELEMENT__/g, getKontentItemElementTypeNameByType('url_slug', config));  


export {
  getKontentItemNodeStringForId,
  getKontentItemNodeTypeName,
  getKontentItemSystemElementTypeName,
  getKontentItemInterfaceName,
  getKontentItemElementTypeNameByType,
  getKontentItemElementsSchemaTypeName,
  getSchemaNamingConfiguration,
}