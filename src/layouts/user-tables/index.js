import {
  Card,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useRef, useState } from "react";
import CreateOrUpdateUser from "./components/CreateOrUpdateUser";
import SearchUser from "./components/SearchUser";
import authorsTableData, { usersData } from "./data/authorsTableData";

export default function UserTables() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
    icon: "check",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const updateModalRef = useRef();

  // Lấy Users từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const apiUsers = await response.json();

      // Transform API data to match our format
      const transformedUsers = apiUsers.map((user) => ({
        id: user.id,
        hoTen: user.name,
        email: user.email,
        vaiTro: "User",
      }));

      setAllUsers(transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to local data if API fails
      setAllUsers(usersData);
      setUsers(usersData);
      setSnackbar({
        open: true,
        message: "Không thể tải dữ liệu từ API, sử dụng dữ liệu mẫu!",
        color: "warning",
        icon: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Loại bỏ ký tự tiếng việt
  const removeVietnameseAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Sắp xếp Users
  const sortUsers = (usersToSort, sortField, order) => {
    if (!sortField) return usersToSort;
    return [...usersToSort].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // For Vietnamese text, remove accents for comparison
      if (typeof aValue === "string") {
        aValue = removeVietnameseAccents(aValue.toLowerCase());
        bValue = removeVietnameseAccents(bValue.toLowerCase());
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Lọc và xử lý Users
  const processUsers = () => {
    let processed = [...allUsers];

    // Apply search filter
    if (searchValue.trim()) {
      const normalizedSearchTerm = removeVietnameseAccents(searchValue.toLowerCase());
      processed = processed.filter((user) => {
        const normalizedUserName = removeVietnameseAccents(user.hoTen.toLowerCase());
        const normalizedEmail = removeVietnameseAccents(user.email.toLowerCase());
        return (
          normalizedUserName.includes(normalizedSearchTerm) ||
          normalizedEmail.includes(normalizedSearchTerm)
        );
      });
    }

    // Apply sorting
    processed = sortUsers(processed, sortBy, sortOrder);

    return processed;
  };

  // Lấy Users phân trang
  const getPaginatedUsers = () => {
    const processed = processUsers();
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return processed.slice(startIndex, endIndex);
  };

  // Sắp xếp Users
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(0); // Reset to first page when sorting
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (userId) => {
    try {
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setPage(0); // Reset to first page after delete

      setSnackbar({
        open: true,
        message: "Đã xóa người dùng thành công!",
        color: "success",
        icon: "check",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi xóa người dùng!",
        color: "error",
        icon: "close",
      });
    }
  };

  const handleUpdate = (user) => {
    setEditUser(user);
    updateModalRef.current?.openModal();
  };

  // Tìm kiếm người dùng (updated to work with new structure)
  const handleSearch = (searchTerm) => {
    setSearchValue(searchTerm);
    setPage(0); // Reset to first page when searching
  };

  const processedUsers = getPaginatedUsers();
  const totalUsers = processUsers().length;
  const { columns, rows } = authorsTableData(processedUsers, {
    onDelete: handleDelete,
    onUpdate: handleUpdate,
  });

  // Thêm người dùng
  const handleAddUser = (newUser) => {
    try {
      const existingUser = allUsers.find((user) => user.email === newUser.email);
      if (existingUser) {
        setSnackbar({
          open: true,
          message: "Email này đã tồn tại trong hệ thống!",
          color: "error",
          icon: "close",
        });
        return;
      }

      // Lấy ID lớn nhất và tạo ID mới
      const maxId = allUsers.length > 0 ? Math.max(...allUsers.map((user) => user.id)) : 0;
      const newId = maxId + 1;

      const newUserWithId = {
        ...newUser,
        id: newId,
      };

      setAllUsers((prevUsers) => {
        const newUsers = [...prevUsers, newUserWithId];
        return newUsers.sort((a, b) => a.id - b.id);
      });

      setPage(0); // Reset to first page to show new user

      setSnackbar({
        open: true,
        message: `Đã thêm người dùng ${newUserWithId.hoTen} (ID: ${newUserWithId.id}) thành công!`,
        color: "success",
        icon: "check",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi thêm người dùng!",
        color: "error",
        icon: "close",
      });
    }
  };

  //Cập nhật người dùng
  const handleUpdateUser = (updatedUser) => {
    try {
      const existingUser = allUsers.find(
        (user) => user.email === updatedUser.email && user.id !== updatedUser.id
      );

      if (existingUser) {
        setSnackbar({
          open: true,
          message: "Email này đã tồn tại trong hệ thống!",
          color: "error",
          icon: "close",
        });
        return;
      }

      setAllUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setSnackbar({
        open: true,
        message: `Đã cập nhật người dùng ${updatedUser.hoTen} thành công!`,
        color: "success",
        icon: "check",
      });

      setEditUser(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi cập nhật người dùng!",
        color: "error",
        icon: "close",
      });
    }
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

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Users Table
              </MDTypography>
            </MDBox>
            <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress size={60} />
            </MDBox>
          </Card>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Users Table
            </MDTypography>
          </MDBox>
          <MDBox>
            <MDBox py={2} px={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-start">
                <SearchUser onSearch={handleSearch} searchValue={searchValue} />
                <CreateOrUpdateUser handleAddUser={handleAddUser} />
                <CreateOrUpdateUser
                  ref={updateModalRef}
                  handleUpdateUser={handleUpdateUser}
                  editUser={editUser}
                  isEdit={true}
                />
              </Stack>
            </MDBox>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ width: "100%", display: "table-header-group" }}>
                  <TableRow>
                    {columns.map((column, index) => renderSortableHeader(column, index))}
                  </TableRow>
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
                          {searchValue
                            ? "Không tìm thấy người dùng nào phù hợp"
                            : "Không có dữ liệu"}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
              }
              sx={{
                borderTop: "1px solid #e0e0e0",
                ".MuiTablePagination-toolbar": {
                  paddingLeft: "16px",
                  paddingRight: "16px",
                },
              }}
            />
          </MDBox>
        </Card>
      </MDBox>

      {/* MD Snackbar */}
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
