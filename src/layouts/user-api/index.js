import { Card, CircularProgress, Stack, TablePagination } from "@mui/material";
import MDBox from "components/MDBox";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useRef } from "react";
import { useUserApiStore } from "store/userApiStore";
import CreateOrUpdateUser from "./components/CreateOrUpdateUser";
import SearchUser from "./components/SearchUser";
import TableUser from "./components/TableUser";
import usersTableData from "./data/usersTableData";

export default function UserApi() {
  const loading = useUserApiStore((state) => state.loading);
  const searchValue = useUserApiStore((state) => state.searchValue);
  const editUser = useUserApiStore((state) => state.editUser);
  const snackbar = useUserApiStore((state) => state.snackbar);
  const page = useUserApiStore((state) => state.page);
  const rowsPerPage = useUserApiStore((state) => state.rowsPerPage);
  const sortBy = useUserApiStore((state) => state.sortBy);
  const sortOrder = useUserApiStore((state) => state.sortOrder);

  const fetchUsers = useUserApiStore((state) => state.fetchUsers);
  const setSort = useUserApiStore((state) => state.setSort);
  const setPage = useUserApiStore((state) => state.setPage);
  const setRowsPerPage = useUserApiStore((state) => state.setRowsPerPage);
  const deleteUser = useUserApiStore((state) => state.deleteUser);
  const setEditUser = useUserApiStore((state) => state.setEditUser);
  const setSearchValue = useUserApiStore((state) => state.setSearchValue);
  const getPaginatedUsers = useUserApiStore((state) => state.getPaginatedUsers);
  const getTotalUsers = useUserApiStore((state) => state.getTotalUsers);
  const addUser = useUserApiStore((state) => state.addUser);
  const updateUser = useUserApiStore((state) => state.updateUser);
  const setSnackbar = useUserApiStore((state) => state.setSnackbar);
  const closeSnackbar = useUserApiStore((state) => state.closeSnackbar);

  const updateModalRef = useRef();

  // Lấy Users từ API
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sắp xếp Users
  const handleSort = (field) => {
    setSort(field);
  };

  const handleChangePage = async (event, newPage) => {
    await setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    await setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleDelete = (userId) => {
    try {
      deleteUser(userId);
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

  // Tìm kiếm người dùng
  const handleSearch = (searchTerm) => {
    setSearchValue(searchTerm);
  };

  const processedUsers = getPaginatedUsers();
  const totalUsers = getTotalUsers();
  const { columns, rows } = usersTableData(processedUsers, {
    onDelete: handleDelete,
    onUpdate: handleUpdate,
  });

  // Thêm người dùng
  const handleAddUser = (newUser) => {
    try {
      addUser(newUser);
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
      updateUser(updatedUser);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Đã xảy ra lỗi khi cập nhật người dùng!",
        color: "error",
        icon: "close",
      });
    }
  };

  const handleCloseSnackbar = () => {
    closeSnackbar();
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
                Users API Table
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
              Users API Table
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
            <TableUser
              columns={columns}
              rows={rows}
              searchValue={searchValue}
              handleSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onUpdateUser={handleUpdateUser}
            />

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 10, 24]}
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
        close={handleCloseSnackbar}
      />
    </DashboardLayout>
  );
}
