// STEP-4:
// create "server.js" inside "src/mocks/" directory
// STEP-5:
// import "setupServer" function and our previously defined handlers
import { setupServer } from 'msw/node';
import handlers from './handlers';

// STEP-6:
// Configure a request mocking server with the given request handlers:
const server = setupServer(...handlers);

export default server;

// proceed to "setupTests.js" for STEP-7
