import React from 'react';

import userEvent from '@testing-library/user-event';
import Options from '../Options';
import { render, screen } from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';

test('scoops subTotal starts with 0 and updates when scoops number changes', async () => {
  const user = userEvent.setup();
  // After we added context our components now depend on it,
  // so we need to update test accordingly.
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

test('scoops subtotal does not change when ScoopOption input value is invalid', async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  const vanillaScoopInput = await screen.findByRole('spinbutton', {
    name: /vanilla/i,
  });
  const scoopsSubTotal = screen.getByText('Scoops total: $0.00');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '-1');

  expect(scoopsSubTotal).toHaveTextContent('$0.00');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '11');

  expect(scoopsSubTotal).toHaveTextContent('$0.00');
});

describe('grand total', () => {
  // This particular test causes an error about not wrapping code
  // that changes the state of React component into "act" method...
  // But in reality this error is MISLEADING! We don't run any code
  // inside the test to update component state. It turns out
  // that the problem is caused by AUTO-CLEANUP made by RTL at the
  // end of each test AND updating the component state because of
  // request to the server in useEffect:
  // 1) We run the test
  // 2) Component mounts
  // 3) Request inside useEffect is being sent
  // 4) We query the text
  // 5) We find the text
  // 6) We make an assertion
  // 7) Test finishes
  // 8) RTL does its AUTO-CLEANUP (basically unmounting the component)
  // 9) The request is resolved and React tries to update the state
  // of UNMOUNTED component which leads to an ERROR.
  // There are different ways of solving this:
  // 1) Turn OFF RTL auto-cleanup. But it is global and hence NOT RECOMMENDED.
  // 2) Mock useEffect to avoid network request. This will make our test to
  // be much less representative and hence NOT RECOMMENDED.
  // 3) Wrap in "act" (but we have nothing to wrap).
  // 4) Add "awaits" for requests to the end of the test.
  // 5) Move this test to the one that awaits request initiated inside useEffect.
  // test('starts with $0.00', async () => {
  //   render(<OrderEntry />);
  //
  //   const grandTotal = screen.getByText('Grand total: $', { exact: false });
  //   expect(grandTotal).toHaveTextContent('0.00');
  // });

  test('starts with $0.00 and updates correctly if scoop is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry setOrderPhase={jest.fn()} />);

    const grandTotal = screen.getByText('Grand total: $', { exact: false });
    expect(grandTotal).toHaveTextContent('0.00');

    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');

    expect(grandTotal).toHaveTextContent('2.00');
  });

  test('updates correctly if topping is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry setOrderPhase={jest.fn()} />);

    const grandTotal = screen.getByText('Grand total: $', { exact: false });

    const mNmsToppingCheckbox = await screen.findByRole('checkbox', {
      name: /M&Ms/i,
    });
    await user.click(mNmsToppingCheckbox);

    expect(grandTotal).toHaveTextContent('1.50');
  });

  test('resets to $0.00 if all items are removed', async () => {
    const user = userEvent.setup();
    render(<OrderEntry setOrderPhase={jest.fn()} />);

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
