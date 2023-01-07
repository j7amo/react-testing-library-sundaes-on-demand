import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Row } from 'react-bootstrap';
import ScoopOption from './ScoopOption';
import ToppingOption from './ToppingOption';

function Options({ optionType }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/${optionType}`);

        if (response.statusText !== 'OK') {
          throw new Error('Could not fetch options');
        }

        setItems(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchItems();
  }, [optionType]);

  const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption;

  const optionItems = items.map(({ name, imagePath }) => (
    <ItemComponent key={name} name={name} imagePath={imagePath} />
  ));

  return <Row>{optionItems}</Row>;
}

Options.propTypes = {
  optionType: PropTypes.string.isRequired,
};

export default Options;
