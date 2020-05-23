import { Factory } from 'rosie';

const TaskFactory = new Factory()
  .sequence('id', (index) => index + 1)
  .sequence('description', (index) => `Task ${index}`)
  .attr('priority', 1)
  .attr('due_date', '2020-05-22')
  .attr('is_completed', false);

export {
  TaskFactory,
}
