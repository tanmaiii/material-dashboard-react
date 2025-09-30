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

export const useUserStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    users: [],
    allUsers: [],
    loading: true,
    searchValue: "",
    editUser: null,
    snackbar: {
      open: false,
      message: "",
      color: "success",
      icon: "check",
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: null,
    sortOrder: "asc",

    // Actions
    setLoading: (loading) => set({ loading }),

    setUsers: (users) => set({ allUsers: users, loading: false }),

    addUser: (newUser) => {
      const { allUsers } = get();

      // Check if email already exists
      const existingUser = allUsers.find((user) => user.email === newUser.email);
      if (existingUser) {
        set({
          snackbar: {
            open: true,
            message: "Email này đã tồn tại trong hệ thống!",
            color: "error",
            icon: "close",
          },
        });
        return;
      }

      // Generate new ID
      const maxId = allUsers.length > 0 ? Math.max(...allUsers.map((user) => user.id)) : 0;
      const newUserWithId = {
        ...newUser,
        id: maxId + 1,
      };

      const newAllUsers = [...allUsers, newUserWithId].sort((a, b) => a.id - b.id);

      set({
        allUsers: newAllUsers,
        page: 0,
        snackbar: {
          open: true,
          message: `Đã thêm người dùng ${newUserWithId.hoTen} (ID: ${newUserWithId.id}) thành công!`,
          color: "success",
          icon: "check",
        },
      });
    },

    updateUser: (updatedUser) => {
      const { allUsers } = get();

      // Check if email already exists for other users
      const existingEmailUser = allUsers.find(
        (user) => user.email === updatedUser.email && user.id !== updatedUser.id
      );

      if (existingEmailUser) {
        set({
          snackbar: {
            open: true,
            message: "Email này đã tồn tại trong hệ thống!",
            color: "error",
            icon: "close",
          },
        });
        return;
      }

      const updatedUsers = allUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );

      set({
        allUsers: updatedUsers,
        editUser: null,
        snackbar: {
          open: true,
          message: `Đã cập nhật người dùng ${updatedUser.hoTen} thành công!`,
          color: "success",
          icon: "check",
        },
      });
    },

    deleteUser: (userId) => {
      const { allUsers } = get();
      const filteredUsers = allUsers.filter((user) => user.id !== userId);

      set({
        allUsers: filteredUsers,
        page: 0,
        snackbar: {
          open: true,
          message: "Đã xóa người dùng thành công!",
          color: "success",
          icon: "check",
        },
      });
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

    setPage: (page) => set({ page }),

    setRowsPerPage: (rowsPerPage) => set({ rowsPerPage, page: 0 }),

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

    //Lấy dữ liệu từ API
    fetchUsers: async () => {
      const { setLoading, setUsers, setSnackbar } = get();

      try {
        setLoading(true);
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const apiUsers = await response.json();

        // Hàm tạo ngày sinh mặc định (đủ 18 tuổi)
        const getDefaultBirthDate = () => {
          const today = new Date();
          const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          return eighteenYearsAgo.toISOString().split("T")[0];
        };

        // Transform API data to match our format
        const transformedUsers = apiUsers.map((user) => ({
          id: user.id,
          hoTen: user.name,
          email: user.email,
          ngaySinh: getDefaultBirthDate(),
          vaiTro: "User",
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);

        // Lấy dữ liệu mẫu
        try {
          const { usersData } = await import("../layouts/user-tables/data/authorsTableData");
          setUsers(usersData);

          setSnackbar({
            open: true,
            message: "Không thể tải dữ liệu từ API, sử dụng dữ liệu mẫu!",
            color: "warning",
            icon: "warning",
          });
        } catch (importError) {
          console.error("Error importing local data:", importError);
          setSnackbar({
            open: true,
            message: "Không thể tải dữ liệu!",
            color: "error",
            icon: "close",
          });
        }
      }
    },

    getProcessedUsers: () => {
      const { allUsers, searchValue, sortBy, sortOrder } = get();
      return processUsers(allUsers, searchValue, sortBy, sortOrder);
    },

    getPaginatedUsers: () => {
      const { allUsers, searchValue, sortBy, sortOrder, page, rowsPerPage } = get();
      const processed = processUsers(allUsers, searchValue, sortBy, sortOrder);
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return processed.slice(startIndex, endIndex);
    },

    getTotalUsers: () => {
      const { allUsers, searchValue, sortBy, sortOrder } = get();
      return processUsers(allUsers, searchValue, sortBy, sortOrder).length;
    },
  }))
);

//Tự động đóng thông báo sau 3 giây
useUserStore.subscribe(
  (state) => state.snackbar.open,
  (open) => {
    if (open) {
      setTimeout(() => {
        useUserStore.getState().closeSnackbar();
      }, 3000);
    }
  }
);

export default useUserStore;
