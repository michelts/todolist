import React from 'react';
import { shallow } from 'enzyme';
import Index from '../Index';

describe('Index component', () => {
  it('should render routes to Login, Logout and Tasks', () => {
    const wrapper = shallow(<Index />);
    expect(wrapper).toMatchSnapshot();
  });
});
