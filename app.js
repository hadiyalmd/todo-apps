// === Model ===
class TodoModel {
  constructor() {
    this.todos = [];
  }

  addTodo(text) {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    this.todos.push(todo);
    return todo;
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  toggleTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  getTodos() {
    return this.todos;
  }
}

// === View ===
class TodoView {
  constructor() {
    this.input = document.getElementById('todo-input');
    this.addBtn = document.getElementById('add-btn');
    this.todoList = document.getElementById('todo-list');
  }

  getInputValue() {
    return this.input.value.trim();
  }

  clearInput() {
    this.input.value = '';
  }

  renderTodos(todos) {
    this.todoList.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';
      li.innerHTML = `
        <span>${todo.text}</span>
        <div>
          <button data-action="toggle" data-id="${todo.id}">✔</button>
          <button data-action="delete" data-id="${todo.id}">✖</button>
        </div>
      `;
      this.todoList.appendChild(li);
    });
  }

  bindAdd(handler) {
    this.addBtn.addEventListener('click', () => {
      if (this.getInputValue()) {
        handler(this.getInputValue());
        this.clearInput();
      }
    });
  }

  bindActions(toggleHandler, deleteHandler) {
    this.todoList.addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id);
      const action = e.target.dataset.action;

      if (action === 'toggle') toggleHandler(id);
      if (action === 'delete') deleteHandler(id);
    });
  }
}

// === Controller ===
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind view handlers
    this.view.bindAdd(this.handleAddTodo);
    this.view.bindActions(this.handleToggleTodo, this.handleDeleteTodo);

    // Initial render
    this.view.renderTodos(this.model.getTodos());
  }

  handleAddTodo = (text) => {
    this.model.addTodo(text);
    this.view.renderTodos(this.model.getTodos());
  };

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id);
    this.view.renderTodos(this.model.getTodos());
  };

  handleDeleteTodo = (id) => {
    this.model.deleteTodo(id);
    this.view.renderTodos(this.model.getTodos());
  };
}

// === Init App ===
const app = new TodoController(new TodoModel(), new TodoView());
