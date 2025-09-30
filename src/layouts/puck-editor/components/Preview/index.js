import {
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

Preview.propTypes = {
  data: PropTypes.object.isRequired,
};

export default function Preview({ data }) {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialValues = {};
    data.content?.forEach((block, i) => {
      if (block.type === "DropdownBlock" || block.type === "RadioBlock") {
        const label = block.props?.label || block.label || "";
        const defaultValue = block.props?.defaultValue || block.defaultValue || "";
        if (label && defaultValue) {
          initialValues[`${label}-${i}`] = defaultValue;
        }
      }
    });
    setFormValues(initialValues);
  }, [data.content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log("Submitted values:", values);
    alert("Submitted values:" + JSON.stringify(values));
  };

  const handleValueChange = (fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <Card sx={{ padding: 4 }}>
      <MDTypography variant="h6">Preview</MDTypography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20, minHeight: "200px" }}
      >
        {data.content?.map((block, i) => {
          if (block.type === "DropdownBlock") {
            const label = block.props?.label || block.label || "";
            const defaultValue = block.props?.defaultValue || block.defaultValue || "";
            const options = block.props?.options || block.options || [];

            console.log(
              `DropdownBlock ${i} - label:`,
              label,
              "defaultValue:",
              defaultValue,
              "options:",
              options
            );

            const fieldName = `${label}-${i}`;
            const currentValue = formValues[fieldName] || defaultValue;

            return (
              <FormControl key={i} fullWidth margin="normal">
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  value={currentValue}
                  onChange={(e) => handleValueChange(fieldName, e.target.value)}
                  label={label}
                  name={fieldName}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                    "& .MuiSelect-icon": {
                      fontSize: "1.25rem",
                      right: "8px",
                    },
                  }}
                >
                  {options?.map((o, j) => (
                    <MenuItem key={j} value={o.value}>
                      {o.value}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            );
          }
          if (block.type === "RadioBlock") {
            const label = block.props?.label || block.label || "";
            const defaultValue = block.props?.defaultValue || block.defaultValue || "";
            const options = block.props?.options || block.options || [];

            console.log(
              `RadioBlock ${i} - label:`,
              label,
              "defaultValue:",
              defaultValue,
              "options:",
              options
            );

            const fieldName = `${label}-${i}`;
            const currentValue = formValues[fieldName] || defaultValue;

            return (
              <FormControl key={i} component="fieldset" margin="normal">
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup
                  name={fieldName}
                  value={currentValue}
                  onChange={(e) => handleValueChange(fieldName, e.target.value)}
                >
                  {options?.map((o, j) => (
                    <FormControlLabel
                      key={j}
                      value={o.value}
                      control={
                        <Radio
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: "1.25rem",
                            },
                          }}
                        />
                      }
                      label={o.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          }
          return null;
        })}
        <MDButton sx={{ marginTop: "auto" }} type="submit" variant="contained" color="primary">
          Submit
        </MDButton>
      </form>
    </Card>
  );
}
