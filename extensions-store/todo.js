// Extension To-Do List pour Libernav
(function(){
  if (typeof document !== 'undefined') {
    // Nettoyage si déjà présent
    const oldTodo = document.getElementById('libernav-todo');
    if (oldTodo) oldTodo.remove();

    // Fonction de suppression à chaud
    window.removeLibernavTodo = function() {
      const t = document.getElementById('libernav-todo');
      if (t) t.remove();
    };

    // Création du composant
    let todo = document.createElement('div');
    todo.id = 'libernav-todo';
    todo.style.position = 'fixed';
    todo.style.bottom = '150px';
    todo.style.right = '24px';
    todo.style.width = '220px';
    todo.style.background = '#222';
    todo.style.color = '#fff';
    todo.style.border = '1px solid #ff5252';
    todo.style.borderRadius = '8px';
    todo.style.padding = '10px';
    todo.style.zIndex = 9999;
    todo.innerHTML = `
      <b>To-Do Libernav</b>
      <ul id="libernav-todo-list" style="padding-left:18px;margin:8px 0;"></ul>
      <input id="libernav-todo-input" type="text" placeholder="Nouvelle tâche..." style="width:70%;border-radius:4px;border:none;padding:3px;">
      <button id="libernav-todo-add" style="float:right;">+</button>
      <div style="clear:both"></div>
    `;
    document.body.appendChild(todo);

    // Gestion des tâches
    const list = todo.querySelector('#libernav-todo-list');
    const input = todo.querySelector('#libernav-todo-input');
    const addBtn = todo.querySelector('#libernav-todo-add');
    let tasks = JSON.parse(localStorage.getItem('libernav-todo') || '[]');
    function render() {
      list.innerHTML = '';
      tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.textContent = t;
        li.style.cursor = 'pointer';
        li.onclick = () => { tasks.splice(i,1); save(); render(); };
        list.appendChild(li);
      });
    }
    function save() {
      localStorage.setItem('libernav-todo', JSON.stringify(tasks));
    }
    addBtn.onclick = () => {
      if (input.value.trim()) {
        tasks.push(input.value.trim());
        input.value = '';
        save();
        render();
      }
    };
    input.onkeydown = e => { if (e.key === 'Enter') addBtn.onclick(); };
    render();
    console.log('Extension To-Do activée !');
  }
})();
