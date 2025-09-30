import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import { Icon, Avatar } from "@mui/material";
import PropTypes from "prop-types";
import DeleteUser from "../components/DeleteUser";

export default function data(users = [], { onDelete, onUpdate } = {}) {
  const JobBadge = ({ job }) => {
    let color;
    switch (job) {
      case "Admin":
        color = "error";
        break;
      case "Manager":
        color = "warning";
        break;
      case "Developer":
        color = "success";
        break;
      case "Designer":
        color = "info";
        break;
      case "User":
      default:
        color = "secondary";
        break;
    }

    return <MDBadge badgeContent={job || "User"} color={color} variant="gradient" size="sm" />;
  };

  JobBadge.propTypes = {
    job: PropTypes.string,
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

  const UserAvatar = ({ user }) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          sx={{ width: 40, height: 40 }}
        />
        <div>
          <MDTypography variant="button" color="text" fontWeight="medium">
            {user.first_name} {user.last_name}
          </MDTypography>
        </div>
      </div>
    );
  };

  UserAvatar.propTypes = {
    user: PropTypes.object.isRequired,
  };

  return {
    columns: [
      { Header: "ID", accessor: "id", width: "8%", align: "center" },
      { Header: "Người Dùng", accessor: "user", width: "30%", align: "left" },
      { Header: "Tên", accessor: "first_name", width: "20%", align: "left" },
      { Header: "Họ", accessor: "last_name", width: "20%", align: "left" },
      { Header: "Email", accessor: "email", width: "25%", align: "left" },
      { Header: "Công việc", accessor: "job", width: "15%", align: "center" },
      { Header: "Thao Tác", accessor: "action", width: "12%", align: "center" },
    ],

    rows: users.map((user) => ({
      originalData: user, // Thêm dữ liệu gốc để dùng cho inline editing
      id: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.id}
        </MDTypography>
      ),
      user: <UserAvatar user={user} />,
      first_name: (
        <MDTypography variant="button" color="text" fontWeight="medium">
          {user.first_name}
        </MDTypography>
      ),
      last_name: (
        <MDTypography variant="button" color="text" fontWeight="medium">
          {user.last_name}
        </MDTypography>
      ),
      email: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.email}
        </MDTypography>
      ),
      job: <JobBadge job={user.job} />,
      action: <ActionButtons user={user} />,
    })),
  };
}
