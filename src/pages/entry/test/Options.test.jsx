import React from 'react';
import { render, screen } from '@testing-library/react';
import Options from '../Options';

describe('Options component', () => {
  test('should display images for each Scoop option received from the server', async () => {
    render(<Options optionType="scoops" />);
    // to query images that should be present we can use
    // "getAllByRole" (we are using "all" part because we know that we should have > 1 image).
    // images have the "img" role, so we can use it here.
    // the text that is associated with an image (which we use as a value for "name" option)
    // is a text value of "alt" attribute.
    // BUT there is a problem:
    // If we look at Options component, we can see that it doesn't have images that we're
    // looking for directly after mounting. In fact, we fetch these images from server
    // in useEffect and re-render component after we got them and set the state with new data.
    // So "getAllByRole" is NOT going to work here because data population is async in this case!
    // That is why we need to use "findAllByRole"
    const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
    // we know that our Mock Server returns an array of 2 items, so we can check the length:
    expect(scoopImages).toHaveLength(2);
    // and we can extract "alt" text values from images:
    const altTexts = scoopImages.map((image) => image.alt);
    // and now when we have "altTexts" array, we can make an assertion.
    // IMPORTANT: when we compare primitive values we use "toBe" Jest matcher,
    // BUT for reference types we must use "toEqual" matcher:
    expect(altTexts).toEqual(['Chocolate scoop', 'Vanilla scoop']);
  });

  test('should display images for each Topping option received from the server', async () => {
    render(<Options optionType="toppings" />);

    const toppingImages = await screen.findAllByRole('img', {
      name: /topping$/i,
    });
    const altTexts = toppingImages.map((image) => image.alt);

    expect(toppingImages).toHaveLength(3);
    expect(altTexts).toEqual([
      'M&Ms topping',
      'Hot fudge topping',
      'Peanut butter cups topping',
    ]);
  });
});
