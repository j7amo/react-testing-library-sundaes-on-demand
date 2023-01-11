/* eslint-disable react/no-unescaped-entities */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import * as PropTypes from 'prop-types';
import {
  Button, Form, FormCheck, FormGroup,
} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import axios from 'axios';
import { ORDER_PHASES } from '../../const/const';
import { useOrderDetails } from '../../contexts/OrderDetails';
import AlertBanner from '../common/AlertBanner';

function SummaryForm({ onSubmit }) {
  const [isTcChecked, setIsTcChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const popoverTarget = useRef(null);
  const { resetOrderCounts, updateOrderNumber } = useOrderDetails();

  const checkboxChangeHandler = () => {
    setIsTcChecked((prevIsTcChecked) => !prevIsTcChecked);
  };

  const formSubmitHandler = (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);
  };

  const tryAgainHandler = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const submitOrder = async () => {
      try {
        const response = await axios.post('http://localhost:3030/order');

        if (response.status >= 400) {
          throw new Error('Could not place the order');
        }

        updateOrderNumber(response.data.orderNumber);
        onSubmit(ORDER_PHASES.COMPLETE);
      } catch (err) {
        setError(err.message);
      }

      setIsSubmitting(false);
    };

    if (isSubmitting) {
      submitOrder();
    }
  }, [isSubmitting, onSubmit, resetOrderCounts, updateOrderNumber]);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>No ice cream will actually be delivered</Popover.Body>
    </Popover>
  );

  const checkboxLabel = (
    <span>
      I agree to
      <OverlayTrigger
        placement="right"
        overlay={popover}
        trigger={['hover', 'focus']}
      >
        <span style={{ color: 'blue' }} ref={popoverTarget}>
          Terms and conditions
        </span>
      </OverlayTrigger>
    </span>
  );

  if (isSubmitting) {
    return <p>Submitting</p>;
  }

  if (error) {
    return (
      <div style={{ width: '50%' }}>
        <AlertBanner message={error} />
        <Button type="button" onClick={tryAgainHandler}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <Form onSubmit={formSubmitHandler} style={{ marginTop: '50px' }}>
      <FormGroup controlId="terms-and-conditions">
        <FormCheck
          type="checkbox"
          checked={isTcChecked}
          onChange={checkboxChangeHandler}
          label={checkboxLabel}
        />
      </FormGroup>
      <Button
        variant="primary"
        type="submit"
        disabled={!isTcChecked || isSubmitting}
      >
        Confirm order
      </Button>
    </Form>
  );
}

SummaryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SummaryForm;
