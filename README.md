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
        url: `https://your-zesty-instance.com/-/gql/`,
      },
    },
    ...
  ],
};
```

## Configuration options

Your Zesty.io GraphQL endpoint URL is required.
To turn this on you can follow these steps:

- Log into Zesty.io
- Open the manager interface for the instance you want to access GraphQL
- In manager, Go to your Schema > settings area
- Navigate to Developer settings
- Click GraphQL to turn on
- Set GraphQL origin to \* (this can later be tied to your remote)

## How to query

All content of a certain type

```graphql
{
  allCategory {
    nodes {
      category
      description
    }
  }
}
```

Filtering

```graphql
{
  allHomepage(filter: { data: { title: { eq: "the article I want" } } }) {
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
