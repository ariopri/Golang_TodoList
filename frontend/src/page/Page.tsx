import { useState, useEffect } from "react";
import { Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { FC } from "react";
import axios from "axios";

interface Todo {
  id: number;
  task: string;
}

const Title: FC<{ judul: string }> = ({ judul }) => {
  return (
    <Typography variant="h4" sx={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '5rem',
    }}>
      {judul}
    </Typography>
  )
}

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get("http://localhost:8080/api/todos");
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const response = await axios.post("http://localhost:8080/api/todos", { task: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    }
  }

  const handleDeleteTodo = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/todos/${id}`);
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  }

  return (
    <>
      <Title judul="Todo List" />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <TextField
          label="Add Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          variant="outlined"
          sx={{ marginRight: '1rem' }}
        />
        <Button variant="contained" onClick={handleAddTodo}>Add</Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <List sx={{ width: '50%' }}>
          {todos.map(todo => (
            <ListItem key={todo.id} secondaryAction={<Button onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>}>
              <ListItemText primary={todo.task} />
            </ListItem>
          ))}
        </List>
      </div>
    </>
  )
}

export default Page;
