import { CustomCreateSchemaCustomizationArgs } from "./types";
import * as fs from "fs";
import * as path from "path";
import { getSchemaNamingConfiguration } from "./naming";

const createSchemaCustomization = async (api: CustomCreateSchemaCustomizationArgs): Promise<void> => {
  const baseSchemaTemplate = fs.readFileSync(path.join(__dirname, "template.schema.gql"), "utf8");
  const baseSchema = getSchemaNamingConfiguration(baseSchemaTemplate);
  api.actions.createTypes(baseSchema);
};

export {
  createSchemaCustomization
}