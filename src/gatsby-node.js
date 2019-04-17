const SDK = require('@zesty-io/sdk');

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

  // authenticate session
  async function authedSDK() {
    const auth = new SDK.Auth();
    const session = await auth.login(
      configOptions.userName,
      configOptions.password
    );
    return new SDK(configOptions.instanceZUID, session.token);
  }

  const zesty = await authedSDK();

  // options for getting content, models, media --no version support (only published?)
  if (!configOptions.models && !configOptions.items) {
    // by default all models and items are fetched
    zesty.instance.getModels().then(modelRes => {
      const models = modelRes.data;
      models.map(model => {
        return zesty.instance.getItems(model.ZUID).then(itemRes => {
          const items = itemRes.data;
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
