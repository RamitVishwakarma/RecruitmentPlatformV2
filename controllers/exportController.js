import express from "express";
import prisma from "../utils/prisma.js";
import XLSX from "xlsx";
import { flatten } from "flat";
import { asyncHandler } from "../utils/asyncHandler.js";

const exportData = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      socialLinks: true,
      answer: true,
    },
  });

  const flattenedUsers = users.map((user) => flatten(user));

  const worksheet = XLSX.utils.json_to_sheet(flattenedUsers);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  return res.send(buffer);
});

export { exportData };
