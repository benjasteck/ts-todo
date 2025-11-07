import { describe, it, expect, beforeEach, vi } from 'vitest';

// --- Todo interface ---
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// --- Global todos array ---
let todos: Todo[] = [];

// --- Mock removeTodo function ---
let removeTodo: (id: number) => void;



// --- Function under test ---
function removeCompletedTodos(): void {
  const completedTodos = todos.filter(todo => todo.completed);
  completedTodos.forEach(todo => removeTodo(todo.id));
}

const localStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// --- Helper to save todos ---
function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const renderTodos = vi.fn();

// --- Function under test ---
function filterTodos(): void {
  todos.sort((a, b) => Number(a.completed) - Number(b.completed));

  renderTodos();
}

// --- Basic Todo tests ---
describe('Todo App', () => {
  beforeEach(() => {
    todos = [];
    vi.clearAllMocks();
  });

  it('should add a new todo', () => {
    const newTodo: Todo = { id: 1, title: 'Test Todo', completed: false };
    todos.push(newTodo);
     saveTodosToLocalStorage();

    // Assertions
    expect(todos.length).toBe(1);
    expect(todos[0]).toEqual(newTodo);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
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
    saveTodosToLocalStorage();
    expect(todos.length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('todos', JSON.stringify(todos));
  });

  it('should store todos in localStorage', () => {
  const newTodo: Todo = { id: 1, title: 'Test Todo', completed: false };
  todos.push(newTodo);

  // Use a real localStorage mock
  localStorage.setItem = vi.fn((key, value) => {
    (localStorage as any)[key] = value;
  });
  localStorage.getItem = vi.fn((key) => (localStorage as any)[key]);

  saveTodosToLocalStorage();

  const saved = JSON.parse(localStorage.getItem('todos')!);
  expect(saved).toEqual(todos);
});
});

// --- removeCompletedTodos tests ---
describe('removeCompletedTodos', () => {
  beforeEach(() => {
    // Set up a fake DOM button
    document.body.innerHTML = `<button id="removeDoneBtn"></button>`;
    document.getElementById('removeDoneBtn') as HTMLButtonElement;

    // Create fake todos
    todos = [
      { id: 1, title: 'done', completed: true },
      { id: 2, title: 'not done', completed: false },
      { id: 3, title: 'also done', completed: true },
    ];

    // Mock removeTodo function
    removeTodo = vi.fn();
  });

  it('should call removeTodo for each completed todo', () => {
    removeCompletedTodos();

    // removeTodo should be called twice — for todos 1 and 3
    expect(removeTodo).toHaveBeenCalledTimes(2);
    expect(removeTodo).toHaveBeenCalledWith(1);
    expect(removeTodo).toHaveBeenCalledWith(3);
  });
});

describe('filterTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    todos = [
      { id: 1, title: 'done', completed: true },
      { id: 2, title: 'not done', completed: false },
      { id: 3, title: 'done again', completed: true },
      { id: 4, title: 'still not done', completed: false },
    ];
  });

  it('should sort todos so incomplete come first', () => {
    filterTodos();

    const completedStatuses = todos.map(t => t.completed);
    // Incomplete (false) should appear before complete (true)
    expect(completedStatuses).toEqual([false, false, true, true]);
  });
});


describe('Todo DOM interactions', () => {
  beforeEach(() => {
    // Set up fake DOM for each test
    document.body.innerHTML = `
      <div id="app">
        <div class="container">
          <h1>Todo App</h1>
          <div class="progressBarWrapper">
            <div class="progressBar"></div>
          </div>
          <div class="topButtons">
            <button id="removeDoneBtn">remove completed tasks</button>
            <button id="filterDoneBtn">filter tasks</button>
          </div>
          <form class="todo-form">
            <input type="text" id="todo-input" placeholder="Add a new todo" />
            <input type="date" id="dueDateInput" onkeydown="return false;">
            <button type="submit">Add</button>
          </form>
          <p id="error-message">fill out ALL fields</p>
          <ul class="todo-list" id="todo-list"></ul>
          <input type="color" id="colorPicker" />
        </div>
      </div>
    `;
  });

  it('should render a todo in the list', () => {
    const list = document.getElementById('todo-list')!;
    const todoItem = document.createElement('li');
    todoItem.textContent = 'Buy milk';
    list.appendChild(todoItem);

    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain('Buy milk');
  });
});

