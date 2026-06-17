const todoBox = document.querySelector("section");
const inp = document.querySelector("input");
const addTask = document.querySelector("#addbtn");
const enterTaskModal = document.querySelector(".et");
const errorMessage = document.querySelector("#error-message");
const okBtn = document.querySelector(".ok-btn");
const delConfirmModal = document.querySelector(".dc");
const yesDelBtn = document.querySelector(".yes-del");
const noKeepBtn = document.querySelector(".no-keep");
const arrow = document.querySelector(".arrow");
const customDropdown = document.querySelector("#custom-dropdown");
const dropdownList = document.querySelector(".dropdown-list");
const selectedSpan = customDropdown.querySelector("span");
const listItems = document.querySelectorAll(".dropdown-list li");

let taskToDelete = null;

customDropdown.addEventListener("click", (e) => {
    customDropdown.classList.toggle("open");
    e.stopPropagation();
});

document.addEventListener("click", () => {
    customDropdown.classList.remove("open");
});

listItems.forEach((item) => {
    item.addEventListener("click", () => {
        const itemContent = item.innerHTML;
        const value = item.getAttribute("data-value");

        selectedSpan.innerHTML = itemContent;
        customDropdown.setAttribute("data-value", value);
        customDropdown.classList.remove("open");
        customDropdown.classList.remove("dropdown-header-center");
        customDropdown.style.fontSize = "0.9rem";
    });
});

function resetDropdown() {
    customDropdown.setAttribute("data-value", "");
    selectedSpan.innerHTML = "Select Category";
    customDropdown.classList.add("dropdown-header-center");
    customDropdown.style.fontSize = "";
}

function toggleArrow() {
    const totalTasks = todoBox.querySelectorAll(".task-bar").length;
    if (totalTasks === 1) {
        arrow.style.display = "flex";
    } else {
        arrow.style.display = "none";
    }
}

addTask.addEventListener("click", () => {
    let task = inp.value.trim();
    let categoryValue = customDropdown.getAttribute("data-value");
    let categoryHTML = selectedSpan.innerHTML;

    // Task Input check
    if (task === "") {
        errorMessage.innerText = "Please enter a Task!";
        enterTaskModal.style.display = "flex";
        inp.value = "";
        return;
    }

    // Dropdown selection check
    if (!categoryValue || categoryValue === "") {
        errorMessage.innerText = "Please select a Category!";
        enterTaskModal.style.display = "flex";
        return;
    }

    const taskBar = document.createElement("div");
    taskBar.classList.add("task-bar");

    taskBar.innerHTML = `
        <div>
            <div class="checkbox">
                <i class="ri-check-line tick"></i>
            </div>
            <div class="task-context">${task}</div>
            <div class="task-category-badge">${categoryHTML}</div>
            <i class="ri-settings-3-fill setting"></i>
        </div>
        <div class="btns hidden">
            <button class="edit">
                <i class="ri-pencil-fill"></i>
                Edit
            </button>               
            <button class="undo">
                <i class="ri-arrow-go-back-line"></i>
                Undone
            </button>
            <button class="del">
                <i class="ri-delete-bin-fill"></i>
                Delete
            </button>
            <button class="off">
                <i class="ri-close-circle-line"></i>
                Close
            </button>
        </div>
        <div class="text-divider"></div>
    `;

    const checkBox = taskBar.querySelector(".checkbox");
    const tick = taskBar.querySelector(".tick");
    const setting = taskBar.querySelector(".setting");
    const btns = taskBar.querySelector(".btns");
    const editBtn = taskBar.querySelector(".edit");
    const undoBtn = taskBar.querySelector(".undo");
    const delBtn = taskBar.querySelector(".del");
    const offBtn = taskBar.querySelector(".off");
    const taskContext = taskBar.querySelector(".task-context");

    function updateButtons() {
        if (taskContext.classList.contains("completed")) {
            undoBtn.style.display = "flex";
            editBtn.style.display = "none";
        } else {
            undoBtn.style.display = "none";
            editBtn.style.display = "flex";
        }
    }

    // Checkbox click logic
    checkBox.addEventListener("click", () => {
        checkBox.style.border = "0.55rem solid #a8dadc";
        checkBox.style.transform = "scale(2)";
        tick.style.display = "flex";
        arrow.style.display = "none";
        taskContext.classList.add("completed");
        updateButtons();
    });

    // Settings click logic
    setting.addEventListener("click", () => {
        btns.classList.toggle("hidden");
        delBtn.style.display = "flex";
        arrow.style.display = "none";
        setting.classList.toggle("open");
        updateButtons();
    });

    // Undo button logic
    undoBtn.addEventListener("click", () => {
        checkBox.style.border = "3px solid #a8dadc";
        checkBox.style.transform = "scale(1)";
        tick.style.display = "none";
        taskContext.classList.remove("completed");
        updateButtons();
    });

    // Edit button logic
    editBtn.addEventListener("click", () => {
        if (taskContext.contentEditable !== "true") {
            taskContext.contentEditable = true;
            taskContext.focus();
            editBtn.style.backgroundColor = "#00FF62";
            editBtn.style.color = "#011627";
            editBtn.innerHTML = `<i class="ri-check-double-line"></i> Confirm Edit`;
        } else {
            saveTaskState();
        }
    });

    function saveTaskState() {
        taskContext.contentEditable = false;
        editBtn.style.backgroundColor = "#fb8500";
        editBtn.style.color = "#f1faee";
        editBtn.innerHTML = `<i class="ri-pencil-fill"></i> Edit`;

        if (taskContext.innerText.trim() === "") {
            taskContext.innerText = "Untitled Task";
        }
    }

    // Custom Delete Alert Logic
    delBtn.addEventListener("click", () => {
        delConfirmModal.style.display = "flex";
        taskToDelete = taskBar;
    });

    // Off button logic
    offBtn.addEventListener("click", () => {
        setting.click();
    });

    todoBox.appendChild(taskBar);

    inp.value = "";
    resetDropdown();
    toggleArrow();
    document.querySelector("form").reset;
});

okBtn.addEventListener("click", () => {
    enterTaskModal.style.display = "none";
});

yesDelBtn.addEventListener("click", () => {
    if (taskToDelete) {
        taskToDelete.remove();
        taskToDelete = null;
    }
    delConfirmModal.style.display = "none";
});

noKeepBtn.addEventListener("click", () => {
    taskToDelete = null;
    delConfirmModal.style.display = "none";
});