const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.API_BASE_URL });

const indexTool = async (tool) => {
  await client.index({
    index: 'tools',
    body: tool,
  });
};

const searchTools = async (query) => {
  const { body } = await client.search({
    index: 'tools',
    body: {
      query: {
        multi_match: {
          query: query,
          fields: ['name', 'description', 'categories'],
        },
      },
    },
  });
  return body.hits.hits;
};

module.exports = { indexTool, searchTools };
