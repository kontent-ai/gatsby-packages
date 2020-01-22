const testItemNode = require('./test-item-node');
const testItem2Node = require('./test-item-2-node');
const testComponentNode = require('./test-component-node');


const { sourceNodes } = require('../../gatsby-node');

describe('Gatsby Preview update', () => {
  it.each([
    ['text element', './item-response-updated-text'],
    ['number element', './item-response-updated-number'],
    ['date time element', './item-response-updated-datetime'],
    ['custom element', './item-response-updated-custom'],
    ['url slug element', './item-response-updated-url-slug'],
    ['asset element', './item-response-updated-asset'],
    ['linked items element', './item-response-updated-linked-items'],
    ['rich text element', './item-response-updated-rich-text'],
  ])('%s', async (_, updateResponse) => {
    const response = require(updateResponse);

    const api = {
      actions: {
        createNode: jest.fn(),
        createTypes: jest.fn(),
        touchNode: jest.fn(),
      },
      createNodeId: jest.fn(() => '1bdc8830-979d-57b2-a2a3-501486825575'),
      schema: {
        buildObjectType: jest.fn(),
      },
      webhookBody: {
        message: {
          operation: 'update',
          elementCodenames: ['text'],
          selectedLanguage: 'default',
        },
        data: {
          response,
        },
      },
      getNodes: jest.fn(() => [testItemNode, testItem2Node, testComponentNode]),
    };

    const pluginConfig = {
      deliveryClientConfig: {
        projectId: 'dummyProject',
        typeResolvers: [],
      },
      languageCodenames: ['default'],
    };

    await sourceNodes(api, pluginConfig);

    expect(api.actions.createNode.mock.calls)
      .toHaveLength(1);
    expect(api.actions.createNode.mock.calls[0])
      .toMatchSnapshot();
  });
});
