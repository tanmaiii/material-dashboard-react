import userApiService from "services/userApiService";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// Utility function để loại bỏ ký tự tiếng việt
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
const processUsers = (allUsers, searchValue, sortBy, sortOrder) => {
  let processed = [...allUsers];

  // Apply search filter
  if (searchValue.trim()) {
    const normalizedSearchTerm = removeVietnameseAccents(searchValue.toLowerCase());
    processed = processed.filter((user) => {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const email = user.email || "";

      const normalizedUserName = removeVietnameseAccents(fullName.toLowerCase());
      const normalizedEmail = removeVietnameseAccents(email.toLowerCase());

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

export const useUserApiStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    users: [],
    allUsers: [],
    loading: true,
    searchValue: "",
    editUser: null,
    totalPages: 1,
    totalUsers: 0,
    snackbar: {
      open: false,
      message: "",
      color: "success",
      icon: "check",
    },
    page: 0,
    rowsPerPage: 6,
    sortBy: null,
    sortOrder: "asc",

    // Actions
    setLoading: (loading) => set({ loading }),

    setUsers: (users, totalPages = 1, totalUsers = 0) => {
      set({
        allUsers: users,
        loading: false,
        totalPages,
        totalUsers,
      });
    },

    // Fetch users from reqres.in API
    fetchUsers: async (pageNumber = 1, perPageParam = null) => {
      const { setLoading, setSnackbar, rowsPerPage } = get();
      const actualRowsPerPage = perPageParam || rowsPerPage;

      try {
        setLoading(true);
        const result = await userApiService.getUsers(pageNumber, actualRowsPerPage);

        set({
          allUsers: result.data,
          totalPages: result.totalPages,
          totalUsers: result.totalUsers,
          page: pageNumber - 1, // API sử dụng 1-based, UI sử dụng 0-based
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching users:", error);

        set({
          allUsers: [],
          totalPages: 0,
          totalUsers: 0,
          loading: false,
        });

        setSnackbar({
          open: true,
          message: "Không thể tải dữ liệu từ API, sử dụng dữ liệu mẫu!",
          color: "warning",
          icon: "warning",
        });
      }
    },

    // Add user via API
    addUser: async (newUser) => {
      const { setSnackbar, fetchUsers } = get();

      try {
        const result = await userApiService.createUser(newUser);

        setSnackbar({
          open: true,
          message: result.message,
          color: "success",
          icon: "check",
        });

        // Refresh the user list after adding - quay về trang đầu
        set({ page: 0 });
        await fetchUsers(1);
      } catch (error) {
        console.error("Error adding user:", error);
        setSnackbar({
          open: true,
          message: error.message || "Đã xảy ra lỗi khi thêm người dùng!",
          color: "error",
          icon: "close",
        });
      }
    },

    // Update user via API
    updateUser: async (updatedUser) => {
      const { setSnackbar, fetchUsers } = get();

      try {
        const result = await userApiService.updateUser(updatedUser.id, updatedUser);

        setSnackbar({
          open: true,
          message: result.message,
          color: "success",
          icon: "check",
        });

        set({ editUser: null });

        // Refresh the user list after updating - giữ trang hiện tại
        const { page } = get();
        await fetchUsers(page + 1);
      } catch (error) {
        console.error("Error updating user:", error);
        setSnackbar({
          open: true,
          message: error.message || "Đã xảy ra lỗi khi cập nhật người dùng!",
          color: "error",
          icon: "close",
        });
      }
    },

    // Delete user via API
    deleteUser: async (userId) => {
      const { setSnackbar, fetchUsers } = get();

      try {
        const result = await userApiService.deleteUser(userId);

        setSnackbar({
          open: true,
          message: result.message,
          color: "success",
          icon: "check",
        });

        // Refresh the user list after deleting - giữ trang hiện tại
        const { page } = get();
        await fetchUsers(page + 1);
      } catch (error) {
        console.error("Error deleting user:", error);
        setSnackbar({
          open: true,
          message: error.message || "Đã xảy ra lỗi khi xóa người dùng!",
          color: "error",
          icon: "close",
        });
      }
    },

    setSearchValue: (searchValue) => set({ searchValue, page: 0 }),

    setSort: (field) => {
      const { sortBy, sortOrder } = get();
      let newSortOrder = "asc";

      if (sortBy === field) {
        newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      }

      set({
        sortBy: field,
        sortOrder: newSortOrder,
        page: 0,
      });
    },

    setPage: async (page) => {
      const { fetchUsers } = get();
      set({ page });
      // Gọi API với trang mới (chuyển từ 0-based sang 1-based)
      await fetchUsers(page + 1);
    },

    setRowsPerPage: async (rowsPerPage) => {
      const { fetchUsers } = get();
      set({ rowsPerPage, page: 0 });
      // Gọi API với rowsPerPage mới và reset về trang đầu
      await fetchUsers(1, rowsPerPage);
    },

    setSnackbar: (snackbar) => set({ snackbar }),

    closeSnackbar: () => {
      const { snackbar } = get();
      set({
        snackbar: {
          ...snackbar,
          open: false,
        },
      });
    },

    setEditUser: (user) => set({ editUser: user }),

    getProcessedUsers: () => {
      const { allUsers, searchValue, sortBy, sortOrder } = get();
      return processUsers(allUsers, searchValue, sortBy, sortOrder);
    },

    getPaginatedUsers: () => {
      const { allUsers, searchValue, sortBy, sortOrder } = get();
      // Với server-side pagination, chỉ cần trả về allUsers được lọc và sort
      return processUsers(allUsers, searchValue, sortBy, sortOrder);
    },

    getTotalUsers: () => {
      const { totalUsers, searchValue } = get();
      // Nếu có tìm kiếm, trả về số lượng sau khi lọc local
      if (searchValue.trim()) {
        const { allUsers, sortBy, sortOrder } = get();
        return processUsers(allUsers, searchValue, sortBy, sortOrder).length;
      }
      // Nếu không có tìm kiếm, trả về totalUsers từ API
      return totalUsers;
    },
  }))
);

//Tự động đóng thông báo sau 3 giây
useUserApiStore.subscribe(
  (state) => state.snackbar.open,
  (open) => {
    if (open) {
      setTimeout(() => {
        useUserApiStore.getState().closeSnackbar();
      }, 3000);
    }
  }
);

export default useUserApiStore;
