import { Card, Checkbox, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card sx={{ p: 4, minHeight: "500px" }}>
          <TodoInput inputValue={inputValue} setInputValue={setInputValue} onAddTodo={addTodo} />
          {todos.length > 0 ? (
            <List>
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </List>
          ) : (
            <Typography variant="body1" mt={4} color="text.secondary" textAlign="center">
              No todos found. Add a todo to get started.
            </Typography>
          )}
        </Card>
      </Container>
    </DashboardLayout>
  );
}
