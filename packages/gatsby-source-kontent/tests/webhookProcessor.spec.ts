import * as _ from 'lodash';
import { SourceNodesArgs, Actions } from 'gatsby';
import { handleIncomingWebhook } from '../src/webhookProcessor';
import { CustomPluginOptions, KontentItem } from '../src/types';
import { createMock } from 'ts-auto-mock';
import { createContentDigest } from 'gatsby-core-utils';

import * as UPSERT_ITEM from './webhookUpsertClientItemResponse.json';
const UPSERT_ITEM_ID = UPSERT_ITEM.item.system.id;
const PROJECT_ID = "00676a8d-358c-0084-f2f2-33ed466c480a";
const LANGUAGE = "en-US";

import { mocked } from 'ts-jest/dist/util/testing';

jest.mock('../src/client', () => ({
  loadKontentItem: async (itemId: string): Promise<{
    item: KontentItem | undefined;
    modularKontent: { [key: string]: KontentItem };
  }> => {
    if (itemId.includes(UPSERT_ITEM_ID)) {
      return Promise.resolve(
        createMock<{
          item: KontentItem | undefined;
          modularKontent: { [key: string]: KontentItem };
        }>({
          ...UPSERT_ITEM
        })
      );
    } else {
      return Promise.resolve(
        createMock<{
          item: KontentItem | undefined;
          modularKontent: { [key: string]: KontentItem };
        }>({
          item: undefined,
          modularKontent: {}
        })
      );
    }
  }
}));
describe('webhookProcessor', () => {
  const pluginConfigurationBaseData = {
    projectId: PROJECT_ID,
    languageCodenames: [LANGUAGE]
  };
  const pluginConfiguration = createMock<CustomPluginOptions>(pluginConfigurationBaseData);

  describe('handleIncomingWebhook for upsert preview API trigger', () => {

    const api = createMock<SourceNodesArgs>({
      webhookBody: {
        data: {
          items: [
            {
              id: UPSERT_ITEM_ID,
              codename: "author",
              language: LANGUAGE,
              type: "author"
            }
          ],
          taxonomies: []
        },
        message: {
          id: "3ad63b9a-b0c7-45ce-aa4f-a03ccee418ab",
          "project_id": PROJECT_ID,
          type: "content_item_variant",
          operation: "upsert",
          "api_name": "delivery_preview",
          "created_timestamp": "2020-09-22T08:43:06.9629422Z",
          "webhook_url": "https://testing-endpoint.io/__refresh"
        }
      },
      createNodeId: jest.fn(input => `dummyId-${input}`),
      actions: createMock<Actions>({
        createNode: jest.fn(),
      }),
      createContentDigest,
    });

    it('call createNode action for modular content as well', async () => {
      await handleIncomingWebhook(api, pluginConfiguration, []);

      const createNodesMock = mocked(api.actions.createNode, true);
      const createdNodes = _.flatMap(
        createNodesMock.mock.calls,
      ) as KontentItem[];
      expect(createNodesMock.mock.calls.length).toBe(2);
      expect(createdNodes).toMatchSnapshot();
    });
  });

  describe('handleIncomingWebhook for upsert management API webhoook trigger (change workflow step)', () => {
    const api = createMock<SourceNodesArgs>({
      webhookBody: {
        data: {
          items: [
            {
              item: {
                id: UPSERT_ITEM_ID
              },
              language: {
                id: "00000000-0000-0000-0000-000000000000"
              },
              "transition_from": {
                id: "88ac5e6e-1c5c-4638-96e1-0d61221ad5bf"
              },
              "transition_to": {
                id: "10b99292-5bd1-4d4e-b6c1-a2fe2aedf3c5"
              }
            }
          ],
          taxonomies: []
        },
        message:
        {
          id: "562a9727-61b5-4919-9083-105b0c64995b",
          "project_id": PROJECT_ID,
          type: "content_item_variant",
          operation: "change_workflow_step",
          "api_name": "content_management",
          "created_timestamp": "2021-07-01T10:19:25.4983423Z",
          "webhook_url": "https://testing-endpoint.io/__refresh"
        }
      },
      createNodeId: jest.fn(input => `dummyId-${input}`),
      actions: createMock<Actions>({
        createNode: jest.fn(),
      }),
      createContentDigest,
    });


    it('does not call createNode actions when turned off', async () => {
      await handleIncomingWebhook(api, pluginConfiguration, []);

      const createNodesMock = mocked(api.actions.createNode, true);
      const createdNodes = _.flatMap(
        createNodesMock.mock.calls,
      ) as KontentItem[];
      expect(createNodesMock.mock.calls.length).toBe(0);
      expect(createdNodes).toMatchSnapshot();
    });

    it('call createNode action for modular content as well when turned on', async () => {

      const experimentalPluginConfiguration = createMock<CustomPluginOptions>({
        ...pluginConfigurationBaseData,
        experimental: {
          managementApiTriggersUpdate: true
        }
      });

      await handleIncomingWebhook(api, experimentalPluginConfiguration, []);

      const createNodesMock = mocked(api.actions.createNode, true);
      const createdNodes = _.flatMap(
        createNodesMock.mock.calls,
      ) as KontentItem[];
      expect(createNodesMock.mock.calls.length).toBe(2);
      expect(createdNodes).toMatchSnapshot();
    });

  });

  describe('handleIncomingWebhook for delete', () => {

    const mainItemKontentSystemId = "74b9fc6e-b7e2-42a1-a01b-ae6ee69b2174";
    const inlineLinkedKontentItemCodename = "test_note_linekd_inline_kontent_item";
    const kontentComponentCodename = "bcbb41f3_b964_01af_7c70_8384a101bca5";

    const mainItemGraphQlNode = {
      "system": {
        "id": mainItemKontentSystemId,
        "name": "Ondrejch test (copy)",
        "codename": "ondrejch_test__copy_",
        "language": "en-US",
        "type": "author",
        "sitemap_locations": [],
        "last_modified": "2020-09-23T10:21:25.7632394Z"
      },
      "elements": {
        "notes": {
          "type": "rich_text",
          "name": "Notes",
          "images": [],
          "links": [],
          "modular_content": [
            inlineLinkedKontentItemCodename,
            kontentComponentCodename
          ],
          "value": `<p>Great notes</p>\n<object type="application/kenticocloud" data-type="item" data-rel="component" data-codename="${kontentComponentCodename}"></object>\n<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="${inlineLinkedKontentItemCodename}"></object>`
        }
      },
      "preferred_language": "en-US",
      "id": "c415f1ce-6022-5672-8439-04c023ee2184",
      "children": [],
      "internal": {
        "type": "kontent_item_author",
        "contentDigest": "f6d6bb19f908369cf2209a6de314000e",
        "counter": 144,
        "owner": "@kentico/gatsby-source-kontent"
      },
      "parent": null
    };

    const modularItemsGraphQlNodes = [
      {
        "system": {
          "id": "9616528a-d5f7-43ce-a313-1ff921adc078",
          "name": "test note linekd inline kontent item",
          "codename": "test_note_linekd_inline_kontent_item",
          "language": "en-US",
          "type": "note",
          "sitemap_locations": [],
          "last_modified": "2020-09-22T11:34:54.0552695Z"
        },
        "elements": {
          "text": {
            "type": "text",
            "name": "Text",
            "value": "test note linekd inline kontent item"
          }
        },
        "preferred_language": "en-US",
        "id": "ff8798ff-a586-5295-9a0b-3171194e2a47",
        "children": [],
        "internal": {
          "type": "kontent_item_note",
          "contentDigest": "a0b030791ddaee2291e024db0644e799",
          "counter": 268,
          "owner": "@kentico/gatsby-source-kontent"
        },
        "parent": null
      },
      {
        "system": {
          "id": "bcbb41f3-b964-01af-7c70-8384a101bca5",
          "name": "bcbb41f3-b964-01af-7c70-8384a101bca5",
          "codename": "bcbb41f3_b964_01af_7c70_8384a101bca5",
          "language": "en-US",
          "type": "note",
          "sitemap_locations": [],
          "last_modified": "2020-09-23T10:21:25.7632394Z"
        },
        "elements": {
          "text": {
            "type": "text",
            "name": "Text",
            "value": "Magic note"
          }
        },
        "preferred_language": "en-US",
        "id": "d02ab1e7-56d4-588d-9d15-0266a84ec349",
        "children": [],
        "internal": {
          "type": "kontent_item_note",
          "contentDigest": "aae62fcb99f01c62256c16f301df2eca",
          "counter": 145,
          "owner": "@kentico/gatsby-source-kontent"
        },
        "parent": null
      }
    ];

    const api = createMock<SourceNodesArgs>({
      webhookBody: {
        "data": {
          "items": [
            {
              "id": mainItemKontentSystemId,
              "codename": "ondrejch_test__copy_",
              "language": LANGUAGE,
              "type": "author"
            }
          ],
          "taxonomies": []
        },
        "message": {
          "id": "d9e52de0-e289-4275-bdd6-11ee00d0c799",
          "project_id": PROJECT_ID,
          "type": "content_item_variant",
          "operation": "archive",
          "api_name": "delivery_preview",
          "created_timestamp": "2020-09-22T11:44:31.7718735Z",
          "webhook_url": "https://testing-endpoint.io/__refresh"
        }
      },
      createNodeId: jest.fn(input => `dummyId-${input}`),
      getNodes: jest.fn(() => [mainItemGraphQlNode, ...modularItemsGraphQlNodes]),
      getNode: jest.fn(() => mainItemGraphQlNode),
      actions: createMock<Actions>({
        deleteNode: jest.fn(),
      }),
      createContentDigest,
    });

    it('call deleteNode action for modular content as well', async () => {
      await handleIncomingWebhook(api, pluginConfiguration, []);

      const deletedNodesMock = mocked(api.actions.deleteNode, true);
      const deletedNodes = _.flatMap(
        deletedNodesMock.mock.calls,
      ) as KontentItem[];
      expect(deletedNodesMock.mock.calls.length).toBe(2);
      expect(deletedNodes).toMatchSnapshot();
    });
  });
});
