import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import Preview from "./components/Preview";

export const config = {
  components: {
    DropdownBlock: {
      fields: {
        label: { type: "text" },
        options: { type: "array", arrayFields: { value: { type: "text" } } },
        defaultValue: { type: "text" },
      },
      render: ({ label, options, defaultValue }) => (
        <FormControl fullWidth margin="normal">
          <TextField
            fullWidth
            select
            variant="outlined"
            defaultValue={defaultValue}
            label={label}
            sx={{
              "& .MuiInputBase-root": { height: 40 },
              "& .MuiSelect-icon": {
                fontSize: "1.25rem",
                right: "8px",
                display: "none !important",
              },
            }}
          >
            {options?.map((o, i) => (
              <MenuItem key={i} value={o.value}>
                {o.value}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      ),
    },
    RadioBlock: {
      fields: {
        label: { type: "text" },
        options: { type: "array", arrayFields: { value: { type: "text" } } },
        defaultValue: { type: "text" },
      },
      render: ({ label, options, defaultValue }) => (
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup defaultValue={defaultValue}>
            {options?.map((o, i) => (
              <FormControlLabel
                key={i}
                value={o.value}
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.25rem",
                        display: "none !important",
                      },
                    }}
                  />
                }
                label={o.value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ),
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
        <div style={{ flex: 1, borderRight: "1px solid #ccc" }}>
          <Puck config={config} data={data} onChange={setData} />
        </div>

        {/* Preview */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Preview data={data} />
        </div>
      </MDBox>
    </DashboardLayout>
  );
}
