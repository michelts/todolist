import { Factory } from 'rosie';

const TaskFactory = new Factory()
  .sequence('id', (index) => index + 1)
  .sequence('description', (index) => `Task ${index}`)
  .attr('priority', 0)
  .attr('due_date', '2020-05-22')
  .attr('is_completed', false)
  .attr('selected', false); // selected is a local flag only

const BlankTaskFactory = new Factory()
  .extend(TaskFactory)
  .attr('description', '')
  .attr('priority', 0)
  .attr('due_date', null)
  .attr('is_completed', false);

export {
  TaskFactory,
  BlankTaskFactory,
};
