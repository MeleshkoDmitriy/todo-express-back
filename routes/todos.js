const express = require("express");
const { 
  getTasks, 
  getTaskById, 
  addTask,
  deleteTask,
  updateTask
} = require("../controllers/todos");
const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", addTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);

module.exports = router;
