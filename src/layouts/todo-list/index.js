import { Card, Container, List, Typography } from "@mui/material";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("todoList");
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState("");

  // State lưu thông báo
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
    icon: "check",
  });

  // Lưu todos vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todoList", JSON.stringify(todos));
    } catch (error) {
      console.error(error);
    }
  }, [todos]);

  // Hiển thị thông báo
  const showSnackbar = (message, color = "success", icon = "check") => {
    setSnackbar({
      open: true,
      message,
      color,
      icon,
    });
  };

  // Đóng thông báo
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Đóng thông báo sau 3 giây
  useEffect(() => {
    let timer;
    if (snackbar.open) {
      timer = setTimeout(() => {
        closeSnackbar();
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [snackbar.open]);

  // Thêm todo
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
      showSnackbar("Todo đã được thêm thành công!", "success", "check_circle");
    }
  };

  // Chỉnh sửa todo
  const editTodo = (id, newText) => {
    if (newText.trim()) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText.trim() } : todo)));
      showSnackbar("Todo đã được cập nhật thành công!", "info", "edit");
    }
  };

  // Xóa todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showSnackbar("Todo đã được xóa thành công!", "error", "delete");
  };

  // Chuyển trạng thái hoàn thành
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
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
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={editTodo}
                  onDelete={deleteTodo}
                  onToggleComplete={toggleComplete}
                />
              ))}
            </List>
          ) : (
            <Typography variant="body1" mt={4} color="text.secondary" textAlign="center">
              No todos found. Add a todo to get started.
            </Typography>
          )}
        </Card>
      </Container>

      <MDSnackbar
        color={snackbar.color}
        icon={snackbar.icon}
        title="Thông báo"
        content={snackbar.message}
        open={snackbar.open}
        close={closeSnackbar}
      />
    </DashboardLayout>
  );
}
