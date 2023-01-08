import React from 'react';
import Options from './Options';
import { useOrderDetails } from '../../contexts/OrderDetails';
import formatCurrency from '../../utils';

function OrderEntry() {
  const { totals } = useOrderDetails();

  return (
    <>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>
        {`Grand total: ${formatCurrency(totals.scoops + totals.toppings)}`}
      </h2>
    </>
  );
}

export default OrderEntry;
