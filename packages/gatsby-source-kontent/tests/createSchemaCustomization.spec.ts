import { CustomCreateSchemaCustomizationArgs, CustomPluginOptions } from "../src/types";
import { createSchemaCustomization } from "../src/createSchemaCustomization";
import { createMock } from "ts-auto-mock";
import { Actions } from "gatsby";
import { mocked } from "ts-jest/dist/util/testing";
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// TODO fix lint error https://github.com/microsoft/TypeScript/issues/25400
import fakeEmptyItemsResponse from './fakeEmptyItemsResponse.json';

describe("createSchemaCustomization", () =>{
  it("create fixed type definition", () => {

    const api = createMock<CustomCreateSchemaCustomizationArgs>({
      actions: createMock<Actions>({
        createTypes: jest.fn()
      })
    });

    const pluginConfiguration = createMock<CustomPluginOptions>({
      projectId: 'dummyProject',
      languageCodenames: [
        "dummyLanguage"
      ]
    });

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes(pluginConfiguration.projectId) && url.includes(pluginConfiguration.languageCodenames[0])) {
        return Promise.resolve({
          data: fakeEmptyItemsResponse,
          headers: []
        })
      } else {
        throw new Error('Language should be defined in the language parameter');
      }
    });



    createSchemaCustomization(api, pluginConfiguration);
    const createTypesMock = mocked(api.actions.createTypes, true);
    expect(createTypesMock).toBeCalled();
    // Fix schema
    expect(createTypesMock.mock.calls[0][0]).toMatchSnapshot();
  })
})