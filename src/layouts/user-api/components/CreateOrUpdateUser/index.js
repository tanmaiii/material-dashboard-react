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

const jobOptions = [
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
  { value: "Manager", label: "Manager" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
];

// Validation Schema với Yup
const validationSchema = Yup.object({
  first_name: Yup.string().trim().min(2, "Tên phải có ít nhất 2 ký tự").required("Tên là bắt buộc"),
  last_name: Yup.string().trim().min(2, "Họ phải có ít nhất 2 ký tự").required("Họ là bắt buộc"),
  email: Yup.string().trim().email("Email không hợp lệ").required("Email là bắt buộc"),
  job: Yup.string()
    .oneOf(["User", "Admin", "Manager", "Developer", "Designer"], "Công việc không hợp lệ")
    .required("Công việc là bắt buộc"),
});

// For adding new users, use simpler validation
const addValidationSchema = Yup.object({
  name: Yup.string().trim().min(3, "Tên phải có ít nhất 3 ký tự").required("Tên là bắt buộc"),
  job: Yup.string()
    .oneOf(["User", "Admin", "Manager", "Developer", "Designer"], "Công việc không hợp lệ")
    .required("Công việc là bắt buộc"),
});

const CreateOrUpdateUser = forwardRef(
  ({ handleAddUser, handleUpdateUser, editUser, isEdit = false }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Initial values cho Formik
    const getInitialValues = () => {
      if (isEdit && editUser) {
        return {
          first_name: editUser.first_name || "",
          last_name: editUser.last_name || "",
          email: editUser.email || "",
          job: editUser.job || "User",
        };
      }
      return {
        name: "",
        job: "User",
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
        if (isEdit && editUser) {
          const updatedUser = {
            ...editUser,
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            email: values.email.trim().toLowerCase(),
            job: values.job,
          };
          await handleUpdateUser(updatedUser);
        } else {
          const userData = {
            name: values.name.trim(),
            job: values.job,
          };
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

    const validationSchemaToUse = isEdit ? validationSchema : addValidationSchema;

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
              validationSchema={validationSchemaToUse}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    {isEdit ? (
                      <>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            name="first_name"
                            label="Tên"
                            value={values.first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.first_name && Boolean(errors.first_name)}
                            helperText={touched.first_name && errors.first_name}
                            disabled={loading || isSubmitting}
                            placeholder="Nhập tên"
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            name="last_name"
                            label="Họ"
                            value={values.last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.last_name && Boolean(errors.last_name)}
                            helperText={touched.last_name && errors.last_name}
                            disabled={loading || isSubmitting}
                            placeholder="Nhập họ"
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
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Tên đầy đủ"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          disabled={loading || isSubmitting}
                          placeholder="Nhập tên đầy đủ"
                          variant="outlined"
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        name="job"
                        label="Công việc"
                        value={values.job}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.job && Boolean(errors.job)}
                        helperText={touched.job && errors.job}
                        disabled={loading || isSubmitting}
                        variant="outlined"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 40,
                          },
                        }}
                      >
                        {jobOptions.map((option) => (
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
