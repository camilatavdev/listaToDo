const tarefaEntrada = document.querySelector(".task-input input"),
    filtros = document.querySelectorAll(".filters span"),
    limparTudo = document.querySelector(".clear-btn"),
    areaTarefa = document.querySelector(".task-box");

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

filtros.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        mostrarTudo(btn.id);
    });
});

function mostrarTudo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Editar</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Deletar</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }

    areaTarefa.innerHTML = liTag || `<span>Você não tem nenhuma tarefa ainda</span>`;
    let checarTarefa = areaTarefa.querySelectorAll(".task");
    !checarTarefa.length ? limparTudo.classList.remove("active") : limparTudo.classList.add("active");
    areaTarefa.offsetHeight >= 300 ? areaTarefa.classList.add("overflow") : areaTarefa.classList.remove("overflow");

}
mostrarTudo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    tarefaEntrada.value = textName;
    tarefaEntrada.focus();
    tarefaEntrada.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    mostrarTudo(filter);
}

limparTudo.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    mostrarTudo();
});

tarefaEntrada.addEventListener("keyup", e => {
    let userTask = tarefaEntrada.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        tarefaEntrada.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        mostrarTudo(document.querySelector("span.active").id);
    }
});