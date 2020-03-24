import {
  CustomCreateSchemaCustomizationArgs,
  CustomPluginOptions,
} from '../src/types';
import { kontentItemsCreateSchemaCustomization } from '../src/createSchemaCustomization.items';
import { createMock } from 'ts-auto-mock';
import { Actions } from 'gatsby';
import { mocked } from 'ts-jest/dist/util/testing';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// TODO fix lint error https://github.com/microsoft/TypeScript/issues/25400
import fakeEmptyItemsResponse from './fakeEmptyItemsResponse.json';
import fakeEmptyTypesResponse from './fakeEmptyTypesResponse.json';

describe('kontentItemsCreateSchemaCustomization', () => {
  it('create fixed type definition', () => {
    const api = createMock<CustomCreateSchemaCustomizationArgs>({
      actions: createMock<Actions>({
        createTypes: jest.fn(),
      }),
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
      languageCodenames: ['dummyLanguage'],
    });

    mockedAxios.get.mockImplementation(url => {
      if (url.endsWith('/types')) {
        return Promise.resolve({
          data: fakeEmptyTypesResponse,
          headers: [],
        });
      } else {
        throw new Error(
          'Just `/types` endpoint should be called for schema definition.',
        );
      }
    });

    kontentItemsCreateSchemaCustomization(api, pluginConfiguration);
    const createTypesMock = mocked(api.actions.createTypes, true);
    expect(createTypesMock).toBeCalled();
    // Fix schema
    expect(createTypesMock.mock.calls[0][0]).toMatchSnapshot();
  });
});
