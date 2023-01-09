import React, { useCallback } from 'react';
import * as PropTypes from 'prop-types';
import {
  Col, FormCheck, FormGroup, Row,
} from 'react-bootstrap';
import { useOrderDetails } from '../../contexts/OrderDetails';

function ToppingOption({ name, imagePath }) {
  const { updateItemCount } = useOrderDetails();

  const inputChangeHandler = useCallback(
    (evt) => {
      updateItemCount(name, evt.target.checked ? 1 : 0, 'toppings');
    },
    [name, updateItemCount],
  );

  return (
    <Col xs={12} sm={6} md={2} lg={2} style={{ textAlign: 'center' }}>
      <img
        style={{ width: '75%' }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} topping`}
      />
      <FormGroup
        controlId={`${name}- count`}
        as={Row}
        style={{ marginTop: '10px' }}
      >
        <FormCheck type="checkbox" onChange={inputChangeHandler} label={name} />
      </FormGroup>
    </Col>
  );
}

ToppingOption.propTypes = {
  name: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
};

export default ToppingOption;
