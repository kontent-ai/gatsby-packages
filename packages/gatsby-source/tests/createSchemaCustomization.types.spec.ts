import { kontentTypesCreateSchemaCustomization } from '../src/createSchemaCustomization.types';
import { createMock } from 'ts-auto-mock';
import { Actions, CreateSchemaCustomizationArgs } from 'gatsby';
import { jest } from '@jest/globals';


describe('kontentTypesCreateSchemaCustomization', () => {
  it('create fixed type definition', () => {
    const api = createMock<CreateSchemaCustomizationArgs>({
      actions: createMock<Actions>({
        createTypes: jest.fn(),
      }),
    });

    kontentTypesCreateSchemaCustomization(api);
    const createTypesMock = jest.mocked(api.actions.createTypes);
    expect(createTypesMock).toBeCalledTimes(1);
    // Fix schema
    expect(createTypesMock.mock.calls[0][0]).toMatchSnapshot();
  });
});
