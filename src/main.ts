import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
      <h1>Todo App</h1>
      <div class = progressBarWrapper>
      <div class = progressBar></div>
      </div>
      <div class = topButtons>
      <button id="removeDoneBtn">remove completed tasks</button>
      <button id="filterDoneBtn">filter tasks</button>
      </div>
      <form class="todo-form">
        <input type="text" id="todo-input" placeholder="Add a new todo" />
        <input type="date" id="dueDateInput" onkeydown="return false;">
        <button type="submit">Add</button>
      </form>
      <!-- error handling message : CSS added:: .input-error & #error-message -->
      <p id="error-message">fill out ALL fields</p>
      <ul class="todo-list" id="todo-list"></ul>

      <input type="color" id="colorPicker" />
    </div>
`

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date;
}


export let todos: Todo[] = [];

const loadTodosFromLocalStorage = (): void => {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    const parsed: Todo[] = JSON.parse(storedTodos);
    todos = parsed.map(todo => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    }));
  }
};



const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const dueDateInput = document.getElementById("dueDateInput") as HTMLInputElement;

const saveTodosToLocalStorage = (): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const renderTodos = (): void => {

  todoList.innerHTML = '';

  todos.forEach(todo => {
     const li = document.createElement('li');
    li.className = 'todo-item';

     const isOverdue = todo.dueDate ? todo.dueDate < new Date() : false;

    li.innerHTML = `
      <span>${todo.text}</span>
     ${todo.dueDate ? `<small style="color: ${isOverdue ? 'red' : 'black'}">Due: ${todo.dueDate.toLocaleDateString()}</small>` : ''}
      <button>Remove</button>
         <button id="editBtn">Edit</button>
         <button id="completedBtn">${todo.completed ? 'done' : 'not done'}</button>
    `;

  updateProgressBar();
    addRemoveButtonListener(li, todo.id);
    addEditButtonListener(li, todo.id);
    addDoneButtonListener(li, todo.id);
    todoList.appendChild(li);

  });
};


renderTodos();

export const addTodo = (text: string, dueDate?: Date): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: dueDate
  };

  todos.push(newTodo);
  console.log("Todo added:", todos);
  saveTodosToLocalStorage();
  renderTodos();
};

const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : undefined;
  const dueDateValue = dueDateInput.value;

  if (text && dueDateValue !== '') {
    todoInput.classList.remove('input-error');
    errorMessage.style.display = 'none';
    addTodo(text, dueDate);
    todoInput.value = '';
    dueDateInput.value = '';
  } else {
    todoInput.classList.add('input-error');
    dueDateInput.classList.add('input-error');
    errorMessage.style.display = 'block';
  }
});

const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector('button');
  if (removeButton) {
    removeButton.addEventListener('click', () => removeTodo(id));
  } else {
    console.error(`Remove button not found for todo item with ID: ${id}`);
  }
};

export const removeTodo = (id: number): void => {
  todos = todos.filter(todo => todo.id !== id);
  saveTodosToLocalStorage();
  renderTodos();
};

const addEditButtonListener = (li: HTMLLIElement, id:number) => {
  const editButton = li.querySelector('#editBtn')
  editButton?.addEventListener('click', () => editTodo(id))
}

const editTodo = (id:number) => {
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    const text = prompt('Edit todo', todo.text)
    if (text) {
      todo.text = text
      saveTodosToLocalStorage();
      renderTodos()
    }
  }
}

const addDoneButtonListener = (li: HTMLLIElement, id:number) => {
  const editButton = li.querySelector('#completedBtn')
  editButton?.addEventListener('click', () => completeTodo(id))
}

const completeTodo = (id:number) => {
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToLocalStorage();
    renderTodos()
  }
}

const removeDoneBtn = document.getElementById("removeDoneBtn");

removeDoneBtn?.addEventListener("click", removeCompletedTodos);

function removeCompletedTodos(): void {
  const completedTodos = todos.filter(todo => todo.completed);
  completedTodos.forEach(todo => removeTodo(todo.id));
}

const filterDoneBtn = document.getElementById("filterDoneBtn");

filterDoneBtn?.addEventListener("click", filterTodos);

function filterTodos(): void {
  todos.sort((a, b) => {
    return Number(a.completed) - Number(b.completed);
  });
  saveTodosToLocalStorage();
  renderTodos();
}

const progressBar = document.querySelector('.progressBar') as HTMLDivElement;

const updateProgressBar = (): void => {
  if (todos.length === 0) {
    progressBar.style.width = '0%';
    return;
  }

  const completedCount = todos.filter(todo => todo.completed).length;
  const percent = (completedCount / todos.length) * 100;

  progressBar.style.width = `${percent}%`;
};

const changeBackgroundColor = (color: string): void => {
  document.body.style.backgroundColor = color;
};


const initializeColorPicker = (): void => {
  const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
  if (colorPicker) {
    colorPicker.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      changeBackgroundColor(target.value);
    });
  } else {
    console.error('Color picker element not found');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initializeColorPicker();
});
loadTodosFromLocalStorage();
renderTodos();
