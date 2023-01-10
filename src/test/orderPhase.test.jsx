import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('app should pass the happy path', async () => {
  const user = userEvent.setup();
  render(<App />);

  const vanillaScoopInput = await screen.findByRole('spinbutton', {
    name: /vanilla/i,
  });
  const mnmsToppingInput = await screen.findByRole('checkbox', {
    name: /m&ms/i,
  });
  const orderButton = screen.getByRole('button', {
    name: /Order/i,
  });

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '1');
  await user.click(mnmsToppingInput);
  await user.click(orderButton);

  const scoopsTotalSummary = screen.getByText('Scoops:', { exact: false });
  const toppingsTotalSummary = screen.getByText('Toppings:', {
    exact: false,
  });
  const grandTotal = screen.getByText('Grand total: $', { exact: false });

  expect(scoopsTotalSummary).toHaveTextContent('2.00');
  expect(toppingsTotalSummary).toHaveTextContent('1.50');
  expect(grandTotal).toHaveTextContent('3.50');

  const termsAndConditionsCheckbox = screen.getByRole('checkbox', {
    name: /I agree to terms and conditions/i,
  });
  const orderConfirmButton = screen.getByRole('button', {
    name: /Confirm order/i,
  });

  await user.click(termsAndConditionsCheckbox);
  await user.click(orderConfirmButton);

  const loadingElement = screen.getByText('Submitting');
  expect(loadingElement).toBeInTheDocument();

  const orderNumber = await screen.findByText(
    'Your order number is 123456789',
    {
      exact: false,
    },
  );

  const nullLoadingElement = screen.queryByText('Submitting');
  expect(nullLoadingElement).not.toBeInTheDocument();

  const newOrderButton = screen.getByRole('button', {
    name: /new order/i,
  });

  expect(orderNumber).toBeInTheDocument();

  await user.click(newOrderButton);

  const scoopsTotalEntry = screen.getByText('Scoops total: $', {
    exact: false,
  });
  const toppingsTotalEntry = screen.getByText('Toppings total: $', {
    exact: false,
  });

  expect(scoopsTotalEntry).toHaveTextContent('0.00');
  expect(toppingsTotalEntry).toHaveTextContent('0.00');
});

test('app should pass the happy path if no toppings were ordered', async () => {
  const user = userEvent.setup();
  render(<App />);

  const vanillaScoopInput = await screen.findByRole('spinbutton', {
    name: /vanilla/i,
  });
  const orderButton = screen.getByRole('button', {
    name: /Order/i,
  });

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '1');
  await user.click(orderButton);

  const scoopsTotalSummary = screen.getByText('Scoops:', { exact: false });
  const toppingsTotalSummary = screen.queryByText('Toppings:', {
    exact: false,
  });
  const grandTotal = screen.getByText('Grand total: $', { exact: false });

  expect(scoopsTotalSummary).toHaveTextContent('2.00');
  expect(toppingsTotalSummary).not.toBeInTheDocument();
  expect(grandTotal).toHaveTextContent('2.00');

  const termsAndConditionsCheckbox = screen.getByRole('checkbox', {
    name: /I agree to terms and conditions/i,
  });
  const orderConfirmButton = screen.getByRole('button', {
    name: /Confirm order/i,
  });

  await user.click(termsAndConditionsCheckbox);
  await user.click(orderConfirmButton);

  const loadingElement = screen.getByText('Submitting');
  expect(loadingElement).toBeInTheDocument();

  const orderNumber = await screen.findByText(
    'Your order number is 123456789',
    {
      exact: false,
    },
  );

  const nullLoadingElement = screen.queryByText('Submitting');
  expect(nullLoadingElement).not.toBeInTheDocument();

  const newOrderButton = screen.getByRole('button', {
    name: /new order/i,
  });

  expect(orderNumber).toBeInTheDocument();

  await user.click(newOrderButton);

  const scoopsTotalEntry = screen.getByText('Scoops total: $', {
    exact: false,
  });
  const toppingsTotalEntry = screen.getByText('Toppings total: $', {
    exact: false,
  });

  expect(scoopsTotalEntry).toHaveTextContent('0.00');
  expect(toppingsTotalEntry).toHaveTextContent('0.00');
});
