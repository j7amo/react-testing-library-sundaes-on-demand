import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import * as PropTypes from 'prop-types';
import { PRICES } from '../const/const';

const OrderDetails = createContext({
  optionsCounts: {},
  totals: {},
  orderNumber: '',
  updateItemCount: () => {},
  resetOrderCounts: () => {},
  updateOrderNumber: () => {},
});

const initialState = {
  scoops: {
    'Mint chip': 0,
    Vanilla: 0,
    Chocolate: 0,
    'Salted caramel': 0,
  },
  toppings: {
    'M&Ms': 0,
    'Hot fudge': 0,
    'Peanut butter cups': 0,
    'Gummi bears': 0,
    Mochi: 0,
    Cherries: 0,
  },
  orderNumber: '',
};

export function OrderDetailsProvider({ children }) {
  const [optionsCounts, setOptionsCounts] = useState(initialState);

  const updateItemCount = useCallback((name, count, type) => {
    setOptionsCounts((prevOptionsCounts) => {
      if (type === 'scoops') {
        return {
          ...prevOptionsCounts,
          scoops: {
            ...prevOptionsCounts.scoops,
            [name]: count,
          },
        };
      }

      return {
        ...prevOptionsCounts,
        toppings: {
          ...prevOptionsCounts.toppings,
          [name]: count,
        },
      };
    });
  }, []);

  const resetOrderCounts = useCallback(
    () => setOptionsCounts(initialState),
    [],
  );

  const updateOrderNumber = useCallback((number) => {
    setOptionsCounts((prevState) => ({
      ...prevState,
      orderNumber: number,
    }));
  }, []);

  const calculateTotal = useCallback(
    (type) => PRICES[type]
      * Object.values(optionsCounts[type]).reduce(
        (acc, curr) => acc + Number(curr),
        0,
      ),
    [optionsCounts],
  );

  const totals = useMemo(
    () => ({
      scoops: calculateTotal('scoops'),
      toppings: calculateTotal('toppings'),
    }),
    [calculateTotal],
  );

  const contextValue = useMemo(
    () => ({
      optionsCounts,
      totals,
      orderNumber: optionsCounts.orderNumber,
      updateItemCount,
      resetOrderCounts,
      updateOrderNumber,
    }),
    [
      optionsCounts,
      resetOrderCounts,
      updateOrderNumber,
      totals,
      updateItemCount,
    ],
  );

  return (
    <OrderDetails.Provider value={contextValue}>
      {children}
    </OrderDetails.Provider>
  );
}

// this is a custom hook which:
// - is more representative (it's not about some generic context but about 'OrderDetails')
// - has a built-in check whether we call it correctly or not
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      'useOrderDetails must be called from within OrderDetailsProvider',
    );
  }

  return contextValue;
}

OrderDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OrderDetails;
