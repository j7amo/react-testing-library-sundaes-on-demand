// STEP-2:
// import "rest" (we're mocking REST and not GraphQL which is also possible with this package)
import { rest } from 'msw'; // after installing Mock Service Worker package (msw)

// after installing Mock Service Worker package (msw)
// we need to take several steps in order to set up testing environment:
// STEP-1:
// create "mocks" directory and "handlers.js" file inside this directory.
// STEP-3:
// define HANDLERS that will be used to MOCK the response to a specific endpoint and HTTP verb
const handlers = [
  // we can get the following URL from the server setup that we are running for REAL requests,
  // we need to use the same URL here in order to intercept requests
  rest.get('http://localhost:3030/scoops', (req, res, ctx) => res(
    // we return the response (mock) that should have exactly the same data structure as for
    // real response (in our case it is an array of objects)
    ctx.json([
      {
        name: 'Chocolate',
        imagePath: '/images/chocolate.png',
      },
      {
        name: 'Vanilla',
        imagePath: '/images/vanilla.png',
      },
    ]),
  )),
  rest.get('http://localhost:3030/toppings', (req, res, ctx) => res(
    ctx.json([
      {
        name: 'M&Ms',
        imagePath: '/images/m-and-ms.png',
      },
      {
        name: 'Hot fudge',
        imagePath: '/images/hot-fudge.png',
      },
      {
        name: 'Peanut butter cups',
        imagePath: '/images/peanut-butter-cups.png',
      },
    ]),
  )),
  rest.post('http://localhost:3030/order', (req, res, ctx) => res(ctx.json({ orderNumber: 123456789 }))),
];

export default handlers;

// Proceed to "src/mocks/server.js" for STEP-4
