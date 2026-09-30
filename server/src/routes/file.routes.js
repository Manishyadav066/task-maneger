const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
    uploadFile,
    getFilesByTask,
    getFile,
    downloadFile,
    deleteFile,

 } = require("../controllers/file.controller");

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/task/:taskId", authMiddleware, getFilesByTask);

router.get("/:fileId/download", authMiddleware, downloadFile);

router.get("/:fileId", authMiddleware, getFile);

router.delete("/:fileId", authMiddleware, deleteFile);

module.exports = router;
