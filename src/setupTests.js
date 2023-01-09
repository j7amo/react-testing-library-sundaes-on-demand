// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// STEP-7:
// import our newly created server
import server from './mocks/server';

// STEP-8:
// Establish API mocking(intercepting real requests) before all test.
beforeAll(() => server.listen());

// STEP-9:
// Reset any request handlers that we may add during the test,
// so they don't affect other test.
afterEach(() => server.resetHandlers());

// STEP-10:
// Clean up after the test are finished.
afterAll(() => server.close());
