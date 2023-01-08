import React from 'react';

import userEvent from '@testing-library/user-event';
import Options from '../Options';
import { render, screen } from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';

test('scoops subTotal starts with 0 and updates when scoops number changes', async () => {
  const user = userEvent.setup();
  // After we added context our components now depend on it,
  // so we need to update tests accordingly.
  // Instead of rendering just <Options /> we now need to wrap it with Context Provider:
  render(<Options optionType="scoops" />);
  // OR we can create a custom "render" method to reduce the boilerplate:

  // Here we query by a partial match because the "total" value will change
  // during the test(we will change the number of scoops) and we want to reuse this element
  // without having to query for it after every change we make via "userEvent".
  // By default, "getByText" works in "exact" mode, so we need to change it:
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });

  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // Now we want to find an input where we can change the quantity of Vanilla scoops.
  // Because this input is a part of <ScoopOption /> which is populated with data
  // only after server response, then we have to use "findByRole":
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });

  // after finding the input we clear it just in case
  // p.s. don't forget to await because it returns a Promise
  await user.clear(vanillaInput);
  // and type in the quantity we want
  await user.type(vanillaInput, '1');

  expect(scoopsSubtotal).toHaveTextContent('2.00');

  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');

  expect(scoopsSubtotal).toHaveTextContent('6');
});

test('toppings subTotal starts with 0 and updates when scoops number changes', async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  const toppingsTotal = screen.getByText('Toppings total: $', { exact: false });
  expect(toppingsTotal).toHaveTextContent('0.00');

  const hotFudgeToppingCheckbox = await screen.findByRole('checkbox', {
    name: /hot fudge/i,
  });
  await user.click(hotFudgeToppingCheckbox);

  expect(toppingsTotal).toHaveTextContent('1.50');

  const mNmsToppingCheckbox = await screen.findByRole('checkbox', {
    name: /M&Ms/i,
  });
  await user.click(mNmsToppingCheckbox);

  expect(toppingsTotal).toHaveTextContent('3.00');

  await user.click(mNmsToppingCheckbox);
  expect(toppingsTotal).toHaveTextContent('1.50');
});

describe('grand total', () => {
  test('starts with $0.00', async () => {
    render(<OrderEntry />);

    const grandTotal = screen.getByText('Grand total: $', { exact: false });
    expect(grandTotal).toHaveTextContent('0.00');
  });

  test('updates correctly if scoop is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByText('Grand total: $', { exact: false });

    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');

    expect(grandTotal).toHaveTextContent('2.00');
  });

  test('updates correctly if topping is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByText('Grand total: $', { exact: false });

    const mNmsToppingCheckbox = await screen.findByRole('checkbox', {
      name: /M&Ms/i,
    });
    await user.click(mNmsToppingCheckbox);

    expect(grandTotal).toHaveTextContent('1.50');
  });

  test('resets to $0.00 if all items are removed', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByText('Grand total: $', { exact: false });

    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });

    const mNmsToppingCheckbox = await screen.findByRole('checkbox', {
      name: /M&Ms/i,
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');
    await user.click(mNmsToppingCheckbox);

    expect(grandTotal).toHaveTextContent('3.50');

    await user.click(mNmsToppingCheckbox);
    expect(grandTotal).toHaveTextContent('2.00');

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '0');
    expect(grandTotal).toHaveTextContent('0.00');
  });
});
