import { Add as AddIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  p: 4,
  maxHeight: "90vh",
  overflow: "auto",
};

const vaiTroOptions = [
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
];

const CreateOrUpdateUser = forwardRef(
  ({ handleAddUser, handleUpdateUser, editUser, isEdit = false }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
      hoTen: "",
      email: "",
      vaiTro: "User",
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
      if (isEdit && editUser && open) {
        setFormData({
          hoTen: editUser.hoTen || "",
          email: editUser.email || "",
          vaiTro: editUser.vaiTro || "User",
        });
      }
    }, [isEdit, editUser, open]);

    useImperativeHandle(ref, () => ({
      openModal: handleOpen,
    }));

    const handleOpen = () => {
      setOpen(true);
      setError("");
      setFormErrors({});
    };

    const handleClose = () => {
      setOpen(false);
      setFormData({
        hoTen: "",
        email: "",
        vaiTro: "User",
      });
      setFormErrors({});
      setError("");
    };

    const handleInputChange = (field) => (event) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
      if (formErrors[field]) {
        setFormErrors({
          ...formErrors,
          [field]: "",
        });
      }
    };

    const validateForm = () => {
      const errors = {};

      // Validate Họ Tên
      if (!formData.hoTen.trim()) {
        errors.hoTen = "Họ tên là bắt buộc";
      } else if (formData.hoTen.trim().length < 2) {
        errors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
      }

      // Validate Email
      if (!formData.email.trim()) {
        errors.email = "Email là bắt buộc";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = "Email không hợp lệ";
        }
      }

      // Validate Vai Trò
      if (!formData.vaiTro) {
        errors.vaiTro = "Vai trò là bắt buộc";
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      //Kiểm tra validate form
      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const userData = {
          hoTen: formData.hoTen.trim(),
          email: formData.email.trim().toLowerCase(),
          vaiTro: formData.vaiTro,
        };

        if (isEdit && editUser) {
          const updatedUser = {
            ...userData,
            id: editUser.id,
          };
          handleUpdateUser(updatedUser);
        } else {
          handleAddUser(userData);
        }

        handleClose();
      } catch (err) {
        const errorMessage = isEdit
          ? "Đã xảy ra lỗi khi cập nhật người dùng. Vui lòng thử lại."
          : "Đã xảy ra lỗi khi thêm người dùng. Vui lòng thử lại.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {!isEdit && (
          <MDButton variant="gradient" color="info" onClick={handleOpen} startIcon={<AddIcon />}>
            Thêm Người Dùng
          </MDButton>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-user-modal-title"
          aria-describedby="add-user-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="add-user-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              {isEdit ? "Cập Nhật Người Dùng" : "Thêm Người Dùng Mới"}
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và Tên"
                    value={formData.hoTen}
                    onChange={handleInputChange("hoTen")}
                    error={!!formErrors.hoTen}
                    helperText={formErrors.hoTen}
                    disabled={loading}
                    placeholder="Nhập họ và tên"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={loading}
                    placeholder="Nhập địa chỉ email"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Vai Trò"
                    value={formData.vaiTro}
                    onChange={handleInputChange("vaiTro")}
                    error={!!formErrors.vaiTro}
                    helperText={formErrors.vaiTro}
                    disabled={loading}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                    }}
                  >
                    {vaiTroOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={loading}
                      sx={{ minWidth: 100, color: "red" }}
                      color="error"
                    >
                      Hủy
                    </Button>
                    <MDButton
                      variant="gradient"
                      color="info"
                      type="submit"
                      disabled={loading}
                      sx={{ minWidth: 100 }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : isEdit ? (
                        "Cập Nhật"
                      ) : (
                        "Thêm"
                      )}
                    </MDButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
);

CreateOrUpdateUser.displayName = "CreateOrUpdateUser";

CreateOrUpdateUser.propTypes = {
  handleAddUser: PropTypes.func,
  handleUpdateUser: PropTypes.func,
  editUser: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default CreateOrUpdateUser;
