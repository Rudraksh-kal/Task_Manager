const express = require("express")
const Task = require("../models/Task")
const auth = require("../middleware/authMiddleware")

const router = express.Router()

// GET tasks (only logged-in user's tasks)
router.get("/", auth, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId })
    res.json(tasks)
})

// ADD task
router.post("/", auth, async (req, res) => {
    const { title, description, status } = req.body

    const task = await Task.create({
        title,
        description,
        status,
        userId: req.userId
    })

    res.json(task)
})

// UPDATE task
router.put("/:id", auth, async (req, res) => {
    await Task.updateOne(
        { _id: req.params.id, userId: req.userId },
        req.body
    )

    res.json({ message: "Task updated" })
})

// DELETE task
router.delete("/:id", auth, async (req, res) => {
    await Task.deleteOne({
        _id: req.params.id,
        userId: req.userId
    })

    res.json({ message: "Task deleted" })
})

module.exports = router
