import getToken from './util/getToken';

const Zesty = require('zestyio-api-wrapper');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  // await getToken with user credentials.
  await getToken(configOptions.userName, configOptions.password);
  // options for getting content, models, media --no version support (only published?)
  // TODO: create zesty instance
  // fetch data from endpoints
  // write data by node type/endpoint
};
