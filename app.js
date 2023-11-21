document.addEventListener("DOMContentLoaded", () => {
    loadLists();
});

function generateList() {
    const gameName = document.getElementById("gameName").value;
    if (gameName) {
        const listsContainer = document.getElementById("lists");
        const listId = gameName.toLowerCase().replace(/\s/g, '-');
        const list = document.createElement("div");
        const timestamp = new Date().toLocaleString(); // Get the current timestamp

        list.innerHTML = `<h2>${gameName} - ${timestamp}</h2>
                          <ol id="${listId}-list"></ol>
                          <button onclick="removeList('${listId}')">Remove List</button>`;
        listsContainer.appendChild(list);
        createTasksList(gameName);
        saveList(gameName, timestamp);
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
        checkbox.addEventListener("change", () => updateTaskStatus(gameName, index, checkbox));

        const label = document.createElement("label");
        label.htmlFor = `${gameName.replace(/\s/g, '-')}-task-${index}`;
        label.appendChild(document.createTextNode(task));

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listContainer.appendChild(listItem);
    });
}

function updateTaskStatus(gameName, index, checkbox) {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const tasks = lists.find(item => item.gameName === gameName).tasks;
    tasks[index].completed = checkbox.checked;

    // Add timestamp logic
    if (checkbox.checked) {
        tasks[index].timestamp = new Date().toLocaleString();
    } else {
        tasks[index].timestamp = null; // Reset timestamp if unchecked
    }

    localStorage.setItem("lists", JSON.stringify(lists));
}

function saveList(gameName, timestamp) {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const newGame = {
        gameName: gameName,
        timestamp: timestamp,
        tasks: Array(4).fill({ completed: false, timestamp: null })
    };
    lists.push(newGame);
    localStorage.setItem("lists", JSON.stringify(lists));
}

function loadLists() {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const listsContainer = document.getElementById("lists");
    lists.forEach(game => {
        const listId = game.gameName.toLowerCase().replace(/\s/g, '-');
        const list = document.createElement("div");
        list.innerHTML = `<h2>${game.gameName} - ${game.timestamp}</h2>
                          <ol id="${listId}-list"></ol>
                          <button onclick="removeList('${listId}')">Remove List</button>`;
        listsContainer.appendChild(list);
        createTasksList(game.gameName);
        game.tasks.forEach((task, index) => {
            const checkbox = document.getElementById(`${game.gameName.replace(/\s/g, '-')}-task-${index}`);
            if (checkbox) {
                checkbox.checked = task.completed;
            }
        });
    });
}

function removeList(listId) {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    const updatedLists = lists.filter(item => item.gameName.toLowerCase().replace(/\s/g, '-') !== listId);
    localStorage.setItem("lists", JSON.stringify(updatedLists));
    document.getElementById("lists").innerHTML = ""; // Clear existing lists
    loadLists(); // Reload the lists after removal
}
function removeAllLists() {
    localStorage.removeItem("lists");
    
    // Clear existing lists by removing child elements
    const listsContainer = document.getElementById("lists");
    while (listsContainer.firstChild) {
        listsContainer.removeChild(listsContainer.firstChild);
    }
}
