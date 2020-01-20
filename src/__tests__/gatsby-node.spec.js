const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../gatsby-node');
const complexContentItemsFirstLanguageFakeReponse =
  require('./complexContentItemsFirstLanguageFakeReponse.json');
const complexContentItemsSecondtLanguageFakeReponse =
  require('./complexContentItemsSecondLanguageFakeReponse.json');
const complexTypesFakeResponse =
  require('./complexTypesFakeResponse.json');
const fakeTaxonomiesResponse = require('./fakeTaxonomiesResponse.json');


describe('sourceNodes', () => {
  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockReturnValue('dummyId');
  const schemaDummy = {
    buildObjectType: jest.fn((input) => ({ data: input })),
  };

  const dummyCreation = {
    actions: {
      createNode: jest.fn(),
      createTypes: jest.fn(),
    },
    createNodeId: dummyCreateNodeID,
    schema: schemaDummy,
  };

  describe('complex multilingual data section', () => {
    const fakeComplexConfig = new Map();
    fakeComplexConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/items.*Another_language.*/,
      {
        fakeResponseJson: complexContentItemsSecondtLanguageFakeReponse,
        throwError: false,
      });
    fakeComplexConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/items/,
      {
        fakeResponseJson: complexContentItemsFirstLanguageFakeReponse,
        throwError: false,
      });
    fakeComplexConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/types/,
      {
        fakeResponseJson: complexTypesFakeResponse,
        throwError: false,
      });
    fakeComplexConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/taxonomies/,
      {
        fakeResponseJson: fakeTaxonomiesResponse,
        throwError: false,
      });

    const createNodeMock = jest.fn();
    const createTypesMock = jest.fn();
    const mockedSchema = {
      buildObjectType: jest.fn((input) => ({
        data: input,
      })),
    };

    const actions = {
      actions: {
        createNode: createNodeMock,
        createTypes: createTypesMock,
      },
      createNodeId: dummyCreation.createNodeId,
      schema: mockedSchema,
    };

    const deliveryClientConfig = {
      projectId: 'dummyProject',
      typeResolvers: [],
      httpService: new KontentTestHttpService(
        fakeComplexConfig
      ),
    };

    const pluginConfiguration = {
      deliveryClientConfig,
      languageCodenames: ['default', 'Another_language'],
    };

    it('resolve all element types in two languages', async () => {
      await sourceNodes(actions, pluginConfiguration);

      const calls = createNodeMock.mock.calls;
      expect(calls).toMatchSnapshot();
    });
  });
});
