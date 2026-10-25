
const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearButton = document.getElementById("clear");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = task.done ? "done" : "";

    const label = document.createElement("span");
    label.className = "task-text";
    label.textContent = task.text;

    const toggleButton = document.createElement("button");
    toggleButton.className = "toggle";
    toggleButton.dataset.action = "toggle";
    toggleButton.textContent = task.done ? "Undo" : "Done";
    toggleButton.type = "button";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    li.append(label, toggleButton, deleteButton);
    list.appendChild(li);
  });

  const remaining = tasks.filter(task => !task.done).length;
  count.textContent = `${remaining} task(s) left`;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text: text,
    done: false
  });

  input.value = "";
  saveTasks();
  renderTasks();
  input.focus();
});

list.addEventListener("click", function (event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const li = event.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (action === "delete") {
    tasks = tasks.filter(task => task.id !== id);
  }

  if (action === "toggle") {
    tasks.forEach(task => {
      if (task.id === id) task.done = !task.done;
    });
  }

  saveTasks();
  renderTasks();
});

document.querySelector(".filters").addEventListener("click", function (event) {
  const filter = event.target.dataset.filter;
  if (!filter) return;

  currentFilter = filter;
  renderTasks();
});

clearButton.addEventListener("click", function () {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
});

renderTasks();
s