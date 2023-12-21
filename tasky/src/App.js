import logo from './logo.svg';
import './App.css';
import Task from './components/Task';
import React, { useState, useEffect } from 'react';
import AddTaskForm from './components/Form';
import { v4 as uuidv4 } from 'uuid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { getTasks, addTask, deleteTask, updateTask } from "./api/tasky-api";

function App() {

  const [taskState, setTaskState] = useState({ tasks: [] });

  useEffect(() => {
    getTasks().then(tasks => {
      setTaskState({ tasks: tasks });
    });
  }, []);

  const doneHandler = (taskIndex) => {
    const tasks = [...taskState.tasks];
    tasks[taskIndex].done = !tasks[taskIndex].done;
    updateTask(tasks[taskIndex]);
    setTaskState({ tasks });
  }

  const deleteHandler = (taskIndex) => {
    const tasks = [...taskState.tasks];
    const id = tasks[taskIndex]._id;
    tasks.splice(taskIndex, 1);
    deleteTask(id);
    setTaskState({ tasks });
  }

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Low"
  });


  const formChangeHandler = (event) => {
    let form = { ...formState };
    console.log(event.target.name)
    switch (event.target.name) {
      case "title":
        form.title = event.target.value;
        break;
      case "description":
        form.description = event.target.value;
        break;
      case "deadline":
        form.deadline = event.target.value;
        break;
      case "priority":
        form.priority = event.target.value;
        break;
      default:
        form = formState;
    }
    setFormState(form);
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const tasks = taskState.tasks ? [...taskState.tasks] : [];
    const form = { ...formState };
    const newTask = await addTask(form);
    tasks.push(newTask);
    setTaskState({ tasks });
  }

  return (
    <div className="container">
      {/* App Header */}
      {/* Task Card Grid */}
      <Container maxWidth="md" component="main">
        {taskState.tasks ? (
          <Grid container spacing={5} alignItems="flex-top" justifyContent="center">
            {taskState.tasks.map((task, index) => (
              <Task
                title={task.title}
                description={task.description}
                deadline={task.deadline}
                done={task.done}
                priority={task.priority}
                key={task._id}
                markDone={() => doneHandler(index)}
                deleteTask={() => deleteHandler(index)}
              />
            ))}
          </Grid>
        ) : (
          <p>No Tasks to do - have a cup of tea and a biscuit!</p> // You can render a placeholder or a message if the array is empty
        )}
      </Container>
      {/* End Footer */}
    </div>
  );
}

export default App;