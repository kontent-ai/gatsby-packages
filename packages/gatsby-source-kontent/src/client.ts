import * as rax from 'retry-axios';
import axios, { AxiosError } from "axios";
import { KontentItem, KontentType, KontentTaxonomy } from "./types";
import * as _ from "lodash";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";
const continuationHeaderName = 'x-continuation';

rax.attach();

const logRetryAttempt = (err: AxiosError): void => {
  const cfg = rax.getConfig(err);
  console.log(`Error axios request:(url: ${err.response?.config.url}) ${err.message}`)
  console.log(`Retry attempt #${cfg?.currentRetryAttempt}`);
}

const loadAllKontentItems = async (projectId: string, language: string): Promise<KontentItem[]> => {
  let continuationToken = "";
  const items = [];
  do {
    const headers = {
      [continuationHeaderName]: continuationToken
    };
    try {
      const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/items-feed?language=${language}`, {
        headers,
        raxConfig: {
          onRetryAttempt: logRetryAttempt
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
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/types`, {
    raxConfig: {
      onRetryAttempt: logRetryAttempt
    }
  });
  return response.data.types;
}

const loadAllKontentTaxonomies = async (projectId: string): Promise<KontentTaxonomy[]> => {
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/taxonomies`, {
    raxConfig: {
      onRetryAttempt: logRetryAttempt
    }
  });
  return response.data.taxonomies;
}

export {
  loadAllKontentItems,
  loadAllKontentTypes,
  loadAllKontentTaxonomies
}