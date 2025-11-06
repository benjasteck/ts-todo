import { describe, it, expect, beforeEach, vi } from 'vitest';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Global variable for the first test suite, but it's okay because
// it's immediately reset in the beforeEach
let todos: Todo[] = [];

describe('Todo App - Basic Logic', () => {
  beforeEach(() => {
    // Reset state before EACH test in this suite
    todos = [];
  });

  it('should add a new todo', () => {
    const newTodo: Todo = { id: 1, title: 'Test Todo', completed: false };
    todos.push(newTodo);
    expect(todos.length).toBe(1);
    expect(todos[0]).toEqual(newTodo);
  });

  it('should mark a todo as completed', () => {
    const newTodo: Todo = { id: 1, title: 'Test Todo', completed: false };
    todos.push(newTodo);
    todos[0].completed = true;
    expect(todos[0].completed).toBe(true);
  });

  it('should delete a todo', () => {
    const newTodo: Todo = { id: 1, title: 'Test Todo', completed: false };
    todos.push(newTodo);
    todos = todos.filter(todo => todo.id !== newTodo.id);
    expect(todos.length).toBe(0);
  });
});

// The check for 'document' is a good sanity check
it('Environment Check: JSDOM should provide the document object', () => {
  expect(typeof document).toBe('object');
});

// --- Second Test Suite (Where the failures likely are) ---
describe("removeCompletedTodos - Integration Test", () => {
  // Declare variables for THIS suite
  let todos: Todo[];
  let removeTodo: (id: number) => void;

  // This function is now local to the test suite, preventing global leakage
  function removeCompletedTodos(): void {
    const completedTodos = todos.filter(todo => todo.completed);
    // Crucial: Use the removeTodo function that will be defined in beforeEach
    completedTodos.forEach(todo => removeTodo(todo.id));
  }

  beforeEach(() => {
    // 1. Reset/Initialize local suite variables
    todos = [
      { id: 1, title: "done", completed: true },
      { id: 2, title: "not done", completed: false },
      { id: 3, title: "also done", completed: true },
    ];

    // 2. Initialize the mock function
    removeTodo = vi.fn();

    // 3. Clear the DOM, preventing leakage from other files/tests
    document.body.innerHTML = '';

    // If you need the button for a specific test, declare it in that test.
    // You don't seem to be using the button in the 'it' block, so I'll remove it
    // from the beforeEach for clarity/isolation.
  });

  it("should call removeTodo for each completed todo", () => {
    // ACT
    removeCompletedTodos();

    // ASSERT
    // removeTodo should be called twice — for todos 1 and 3
    expect(removeTodo).toHaveBeenCalledTimes(2);
    expect(removeTodo).toHaveBeenCalledWith(1);
    expect(removeTodo).toHaveBeenCalledWith(3);
  });
});
