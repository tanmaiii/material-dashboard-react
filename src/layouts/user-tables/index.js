import {
  Card,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
  const [users, setUsers] = useState(usersData);
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [searchValue, setSearchValue] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    color: "success",
    icon: "check",
  });
  const updateModalRef = useRef();

  const handleDelete = (userId) => {
    try {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== userId);
        if (searchValue.trim()) {
          const normalizedSearchTerm = removeVietnameseAccents(searchValue.toLowerCase());
          const filtered = updatedUsers.filter((user) => {
            const normalizedUserName = removeVietnameseAccents(user.hoTen.toLowerCase());
            return normalizedUserName.includes(normalizedSearchTerm);
          });
          setFilteredUsers(filtered);
        } else {
          setFilteredUsers(updatedUsers);
        }
        return updatedUsers;
      });

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

  // Loại bỏ ký tự tiếng việt
  const removeVietnameseAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Tìm kiếm người dùng
  const handleSearch = (searchTerm) => {
    setSearchValue(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const normalizedSearchTerm = removeVietnameseAccents(searchTerm.toLowerCase());
      const filtered = users.filter((user) => {
        const normalizedUserName = removeVietnameseAccents(user.hoTen.toLowerCase());
        return normalizedUserName.includes(normalizedSearchTerm);
      });
      setFilteredUsers(filtered);
    }
  };

  const { columns, rows } = authorsTableData(filteredUsers, {
    onDelete: handleDelete,
    onUpdate: handleUpdate,
  });

  // Thêm người dùng
  const handleAddUser = (newUser) => {
    try {
      const existingUser = users.find((user) => user.email === newUser.email);
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
      const maxId = users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
      const newId = maxId + 1;

      const newUserWithId = {
        ...newUser,
        id: newId,
      };

      setUsers((prevUsers) => {
        const newUsers = [...prevUsers, newUserWithId];
        const sortedUsers = newUsers.sort((a, b) => a.id - b.id);
        // Tìm kiếm và lọc người dùng
        if (searchValue.trim()) {
          const normalizedSearchTerm = removeVietnameseAccents(searchValue.toLowerCase());
          const filtered = sortedUsers.filter((user) => {
            const normalizedUserName = removeVietnameseAccents(user.hoTen.toLowerCase());
            return normalizedUserName.includes(normalizedSearchTerm);
          });
          setFilteredUsers(filtered);
        } else {
          setFilteredUsers(sortedUsers);
        }
        return sortedUsers;
      });

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
      const existingUser = users.find(
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

      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        if (searchValue.trim()) {
          const normalizedSearchTerm = removeVietnameseAccents(searchValue.toLowerCase());
          const filtered = updatedUsers.filter((user) => {
            const normalizedUserName = removeVietnameseAccents(user.hoTen.toLowerCase());
            return normalizedUserName.includes(normalizedSearchTerm);
          });
          setFilteredUsers(filtered);
        } else {
          setFilteredUsers(updatedUsers);
        }
        return updatedUsers;
      });

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
                    {columns.map((column, index) => (
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
                    ))}
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
                      <TableCell colSpan={columns.length} align="center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
