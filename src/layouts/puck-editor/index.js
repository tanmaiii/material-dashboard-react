import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { Button, Card, FormControl, FormLabel, Input, Radio } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import Preview from "./components/Preview";

const config = {
  components: {
    Header: {
      fields: {
        title: {
          type: "text",
          contentEditable: true,
        },
      },
      defaultProps: {
        title: "Hello World",
      },
      render: ({ title }) => <h2>{title}</h2>,
    },
    DropdownBlock: {
      fields: {
        label: { type: "text", contentEditable: true },
        options: {
          type: "array",
          arrayFields: {
            value: { type: "text", contentEditable: true },
          },
          defaultItemProps: {
            value: "New Option",
          },
        },
        defaultValue: { type: "text", contentEditable: true },
        button: { type: "text" },
      },
      defaultProps: {
        label: "Select an option",
        options: [{ value: "Option 1" }, { value: "Option 2" }, { value: "Option 3" }],
        defaultValue: "",
        button: "Thêm lựa chọn",
      },
      render: ({ label, options, defaultValue, button, onChange }) => {
        return (
          <FormControl fullWidth margin="normal" sx={{ px: "8px" }}>
            <Card sx={{ padding: 4 }}>
              <h2>Dropdown</h2>
              <FormLabel component="legend">{label}</FormLabel>
              <Input
                style={{
                  height: "44px",
                  width: "100%",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              />
              {options.map((o, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {o.value}
                </div>
              ))}

              <Button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  // onChange({
                  //   options: [...data, { value: `Option ${data.length + 1}` }],
                  // });
                }}
                sx={{ pointerEvents: "auto" }}
              >
                {button}
              </Button>
            </Card>
          </FormControl>
        );
      },
    },
    RadioBlock: {
      fields: {
        label: { type: "text", contentEditable: true },
        options: {
          type: "array",
          arrayFields: {
            value: { type: "text", contentEditable: true },
          },
          defaultItemProps: {
            value: "New Option",
          },
        },
        defaultValue: { type: "text", contentEditable: true },
        button: { type: "text" },
      },
      defaultProps: {
        label: "Radio",
        options: [{ value: "Option 1" }, { value: "Option 2" }, { value: "Option 3" }],
        defaultValue: "",
        button: "Thêm lựa chọn",
      },
      render: ({ label, options, defaultValue, button, onChange }) => {
        return (
          <FormControl fullWidth margin="normal" sx={{ px: "8px" }}>
            <Card sx={{ padding: 4 }}>
              <h2>Radio</h2>
              <FormLabel component="legend">{label}</FormLabel>
              {options.map((o, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <Radio />
                  {o.value}
                </div>
              ))}

              <Button
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                sx={{ pointerEvents: "auto" }}
              >
                {button}
              </Button>
            </Card>
          </FormControl>
        );
      },
    },
  },
};

export default function PuckEditor() {
  const [data, setData] = useState({});

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Editor */}
        <div style={{ flex: 1 }}>
          <style>
            {`
              .Puck-rightSidebar {
                display: none !important;
              }
              .Puck-frame {
                width: 100% !important;
              }
            `}
          </style>
          <Puck
            leftSideBarVisible={false}
            config={config}
            data={data}
            style={{ "--puck-sidebar-width": "0px" }} // trick: thu gọn sidebar
            onChange={setData}
          />
        </div>

        {/* Preview */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Preview data={data} />
        </div>
      </MDBox>
    </DashboardLayout>
  );
}
