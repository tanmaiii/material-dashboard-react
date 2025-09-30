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

// Typechecking props for the Preview
Preview.propTypes = {
  data: PropTypes.object.isRequired,
};

export default function Preview({ data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log("Submitted values:", values);
    alert("Submitted values:" + JSON.stringify(values));
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
            return (
              <FormControl key={i} fullWidth margin="normal">
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  defaultValue={block.props?.defaultValue || ""}
                  label={block.props?.label || ""}
                  name={`${block.props?.label}-${i}`}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                  }}
                >
                  {block.props?.options?.map((o, j) => (
                    <MenuItem key={j} value={o.value}>
                      {o.value}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            );
          }
          if (block.type === "RadioBlock") {
            return (
              <FormControl key={i} component="fieldset" margin="normal">
                <FormLabel component="legend">{block.props?.label || ""}</FormLabel>
                <RadioGroup
                  name={`${block.props?.label}-${i}`}
                  defaultValue={block.props?.defaultValue || ""}
                >
                  {block.props?.options?.map((o, j) => (
                    <FormControlLabel key={j} value={o.value} control={<Radio />} label={o.value} />
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
