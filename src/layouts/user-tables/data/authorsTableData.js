import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import PropTypes from "prop-types";
import DeleteUser from "../components/DeleteUser";

export const usersData = [
  {
    id: 1,
    hoTen: "Nguyễn Văn An",
    email: "vanAn@gmail.com",
    vaiTro: "Admin",
  },
  {
    id: 2,
    hoTen: "Trần Thị Bình",
    email: "binh@gmail.com",
    vaiTro: "User",
  },
  {
    id: 3,
    hoTen: "Lê Hoàng Cường",
    email: "cuong@gmail.com",
    vaiTro: "User",
  },
  {
    id: 4,
    hoTen: "Phạm Thị Dung",
    email: "dung@gmail.com",
    vaiTro: "User",
  },
  {
    id: 5,
    hoTen: "Võ Minh Tuấn",
    email: "tuan@gmail.com",
    vaiTro: "Admin",
  },
  {
    id: 6,
    hoTen: "Đặng Thị Hoa",
    email: "hoa@gmail.com",
    vaiTro: "User",
  },
];

export default function data(users = [], { onDelete, onUpdate } = {}) {
  const VaiTro = ({ vaiTro }) => {
    let color;
    switch (vaiTro) {
      case "Admin":
        color = "error";
        break;
      case "Guest":
        color = "warning";
        break;
      case "User":
      default:
        color = "info";
        break;
    }

    return <MDBadge badgeContent={vaiTro} color={color} variant="gradient" size="sm" />;
  };

  VaiTro.propTypes = {
    vaiTro: PropTypes.string.isRequired,
  };

  const ActionButtons = ({ user }) => {
    return (
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        <MDButton
          variant="text"
          color="info"
          onClick={() => onUpdate && onUpdate(user)}
          size="medium"
          disabled={!onUpdate}
        >
          <Icon>edit</Icon>
        </MDButton>
        <DeleteUser user={user} onDelete={onDelete} />
      </div>
    );
  };

  ActionButtons.propTypes = {
    user: PropTypes.object.isRequired,
  };

  return {
    columns: [
      { Header: "ID", accessor: "id", width: "10%", align: "center" },
      { Header: "Họ Tên", accessor: "hoTen", width: "25%", align: "left" },
      { Header: "Email", accessor: "email", width: "30%", align: "left" },
      { Header: "Ngày Sinh", accessor: "ngaySinh", width: "30%", align: "left" },
      { Header: "Vai Trò", accessor: "vaiTro", width: "20%", align: "center" },
      { Header: "Thao Tác", accessor: "action", width: "15%", align: "center" },
    ],

    rows: users.map((user) => ({
      originalData: user, // Thêm dữ liệu gốc để dùng cho inline editing
      id: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.id}
        </MDTypography>
      ),
      hoTen: (
        <MDTypography variant="button" color="text" fontWeight="medium">
          {user.hoTen}
        </MDTypography>
      ),
      ngaySinh: (
        <MDTypography variant="button" color="text" fontWeight="medium">
          {user.ngaySinh}
        </MDTypography>
      ),
      email: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.email}
        </MDTypography>
      ),
      vaiTro: <VaiTro vaiTro={user.vaiTro} />,
      action: <ActionButtons user={user} />,
    })),
  };
}
