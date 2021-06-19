require("../src/db/mongoose");
const Task = require("../src/models/task");

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};
/*
Task.findByIdAndDelete("60c8cbd89c3e0c517428cb5a")
  .then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });*/

deleteTaskAndCount("60c8cd40a149240708623b01")
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log(err);
  });
