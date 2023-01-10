import React, { useCallback, useRef, useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  Col, FormControl, FormGroup, FormLabel, Row,
} from 'react-bootstrap';
import { useOrderDetails } from '../../contexts/OrderDetails';
import { isAmountValid } from '../../utils';

function ScoopOption({ name, imagePath }) {
  const { updateItemCount } = useOrderDetails();
  const inputRef = useRef(null);
  const [isValid, setIsValid] = useState(true);

  const inputChangeHandler = useCallback(() => {
    const enteredValue = parseFloat(inputRef.current.value);

    const isInputValid = inputRef?.current
      && inputRef.current.value
      && isAmountValid(enteredValue);

    if (isInputValid) {
      updateItemCount(name, enteredValue, 'scoops');
      setIsValid(true);
    } else {
      updateItemCount(name, 0, 'scoops');
      setIsValid(false);
    }
  }, [name, updateItemCount]);

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img
        style={{ width: '75%' }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} scoop`}
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
            type="number"
            defaultValue={0}
            onChange={inputChangeHandler}
            isInvalid={!isValid}
            ref={inputRef}
          />
          <FormControl.Feedback type="invalid">
            The amount should be an integer number between 1 and 10 included
          </FormControl.Feedback>
        </Col>
      </FormGroup>
    </Col>
  );
}

ScoopOption.propTypes = {
  name: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
};

export default ScoopOption;
