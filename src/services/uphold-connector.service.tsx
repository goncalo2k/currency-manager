import SDK from '@uphold/uphold-sdk-javascript';

const sdk = new SDK({
  clientId: 'foo',
  clientSecret: 'bar'
});

sdk.authorize('code')
  .then(() => sdk.getMe())
  .then(user => {
    console.log(user);
  });