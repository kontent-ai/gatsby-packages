import * as fs from "fs";
import * as path from "path";
import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const SYSTEM_IDENTIFIER = "system";
const ELEMENT_IDENTIFIER = "element";
const ELEMENT_OPTION_IDENTIFIER = "option";
const TYPE_IDENTIFIER = "type";
const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent`,
};

const getKontentTypeNodeStringForCodeName = (codename: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${codename}`;

const getKontentTypeTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}`;
const getKontentTypeSystemElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${SYSTEM_IDENTIFIER}`;
const getKontentTypeElementTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${TYPE_IDENTIFIER}${CONNECTOR}${ELEMENT_IDENTIFIER}`;
const getKontentTypeElementOptionTypeName = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${getKontentTypeElementTypeName(config)}${CONNECTOR}${ELEMENT_OPTION_IDENTIFIER}`;



const getKontentTypesSchemaNamingConfiguration = (config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string => {
  const template = fs.readFileSync(path.join(__dirname, "template.types.schema.gql"), "utf8");
  return template
    .replace(/__KONTENT_TYPE_NAME__/g, getKontentTypeTypeName(config))
    .replace(/__KONTENT_TYPE_SYSTEM_TYPE__/g, getKontentTypeSystemElementTypeName(config))
    .replace(/__KONTENT_TYPE_ELEMENT_TYPE__/g, getKontentTypeElementTypeName(config))
    .replace(/__KONTENT_TYPE_ELEMENT_OPTIONS_TYPE__/g, getKontentTypeElementOptionTypeName(config));
}

export {
  getKontentTypeNodeStringForCodeName,
  getKontentTypesSchemaNamingConfiguration,
  getKontentTypeTypeName
}