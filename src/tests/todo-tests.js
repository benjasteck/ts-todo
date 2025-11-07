import { Selector } from 'testcafe';

fixture('Todo App')
  .page('http://localhost:5173'); // adjust if your local dev URL differs

test('User can add a todo only when all fields are filled', async t => {
  const todoInput = Selector('#todo-input');
  const dateInput = Selector('#dueDateInput');
  const addButton = Selector('.todo-form button[type="submit"]');
  const errorMessage = Selector('#error-message');
  const todoList = Selector('#todo-list');

  // 🧩 Step 1: Try submitting with empty fields
  await t
    .click(addButton)
    .expect(errorMessage.visible)
    .ok('Error message should appear when fields are empty');

  // 🧩 Step 2: Fill text but no date
  await t
    .typeText(todoInput, 'TestCafe Todo')
    .click(addButton)
    .expect(errorMessage.visible)
    .ok('Error message should appear when date is missing');

  // 🧩 Step 3: Fill both text and date
  const today = new Date().toISOString().split('T')[0]; // "2025-11-07"
  await t
    .selectText(todoInput) // clears previous text
    .typeText(todoInput, 'TestCafe Todo')
    .typeText(dateInput, today)
    .click(addButton);

  // 🧩 Step 4: Verify todo is added
  const newTodo = todoList.find('li').withText('TestCafe Todo');
  await t
    .expect(newTodo.exists)
    .ok('New todo should be added to the list');

  // 🧩 Step 5: Verify error message is hidden after successful add
  await t
    .expect(errorMessage.visible)
    .notOk('Error message should be hidden after adding a todo');
});
