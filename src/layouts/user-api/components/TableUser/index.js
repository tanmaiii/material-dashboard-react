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
  // State để quản lý row editing
  const [editingRow, setEditingRow] = useState(null); // rowIndex
  const [editValues, setEditValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Validation functions
  const validateField = (column, value) => {
    const trimmedValue = value.trim();
    switch (column) {
      case "first_name":
        if (!trimmedValue) {
          return "Tên không được để trống";
        }
        if (trimmedValue.length < 2) {
          return "Tên phải có ít nhất 2 ký tự";
        }
        break;
      case "last_name":
        if (!trimmedValue) {
          return "Họ không được để trống";
        }
        if (trimmedValue.length < 2) {
          return "Họ phải có ít nhất 2 ký tự";
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
      case "job":
        if (!["Admin", "User", "Manager", "Developer", "Designer"].includes(trimmedValue)) {
          return "Công việc phải là một trong các lựa chọn có sẵn";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const startEditRow = (rowIndex) => {
    const rowData = rows[rowIndex];
    const initialValues = {
      first_name: rowData.originalData?.first_name || "",
      last_name: rowData.originalData?.last_name || "",
      email: rowData.originalData?.email || "",
      job: rowData.originalData?.job || "",
    };
    setEditingRow(rowIndex);
    setEditValues(initialValues);
    setValidationErrors({});
  };

  const cancelEditRow = () => {
    setEditingRow(null);
    setEditValues({});
    setValidationErrors({});
  };

  const validateAllFields = () => {
    const errors = {};
    const editableFields = ["first_name", "last_name", "email", "job"];

    editableFields.forEach((field) => {
      const error = validateField(field, editValues[field] || "");
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  };

  const saveEditRow = () => {
    const errors = validateAllFields();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (onUpdateUser) {
      const rowData = rows[editingRow];
      const updatedUser = {
        ...rowData.originalData,
        ...editValues,
      };
      onUpdateUser(updatedUser);
    }
    setEditingRow(null);
    setEditValues({});
    setValidationErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      saveEditRow();
    } else if (event.key === "Escape") {
      cancelEditRow();
    }
  };

  const renderCell = (rowIndex, column, value) => {
    const isRowEditing = editingRow === rowIndex;
    const isEditableField = ["first_name", "last_name", "email", "job"].includes(column);

    if (!isEditableField || !isRowEditing) {
      return value;
    }

    // Render editable inputs when row is in edit mode
    if (column === "job") {
      return (
        <FormControl size="small" fullWidth>
          <Select
            value={editValues[column] || ""}
            onChange={(e) => handleInputChange(column, e.target.value)}
            onKeyDown={handleKeyPress}
            error={!!validationErrors[column]}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Developer">Developer</MenuItem>
            <MenuItem value="Designer">Designer</MenuItem>
          </Select>
          {validationErrors[column] && (
            <MDTypography variant="caption" color="error" sx={{ fontSize: "0.75rem", mt: 0.5 }}>
              {validationErrors[column]}
            </MDTypography>
          )}
        </FormControl>
      );
    } else {
      return (
        <div>
          <TextField
            size="small"
            fullWidth
            value={editValues[column] || ""}
            onChange={(e) => handleInputChange(column, e.target.value)}
            onKeyDown={handleKeyPress}
            error={!!validationErrors[column]}
          />
          {validationErrors[column] && (
            <MDTypography variant="caption" color="error" sx={{ fontSize: "0.75rem", mt: 0.5 }}>
              {validationErrors[column]}
            </MDTypography>
          )}
        </div>
      );
    }
  };

  const renderActionsCell = (rowIndex) => {
    const isRowEditing = editingRow === rowIndex;

    if (!isRowEditing) {
      return null;
    }

    return (
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <IconButton size="small" onClick={saveEditRow} color="success">
          <Check fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={cancelEditRow} color="error">
          <Close fontSize="small" />
        </IconButton>
      </div>
    );
  };

  const renderSortableHeader = (column, index) => {
    const isSortable = column.accessor === "first_name" || column.accessor === "email";
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
          <TableRow>
            {columns
              .filter((column) => {
                // Ẩn cột "Thao Tác" khi có row đang edit
                if (column.accessor === "action" && editingRow !== null) {
                  return false;
                }
                return true;
              })
              .map((column, index) => renderSortableHeader(column, index))}
            {/* Chỉ hiện cột "Hành động" khi có row đang edit */}
            {editingRow !== null && (
              <TableCell
                align="center"
                sx={{
                  minWidth: "160px",
                  borderBottom: "1px solid #e0e0e0",
                  backgroundColor: "#f8f9fa",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  color: "#6c757d",
                  padding: "0.65rem",
                }}
              >
                Hành động
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onDoubleClick={() => startEditRow(rowIndex)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&:last-child td": {
                    borderBottom: "none",
                  },
                  cursor: editingRow !== rowIndex ? "pointer" : "default",
                  backgroundColor: editingRow === rowIndex ? "#f0f8ff" : "transparent",
                }}
              >
                {columns
                  .filter((column) => {
                    // Ẩn cột "Thao Tác" khi có row đang edit
                    if (column.accessor === "action" && editingRow !== null) {
                      return false;
                    }
                    return true;
                  })
                  .map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align={column.align}
                      sx={{
                        borderBottom: "1px solid #e0e0e0",
                        padding: "16px",
                        fontSize: "0.875rem",
                      }}
                    >
                      {renderCell(rowIndex, column.accessor, row[column.accessor])}
                    </TableCell>
                  ))}
                {/* Chỉ hiện cột "Hành động" khi có row đang edit */}
                {editingRow !== null && (
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      padding: "16px",
                      fontSize: "0.875rem",
                      width: "120px",
                    }}
                  >
                    {renderActionsCell(rowIndex)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  columns.filter((column) => !(column.accessor === "action" && editingRow !== null))
                    .length + (editingRow !== null ? 1 : 0)
                }
                align="center"
                sx={{ padding: "40px" }}
              >
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
