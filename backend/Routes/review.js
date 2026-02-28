import express from "express";
import { createReview, getAllReview } from "../Controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router({ mergeParams: true }); // needed to access doctorId


router
  .route("/")
  .get(getAllReview)
  .post(authenticate, restrict(["patient"]), createReview);

export default router;
