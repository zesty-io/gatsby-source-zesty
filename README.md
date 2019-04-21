# Gatsby Source Zesty

Source plugin to get Zesty.io data in Gatsby sites

## Installation

```
# Install the plugin
yarn add gatsby-source-zesty
```

in `gatsby-config.js`

```
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

```
options: {

  // REQUIRED
  email: 'your@Email.Address',
  password: 'yourPassword',
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

```
{
  allHomepage {
    nodes {
      data {
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
