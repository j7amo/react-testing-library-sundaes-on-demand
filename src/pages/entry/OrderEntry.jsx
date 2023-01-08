import React from 'react';
import Options from './Options';

function OrderEntry() {
  return (
    <>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
    </>
  );
}

export default OrderEntry;
