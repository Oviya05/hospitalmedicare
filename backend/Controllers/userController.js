import User from "../models/UserSchema.js";
import BookingSchema from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};


export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ role: "patient" }).select("-password");
    res.status(200).json({
      success: true,
      message: "Patients found",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile info retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get profile",
    });
  }
};

export const getMyAppointments = async(req,res) => {
  try {

    const booking = await BookingSchema.find({ user: req.userId });

    const doctorIds = booking.map(el => el.doctor);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select("-password");

    res.status(200).json({success:true,message:'appointments are getting',data:doctors})

  } catch (err) {
    console.log(err)
    res.status(500).json({success:false,message:"something went wrong , cannot get" });
  }
}


