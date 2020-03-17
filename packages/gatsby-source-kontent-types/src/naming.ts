import { PluginNamingConfiguration } from "./types";

const CONNECTOR = "_";
const defaultPluginNamingConfiguration: PluginNamingConfiguration = {
  prefix: `kontent${CONNECTOR}type`,
};

const getKontentTypeNodeStringForCodeName = (codename: string, config: PluginNamingConfiguration = defaultPluginNamingConfiguration): string =>
  `${config.prefix}${CONNECTOR}${codename}`;


export {
  getKontentTypeNodeStringForCodeName
}