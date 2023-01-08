import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Options from '../Options';

test('scoops subTotal starts with 0 and updates when scoops number changes', async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

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
