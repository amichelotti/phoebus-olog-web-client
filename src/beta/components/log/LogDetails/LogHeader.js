import React from "react";
import { Stack } from "@mui/material";
import LogDetailActionButton from "./LogDetailActionButton";
import { CreatedDate } from "./CreatedDate";
import { KeyValueTable } from "./KeyValueTable";

const LogHeader = ({ log, className }) => (
  <Stack
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    className={className}
  >
    <KeyValueTable data={[
      {
        name: "Author",
        value: log.owner
      },
      {
        name: "Created",
        value: <CreatedDate log={log} />
      }]}
    />
    <LogDetailActionButton log={log} />
  </Stack>
);

export default LogHeader;