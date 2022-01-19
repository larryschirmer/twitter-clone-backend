const users = [
  {
    id: '1',
    name: 'Chesterfield',
  },
  {
    id: '2',
    name: 'Nemo',
  },
];

const resolvers = {
  Query: {
    users: () => users,
  },
};

module.exports = resolvers;
