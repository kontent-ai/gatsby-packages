
const { KontentTestHttpService }
= require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../../gatsby-node');

const fakeTypeResponse =
require('./fakeTypesResponse.json');
const fakeItemsResponse =
require('./fakeItemsResponse.json');

describe(
  `Simple content type without item representation`,
  async () => {
    const fakeHttpServiceConfig = new Map();
    fakeHttpServiceConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/items/,
      {
        fakeResponseJson: fakeItemsResponse,
        throwError: false,
      });
    fakeHttpServiceConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/types/,
      {
        fakeResponseJson: fakeTypeResponse,
        throwError: false,
      });

    const dummyCreateNodeID = jest.fn();
    dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

    const createNodeMock = jest.fn();
    const createTypesMock = jest.fn();

    const actions = {
      actions: {
        createNode: createNodeMock,
        createTypes: createTypesMock,
      },
      createNodeId: dummyCreateNodeID,
    };
    const deliveryClientConfig = {
      projectId: 'dummyProject',
      typeResolvers: [],
      httpService: new KontentTestHttpService(
        fakeHttpServiceConfig
      ),
    };

    const pluginConfiguration = {
      deliveryClientConfig,
      languageCodenames: ['default'],
    };

    it('passes with no error', async () => {
      await sourceNodes(actions, pluginConfiguration);

      const calls = createTypesMock.mock.calls;
      expect(calls).toMatchSnapshot();
    });
  });
