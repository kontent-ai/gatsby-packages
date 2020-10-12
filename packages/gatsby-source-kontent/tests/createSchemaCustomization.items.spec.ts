import { CreateSchemaCustomizationArgs } from "gatsby";
import {
  CustomPluginOptions,
} from '../src/types';
import { kontentItemsCreateSchemaCustomization } from '../src/createSchemaCustomization.items';
import { createMock } from 'ts-auto-mock';
import { Actions } from 'gatsby';
import { mocked } from 'ts-jest/dist/util/testing';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import fakeEmptyTypesResponse from './fakeEmptyTypesResponse.json';
import fakeEmptyElementsTypesResponse from './emptyElementsTypesResponse.json';

describe('kontentItemsCreateSchemaCustomization', () => {
  it('create fixed type definition', async () => {
    const api = createMock<CreateSchemaCustomizationArgs>({
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

    await kontentItemsCreateSchemaCustomization(api, pluginConfiguration);
    const createTypesMock: jest.Mock = mocked(api.actions.createTypes, true);
    expect(createTypesMock).toBeCalled();
    // Fix schema
    expect(createTypesMock.mock.calls[0][0]).toMatchSnapshot();
  });


  it('Empty element type does not fail', async () => {
    const api = createMock<CreateSchemaCustomizationArgs>({
      actions: createMock<Actions>({
        createTypes: jest.fn(),
      }),
      schema: {
        buildObjectType: jest.fn(),
      }
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
      languageCodenames: ['dummyLanguage'],
    });

    mockedAxios.get.mockImplementation(url => {
      if (url.endsWith('/types')) {
        return Promise.resolve({
          data: fakeEmptyElementsTypesResponse,
          headers: [],
        });
      } else {
        throw new Error(
          'Just `/types` endpoint should be called for schema definition.',
        );
      }
    });


    await kontentItemsCreateSchemaCustomization(api, pluginConfiguration);
    const createTypesMock = mocked(api.actions.createTypes, true);
    const buildObjectTypeMock = mocked(api.schema.buildObjectType, true);
    expect(createTypesMock).toBeCalledTimes(2);
    expect(buildObjectTypeMock).toBeCalledTimes(1);
    expect((buildObjectTypeMock.mock.calls[0][0].fields as Record<string, unknown>).system).toBeTruthy();
    expect((buildObjectTypeMock.mock.calls[0][0].fields as Record<string, unknown>).elements).toBeUndefined();
    expect(buildObjectTypeMock.mock.calls[0][0]).toMatchSnapshot();
  })
});
