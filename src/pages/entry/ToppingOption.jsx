import React, { useCallback } from 'react';
import * as PropTypes from 'prop-types';
import {
  Col, FormControl, FormGroup, FormLabel, Row,
} from 'react-bootstrap';
import { useOrderDetails } from '../../contexts/OrderDetails';

function ToppingOption({ name, imagePath }) {
  const { updateItemCount } = useOrderDetails();

  const inputChangeHandler = useCallback(
    (evt) => {
      updateItemCount(name, evt.target.disabled ? 0 : 1, 'toppings');
    },
    [name, updateItemCount],
  );

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
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
        <FormLabel column xs="6" style={{ textAlign: 'right' }}>
          {name}
        </FormLabel>
        <Col xs={5}>
          <FormControl
            type="checkbox"
            defaultChecked={false}
            onChange={inputChangeHandler}
          />
        </Col>
      </FormGroup>
    </Col>
  );
}

ToppingOption.propTypes = {
  name: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
};

export default ToppingOption;
