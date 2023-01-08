import React from 'react';
import SummaryForm from './SummaryForm';
import { useOrderDetails } from '../../contexts/OrderDetails';
import formatCurrency from '../../utils';

function OrderSummary() {
  const { totals, optionsCounts } = useOrderDetails();

  const orderedScoops = Object.entries(optionsCounts.scoops).filter(
    ([, amount]) => amount !== 0,
  );
  const scoops = orderedScoops.map(([name, amount]) => (
    <li key={name}>
      {name}
      {' '}
      {amount}
    </li>
  ));

  const orderedToppings = Object.entries(optionsCounts.toppings).filter(
    ([, amount]) => amount !== 0,
  );
  const toppings = orderedToppings.map(([name]) => <li key={name}>{name}</li>);

  return (
    <>
      <h1>Order summary</h1>
      <h2>
        Scoops:
        {formatCurrency(totals.scoops)}
      </h2>
      <ul>{scoops}</ul>
      <h2>
        Toppings:
        {formatCurrency(totals.toppings)}
      </h2>
      <ul>{toppings}</ul>
      <SummaryForm />
    </>
  );
}

export default OrderSummary;
