import { Selector } from 'testcafe';

fixture('Todo App - Add & Edit Todo')
  .page('https://test.bsteckmetz.dk/todo/');

test('Add a todo and then edit it', async t => {
  const todoInput = Selector('#todo-input');
  const dateInput = Selector('#dueDateInput');
  const addButton = Selector('.todo-form button[type="submit"]');
  const todoList = Selector('#todo-list');

  // 1️⃣ Add a new todo 'b'
  const today = new Date().toISOString().split('T')[0];

  await t
    .typeText(todoInput, 'b')
    .typeText(dateInput, today)
    .click(addButton);

  // 2️⃣ Set native dialog handler for prompt (Edit)
  await t.setNativeDialogHandler(() => 'Edited Todo');

  // 3️⃣ Select first todo and its edit button
  const firstTodo = todoList.find('li').nth(0);
  const editButton = firstTodo.find('#editBtn'); // or .edit-btn if you change it
  const todoText = firstTodo.find('span');

  // 4️⃣ Assert the text is initially 'b'
  await t.expect(todoText.innerText).eql('b');

  // 5️⃣ Click edit (triggers prompt)
  await t.click(editButton);

  // 6️⃣ Assert the text has updated
  await t.expect(todoText.innerText).eql('Edited Todo');
});
