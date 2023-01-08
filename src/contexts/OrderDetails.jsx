import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import * as PropTypes from 'prop-types';

export const PRICES = {
  scoops: 2,
  toppings: 1.5,
};

const OrderDetails = createContext({
  optionsCounts: {},
  totals: {},
  updateItemCount: () => {},
  resetOrderCounts: () => {},
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
      updateItemCount,
      resetOrderCounts,
    }),
    [optionsCounts, resetOrderCounts, totals, updateItemCount],
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
