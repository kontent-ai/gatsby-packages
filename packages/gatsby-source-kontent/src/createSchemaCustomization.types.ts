import { CustomCreateSchemaCustomizationArgs } from "./types";
import * as fs from "fs";
import * as path from "path";
import { getKontentTypesSchemaNamingConfiguration } from "./naming";

const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs): Promise<void> => {
  const schema = getKontentTypesSchemaNamingConfiguration();
  api.actions.createTypes(schema);
};

export {
  createSchemaCustomization as kontentTypesCreateSchemaCustomization
}