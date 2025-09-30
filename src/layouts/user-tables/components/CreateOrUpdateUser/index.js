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
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import * as Yup from "yup";

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
  { value: "Guest", label: "Guest" },
];

// Validation Schema với Yup
const validationSchema = Yup.object({
  hoTen: Yup.string()
    .trim()
    .min(3, "Họ tên phải có ít nhất 3 ký tự")
    .required("Họ tên là bắt buộc"),
  email: Yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc"),
  vaiTro: Yup.string()
    .oneOf(["User", "Admin", "Guest"], "Vai trò không hợp lệ")
    .required("Vai trò là bắt buộc"),
  ngaySinh: Yup.date()
    .max(new Date(), "Ngày sinh không thể là ngày trong tương lai")
    .test("age", "Người dùng phải trên 18 tuổi", function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    })
    .required("Ngày sinh là bắt buộc"),
});

const CreateOrUpdateUser = forwardRef(
  ({ handleAddUser, handleUpdateUser, editUser, isEdit = false }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Hàm tính toán ngày sinh mặc định (đủ 18 tuổi)
    const getDefaultBirthDate = () => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return eighteenYearsAgo.toISOString().split("T")[0]; // Format YYYY-MM-DD
    };

    // Initial values cho Formik
    const getInitialValues = () => {
      if (isEdit && editUser) {
        return {
          hoTen: editUser.hoTen || "",
          email: editUser.email || "",
          vaiTro: editUser.vaiTro || "User",
          ngaySinh: editUser.ngaySinh || "",
        };
      }
      return {
        hoTen: "",
        email: "",
        vaiTro: "User",
        ngaySinh: getDefaultBirthDate(),
      };
    };

    useImperativeHandle(ref, () => ({
      openModal: handleOpen,
    }));

    const handleOpen = () => {
      setOpen(true);
      setError("");
    };

    const handleClose = () => {
      setOpen(false);
      setError("");
    };

    // Handle submit với Formik
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      setError("");

      try {
        const userData = {
          hoTen: values.hoTen.trim(),
          email: values.email.trim().toLowerCase(),
          vaiTro: values.vaiTro,
          ngaySinh: values.ngaySinh,
        };

        if (isEdit && editUser) {
          const updatedUser = {
            ...userData,
            id: editUser.id,
          };
          await handleUpdateUser(updatedUser);
        } else {
          await handleAddUser(userData);
        }

        resetForm();
        handleClose();
      } catch (err) {
        const errorMessage = isEdit
          ? "Đã xảy ra lỗi khi cập nhật người dùng. Vui lòng thử lại."
          : "Đã xảy ra lỗi khi thêm người dùng. Vui lòng thử lại.";
        setError(errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
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

            <Formik
              initialValues={getInitialValues()}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="hoTen"
                        label="Họ và Tên"
                        value={values.hoTen}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.hoTen && Boolean(errors.hoTen)}
                        helperText={touched.hoTen && errors.hoTen}
                        disabled={loading || isSubmitting}
                        placeholder="Nhập họ và tên"
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={loading || isSubmitting}
                        placeholder="Nhập địa chỉ email"
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        name="vaiTro"
                        label="Vai Trò"
                        value={values.vaiTro}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.vaiTro && Boolean(errors.vaiTro)}
                        helperText={touched.vaiTro && errors.vaiTro}
                        disabled={loading || isSubmitting}
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

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="ngaySinh"
                        type="date"
                        label="Ngày sinh"
                        value={values.ngaySinh}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.ngaySinh && Boolean(errors.ngaySinh)}
                        helperText={touched.ngaySinh && errors.ngaySinh}
                        disabled={loading || isSubmitting}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 40,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                        <Button
                          variant="outlined"
                          onClick={handleClose}
                          disabled={loading || isSubmitting}
                          sx={{ minWidth: 100, color: "red" }}
                          color="error"
                        >
                          Hủy
                        </Button>
                        <MDButton
                          variant="gradient"
                          color="info"
                          type="submit"
                          disabled={loading || isSubmitting}
                          sx={{ minWidth: 100 }}
                        >
                          {loading || isSubmitting ? (
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
                </Form>
              )}
            </Formik>
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
