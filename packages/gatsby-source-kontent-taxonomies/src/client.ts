import axios from "axios";
import { KontentTaxonomy } from "./types";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";

const loadAllKontentTaxonomies = async (projectId: string): Promise<KontentTaxonomy[]> => {
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/taxonomies`);
  return response.data.taxonomies;
}

export {
  loadAllKontentTaxonomies,
}