import { Puck } from "@measured/puck";
import { FormControl, FormLabel, RadioGroup } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import Preview from "./components/Preview";
import "@measured/puck/puck.css";

export const config = {
  components: {
    DropdownBlock: {
      fields: {
        label: { type: "text" },
        options: { type: "array", arrayFields: { value: { type: "text" } } },
        defaultValue: { type: "text" },
      },
      render: ({ label, options, defaultValue }) => (
        <FormControl fullWidth margin="normal" sx={{ px: "8px" }}>
          <FormLabel component="legend">{label}</FormLabel>
          <select defaultValue={defaultValue} style={{ height: "40px", width: "100%" }}>
            {options?.map((o, i) => (
              <option key={i} value={o.value} style={{ height: "40px" }}>
                {o.value}
              </option>
            ))}
          </select>
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
        <FormControl component="fieldset" margin="normal" sx={{ px: "8px" }}>
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup defaultValue={defaultValue}>
            {options?.map((o, i) => (
              <label key={i}>
                <input type="radio" name={label} value={o.value} style={{ marginRight: "8px" }} />
                {o.value}
              </label>
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
