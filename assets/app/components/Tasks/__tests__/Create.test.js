import React from 'react';
import axios from 'axios';
import { OrderedMap } from 'immutable';
import { shallow } from 'enzyme';
import { TaskFactory } from '../../../factories';
import Create from '../Create';

const getWrapper = (customProps = {}) => {
  const props = {
    tasks: undefined,
    setTasks: jest.fn(),
    ...customProps,
  };
  const wrapper = shallow(<Create {...props} />);
  return { wrapper, props };
};

describe('Create component', () => {
  beforeEach(() => {
  });

  it('should render a disabled button if tasks are undefined', () => {
    const { wrapper } = getWrapper({ tasks: undefined });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a button to add new task if tasks were loaded', () => {
    const { wrapper } = getWrapper({ tasks: OrderedMap() });
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable the create button, create a blank task and append it to the end of the list', async () => {
    const newTask = TaskFactory.build({ description: '' });
    axios.post.mockResolvedValue({ data: newTask });

    const tasks = OrderedMap();
    const { wrapper, props: { setTasks } } = getWrapper({ tasks });

    wrapper.simulate('click');
    expect(wrapper.prop('disabled')).toBe(true);
    expect(axios.post).toHaveBeenCalledWith('/api/v1/tasks/', { description: '' });

    await axios.post;
    const callback = setTasks.mock.calls[0][0];
    const newTasks = callback(OrderedMap()); // simulate callback over a clean state
    expect(newTasks).toEqual(OrderedMap([[newTask.id, newTask]]));
    expect(wrapper.prop('disabled')).toBe(false);
  });
});
