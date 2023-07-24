import express from "express";
import verifyToken from "../middleware/auth";
import multerUpload from "../middleware/multer";
import blog from "../controller";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  multerUpload("./public/imageBlog", "Blog").single("file"),
  blog.createBlog
);
router.get("/get", blog.getAll);
router.post("/like", verifyToken, blog.likeBlog);
router.get("/getlike", verifyToken, blog.getLike);

export default router;
