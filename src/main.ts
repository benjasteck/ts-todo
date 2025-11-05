import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
      <h1>Todo App</h1>
      <form class="todo-form">
        <input type="text" id="todo-input" placeholder="Add a new todo" />
        <button type="submit">Add</button>
      </form>
      <!-- error handling message : CSS added:: .input-error & #error-message -->
      <p id="error-message">Please enter a todo item</p>
      <ul class="todo-list" id="todo-list"></ul>

      <input type="color" id="colorPicker" />
    </div>
`


