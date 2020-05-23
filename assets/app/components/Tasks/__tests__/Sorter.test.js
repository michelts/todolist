import React from 'react';
import axios from 'axios';
import { OrderedMap } from 'immutable';
import { shallow } from 'enzyme';
import { TaskFactory } from '../../../factories';
import Sorter from '../Sorter';

jest.useFakeTimers();

const getWrapper = (customProps = {}) => {
  const props = {
    setTasks: jest.fn(),
    disabled: false,
    ...customProps,
  };
  const wrapper = shallow(<Sorter {...props} />);
  return { wrapper, props };
};

describe('Tasks component', () => {
  afterEach(() => {
    axios.get.mockClear();
  });

  it('should render a select to sort options', () => {
    const { wrapper } = getWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a disabled select when told through props', () => {
    const { wrapper } = getWrapper({ disabled: true });
    expect(wrapper.prop('disabled')).toBe(true);
  });

  it('should get sorted tasks after a timeout', async () => {
    // simulate a value selected in the select, once react-boostrap's onChange
    // doesn't bring the value applied
    jest.spyOn(React, 'useRef').mockReturnValue({ current: { value: 'due_date' } });

    const tasks = TaskFactory.buildList(1);
    axios.get.mockResolvedValue({ data: tasks });

    const { wrapper, props: { setTasks } } = getWrapper();
    wrapper.simulate('change');

    jest.runAllTimers();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/v1/tasks/?sort=due_date');

    await axios.get;
    expect(setTasks).toHaveBeenCalledWith(OrderedMap(tasks.map(obj => [obj.id, obj])));
  });

  it('should reset a previous sort and get sorted tasks after a timeout', async () => {
    // simulate 2 change events by mocking 2 subsequent calls
    jest.spyOn(React, 'useRef')
      .mockReturnValueOnce({ current: { value: 'due_date' } })
      .mockReturnValueOnce({ current: { value: 'priority' } });

    const tasks = TaskFactory.buildList(1);
    axios.get.mockResolvedValue({ data: tasks });

    const { wrapper, props: { setTasks } } = getWrapper();
    wrapper.simulate('change'); // first, change to due_date
    jest.advanceTimersByTime(100);

    wrapper.simulate('change'); // second change, to priority
    jest.runAllTimers();

    // Change to due_date was ignored and his timer was resetted
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/v1/tasks/?sort=priority');

    await axios.get;
    expect(setTasks).toHaveBeenCalledWith(OrderedMap(tasks.map(obj => [obj.id, obj])));
  });
});
