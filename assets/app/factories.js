import Factory from 'rosie';

const UserFactory = new Factory()
  .sequence('id', (index) => index + 1)
  .sequence('username', (index) => `username_${index}`)
  .sequence('name', (index) => `Name-${index}`);

export {
  UserFactory,
};
