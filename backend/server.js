const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")

const app = express()

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

// test route
app.get("/", (req, res) => {
    res.json({ message: "Backend working properly" })
})

// DB + server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected")
        app.listen(4000, () => {
            console.log("Server running on port 4000")
        })
    })
    .catch(err => console.error(err))
