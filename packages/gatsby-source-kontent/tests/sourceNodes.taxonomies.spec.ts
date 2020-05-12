import { kontentTaxonomiesSourceNodes } from '../src/sourceNodes.taxonomies';
import { SourceNodesArgs, Actions } from 'gatsby';
import { CustomPluginOptions, KontentTaxonomy } from '../src/types';
import { createMock } from 'ts-auto-mock';
import { createContentDigest } from 'gatsby-core-utils';

// TODO fix lint error
import * as complexTaxonomiesFakeResponse from './complexTaxonomiesFakeResponse.json';

import { mocked } from 'ts-jest/dist/util/testing';
import * as _ from 'lodash';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('sourceNodes', () => {
  describe('complex taxonomies', () => {
    const api = createMock<SourceNodesArgs>({
      createNodeId: jest.fn(input => `dummyId-${input}`),
      actions: createMock<Actions>({
        createNode: jest.fn(),
      }),
      createContentDigest,
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
    });

    mockedAxios.get.mockImplementation(url => {
      if (url.includes('taxonomies')) {
        return Promise.resolve({
          data: complexTaxonomiesFakeResponse,
          headers: [],
        });
      } else {
        throw new Error('Language should be defined in the language parameter');
      }
    });

    it('import all taxonomies correctly', async () => {
      await kontentTaxonomiesSourceNodes(api, pluginConfiguration);
      const createNodesMock = mocked(api.actions.createNode, true);
      const createdNodes = _.flatMap(
        createNodesMock.mock.calls,
      ) as KontentTaxonomy[];
      expect(createdNodes.length).toBe(5);
      expect(createdNodes).toMatchSnapshot();
    });
  });
});
