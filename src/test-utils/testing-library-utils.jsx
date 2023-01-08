import { render } from '@testing-library/react';
import { OrderDetailsProvider } from '../contexts/OrderDetails';

function renderWithContext(ui, options) {
  return render(ui, { wrapper: OrderDetailsProvider, ...options });
}

// to make this file (testing-library-utils.jsx) a new place to import RTL API from
// we re-export everything:
export * from '@testing-library/react';

// and basically replace library "render" method with ours implementation:
export { renderWithContext as render };
