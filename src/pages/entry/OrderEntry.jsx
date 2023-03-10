import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Container } from 'react-bootstrap';
import Options from './Options';
import { useOrderDetails } from '../../contexts/OrderDetails';
import formatCurrency from '../../utils';
import { ORDER_PHASES } from '../../const/const';

function OrderEntry({ setOrderPhase }) {
  const { optionsCounts, totals } = useOrderDetails();
  const counts = Object.values(optionsCounts.scoops);
  const isOrderButtonEnabled = counts.some((count) => count > 0);

  const orderButtonClickHandler = () => {
    setOrderPhase(ORDER_PHASES.REVIEW);
  };

  return (
    <Container style={{ textAlign: 'left' }}>
      <h1>Design your Sundae!</h1>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>
        {`Grand total: ${formatCurrency(totals.scoops + totals.toppings)}`}
      </h2>
      <Button
        variant="primary"
        type="button"
        onClick={orderButtonClickHandler}
        disabled={!isOrderButtonEnabled}
      >
        Order
      </Button>
    </Container>
  );
}

OrderEntry.propTypes = {
  setOrderPhase: PropTypes.func.isRequired,
};

export default OrderEntry;
