/***********************
 * BACKEND CONFIG
 ***********************/
const API = "http://localhost:4000/api"

function setToken(token) {
    localStorage.setItem("token", token)
}

function getToken() {
    return localStorage.getItem("token")
}

function clearToken() {
    localStorage.removeItem("token")
}

/***********************
 * ELEMENTS
 ***********************/
const themeToggle = document.getElementById("themeToggle")
const form = document.getElementById("taskForm")
const taskSection = document.querySelectorAll("section")[1]
const filterButtons = document.querySelectorAll(".filter-btn")

const editModal = document.getElementById("editModal")
const editTitle = document.getElementById("editTitle")
const editDescription = document.getElementById("editDescription")
const editCancel = editModal.querySelector(".modal-cancel")
const editSave = editModal.querySelector(".modal-save")

const authModal = document.getElementById("authModal")
const authArea = document.getElementById("authArea")
const switchAuth = document.getElementById("switchAuth")
const authTitle = document.getElementById("authTitle")
const switchText = document.getElementById("switchText")
const authCancel = authModal.querySelector(".modal-cancel")
const authSave = authModal.querySelector(".modal-save")

const logoutModal = document.getElementById("logoutModal")
const logoutCancel = document.getElementById("logoutCancel")
const logoutConfirm = document.getElementById("logoutConfirm")

const loginRequiredModal = document.getElementById("loginRequiredModal")
const loginNowBtn = document.getElementById("loginNowBtn")

/***********************
 * STATE
 ***********************/
let tasks = []
let user = JSON.parse(localStorage.getItem("user"))
let currentFilter = "all"
let isSignup = false

/***********************
 * THEME
 ***********************/
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark")
})

/***********************
 * FILTERS
 ***********************/
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
        currentFilter = btn.dataset.filter
        renderTasks()
    })
})

/***********************
 * AUTH UI
 ***********************/
function renderAuth() {
    authArea.innerHTML = ""

    if (user && getToken()) {
        const avatar = document.createElement("div")
        avatar.className = "user-avatar"
        avatar.textContent = user.email[0].toUpperCase()
        avatar.onclick = () => logoutModal.classList.add("show")
        authArea.appendChild(avatar)
    } else {
        const btn = document.createElement("button")
        btn.className = "login-btn"
        btn.textContent = "Sign In"
        btn.onclick = () => authModal.classList.add("show")
        authArea.appendChild(btn)
    }
}

switchAuth.addEventListener("click", () => {
    isSignup = !isSignup
    authTitle.textContent = isSignup ? "Sign Up" : "Sign In"
    switchText.textContent = isSignup
        ? "Already have an account?"
        : "Don’t have an account?"
    switchAuth.textContent = isSignup ? "Sign In" : "Sign Up"
})

authCancel.addEventListener("click", () => {
    authModal.classList.remove("show")
})

authSave.addEventListener("click", async () => {
    const email = document.getElementById("authEmail").value
    const password = document.getElementById("authPassword").value
    if (!email || !password) return

    const endpoint = isSignup ? "/auth/signup" : "/auth/login"

    try {
        const res = await fetch(API + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        if (!res.ok) {
            alert(data.error || "Authentication failed")
            return
        }

        if (data.token) {
            setToken(data.token)
            user = { email }
            localStorage.setItem("user", JSON.stringify(user))
        }

        authModal.classList.remove("show")
        renderAuth()
        loadTasks()

    } catch (err) {
        console.error(err)
        alert("Server error")
    }
})

logoutCancel.addEventListener("click", () => {
    logoutModal.classList.remove("show")
})

logoutConfirm.addEventListener("click", () => {
    localStorage.removeItem("user")
    clearToken()
    user = null
    tasks = []
    logoutModal.classList.remove("show")
    renderAuth()
    renderTasks()
})

/***********************
 * LOGIN REQUIRED MODAL
 ***********************/
loginNowBtn.addEventListener("click", () => {
    loginRequiredModal.classList.remove("show")
    authModal.classList.add("show")
})

/***********************
 * TASK API
 ***********************/
async function loadTasks() {
    if (!getToken()) return

    try {
        const res = await fetch(API + "/tasks", {
            headers: {
                Authorization: "Bearer " + getToken()
            }
        })

        tasks = await res.json()
        renderTasks()
    } catch (err) {
        console.error(err)
    }
}

async function addTask(task) {
    const res = await fetch(API + "/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getToken()
        },
        body: JSON.stringify(task)
    })

    const newTask = await res.json()
    tasks.push(newTask)
    renderTasks()
}
// Close modal when clicking outside
document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", e => {
        if (e.target === backdrop) {
            backdrop.classList.remove("show")
        }
    })
})


/***********************
 * TASK UI
 ***********************/
function renderTasks() {
    taskSection.querySelectorAll(".task-row, .no-task").forEach(e => e.remove())

    const filtered = tasks.filter(
        t => currentFilter === "all" || t.status === currentFilter
    )

    if (filtered.length === 0) {
        const p = document.createElement("p")
        p.className = "no-task"
        p.textContent = "No tasks yet"
        taskSection.appendChild(p)
        return
    }

    filtered.forEach(t => {
        const row = document.createElement("div")
        row.className = "task-row"

        row.innerHTML = `
            <div class="task-main">
                <div class="task-text">
                    <div class="task-title">${t.title}</div>
                    <div class="task-desc">${t.description}</div>
                </div>
                <div class="task-right">
                    <button class="status-badge ${t.status}">
                        ${t.status}
                    </button>
                </div>
            </div>
        `

        taskSection.appendChild(row)
    })
}

/***********************
 * ADD TASK
 ***********************/
form.addEventListener("submit", e => {
    e.preventDefault()

    if (!getToken()) {
        loginRequiredModal.classList.add("show")
        return
    }

    const title = form.querySelector("input").value
    const description = form.querySelector("textarea").value
    const status = form.querySelector("select").value

    addTask({ title, description, status })
    form.reset()
})

/***********************
 * INIT
 ***********************/
renderAuth()

if (getToken()) {
    loadTasks()
} else {
    renderTasks()
}
