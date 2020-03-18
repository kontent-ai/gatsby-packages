import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const SYSTEM_IDENTIFIER = "system";
const ELEMENT_IDENTIFIER = "element";
const ELEMENT_OPTION_IDENTIFIER = "option";
const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent${CONNECTOR}type`,
};

const getKontentTypeNodeStringForCodeName = (codename: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${codename}`;

const getKontentTypeTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}`;
const getKontentTypeSystemElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${SYSTEM_IDENTIFIER}`;
const getKontentTypeElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${ELEMENT_IDENTIFIER}`;
const getKontentTypeElementOptionTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${getKontentTypeElementTypeName(config)}${CONNECTOR}${ELEMENT_OPTION_IDENTIFIER}`;
  

const getSchemaNamingConfiguration = (template: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  template
    .replace(/__KONTENT_TYPE_NAME__/g, getKontentTypeTypeName(config))
    .replace(/__KONTENT_TYPE_SYSTEM_TYPE__/g, getKontentTypeSystemElementTypeName(config))
    .replace(/__KONTENT_TYPE_ELEMENT_TYPE__/g, getKontentTypeElementTypeName(config))
    .replace(/__KONTENT_TYPE_ELEMENT_OPTIONS_TYPE__/g, getKontentTypeElementOptionTypeName(config));

export {
  getKontentTypeNodeStringForCodeName,
  getSchemaNamingConfiguration,
  getKontentTypeTypeName
}