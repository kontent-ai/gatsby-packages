const { customTrackingHeader } = require('../gatsby-node');
const { name, version } = require('../../package.json');

describe('customTrackingHeader', () => {
  it('has correct name', () => {
    expect(customTrackingHeader.header).toEqual('X-KC-SOURCE');
  });

  it('has correct value according to package name and package version', () => {
    const expectedHeaderValue = `${name};${version}`;
    expect(customTrackingHeader.value).toEqual(expectedHeaderValue);
  });
});
