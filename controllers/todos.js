const HTTP_STATUSES = require("../constants");

let todolist = [
  { id: 1, category: "hobby", title: "Task 1", completed: false },
  { id: 2, category: "job", title: "Task 2", completed: false },
  { id: 3, category: "pet", title: "Task 3", completed: true },
];

const getTasks = (req, res) => {
  let foundTasks = [...todolist];

  //поиск по названию
  if (req.query.title) {
    foundTasks = foundTasks.filter((t) =>
      t.title.toLowerCase().includes(req.query.title.toLowerCase())
    );
  }

  //поиск по категории
  if (req.query.category) {
    foundTasks = foundTasks.filter((t) =>
      t.category.toLowerCase().includes(req.query.category.toLowerCase())
    );
  }

  //поиск по статусу выполнения
  if (req.query.completed !== undefined) {
    foundTasks = foundTasks.filter(
      (t) => t.completed.toString() === req.query.completed
    );
  }

  //проверка на наличие тасок после фильтраций
  if (req.query && foundTasks.length > 0) {
    res.status(HTTP_STATUSES.OK_200).json(foundTasks);
  } else {
    res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ message: "Tasks not found" });
  }

  //если нет фильтра и есть таски, возвращаем все таски
  if (!req.query && todolist.length > 0) {
    try {
      res.status(HTTP_STATUSES.OK_200).json(todolist);
    } catch (error) {
      res
        .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
        .json({ message: "Something went wrong!", error: error });
    }
  }

  if (!req.query && todolist.length <= 0) {
    res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ message: "No tasks found in the todolist" });
  }
};

const getTaskById = (req, res) => {
  const { id } = req.params;

  try {
    const task = todolist.find((t) => t.id === +id);

    if (!task) {
      return res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json({ message: "Task not found" });
    }

    res.status(HTTP_STATUSES.OK_200).json(task);
  } catch (error) {
    res
      .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const newTask = req.body;
    const { id, title, category } = newTask;

    if (!title || !category) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json({ message: "Все поля обязательны для заполнения" });
    }

    const foundId = todolist.find((t) => t.id === id);
    if (foundId) {
      return res
        .status(HTTP_STATUSES.CONFLICT_409)
        .json({ message: "Задача с таким идентификатором уже существует" });
    }

    todolist.push(newTask);

    res.status(HTTP_STATUSES.CREATED_201).json(newTask);
  } catch (error) {
    res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json({
      message: "Произошла ошибка при добавлении задачи",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  const newTask = req.body;
  const { title, category } = newTask;

  if (!title || !category) {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ message: "Все поля обязательны для заполнения" });
  }

  const foundTask = todolist.find((t) => t.id === +id);

  if (!foundTask) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ message: "Задача не найдена" });
  }

  const updatedTask = { ...foundTask, ...req.body };
  const index = todolist.indexOf(foundTask);
  todolist[index] = updatedTask;
  res.status(HTTP_STATUSES.OK_200).json(updatedTask);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  const foundTask = todolist.find((t) => t.id === +id);

  if (!foundTask) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ message: "Задача не найдена" });
  }

  todolist = todolist.filter((t) => t.id !== +id);
  res
    .status(HTTP_STATUSES.OK_200)
    .json({ message: "Задача успешно удалена", todolist: todolist });
};

const toggleTask = async (req, res) => {
  const { id } = req.params;

  const foundTask = todolist.find((t) => t.id === +id);

  if (!foundTask) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ message: "Задача не найдена" });
  }

  const updatedTask = { ...foundTask, completed: !foundTask.completed };
  const index = todolist.indexOf(foundTask);
  todolist[index] = updatedTask;
  res.status(HTTP_STATUSES.OK_200).json(updatedTask);
};


module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
  toggleTask
};
