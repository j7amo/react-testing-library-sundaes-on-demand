import React from 'react';
import OrderSummary from './pages/summary/OrderSummary';
import Options from './pages/entry/Options';

function App() {
  return (
    <>
      <Options optionType="scoops" />
      <OrderSummary />
    </>
  );
}

export default App;
