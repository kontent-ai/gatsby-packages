
const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../../gatsby-node');

// Project ID 4ac85e55-6daf-0122-7a52-81a12e5d986a
const simpleLinkedItemFakeItemsResponse =
  require('./simpleLinkedItemFakeItemsResponse.json');
const fakeTypeResponse =
  require('./fakeTypeResponse.json');

describe(
  `Simple linked items element contains reference to another items`,
  () => {
    const fakeHttpServiceConfig = new Map();
    fakeHttpServiceConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/items/,
      {
        fakeResponseJson: simpleLinkedItemFakeItemsResponse,
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
    const mockedSchema = {
      buildObjectType: jest.fn((input) => ({
        data: input,
      })),
    }; ;

    const actions = {
      actions: {
        createNode: createNodeMock,
        createTypes: createTypesMock,
      },
      createNodeId: dummyCreateNodeID,
      schema: mockedSchema,
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

      const calls = createNodeMock.mock.calls;
      expect(calls).toMatchSnapshot();
    });
  });
