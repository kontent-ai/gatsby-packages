import { kontentItemsSourceNodes } from '../src/sourceNodes.items';
import { SourceNodesArgs, Actions } from 'gatsby';
import { CustomPluginOptions, KontentItem } from '../src/types';
import { createMock } from 'ts-auto-mock';
import { createContentDigest } from 'gatsby-core-utils';

// TODO fix lint error https://github.com/microsoft/TypeScript/issues/25400
import complexContentItemsFirstLanguageFakeReponse from './complexContentItemsFirstLanguageFakeReponse.json';
import * as complexContentItemsSecondLanguageFakeReponse from './complexContentItemsSecondLanguageFakeReponse.json';

import axios from 'axios';
import { mocked } from 'ts-jest/dist/util/testing';
import * as _ from 'lodash';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('kontentItemsSourceNodes', () => {
  describe('complex multilingual data section', () => {
    const api = createMock<SourceNodesArgs>({
      createNodeId: jest.fn(input => `dummyId-${input}`),
      actions: createMock<Actions>({
        createNode: jest.fn(),
      }),
      createContentDigest,
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
      languageCodenames: ['default', 'Another_language'],
    });

    mockedAxios.get.mockImplementation(url => {
      if (url.includes('default')) {
        return Promise.resolve({
          data: complexContentItemsFirstLanguageFakeReponse,
          headers: [],
        });
      } else if (url.includes('')) {
        return Promise.resolve({
          data: complexContentItemsSecondLanguageFakeReponse,
          headers: [],
        });
      } else {
        throw new Error('Language should be defined in the language parameter');
      }
    });

    it('resolve all element types in two languages', async () => {
      await kontentItemsSourceNodes(api, pluginConfiguration);
      const createNodesMock = mocked(api.actions.createNode, true);
      const createdNodes = _.flatMap(
        createNodesMock.mock.calls,
      ) as KontentItem[];

      const defaultLanguageNodes = createdNodes.filter(
        node => node.preferred_language === 'default',
      );
      const anotherLanguageNodes = createdNodes.filter(
        node => node.preferred_language === 'Another_language',
      );
      const languageFallbackNodes = createdNodes.filter(
        node => node.preferred_language !== node.system.language,
      );

      const nodesByType: {
        person: KontentItem[];
        repository: KontentItem[];
        session: KontentItem[];
        step: KontentItem[];
        training: KontentItem[];
        website: KontentItem[];
      } = {
        person: createdNodes.filter(node => node.system.type === 'person'),
        repository: createdNodes.filter(
          node => node.system.type === 'repository',
        ),
        session: createdNodes.filter(node => node.system.type === 'session'),
        step: createdNodes.filter(node => node.system.type === 'step'),
        training: createdNodes.filter(node => node.system.type === 'training'),
        website: createdNodes.filter(node => node.system.type === 'website'),
      };

      expect(createdNodes.length).toBe(35);
      expect(defaultLanguageNodes.length).toBe(17);
      expect(anotherLanguageNodes.length).toBe(18);
      expect(languageFallbackNodes.length).toBe(7);

      expect(nodesByType.person.length).toBe(3);
      expect(nodesByType.repository.length).toBe(2);
      expect(nodesByType.session.length).toBe(4);
      expect(nodesByType.step.length).toBe(22);
      expect(nodesByType.training.length).toBe(2);
      expect(nodesByType.website.length).toBe(2);

      expect(createdNodes).toMatchSnapshot();
    });
  });
});
