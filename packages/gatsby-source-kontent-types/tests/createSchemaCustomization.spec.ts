import { CustomCreateSchemaCustomizationArgs } from "../src/types";
import { createSchemaCustomization } from "../src/createSchemaCustomization";
import { createMock } from "ts-auto-mock";
import { Actions } from "gatsby";
import { mocked } from "ts-jest/dist/util/testing";

describe("createSchemaCustomization", () =>{
  it("create fixed type definition", () => {

    const api = createMock<CustomCreateSchemaCustomizationArgs>({
      actions: createMock<Actions>({
        createTypes: jest.fn()
      })
    });


    createSchemaCustomization(api);
    const createTypesMock = mocked(api.actions.createTypes, true);
    expect(createTypesMock).toBeCalledTimes(1);
    // Fix schema
    expect(createTypesMock.mock.calls[0][0]).toMatchSnapshot();
  })
})