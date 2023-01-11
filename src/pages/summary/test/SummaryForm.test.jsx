import React from 'react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import SummaryForm from '../SummaryForm';
import { render, screen } from '../../../test-utils/testing-library-utils';
import server from '../../../mocks/server';

test('checkbox is unchecked by default', () => {
  render(<SummaryForm onSubmit={jest.fn()} />);
  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });

  expect(checkbox).not.toBeChecked();
});

test('button is enabled after checkbox is checked and disabled after it is unchecked again', async () => {
  // here we introduce the use of "userEvent" instead of "fireEvent".
  // why do we need it? because it is better for emulating user interactions
  // as it is more high-level which is exactly how user interacts
  // To use "userEvent" API we need to:
  // 1) set it up:
  const user = userEvent.setup();
  render(<SummaryForm onSubmit={jest.fn()} />);

  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  const button = screen.getByRole('button', { name: /confirm order/i });

  // 2) use it with "await" because it always returns a Promise:
  await user.click(checkbox);
  expect(button).toBeEnabled();

  await user.click(checkbox);
  expect(button).toBeDisabled();
});

test('popover reacts to hovering over "Terms and conditions"', async () => {
  const user = userEvent.setup();
  render(<SummaryForm onSubmit={jest.fn()} />);

  const termsAndConditions = screen.getByText(/terms and conditions/i);
  // if we try the straightforward approach with "getByText" to try and find an element
  // that is not in the DOM then we're not going to succeed...
  //  const popOver = screen.getByText('123');
  // Basically we can use 3 main types of QUERY COMMANDS:
  // 1) GET... - we use it when we expect an element to be in the DOM
  // 2) QUERY... - we use it when we expect an element NOT to be in the DOM
  // 3) FIND... - we use it when we expect an element APPEAR ASYNC in the DOM
  // So in our case we have to use "queryByText" because the element should not be in th DOM:
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i,
  );
  expect(nullPopover).not.toBeInTheDocument();

  await user.hover(termsAndConditions);
  // In this case we use "getByText" because we expect an element to be in the DOM:
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  await user.unhover(termsAndConditions);
  // we don't have to query for "popover" element because it is an object,
  // and we already stored the reference to this object on the previous test step,
  // so we can just re-use it:
  expect(popover).not.toBeInTheDocument();
});

test('alert pops up if there is an error during order submitting', async () => {
  const user = userEvent.setup();
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) => res(ctx.status(500))),
  );
  render(<SummaryForm onSubmit={jest.fn()} />);

  const checkbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
  const confirmButton = screen.getByRole('button', { name: /confirm order/i });

  await user.click(checkbox);
  await user.click(confirmButton);

  const alertBanner = await screen.findByRole('alert');
  expect(alertBanner).toBeInTheDocument();
});
