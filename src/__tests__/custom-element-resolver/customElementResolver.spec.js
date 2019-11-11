const { KontentTestHttpService }
  = require('@kentico/kontent-test-http-service-js');
const {
  Elements: {
    CustomElement,
  },
} = require('@kentico/kontent-delivery');

const customElementResolverItemsResponse =
  require('./customElementResolverItemsResponse.json');
const customElementResolverTypesResponse =
  require('./customElementResolverTypesResponse.json');

const { sourceNodes } = require('../../gatsby-node');


describe(`Element resolver in configuration resolves correctly`,
  () => {
    const fakeRichTextResponseConfig = new Map();
    fakeRichTextResponseConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/items/,
      {
        fakeResponseJson: customElementResolverItemsResponse,
        throwError: false,
      });

    fakeRichTextResponseConfig.set(
      /https:\/\/deliver.kontent.ai\/.*\/types/,
      {
        fakeResponseJson: customElementResolverTypesResponse,
        throwError: false,
      });

    const dummyCreateNodeID = jest.fn();
    dummyCreateNodeID.mockImplementation((input) => `dummy-${input}`);

    const createNodeMock = jest.fn();
    const createTypesMock = jest.fn();
    const schemaDummy = {
      buildObjectType: jest.fn((input) => ({
        data: input,
      })),
    };

    const actions = {
      actions: {
        createNode: createNodeMock,
        createTypes: createTypesMock,
      },
      createNodeId: dummyCreateNodeID,
      schema: schemaDummy,
    };

    class YouTube extends CustomElement {
      constructor(elementWrapper) {
        super(elementWrapper);

        const value = elementWrapper.rawElement.value;
        const parsed = JSON.parse(value);
        this.title = parsed.title;
        this.videoId = parsed.videoId;
      }
    }

    const deliveryClientConfig = {
      projectId: 'dummyProject',
      typeResolvers: [],
      elementResolver: ((elementWrapper) => {
        if (elementWrapper.contentItemSystem.type === 'content_type'
          && elementWrapper.rawElement.name === 'Youtube') {
          return new YouTube(elementWrapper);
        }
      }),
      httpService: new KontentTestHttpService(
        fakeRichTextResponseConfig
      ),
    };

    const pluginConfiguration = {
      deliveryClientConfig,
      languageCodenames: ['default'],
    };

    it('passes parsed data to the model', async () => {
      await sourceNodes(actions, pluginConfiguration);

      const calls = createNodeMock.mock.calls;
      expect(calls).toMatchSnapshot();
    });
  });
