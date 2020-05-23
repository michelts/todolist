import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';
import { TaskFactory } from '../../../factories';
import Tasks from '../index';

const getWrapper = () => {
  const wrapper = shallow(<Tasks />);
  return { wrapper };
};

describe('Tasks component', () => {
  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(effect => effect());
  });

  it('should render a title, disabled create and sort controls, and the list as loading while list is undefined', () => {
    axios.get.mockResolvedValue({});
    const { wrapper } = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a title, create and sort controls, and the list of tasks when available', async () => {
    axios.get.mockResolvedValue({ data: TaskFactory.buildList(1) });
    const { wrapper } = getWrapper();
    await axios.get;
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a title, create and sort controls, and an empty list when tasks are empty', async () => {
    axios.get.mockResolvedValue({ data: [] });
    const { wrapper } = getWrapper();
    await axios.get;
    expect(wrapper).toMatchSnapshot();
  });
});
