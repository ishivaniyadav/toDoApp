document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("manageTasksBtn").addEventListener("click", function () {
    document.getElementById("manageTasksTab").style.display = "block";
    openTab("manageTasks");
    displayTasks(currentSearch, currentPriority);
  });

  document.getElementById("getStartedTab").addEventListener("click", function () {
    openTab("getStarted");
  });

  document.getElementById("manageTasksTab").addEventListener("click", function () {
    openTab("manageTasks");
    displayTasks(currentSearch, currentPriority);
  });

  document.getElementById("addTaskBtn").addEventListener("click", function () {
    openModal("addTaskForm");
  });

  document.getElementById("saveChangesBtn").addEventListener("click", function () {
    saveEditedTask(currentEditIndex);
  });

  const filterWrapper = document.createElement("div");
  filterWrapper.style.display = "flex";
  filterWrapper.style.justifyContent = "space-between";
  filterWrapper.style.alignItems = "center";
  filterWrapper.style.marginTop = "20px";
  filterWrapper.style.gap = "10px";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "🔍 Search tasks...";
  Object.assign(searchInput.style, {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    flex: "1",
  });

  const prioritySelect = document.createElement("select");
  Object.assign(prioritySelect.style, {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  });

  ["All", "Low", "Medium", "High"].forEach((p) => {
    const option = document.createElement("option");
    option.value = p.toLowerCase();
    option.textContent = p;
    prioritySelect.appendChild(option);
  });

  filterWrapper.appendChild(searchInput);
  filterWrapper.appendChild(prioritySelect);

  const manageTab = document.getElementById("manageTasks");
  const taskList = document.getElementById("tasks");
  taskList.insertAdjacentElement("afterend", filterWrapper);

  let currentSearch = "";
  let currentPriority = "";

  searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value.toLowerCase();
    displayTasks(currentSearch, currentPriority);
  });

  prioritySelect.addEventListener("change", () => {
    const val = prioritySelect.value;
    currentPriority = val === "all" ? "" : val;
    displayTasks(currentSearch, currentPriority);
  });

  displayTasks();

  const themeToggleBtn = document.createElement("button");
  Object.assign(themeToggleBtn.style, {
    position: "fixed",
    top: "20px",
    right: "30px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    fontSize: "18px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    zIndex: "1001",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  document.body.appendChild(themeToggleBtn);

  function updateThemeIcon() {
    themeToggleBtn.textContent = document.body.classList.contains("dark") ? "🌞" : "🌙";
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateThemeIcon();
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  updateThemeIcon();
});

function openTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((el) => el.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  document.getElementById(tabName + "Tab").classList.add("active");
}

function openModal(modalId) {
  if (modalId === "addTaskForm") {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("priority").value = "Low";
    document.getElementById("dueDate").value = "";
    document.getElementById("time").value = "";
  }
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

let currentEditIndex;

function addTask() {
  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    priority: document.getElementById("priority").value,
    dueDate: document.getElementById("dueDate").value,
    time: document.getElementById("time").value,
    completed: false,
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  closeModal("addTaskForm");
}

function displayTasks(searchQuery = "", priorityFilter = "") {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const tasksContainer = document.getElementById("tasks");
  tasksContainer.innerHTML = "";

  tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery);
      const matchesPriority = !priorityFilter || task.priority.toLowerCase() === priorityFilter;
      return matchesSearch && matchesPriority;
    })
    .forEach((task, index) => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task");
      taskItem.setAttribute("data-priority", task.priority);
      taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" onchange="toggleTaskCompletion(${index})" ${task.completed ? "checked" : ""}>
        <div class="task-description">
          <div class="task-title">${task.title}</div>
          <div class="task-meta">
            <p>${task.description}</p>
            <p>Priority: ${task.priority}</p>
            <p>Due: ${task.dueDate}</p>
            <p>${task.time}</p>
          </div>
        </div>
        <div class="task-buttons">
          <button onclick="editTask(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      tasksContainer.appendChild(taskItem);
    });
}

function toggleTaskCompletion(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];
  currentEditIndex = index;

  document.getElementById("editTitle").value = task.title;
  document.getElementById("editDescription").value = task.description;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDueDate").value = task.dueDate;
  document.getElementById("editTime").value = task.time;

  openModal("editTaskForm");
}

function saveEditedTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];

  task.title = document.getElementById("editTitle").value;
  task.description = document.getElementById("editDescription").value;
  task.priority = document.getElementById("editPriority").value;
  task.dueDate = document.getElementById("editDueDate").value;
  task.time = document.getElementById("editTime").value;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  closeModal("editTaskForm");
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}
