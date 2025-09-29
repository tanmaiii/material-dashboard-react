import { Delete as DeleteIcon } from "@mui/icons-material";
import { Box, Button, Modal, Typography, Alert, CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import PropTypes from "prop-types";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  p: 4,
};

export default function DeleteUser({ user, onDelete }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await onDelete(user.id);
      handleClose();
    } catch (err) {
      setError("Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDButton
        variant="text"
        color="error"
        onClick={handleOpen}
        size="medium"
        disabled={!onDelete}
      >
        <DeleteIcon />
      </MDButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-user-modal-title"
        aria-describedby="delete-user-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="delete-user-modal-title"
            variant="h5"
            component="h2"
            sx={{ mb: 3, fontWeight: "bold", color: "error.main" }}
          >
            Xác Nhận Xóa Người Dùng
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography id="delete-user-modal-description" variant="body1" sx={{ mb: 1 }}>
            Bạn có chắc chắn muốn xóa người dùng sau đây?
          </Typography>
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
              color="error"
              onClick={handleConfirmDelete}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Xác Nhận Xóa"}
            </MDButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

DeleteUser.propTypes = {
  user: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
