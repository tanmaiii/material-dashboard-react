import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

export default function SearchUser({ onSearch, searchValue = "" }) {
  const handleSearchChange = (event) => {
    const value = event.target.value;
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <TextField
      fullWidth
      placeholder="Tìm kiếm theo tên hoặc email..."
      value={searchValue}
      onChange={handleSearchChange}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{
        maxWidth: 400,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "background.paper",
        },
      }}
    />
  );
}

SearchUser.propTypes = {
  onSearch: PropTypes.func,
  searchValue: PropTypes.string,
};
