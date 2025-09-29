import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import authorsTableData from "./data/authorsTableData";

export default function UserTables() {
  const { columns, rows } = authorsTableData();

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
              Users Table
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ width: "100%", display: "table-header-group" }}>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align={column.align}
                        sx={{
                          width: column.width,
                          borderBottom: "1px solid #e0e0e0",
                          backgroundColor: "#f8f9fa",
                          fontWeight: "bold",
                          fontSize: "0.875rem",
                          textTransform: "uppercase",
                          color: "#6c757d",
                          padding: "0.65rem",
                        }}
                      >
                        {column.Header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&:last-child td": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          align={column.align}
                          sx={{
                            borderBottom: "1px solid #e0e0e0",
                            padding: "16px",
                            fontSize: "0.875rem",
                          }}
                        >
                          {row[column.accessor]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}
