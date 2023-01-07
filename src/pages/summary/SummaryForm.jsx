/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useState } from 'react';
import {
  Button, Form, FormCheck, FormGroup,
} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function SummaryForm() {
  const [isTcChecked, setIsTcChecked] = useState(false);
  const popoverTarget = useRef(null);

  const checkboxChangeHandler = () => {
    setIsTcChecked((prevIsTcChecked) => !prevIsTcChecked);
  };

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

  return (
    <Form>
      <FormGroup controlId="terms-and-conditions">
        <FormCheck
          type="checkbox"
          checked={isTcChecked}
          onChange={checkboxChangeHandler}
          label={checkboxLabel}
        />
      </FormGroup>
      <Button variant="primary" type="submit" disabled={!isTcChecked}>
        Confirm order
      </Button>
    </Form>
  );
}

export default SummaryForm;
