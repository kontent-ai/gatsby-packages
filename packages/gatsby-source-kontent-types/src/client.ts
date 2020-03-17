import axios from "axios";
import { KontentType } from "./types";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";

const loadAllKontentTypes = async (projectId: string): Promise<KontentType[]> => {
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/types`);
  return response.data.types;
}

export {
  loadAllKontentTypes,
}