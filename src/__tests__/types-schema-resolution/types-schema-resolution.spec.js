
const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

const { createSchemaCustomization } = require('../../gatsby-node');

const fakeTypesResponse =
  require('./fakeTypesResponse.json');
const fakeItemsResponse =
  require('./fakeItemsResponse.json');
const fakeTaxonomiesReponse =
  require('../fakeTaxonomiesResponse.json');

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
    fakeHttpServiceConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/taxonomies/,
      {
        fakeResponseJson: fakeTaxonomiesReponse,
        throwError: false,
      });

    const createTypesMock = jest.fn();

    const mockedSchema = { buildObjectType: jest.fn((input) => (
      { data: `Returning from mocked schema's buildObjectType function.
        Original input: ${input}`,
      }))}; ;

    const api = {
      actions: {
        createTypes: createTypesMock,
      },
      schema: mockedSchema,
    };
    const deliveryClientConfig = {
      projectId: 'dummyProject',
      typeResolvers: [],
      httpService: new KontentTestHttpService(
        fakeHttpServiceConfig,
      ),
    };

    const pluginConfiguration = {
      deliveryClientConfig,
      languageCodenames: ['default'],
    };

    it('passes with no error', async () => {
      await createSchemaCustomization(api, pluginConfiguration);

      const createTypeCalls = createTypesMock.mock.calls;
      expect(createTypeCalls).toHaveLength(2);
      expect(createTypeCalls).toMatchSnapshot();

      const buildObjectTypeCalls = mockedSchema.buildObjectType.mock.calls;
      expect(buildObjectTypeCalls).toHaveLength(6);
      expect(buildObjectTypeCalls).toMatchSnapshot();
    });
  });
