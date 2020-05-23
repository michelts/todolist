import React from 'react';
import axios from 'axios';
import { OrderedMap } from 'immutable';
import { shallow } from 'enzyme';
import { TaskFactory, BlankTaskFactory } from '../../../factories';
import Item from '../Item';

const getWrapper = (customProps = {}) => {
  const props = {
    setTasks: jest.fn(),
    ...customProps,
  };
  const wrapper = shallow(<Item {...props} />);
  return { wrapper, props };
};

describe('Tasks component', () => {
  it('should render the task description, a button to select it, the date, and a priority field', () => {
    const task = TaskFactory.build();
    const { wrapper } = getWrapper({ task });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the task description, a button to select it, the date, and a priority field', () => {
    const task = BlankTaskFactory.build();
    const { wrapper } = getWrapper({ task });
    expect(wrapper).toMatchSnapshot();
  });

  it('should post task with the changed description', async () => {
    const task = BlankTaskFactory.build();
    const updatedTask = { ...task, description: 'New value' };
    axios.put.mockResolvedValue({ data: updatedTask });

    const { wrapper, props: { setTasks } } = getWrapper({ task });

    wrapper.find('[data-name="description"]').simulate('save', updatedTask.description);
    const { id, selected, ...payload } = updatedTask;
    expect(axios.put).toHaveBeenCalledWith(`/api/v1/tasks/${id}/`, payload);

    await axios.put;
    const callback = setTasks.mock.calls[0][0];
    const newTasks = callback(OrderedMap()); // simulate callback over a clean state
    expect(newTasks).toEqual(OrderedMap([[updatedTask.id, updatedTask]]));
  });

  it('should post task with the changed due date', async () => {
    const task = BlankTaskFactory.build();
    const updatedTask = { ...task, due_date: '2020-05-23' };
    axios.put.mockResolvedValue({ data: updatedTask });

    const { wrapper, props: { setTasks } } = getWrapper({ task });

    wrapper.find('[data-name="due-date"]').simulate('save', updatedTask.due_date);
    const { id, selected, ...payload } = updatedTask;
    expect(axios.put).toHaveBeenCalledWith(`/api/v1/tasks/${id}/`, payload);

    await axios.put;
    const callback = setTasks.mock.calls[0][0];
    const newTasks = callback(OrderedMap()); // simulate callback over a clean state
    expect(newTasks).toEqual(OrderedMap([[updatedTask.id, updatedTask]]));
  });

  it('should post priority when changed', async () => {
    const task = BlankTaskFactory.build();
    const updatedTask = { ...task, priority: 3 };
    axios.put.mockResolvedValue({ data: updatedTask });

    // react-bootstrap selects don't get a value, we need to get it from the select elem
    jest.spyOn(React, 'useRef').mockReturnValue({ current: { value: updatedTask.priority } });

    const { wrapper, props: { setTasks } } = getWrapper({ task });

    wrapper.find('[name="priority"]').simulate('change');
    const { id, selected, ...payload } = updatedTask;
    expect(axios.put).toHaveBeenCalledWith(`/api/v1/tasks/${id}/`, payload);

    await axios.put;
    const callback = setTasks.mock.calls[0][0];
    const newTasks = callback(OrderedMap()); // simulate callback over a clean state
    expect(newTasks).toEqual(OrderedMap([[updatedTask.id, updatedTask]]));
  });

  it('should render the proper priority option selected', async () => {
    const task = TaskFactory.build({ priority: 3 });
    const { wrapper } = getWrapper({ task });
    expect(wrapper.find('[name="priority"]')).toMatchSnapshot('option 3 selected');
  });

  it('should toggle the item selection when click the checkbox', () => {
    const tasks = OrderedMap(BlankTaskFactory.buildList(1).map((obj) => [obj.id, obj]));
    const { wrapper, props: { setTasks } } = getWrapper({ task: tasks.first() });

    wrapper.find('[name="select"]').simulate('click');
    const callback = setTasks.mock.calls[0][0];
    const newTasks = callback(tasks); // simulate callback over the current state
    expect(newTasks.first().selected).toEqual(true);
  });

  it('should render the checkbox selected if item is selected', () => {
    const task = BlankTaskFactory.build({ selected: true });
    const { wrapper } = getWrapper({ task });
    expect(wrapper.find('[name="select"]').prop('checked')).toBe(true);
  });
});
