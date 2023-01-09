import React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Container } from 'react-bootstrap';
import { ORDER_PHASES } from '../../const/const';
import { useOrderDetails } from '../../contexts/OrderDetails';

export default function OrderConfirmation({ setOrderPhase }) {
  const { orderNumber, resetOrderCounts } = useOrderDetails();

  const buttonClickHandler = () => {
    resetOrderCounts();
    setOrderPhase(ORDER_PHASES.IN_PROGRESS);
  };

  return (
    <Container style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Thank you!</h2>
      <p>{`Your order number is ${orderNumber}`}</p>
      <Button variant="primary" type="button" onClick={buttonClickHandler}>
        New order
      </Button>
    </Container>
  );
}

OrderConfirmation.propTypes = {
  setOrderPhase: PropTypes.func.isRequired,
};
