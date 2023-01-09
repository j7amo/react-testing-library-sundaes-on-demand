import React from 'react';
import { rest } from 'msw';
import { render, screen, waitFor } from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';
import server from '../../../mocks/server';

describe('OrderEntry component', () => {
  // we can use ".only" to ONLY run this particular test in the file(which can be
  // helpful if we want to debug it effectively)
  // OR we can use ".skip" to skip a test we don't want to run for some reason.
  test('should render 2 alerts if server responds with error', async () => {
    // We want to test a case when server responds with error.
    // But our server is configured such it only returns successfully.
    // We can of course go to "handlers.js" and make those handlers return errors,
    // and after running this test we must go back and revert handlers to returning
    // data instead of errors... But in this case we would have to do it each time
    // we want to run this test which is crazy!
    // So there is a much better way of doing this:
    // We just need to override handlers with the help of "resetHandlers".
    // This function accepts an optional list of request handlers to OVERRIDE
    // the initial handlers to re-declare the mock definition completely on runtime:
    server.resetHandlers(
      rest.get('http://localhost:3030/scoops', (req, res, ctx) => res(ctx.status(500))),
      rest.get('http://localhost:3030/toppings', (req, res, ctx) => res(ctx.status(500))),
    );

    render(<OrderEntry setOrderPhase={jest.fn()} />);

    // here we have another challenge:
    // When we render <OrderEntry /> there are 2 network requests (one from <Options /> for scoops,
    // another from <Options /> for toppings) which means that in 99.99% of cases they will
    // resolve unpredictably (we don't know which request will be responded first,
    // and they will definitely NOT be resolved at exact same time). So as a result one of the
    // <Options /> will have its content ready faster than the other <Options />.
    // "findAllByRole" actually waits for first async appearance of element.
    // So if ALL elements we want, APPEAR asynchronously AT THE SAME TIME,
    // then "findAllByRole" is OK to use. But this may not be our case(depends on lots of
    // factors: machine speed, network speed etc.), and if we encounter(we may not) this problem
    // we should use another trick - "waitFor" method which basically waits for 50ms (or more -
    // if we explicitly define it):
    await waitFor(async () => {
      // one more thing here:
      // Bootstrap alerts don't have the expected "name" value, so we have to omit it when querying:
      const alertElements = await screen.findAllByRole('alert');

      expect(alertElements).toHaveLength(2);
    });
  });
});
