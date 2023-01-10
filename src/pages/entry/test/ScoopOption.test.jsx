import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library-utils';
import ScoopOption from '../ScoopOption';

test('ScoopOption component renders input element in red when input value is incorrect', async () => {
  const user = userEvent.setup();
  render(<ScoopOption imagePath="" name="Vanilla" />);

  const vanillaScoopInput = await screen.findByRole('spinbutton', {
    name: /vanilla/i,
  });

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '-1');

  expect(vanillaScoopInput).toHaveClass('is-invalid');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '1');

  expect(vanillaScoopInput).not.toHaveClass('is-invalid');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '1.25');

  expect(vanillaScoopInput).toHaveClass('is-invalid');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '1');

  expect(vanillaScoopInput).not.toHaveClass('is-invalid');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '20');

  expect(vanillaScoopInput).toHaveClass('is-invalid');

  await user.clear(vanillaScoopInput);
  await user.type(vanillaScoopInput, '10');

  expect(vanillaScoopInput).not.toHaveClass('is-invalid');
});
