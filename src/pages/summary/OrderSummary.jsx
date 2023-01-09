import React from 'react';
import * as PropTypes from 'prop-types';
import SummaryForm from './SummaryForm';
import { useOrderDetails } from '../../contexts/OrderDetails';
import formatCurrency from '../../utils';

function OrderSummary({ setOrderPhase }) {
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
      <h2>
        {`Grand total: ${formatCurrency(totals.scoops + totals.toppings)}`}
      </h2>
      <SummaryForm onSubmit={setOrderPhase} />
    </>
  );
}

OrderSummary.propTypes = {
  setOrderPhase: PropTypes.func.isRequired,
};

export default OrderSummary;
