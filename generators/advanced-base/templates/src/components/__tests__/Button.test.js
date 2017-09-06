import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Button from '../Button';

describe('Button', () => {
  it('should render the button', () => {
    const tree = renderer.create(<Button text="Hello" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
