const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');

const { sourceNodes } = require('../gatsby-node');
const { customTrackingHeader } = require('../config');
const { name, version } = require('../../package.json');
const complexContentItemsFirstLanguageFakeReponse =
  require('./complexContentItemsFirstLanguageFakeReponse.json');
const complexContentItemsSecondtLanguageFakeReponse =
  require('./complexContentItemsSecondLanguageFakeReponse.json');
const complexTypesFakeResponse =
  require('./complexTypesFakeResponse.json');
const fakeTaxonomyResponse =
  require('./fakeTaxonomyResponse.json');

describe('customTrackingHeader', () => {
  it('has correct name', () => {
    expect(customTrackingHeader.header).toEqual('X-KC-SOURCE');
  });

  it('has correct value according to package name and package version', () => {
    const expectedHeaderValue = `${name};${version}`;
    expect(customTrackingHeader.value).toEqual(expectedHeaderValue);
  });
});

describe('sourceNodes', () => {
  const dummyCreateNodeID = jest.fn();
  dummyCreateNodeID.mockReturnValue('dummyId');

  const dummyCreation = {
    actions: {
      createNode: jest.fn(),
    },
    createNodeId: dummyCreateNodeID,
  };

  describe('tracking header tests', () => {
    const fakeEmptyResponseConfig = new Map();
    fakeEmptyResponseConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/items/,
      {
        fakeResponseJson: {
          items: [],
          modular_content: [],
          pagination: {
            continuation_token: null,
            next_page: null,
          },
        },
        throwError: false,
      });
    fakeEmptyResponseConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/types/,
      {
        fakeResponseJson: {
          types: [],
          pagination: {
            continuation_token: null,
            next_page: null,
          },
        },
        throwError: false,
      });
    fakeEmptyResponseConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/taxonomies/,
      {
        fakeResponseJson: {
          taxonomies: [],
          pagination: {
            continuation_token: null,
            next_page: null,
          },
        },
        throwError: false,
      });
    const fakeEmptyTestService =
      new KontentTestHttpService(fakeEmptyResponseConfig);


    it('does add tracking header', async () => {
      const deliveryClientConfig = {
        projectId: 'dummyEmptyProject',
        httpService: fakeEmptyTestService,
      };

      await sourceNodes(
        dummyCreation,
        {
          deliveryClientConfig,
          languageCodenames: ['default'],
        }
      );

      expect(deliveryClientConfig.globalQueryConfig.customHeaders)
        .toContainEqual(customTrackingHeader);
    });

    it('does update tracking header value', async () => {
      const deliveryClientConfig = {
        projectId: 'dummyEmptyProject',
        httpService: fakeEmptyTestService,
        globalQueryConfig: {
          customHeaders: [{
            header: customTrackingHeader.header,
            value: 'dummyValue',
          }],
        },
      };

      await sourceNodes(
        dummyCreation,
        {
          deliveryClientConfig,
          languageCodenames: ['default'],
        }
      );

      expect(deliveryClientConfig.globalQueryConfig.customHeaders)
        .toContainEqual(customTrackingHeader);
      expect(deliveryClientConfig.globalQueryConfig.customHeaders.length)
        .toEqual(1);
    });

    it('does not influence other tracking header value', async () => {
      const anotherHeader = {
        header: 'another-header-name',
        value: 'dummyValue',
      };
      const deliveryClientConfig = {
        projectId: 'dummyEmptyProject',
        httpService: fakeEmptyTestService,
        globalQueryConfig: {
          customHeaders: [
            anotherHeader,
          ],
        },
      };

      await sourceNodes(
        dummyCreation,
        {
          deliveryClientConfig,
          languageCodenames: ['default'],
        }
      );

      expect(deliveryClientConfig.globalQueryConfig.customHeaders)
        .toContainEqual(customTrackingHeader);
      expect(deliveryClientConfig.globalQueryConfig.customHeaders)
        .toContainEqual(anotherHeader);
      expect(deliveryClientConfig.globalQueryConfig.customHeaders.length)
        .toEqual(2);
    });
  });

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
        fakeResponseJson: fakeTaxonomyResponse,
        throwError: false,
      });

    const createNodeMock = jest.fn();
    const actions = {
      actions: {
        createNode: createNodeMock,
      },
      createNodeId: dummyCreation.createNodeId,
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


