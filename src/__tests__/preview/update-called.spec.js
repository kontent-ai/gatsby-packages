const { sourceNodes } = require('../../gatsby-node');
const previewModule = require('../../preview');
jest.mock('../../preview', () => ({ performUpdate: jest.fn() }));

describe('Gatsby Preview update', () => {
  it('is called correctly', async () => {
    const webhookBody = {
      message: {
        operation: 'update',
        elementCodenames: ['sample'],
        selectedLanguage: 'default',
      },
      data: {
        response: {
          item: {
            system: {
              id: '7e70cb89-9281-4db9-8130-36076ee1e698',
              name: 'Content item 1',
              codename: 'content_item_1',
              language: 'default',
              type: 'content_type',
              sitemap_locations: [],
              last_modified: '2018-12-28T00:00:00.3224207Z',
            },
            elements: {
              text_1: {
                type: 'text',
                name: 'Text',
                value: 'Test Value',
              },
            },
          },
          modular_content: {},
        },
      },
    };

    const api = {
      actions: {
        createNode: jest.fn(),
        createTypes: jest.fn(),
        touchNode: jest.fn(),
      },
      createNodeId: jest.fn(),
      schema: {
        buildObjectType: jest.fn(),
      },
      webhookBody,
      getNodes: jest.fn(),
    };

    const pluginConfig = {
      deliveryClientConfig: {
        projectId: 'dummyProject',
        typeResolvers: [],
      },
      languageCodenames: ['default'],
    };

    await sourceNodes(api, pluginConfig);
    expect(previewModule.performUpdate)
      .toHaveBeenCalledTimes(1);
  });
});
