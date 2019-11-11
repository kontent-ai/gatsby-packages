
const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../../gatsby-node');

const fakeTypesResponse =
  require('./fakeTypesResponse.json');
const fakeItemsResponse =
  require('./fakeItemsResponse.json');

describe(
  `Complex content types schema resolution`,
  () => {
    // Project ID 532c0844-5eb3-0033-7d1b-faeea1e7e407
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
        fakeResponseJson: fakeTypesResponse,
        throwError: false,
      });

    const dummyCreateNodeID = jest.fn();
    dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

    const createNodeMock = jest.fn();
    const createTypesMock = jest.fn();

    const mockedSchema = { buildObjectType: jest.fn((input) => (
      { data: `Returning from mocked schema's buildObjectType function.
        Original input: ${input}`,
      }))}; ;

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

      const createTypeCalls = createTypesMock.mock.calls;
      expect(createTypeCalls).toHaveLength(2);
      expect(createTypeCalls).toMatchSnapshot();

      const buildObjectTypeCalls = mockedSchema.buildObjectType.mock.calls;
      expect(buildObjectTypeCalls).toHaveLength(4);
      expect(buildObjectTypeCalls).toMatchSnapshot();
    });
  });
