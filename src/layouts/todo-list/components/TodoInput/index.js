import { Icon, Stack, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";

export default function TodoInput({ inputValue, setInputValue, onAddTodo }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onAddTodo();
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        fullWidth
        label="Add Todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <MDButton variant="gradient" color="dark" onClick={onAddTodo}>
        <Icon sx={{ fontWeight: "bold" }}>add</Icon>Add
      </MDButton>
    </Stack>
  );
}

TodoInput.propTypes = {
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  onAddTodo: PropTypes.func.isRequired,
};
