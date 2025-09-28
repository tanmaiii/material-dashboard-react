import {
  Box,
  Checkbox,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function TodoItem({ todo, onEdit, onDelete, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      setEditText(todo.text);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <ListItem
      key={todo.id}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box
        component="section"
        mt={2}
        sx={{
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Checkbox checked={todo.completed || false} onChange={() => onToggleComplete(todo.id)} />

        {isEditing ? (
          <TextField
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            size="medium"
            sx={{ mx: 2 }}
          />
        ) : (
          <ListItemText
            primary={todo.text}
            sx={{
              flexGrow: 1,
              mx: 2,
              textDecoration: todo.completed ? "line-through" : "none",
              opacity: todo.completed ? 0.6 : 1,
              "& .MuiTypography-root": {
                textDecoration: todo.completed ? "line-through" : "none",
              },
            }}
          />
        )}

        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <>
              <IconButton size="small" color="info" onClick={handleEdit} title="Lưu">
                <Icon fontSize="small">check</Icon>
              </IconButton>
              <IconButton size="small" color="default" onClick={handleCancel} title="Hủy">
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </>
          ) : (
            <>
              <IconButton size="small" color="info" onClick={handleEdit} title="Chỉnh sửa">
                <Icon fontSize="small">edit</Icon>
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(todo.id)} title="Xóa">
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </>
          )}
        </Stack>
      </Box>
    </ListItem>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
};
