import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

// ✅ Get all reviews
export const getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("user doctor", "name email");
    res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// ✅ Create a new review
export const createReview = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const userId = req.userId; // from JWT middleware

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is missing in the request URL",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user ID not found from token",
      });
    }

    const { reviewText, rating } = req.body;

    if (!reviewText || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide both review text and rating",
      });
    }

    // ✅ Create and save the review
    const review = new Review({
      doctor: doctorId,
      user: userId,
      reviewText,
      rating,
    });

    const savedReview = await review.save();

    // ✅ Push review reference into the doctor document
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: { reviews: savedReview._id },
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
