import * as rax from 'retry-axios';
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
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const interceptorId = rax.attach();
      const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/items-feed?language=${language}`, {
        headers,
        raxConfig: {
          onRetryAttempt: err => {
            const cfg = rax.getConfig(err);
            console.log(`Retry attempt #${cfg?.currentRetryAttempt}`);
          }
        }
      });

      const union = _.unionBy<KontentItem>(
        response.data.items,
        Object.values(response.data.modular_content),
        'system.codename');
      items.push(...union);
      continuationToken = response.headers[continuationHeaderName];
    } catch (error) {
      console.error(`Items load for project ${projectId} on language ${language} failed with error: ${JSON.stringify(error)}`);
    }


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