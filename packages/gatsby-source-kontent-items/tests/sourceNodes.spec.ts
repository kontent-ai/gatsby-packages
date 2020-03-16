

import { sourceNodes } from '../src/sourceNodes';
import { SourceNodesArgs, Actions } from 'gatsby';
import { CustomPluginOptions } from '../src/types';
import { createMock } from "ts-auto-mock";

// TODO fix lint error
// TODO change data format fo items feed
import * as complexContentItemsFirstLanguageFakeReponse from './complexContentItemsFirstLanguageFakeReponse.json';
import * as complexContentItemsSecondLanguageFakeReponse from './complexContentItemsSecondLanguageFakeReponse.json';

import axios from 'axios';
import { mocked } from 'ts-jest/dist/util/testing';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('sourceNodes', () => {

  describe('complex multilingual data section', () => {

    const api = createMock<SourceNodesArgs>({
      createNodeId: jest.fn((input) => `dummyId-${input}`),
      actions: createMock<Actions>({
        createNode: jest.fn()
      })
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
      languageCodenames: ['default', 'Another_language'],
    });


    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('default')) {
        return Promise.resolve({
          data: complexContentItemsFirstLanguageFakeReponse,
          headers: []
        })
      } else if (url.includes('Another_language')) {
        return Promise.resolve({
          data: complexContentItemsSecondLanguageFakeReponse,
          headers: []
        })
      } else {
        throw new Error('Language should be defined in the language parameter');
      }

    });

    it('resolve all element types in two languages', async () => {
      await sourceNodes(api, pluginConfiguration);
      const createNodesMock = mocked(api.actions.createNode, true);
      // TODO defined expected values
      expect(createNodesMock.mock.calls.length).toBe(34);
    });
  });
});
