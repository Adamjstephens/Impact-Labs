document.addEventListener("DOMContentLoaded", () => {
    loadLists();
});

function generateList() {
    const gameName = document.getElementById("gameName").value;
    if (gameName) {
        const listContainer = document.getElementById("lists");
        const list = document.createElement("div");
        list.innerHTML = `<h2>${gameName}</h2>
                          <ol id="${gameName.toLowerCase().replace(/\s/g, '-')}-list"></ol>`;
        listContainer.appendChild(list);
        createTasksList(gameName);
        saveList(gameName);
    } else {
        alert("Please enter a game name.");
    }
}

function createTasksList(gameName) {
    const listContainer = document.getElementById(`${gameName.toLowerCase().replace(/\s/g, '-')}-list`);
    const tasks = ['Get key', 'Playtest game', 'Write Oculus Store Review', 'Fill out necessary forms'];

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${gameName.replace(/\s/g, '-')}-task-${index}`;
        checkbox.addEventListener("change", () => updateTaskStatus(gameName, index, checkbox.checked));

        const label = document.createElement("label");
        label.htmlFor = `${gameName.replace(/\s/g, '-')}-task-${index}`;
        label.appendChild(document.createTextNode(task));

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listContainer.appendChild(listItem);
    });
}

function updateTaskStatus(gameName, index, isChecked) {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const tasks = lists.find(item => item.gameName === gameName).tasks;
    tasks[index].completed = isChecked;
    localStorage.setItem("lists", JSON.stringify(lists));
}

function saveList(gameName) {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const newGame = {
        gameName: gameName,
        tasks: Array(4).fill({ completed: false })
    };
    lists.push(newGame);
    localStorage.setItem("lists", JSON.stringify(lists));
}

function loadLists() {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const listContainer = document.getElementById("lists");
    lists.forEach(game => {
        const list = document.createElement("div");
        list.innerHTML = `<h2>${game.gameName}</h2>
                          <ol id="${game.gameName.toLowerCase().replace(/\s/g, '-')}-list"></ol>`;
        listContainer.appendChild(list);
        createTasksList(game.gameName);
        game.tasks.forEach((task, index) => {
            const checkbox = document.getElementById(`${game.gameName.replace(/\s/g, '-')}-task-${index}`);
            if (checkbox) {
                checkbox.checked = task.completed;
            }
        });
    });
}

function removeAllLists() {
    const confirmRemove = window.confirm("Are you sure you want to remove all lists?");
    if (confirmRemove) {
        localStorage.removeItem("lists");
        document.getElementById("lists").innerHTML = "";
    }
}
