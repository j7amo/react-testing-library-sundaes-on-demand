import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import OrderSummary from './pages/summary/OrderSummary';
import OrderEntry from './pages/entry/OrderEntry';
import { OrderDetailsProvider } from './contexts/OrderDetails';
import OrderConfirmation from './pages/confirmation/OrderConfirmation';
import { ORDER_PHASES } from './const/const';

function App() {
  const [orderPhase, setOrderPhase] = useState(ORDER_PHASES.IN_PROGRESS);

  return (
    <Container>
      <OrderDetailsProvider>
        {orderPhase === ORDER_PHASES.IN_PROGRESS && (
          <OrderEntry setOrderPhase={setOrderPhase} />
        )}
        {orderPhase === ORDER_PHASES.REVIEW && (
          <OrderSummary setOrderPhase={setOrderPhase} />
        )}
        {orderPhase === ORDER_PHASES.COMPLETE && (
          <OrderConfirmation setOrderPhase={setOrderPhase} />
        )}
      </OrderDetailsProvider>
    </Container>
  );
}

export default App;
