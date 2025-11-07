import { Selector } from 'testcafe';

fixture('Todo App - Add & Edit Todo')
  .page('https://test.bsteckmetz.dk/todo/');

test('Add a todo and then edit it', async t => {
  await t.expect(Selector('#todo-input').exists).ok({ timeout: 10000 });
  const todoInput = Selector('#todo-input');
  const dateInput = Selector('#dueDateInput');
  const addButton = Selector('.todo-form button[type="submit"]');
  const todoList = Selector('#todo-list');

  //lave and date sæt til idag
  const today = new Date().toISOString().split('T')[0];

  await t
    .typeText(todoInput, 'b')
    .typeText(dateInput, today)
    .click(addButton);


  await t.setNativeDialogHandler(() => 'Edited Todo');

  //Select first todo and its edit button
  const firstTodo = todoList.find('li').nth(0);
  const editButton = firstTodo.find('#editBtn'); // or .edit-btn if you change it
  const todoText = firstTodo.find('span');

  //Assert the text is initially 'b'
  await t.expect(todoText.innerText).eql('b');

  //Click edit (triggers prompt)
  await t.click(editButton);

  //Assert the text has updated
  await t.expect(todoText.innerText).eql('Edited Todo');
});
