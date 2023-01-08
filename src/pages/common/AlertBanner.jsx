import React from 'react';
import * as PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

function AlertBanner({ message, variant }) {
  return (
    <Alert variant={variant} style={{ backgroundColor: 'red' }}>
      {message}
    </Alert>
  );
}

AlertBanner.defaultProps = {
  message: 'An unexpected error occurred. Please try again later.',
  variant: 'danger',
};

AlertBanner.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.string,
};

export default AlertBanner;
