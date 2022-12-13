import { kontentTypesSourceNodes } from '../src/sourceNodes.types';
import { SourceNodesArgs, Actions } from 'gatsby';
import { CustomPluginOptions, KontentType } from '../src/types';
import { createMock } from 'ts-auto-mock';
import { createContentDigest } from 'gatsby-core-utils';

// TODO fix lint error
import * as complexTypesFakeResponse from './complexTypesFakeResponse.json';

import { jest } from '@jest/globals';
import * as _ from 'lodash';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('sourceNodes', () => {
  describe('complex types', () => {
    const api = createMock<SourceNodesArgs>({
      createNodeId: jest.fn(input => `dummyId-${input}`),
      actions: createMock<Actions>({
        createNode: jest.fn(() => Promise.resolve()),
      }),
      createContentDigest,
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedAxios.get.mockImplementation((url): Promise<any> => {
      if (url.includes('types')) {
        return Promise.resolve({
          data: complexTypesFakeResponse,
          headers: [],
        });
      } else {
        throw new Error('Language should be defined in the language parameter');
      }
    });

    it('import all types correctly', async () => {
      await kontentTypesSourceNodes(api, pluginConfiguration);
      const createNodesMock = jest.mocked(api.actions.createNode);
      const createdNodes = _.flatMap(
        createNodesMock.mock.calls,
      ) as KontentType[];

      expect(createdNodes.length).toBe(6);
      expect(createdNodes).toMatchSnapshot();
    });
  });
});
