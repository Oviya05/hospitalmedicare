import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";



export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  // Validate MongoDB ObjectId
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
  }

  try {
    // Only allow these fields to be updated
    const allowedUpdates = [
      "name",
      "phone",
      "photo",
      "ticketPrice",
      "specialization",
      "qualifications",
      "experiences",
      "bio",
      "about",
      "timeSlots",
      "isApproved",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) updates[key] = req.body[key];
    });

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // hide password

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedDoctor,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: err.message,
    });
  }
};

// -----------------------------
// Delete doctor
// -----------------------------
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    console.error("Delete doctor error:", err);
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// -----------------------------
// Get single doctor
// -----------------------------
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).populate("reviews").select("-password");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "No Doctor found" });
    }

    console.log("Doctor timeSlots:", doctor.timeSlots);

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (err) {
    console.error("Error in getSingleDoctor:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// Get all doctors
// -----------------------------
export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select("-password");
    }

    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors,
    });
  } catch (err) {
    console.error("Error in getAllDoctor:", err);
    res.status(500).json({ success: false, message: "Not found" });
  }
};

// -----------------------------
// Get logged-in doctor profile
// -----------------------------
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });

    res.status(200).json({
      success: true,
      message: "Profile info fetched",
      data: {
        ...rest,
        appointments,
      },
    });
  } catch (err) {
    console.error("getDoctorProfile Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


