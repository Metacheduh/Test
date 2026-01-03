/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { DownloadRounded, UploadRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useRef, useState } from "react";
import { exportAdvisorData, importAdvisorData } from "../core/storage";

export function BackupControls(): JSX.Element {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleExport = () => {
    const blob = new Blob([exportAdvisorData()], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "advisor-os-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Backup exported");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const updated = importAdvisorData(String(reader.result));
        setStatus(
          updated > 0
            ? `Restored ${updated} record${updated === 1 ? "" : "s"} — refresh to load data.`
            : "No advisor data found in file.",
        );
      } catch (error) {
        setStatus((error as Error).message);
      } finally {
        if (fileInput.current) fileInput.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      <Button
        size="sm"
        startDecorator={<DownloadRounded />}
        variant="soft"
        color="primary"
        onClick={handleExport}
      >
        Export JSON
      </Button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        hidden
        onChange={handleImport}
      />
      <Button
        size="sm"
        startDecorator={<UploadRounded />}
        variant="plain"
        color="neutral"
        onClick={() => fileInput.current?.click()}
      >
        Import JSON
      </Button>
      {status && (
        <Typography level="body-sm" color="neutral">
          {status}
        </Typography>
      )}
    </Stack>
  );
}
