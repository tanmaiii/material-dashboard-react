import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

export default function TableUser({ columns, rows, searchValue, handleSort, sortBy, sortOrder }) {
  // Render sortable header
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
                    {row[column.accessor]}
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
};
