# Gatsby Source Zesty

Source plugin to get Zesty.io data in Gatsby sites

## Installation

```bash
# Install the plugin
yarn add gatsby-source-zesty
```

in `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-zesty',
      options: {
        ...
      }
    }
  ]
};
```

## Configuration options

By default all your Zesty instance content is fetched and will be queryable within Gatsby's GraphQL schema. Optionally individual models can be specified if you only need content from a specific model.

It is not recommended to put your email and password in plain text in the configuration. For sensitive information use an NPM package called `dotenv`. More details on that at the [dotenv npm page.](https://www.npmjs.com/package/dotenv)

```javascript
options: {

  // REQUIRED
  email: 'process.env.your@Email.Address',
  password: 'process.env.yourPassword',
  instanceZUID: 'yourInstanceZUID',

  // OPTIONAL
  // Specific models to fetch.
  models: {
        ModelName: 'modelZUID',
        AnotherModel: 'anotherZUID',
      }
  }
```

If models are specified, the key used will become the 'type' to query in Gatsby.

## How to query

All content of a certain type

```javascript
{
  allHomepage { // the label of the model or 'type' in Gatsby's schema
    nodes {
      data { // date is where an item's user content will be accessible
        image
        title
        content
      }
      id
      meta {
        sort
      }
    }
  }
}
```

Filtering

````javascript
{
  allHomepage (
    filter: {
      data: {
        title: {
          eq: "the article I want"
        }
      }
    }
  ){
    nodes {
      data {
        image
        title
        content
      }
    }
  }
}

```


more information on [GraphQL querying](https://www.gatsbyjs.org/docs/graphql-reference/).
````
