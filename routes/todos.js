const express = require("express");
const { 
  getTasks, 
  getTaskById, 
  addTask,
  deleteTask,
  updateTask,
  toggleTask
} = require("../controllers/todos");
const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", addTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.patch("/:id", toggleTask);

module.exports = router;
