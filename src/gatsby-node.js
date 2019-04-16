import getToken from './util/getToken';

const Zesty = require('zestyio-api-wrapper');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const handleGenerateNodes = (node, name) => {
    return {
      ...node,
      id: createNodeId(node.ZUID),
      parent: null,
      children: [],
      internal: {
        type: name,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
    };
  };
  // await getToken with user credentials.
  const token = await getToken(configOptions.userName, configOptions.password);
  // instantiate a zesty wrapper instance to query the endpoints
  const zesty = new Zesty(configOptions.instanceZUID, token, {
    logErrors: true,
    logResponses: false,
  });
  // options for getting content, models, media --no version support (only published?)
  // TODO default to get all items unless user specifies an item/media
  if (!configOptions.models && !configOptions.items) {
    zesty.getModels().then(models => {
      // potentially filter some models out
      // for each model fetch all items, generate node type by model's name
      models.map(model => {
        return zesty.getItems(model.ZUID).then(items => {
          items.map(item => {
            return createNode(handleGenerateNodes(item, model.label)); // TODO: label?
          });
        });
      });
    });
  } else {
    // the user has specified models//items to fetch
    const endpointsToFetch = [...configOptions.models, ...configOptions.items];
    // fetch only the specific endpoints and generate nodes
  }
  // fetch data from endpoints
  // write data by node type/endpoint
};
