import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row } from 'react-bootstrap';
import ScoopOption from './ScoopOption';
import ToppingOption from './ToppingOption';
import AlertBanner from '../common/AlertBanner';
import { useOrderDetails } from '../../contexts/OrderDetails';
import formatCurrency from '../../utils';
import { PRICES } from '../../const/const';

function Options({ optionType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const { totals } = useOrderDetails();

  useEffect(() => {
    const fetchItems = async () => {
      setError('');

      try {
        const response = await axios.get(`http://localhost:3030/${optionType}`);

        if (response.statusText !== 'OK') {
          throw new Error('Could not fetch options');
        }

        setItems(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchItems();
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption;

  const optionItems = items.map(({ name, imagePath }) => (
    <ItemComponent key={name} name={name} imagePath={imagePath} />
  ));

  const optionTitle = optionType[0].toUpperCase().concat(optionType.slice(1));

  return (
    <Container style={{ padding: '20px' }}>
      <h2>{optionTitle}</h2>
      <p>
        {formatCurrency(PRICES[optionType])}
        {' '}
        each
      </p>
      <p>{`${optionTitle} total: ${formatCurrency(totals[optionType])}`}</p>
      <Row>{optionItems}</Row>
    </Container>
  );
}

Options.propTypes = {
  optionType: PropTypes.string.isRequired,
};

export default Options;
