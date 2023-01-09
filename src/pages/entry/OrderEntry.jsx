import React from 'react';
import * as PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Options from './Options';
import { useOrderDetails } from '../../contexts/OrderDetails';
import formatCurrency from '../../utils';
import { ORDER_PHASES } from '../../const/const';

function OrderEntry({ setOrderPhase }) {
  const { totals } = useOrderDetails();

  const orderButtonClickHandler = () => {
    setOrderPhase(ORDER_PHASES.REVIEW);
  };

  return (
    <>
      <h1>Design your Sundae!</h1>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>
        {`Grand total: ${formatCurrency(totals.scoops + totals.toppings)}`}
      </h2>
      <Button variant="primary" type="button" onClick={orderButtonClickHandler}>
        Order
      </Button>
    </>
  );
}

OrderEntry.propTypes = {
  setOrderPhase: PropTypes.func.isRequired,
};

export default OrderEntry;
