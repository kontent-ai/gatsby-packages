import { kontentTaxonomiesCreateSchemaCustomization } from '../src/createSchemaCustomization.taxonomies';
import { createMock } from 'ts-auto-mock';
import { Actions, CreateSchemaCustomizationArgs } from 'gatsby';
import { mocked } from 'ts-jest/dist/util/testing';

describe('createSchemaCustomization', () => {
  it('create fixed taxonomy definition', () => {
    const api = createMock<CreateSchemaCustomizationArgs>({
      actions: createMock<Actions>({
        createTypes: jest.fn(),
      }),
    });

    kontentTaxonomiesCreateSchemaCustomization(api);
    const createTypesMock = mocked(api.actions.createTypes, true);
    expect(createTypesMock).toBeCalledTimes(1);
    // Fix schema
    expect(createTypesMock.mock.calls[0][0]).toMatchSnapshot();
  });
});
