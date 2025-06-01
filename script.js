const input = document.querySelector('#todo-input');
const addBtn = document.querySelector('#submit');
const list = document.querySelector('.todo-lists');

addBtn.addEventListener('click', () => {
  const task = input.value.trim();
  if (!task) {
    alert("Please enter a task.");
    return;
  }

  input.value = "";

  const item = document.createElement('div');
  item.classList.add('todo-item');

  const textBox = document.createElement('input');
  textBox.type = 'text';
  textBox.value = task;
  textBox.setAttribute('readonly', 'readonly');
  textBox.classList.add('text');

  const btns = document.createElement('div');
  btns.classList.add('action-items');

  const doneBtn = document.createElement('i');
  doneBtn.classList.add('fa-solid', 'fa-check', 'done-btn');

  const editBtn = document.createElement('i');
  editBtn.classList.add('fa-solid', 'fa-pen-to-square', 'edit-btn');

  const delBtn = document.createElement('i');
  delBtn.classList.add('fa-solid', 'fa-trash', 'del-btn');

  btns.appendChild(doneBtn);
  btns.appendChild(editBtn);
  btns.appendChild(delBtn);

  item.appendChild(textBox);
  item.appendChild(btns);
  list.appendChild(item);

  doneBtn.addEventListener('click', () => {
    if (textBox.classList.contains('done')) {
      textBox.classList.remove('done');
      list.insertBefore(item, list.firstChild); 
      doneBtn.classList.replace('fa-rotate-left', 'fa-check');
    } else {
      textBox.classList.add('done');
      list.appendChild(item); 
      doneBtn.classList.replace('fa-check', 'fa-rotate-left');
    }
  });
  editBtn.addEventListener('click', () => {
    if (editBtn.classList.contains('edit-btn')) {
      editBtn.classList.remove('edit-btn', 'fa-pen-to-square');
      editBtn.classList.add('fa-x', 'save-btn');
      textBox.removeAttribute('readonly');
      textBox.focus();
    } else {
      editBtn.classList.remove('save-btn', 'fa-x');
      editBtn.classList.add('edit-btn', 'fa-pen-to-square');
      textBox.setAttribute('readonly', 'readonly');
    }
  });

  delBtn.addEventListener('click', () => {
    list.removeChild(item);
  });
});
