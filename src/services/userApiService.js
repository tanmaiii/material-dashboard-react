/**
 * Service để quản lý tất cả API calls liên quan đến User từ reqres.in
 */

const API_BASE_URL = "https://reqres.in/api";
const API_KEY = "reqres-free-v1";

class UserApiService {
  async getUsers(page = 1, per_page = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&per_page=${per_page}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        totalPages: data.total_pages || 1,
        totalUsers: data.total || 0,
        currentPage: data.page || 1,
        perPage: data.per_page || 10,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(`Không thể tải danh sách người dùng: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Người dùng không tồn tại");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error(`Không thể tải thông tin người dùng: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          name: userData.name,
          job: userData.job || "User",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          id: data.id,
          name: data.name,
          job: data.job,
          createdAt: data.createdAt,
        },
        message: `Đã thêm người dùng ${userData.name} thành công! ID: ${data.id}`,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(`Không thể thêm người dùng: ${error.message}`);
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          job: userData.job,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Người dùng không tồn tại");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          ...userData,
          id: userId,
          updatedAt: data.updatedAt,
        },
        message: `Đã cập nhật người dùng ${userData.first_name} ${userData.last_name} thành công!`,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(`Không thể cập nhật người dùng: ${error.message}`);
    }
  }

  async patchUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Người dùng không tồn tại");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          ...userData,
          id: userId,
          updatedAt: data.updatedAt,
        },
        message: "Đã cập nhật thông tin người dùng thành công!",
      };
    } catch (error) {
      console.error("Error patching user:", error);
      throw new Error(`Không thể cập nhật người dùng: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Người dùng không tồn tại");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: "Đã xóa người dùng thành công!",
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(`Không thể xóa người dùng: ${error.message}`);
    }
  }
}

// Export instance singleton
const userApiService = new UserApiService();
export default userApiService;
