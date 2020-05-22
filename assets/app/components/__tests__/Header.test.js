import React from 'react';
import { useGlobal } from 'reactn';
import { shallow } from 'enzyme';
import { UserFactory } from '../../factories';
import Header from '../Header';

const getWrapper = () => (
  shallow(<Header>Brand name</Header>)
);

describe('Header component', () => {
  it('should render the brand with given children, if user is undefined', () => {
    useGlobal.mockReturnValue([undefined]);
    const wrapper = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the brand with given children, if user is not authenticated', () => {
    useGlobal.mockReturnValue([null]);
    const wrapper = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the brand and a logout link, if user is authenticated', () => {
    useGlobal.mockReturnValue([UserFactory.build()]);
    const wrapper = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });
});
