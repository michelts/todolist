import React from 'react';
import { shallow } from 'enzyme';
import Index from '../Index';

jest.unmock('react-router-dom');

describe('Index component', () => {
  it('should render routes to Login, Logout, Register and Tasks', () => {
    const wrapper = shallow(<Index />);
    expect(wrapper).toMatchSnapshot();
  });
});
