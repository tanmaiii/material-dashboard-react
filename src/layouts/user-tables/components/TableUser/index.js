import { Check, Close } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { useState } from "react";

export default function TableUser({
  columns,
  rows,
  searchValue,
  handleSort,
  sortBy,
  sortOrder,
  onUpdateUser,
}) {
  // State để quản lý inline editing
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, column }
  const [editValue, setEditValue] = useState("");
  const [validationError, setValidationError] = useState("");

  // Validation functions
  const validateField = (column, value) => {
    const trimmedValue = value.trim();
    switch (column) {
      case "hoTen":
        if (!trimmedValue) {
          return "Họ tên không được để trống";
        }
        if (trimmedValue.length < 2) {
          return "Họ tên phải có ít nhất 2 ký tự";
        }
        break;
      case "email":
        if (!trimmedValue) {
          return "Email không được để trống";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) {
          return "Định dạng email không hợp lệ";
        }
        break;
      case "vaiTro":
        if (!["Admin", "User", "Guest"].includes(trimmedValue)) {
          return "Vai trò phải là Admin, User hoặc Guest";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const startEdit = (rowIndex, column, currentValue) => {
    setEditingCell({ rowIndex, column });
    setEditValue(currentValue);
    setValidationError("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
    setValidationError("");
  };

  const saveEdit = (rowIndex, column) => {
    const trimmedValue = editValue.trim();
    const error = validateField(column, trimmedValue);

    if (error) {
      setValidationError(error);
      return;
    }

    if (onUpdateUser && trimmedValue !== "") {
      const rowData = rows[rowIndex];
      const updatedUser = {
        ...rowData.originalData,
        [column]: trimmedValue,
      };
      onUpdateUser(updatedUser);
    }
    setEditingCell(null);
    setEditValue("");
    setValidationError("");
  };

  const handleKeyPress = (event, rowIndex, column) => {
    if (event.key === "Enter") {
      saveEdit(rowIndex, column);
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  };

  const renderEditableCell = (rowIndex, column, value, originalValue) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.column === column;
    const isEditableField = column === "hoTen" || column === "email" || column === "vaiTro";

    if (!isEditableField) {
      return value;
    }

    if (isEditing) {
      if (column === "vaiTro") {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, rowIndex, column)}
                autoFocus
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
              </Select>
            </FormControl>
            <IconButton size="small" onClick={() => saveEdit(rowIndex, column)} color="success">
              <Check fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={cancelEdit} color="error">
              <Close fontSize="small" />
            </IconButton>
          </div>
        );
      } else {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <TextField
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, rowIndex, column)}
                onBlur={() => saveEdit(rowIndex, column)}
                autoFocus
                fullWidth
                error={!!validationError}
                helperText={validationError}
                sx={{ minWidth: "120px" }}
              />
              <IconButton size="small" onClick={() => saveEdit(rowIndex, column)} color="success">
                <Check fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={cancelEdit} color="error">
                <Close fontSize="small" />
              </IconButton>
            </div>
          </div>
        );
      }
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        onClick={() => startEdit(rowIndex, column, originalValue)}
      >
        {value}
      </div>
    );
  };

  const renderSortableHeader = (column, index) => {
    const isSortable = column.accessor === "hoTen" || column.accessor === "email";
    const isActive = sortBy === column.accessor;
    if (!isSortable) {
      return (
        <TableCell
          key={index}
          align={column.align}
          sx={{
            width: column.width,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
            fontWeight: "bold",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            color: "#6c757d",
            padding: "0.65rem",
          }}
        >
          {column.Header}
        </TableCell>
      );
    }

    return (
      <TableCell
        key={index}
        align={column.align}
        sx={{
          width: column.width,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f8f9fa",
          fontWeight: "bold",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          color: "#6c757d",
          padding: "0.65rem",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#e9ecef",
          },
        }}
        onClick={() => handleSort(column.accessor)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: column.align === "center" ? "center" : "flex-start",
          }}
        >
          {column.Header}
          {isActive && <span style={{ marginLeft: "4px" }}>{sortOrder === "asc" ? "↑" : "↓"}</span>}
        </div>
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ width: "100%", display: "table-header-group" }}>
          <TableRow>{columns.map((column, index) => renderSortableHeader(column, index))}</TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&:last-child td": {
                    borderBottom: "none",
                  },
                }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={column.align}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      padding: "16px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {renderEditableCell(
                      rowIndex,
                      column.accessor,
                      row[column.accessor],
                      row.originalData?.[column.accessor] || ""
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ padding: "40px" }}>
                <MDTypography variant="h6" color="text" sx={{ opacity: 0.6 }}>
                  {searchValue ? "Không tìm thấy người dùng nào phù hợp" : "Không có dữ liệu"}
                </MDTypography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TableUser.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  searchValue: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onUpdateUser: PropTypes.func,
};
