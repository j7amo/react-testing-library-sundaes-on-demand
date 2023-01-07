import React from 'react';
import { render, screen } from '@testing-library/react';
import Options from '../Options';

describe('Options component', () => {
  test('should display images for each option received from the server', () => {
    render(<Options optionType="scoops" />);
    // to query images that should be present we can use
    // "getAllByRole" (we are using "all" part because we know that we should have > 1 image).
    // images have the "img" role, so we can use it here.
    // the text that is associated with an image (which we use as a value for "name" option)
    // is a text value of "alt" attribute.
    const scoopImages = screen.getAllByRole('img', { name: /scoop$/i });
    // we know that our Mock Server returns an array of 2 items, so we can check the length:
    expect(scoopImages).toHaveLength(2);
    // and we can extract "alt" text values from images:
    const altTexts = scoopImages.map((image) => image.alt);
    // and now when we have "altTexts" array, we can make an assertion.
    // IMPORTANT: when we compare primitive values we use "toBe" Jest matcher,
    // BUT for reference types we must use "toEqual" matcher:
    expect(altTexts).toEqual(['Chocolate scoop', 'Vanilla scoop']);
  });
});
