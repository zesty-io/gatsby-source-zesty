const SDK = require('@zesty-io/sdk');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const { email, password, instanceZUID } = configOptions;

  if (!email || !password || !instanceZUID) {
    console.error(
      '\n Email, Password, and instance ZUID are required for Zesty.io source plugin'
    );
    return;
  }

  const handleGenerateNodes = (node, ZUID) => {
    return {
      ...node,
      id: createNodeId(ZUID),
      parent: null,
      children: [],
      internal: {
        type: 'ZestyContent',
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
    };
  };

  // authenticate session
  const auth = new SDK.Auth();
  const session = await auth.login(email, password);
  console.log('\n Authenticating Zesty instance');
  const zesty = new SDK(instanceZUID, session.token);

  console.log('\n Fetching Zesty data');
  // by default all models and items are fetched
  const modelRes = await zesty.instance.getModels();
  const contentModels = modelRes.data;
  const contentModelItems = await Promise.all(
    contentModels.map(model =>
      zesty.instance.getItems(model.ZUID).then(itemRes => itemRes.data)
    )
  );

  // eslint-disable-next-line consistent-return
  return contentModelItems.map(items =>
    items.map(item => createNode(handleGenerateNodes(item, item.meta.ZUID)))
  );
};
