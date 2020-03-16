import axios from "axios";
import { KontentItem, KontentType } from "./types";
import * as _ from "lodash";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";
const continuationHeaderName = 'x-continuation';

const loadAllKontentItems = async (projectId: string, language: string): Promise<KontentItem[]> => {
  let continuationToken = "";
  const items = [];
  do {
    const headers = {
      [continuationHeaderName]: continuationToken
    };
    const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/items-feed?language=${language}`, {
      headers
    });
    const union = _.unionBy<KontentItem>(
      response.data.items,
      Object.values(response.data.modular_content),
      'system.codename');
    items.push(...union);
    continuationToken = response.headers[continuationHeaderName];
  } while (continuationToken);
  return items;
}

const loadAllKontentTypes = async (projectId: string): Promise<KontentType[]> => {
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/types`);
  return response.data.types;
}

export {
  loadAllKontentItems,
  loadAllKontentTypes,
}