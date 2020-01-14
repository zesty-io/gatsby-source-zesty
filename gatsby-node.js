const axios = require(`axios`);

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  configOptions
) => {
  const { createNode } = actions;
  let { url } = configOptions;

  if (!url) {
    reporter.error(`A URL is required for Zesty.io source plugin`);
    return;
  }

  if (!url.endsWith(`/-/gql/`)) {
    url = `${url}/`; // eslint-disable-next-line no-unused-expressions

    !url.endsWith(`/-/gql/`) &&
      reporter.warn(
        `Your Zesty URL should point to the GraphQL endpoint ending with '/-/gql/'`
      );
  }

  const handleGenerateNodes = (node, name, ZUID) => {
    return {
      ...node,
      id: createNodeId(ZUID),
      parent: null,
      children: [],
      internal: {
        type: name.replace(/-|__|:|\.|\s/g, `_`),
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
    };
  };

  reporter.info('Fetching Zesty.io data');
  const { data } = await axios
    .get(url)
    .catch(err =>
      reporter.warn(
        `There was an issue fetching content models for your Zesty.io instance`,
        err
      )
    );
  const { models } = data;
  const contentModelItems = await Promise.all(
    models.map(item => axios.get(item.gqlUrl).then(res => res.data))
  ).catch(err =>
    reporter.warn(
      `There was an issue processing content for your Zesty.io instance`,
      err
    )
  ); // eslint-disable-next-line consistent-return

  return contentModelItems.map((contentType, i) =>
    contentType.map(content =>
      createNode(
        handleGenerateNodes(content, models[i].gqlModelName, content.zuid)
      )
    )
  );
};
