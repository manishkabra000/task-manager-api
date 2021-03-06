const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["decription", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid operation" });
  }
  try {
    const tasks = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!tasks) {
      return res.status(404).send();
    }
    updates.forEach((update) => (tasks[update] = req.body[update]));
    await tasks.save();
    // const tasks = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    res.send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
