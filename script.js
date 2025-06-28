const add_todo_ = document.getElementById("add");
const search_todo_ = document.getElementById("search_todo");
const header_checkbox_ = document.getElementById("checkbox_all");
const save_ = document.getElementById("save");
const input_todo_ = document.getElementById("enter_todo");
const todo_holder_ = document.getElementById("todo_holder");
const total_ = document.getElementById("total");
const delete_ = document.getElementsByClassName("delete");
const edit_ = document.getElementsByClassName("edit");
const arr = [];
let flag = true;
const selectAllButton = document.getElementById("select_all");
const deleteSelectedButton = document.getElementById("delete_selected");
const prevPageButton = document.getElementById("prev_page");
const nextPageButton = document.getElementById("next_page");
const pageInfo = document.getElementById("page_info");
let currentPage = 1;
const todosPerPage = 5;
// Render todos for the current page
const renderTodos = (filteredTodos) => {
  todo_holder_.innerHTML = ""; // Clear current todos
  const start = (currentPage - 1) * todosPerPage;
  const end = start + todosPerPage;
  const paginatedTodos = filteredTodos.slice(start, end);

  // Render paginated todos
  paginatedTodos.forEach((item) => {
    todo_holder_.insertAdjacentHTML("beforeend", item.value);
  });

  // Update pagination UI
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage) || 1;
  pageInfo.textContent = `Page: ${currentPage} of ${totalPages}`;
  total_.textContent = `Total Todos: ${filteredTodos.length}`;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
};

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Search todos with debounce
const searchTodos = debounce((query) => {
  query = query.toLowerCase().trim();
  todo_holder_.innerHTML = ""; // Clear current todos
  const filteredTodos = arr.filter((item) =>
    item.text.toLowerCase().includes(query)
  );

  // Render filtered todos
  filteredTodos.forEach((item) => {
    todo_holder_.insertAdjacentHTML("beforeend", item.value);
  });

  // Update visibility
  header_checkbox_.hidden = filteredTodos.length === 0;
  deleteSelectedButton.hidden =
    filteredTodos.length === 0 ||
    !Array.from(
      document.querySelectorAll('input[type="checkbox"][id^="input-"]')
    ).some((checkbox) => checkbox.checked);
}, 500);

// Event listener for search input
search_todo_.addEventListener("input", (e) => {
  searchTodos(e.target.value);
});

// Delete selected event
deleteSelectedButton.addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="input-"]'
  );
  const idsToDelete = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id.split("input-")[1]);

  idsToDelete.forEach((id) => {
    const index = arr.findIndex((item) => item.key == id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  });

  // Adjust currentPage if necessary
  const query = search_todo_.value.toLowerCase().trim();
  const filteredTodos = arr.filter((item) =>
    item.text.toLowerCase().includes(query)
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (arr.length == 0) {
    header_checkbox_.hidden = true;
  }
  renderTodos(filteredTodos);
});

// Pagination events
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    const query = search_todo_.value.toLowerCase().trim();
    const filteredTodos = arr.filter((item) =>
      item.text.toLowerCase().includes(query)
    );
    renderTodos(filteredTodos);
  }
});

nextPageButton.addEventListener("click", () => {
  const query = search_todo_.value.toLowerCase().trim();
  const filteredTodos = arr.filter((item) =>
    item.text.toLowerCase().includes(query)
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    renderTodos(filteredTodos);
  }
});

selectAllButton.addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="input-"]'
  );
  const allChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = !allChecked; // Check all if any are unchecked, uncheck all if all are checked
  });
  if (selectAllButton) {
    selectAllButton.checked = !allChecked; // Reflect the new state
  }
  if (deleteSelectedButton) {
    deleteSelectedButton.hidden =
      checkboxes.length === 0 ||
      !Array.from(checkboxes).some((checkbox) => checkbox.checked);
  }
});

// Add todo event
add_todo_.addEventListener("click", () => {
  const todoText = input_todo_.value.trim();
  if (todoText) {
    const timestamp = Date.now();
    addTodo(todoText, timestamp);
    input_todo_.value = "";
    search_todo_.value = ""; // Clear search
    // Remove searchTodos("") call to avoid overriding pagination
  }
});

// Add todo
const addTodo = (todoText, timestamp) => {
  const obj = {
    key: timestamp,
    value: `<div id="div-${timestamp}"><input type="checkbox" id="input-${timestamp}">${todoText}<button hidden="true" id="save-${timestamp}" class="save">Save</button><button id="edit-${timestamp}" class="edit">Edit</button><button id="delete-${timestamp}" class="delete">Delete</button><br/></div>`,
    text: todoText,
  };
  arr.push(obj);
  // Filter todos based on search query
  const query = search_todo_.value.toLowerCase().trim();
  const filteredTodos = arr.filter((item) =>
    item.text.toLowerCase().includes(query)
  );

  // Calculate total pages and set to the last page to show the new todo
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage) || 1;
  currentPage = totalPages;
  header_checkbox_.hidden = false;

  // Render todos for the current page
  renderTodos(filteredTodos);
};
input_todo_.addEventListener("input", function input_todo(e) {
  console.log(e.data);
});

todo_holder_.addEventListener("change", function checkboxhandler(e) {
  if (e.target.type === "checkbox" && e.target.id.startsWith("input-")) {
    console.log("Clicked checkbox", e.target.checked, e.target.id);
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][id^="input-"]'
    );

    if (deleteSelectedButton) {
      deleteSelectedButton.hidden = !Array.from(checkboxes).some(
        (checkbox) => checkbox.checked
      );
    }
  }
});
todo_holder_.addEventListener("click", function clickhandler(e) {
  if (e.target.classList.value === "edit") {
    const id = e.target.id.split("edit-")[1];
    const div = e.target.parentElement;
    const text = div.childNodes[1].textContent.trim();
    const save_button = document.getElementById(`save-${id}`);
    save_button.hidden = false;
    input_todo_.value = text;
    console.log("edit", text);
    add_todo_.hidden = true;
  } else if (e.target.classList.value === "delete") {
    console.log("delete", e.target);
    const id = e.target.id.split("delete-")[1];
    console.log(id);
    const index = arr.findIndex((item) => item.key == id);
    console.log(index);
    if (index !== -1) {
      arr.splice(index, 1);
      console.log(arr.length);
      if (arr.length == 0) {
        header_checkbox_.hidden = true;
      }
    }
    todo_holder_.innerHTML = arr.map((item) => item.value).join("\n");
  } else if (e.target.classList.value === "save") {
    const id = e.target.id.split("save-")[1];
    const f = arr.find((item) => item.key == id);
    console.log(f);

    f[
      "value"
    ] = `<div id= "div-${id}"><input type="checkbox" id="input-${id}" >${input_todo_.value}  <button hidden="true" id="save-${id}" class="save" >Save</button><button id="edit-${id}" class="edit" >Edit</button> <button id="delete-${id}" class="delete">Delete</button><br/>`;
    const div = e.target.parentElement;
    div.childNodes[1].textContent = input_todo_.value;
    console.log("save", e.target);
    todo_holder_.innerHTML = arr.map((item) => item.value).join("\n");
    add_todo_.hidden = false;
  }
});
