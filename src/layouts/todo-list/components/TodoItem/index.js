import PropTypes from "prop-types";
import { Checkbox, ListItem, ListItemText } from "@mui/material";

export default function TodoItem({ todo }) {
  return (
    <ListItem key={todo.id}>
      <Checkbox />
      <ListItemText primary={todo.text} />
    </ListItem>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
};
