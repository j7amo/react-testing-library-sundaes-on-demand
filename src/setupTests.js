// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// STEP-7:
// import our newly created server
import server from './mocks/server';

// STEP-8:
// Establish API mocking(intercepting real requests) before all tests.
beforeAll(() => server.listen());

// STEP-9:
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// STEP-10:
// Clean up after the tests are finished.
afterAll(() => server.close());
