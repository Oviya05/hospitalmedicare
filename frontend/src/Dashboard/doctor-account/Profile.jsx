import { useEffect, useState, useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "./../../utils/uploadCloudinary";
import { BASE_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";


const Profile = ({ doctorData }) => {
   const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: "",
    qualifications: [],
    experiences: [],
    timeSlots: [],
    about: "",
    photo: "",
  });

  // ✅ FIX: always set arrays correctly
  useEffect(() => {
    setFormData({
      name: doctorData?.name || "",
      email: doctorData?.email || "",
      password: "",
      phone: doctorData?.phone || "",
      bio: doctorData?.bio || "",
      gender: doctorData?.gender || "",
      specialization: doctorData?.specialization || "",
      ticketPrice: doctorData?.ticketPrice || "",
      qualifications: doctorData?.qualifications || [],
      experiences: doctorData?.experiences || [],
      timeSlots: doctorData?.timeSlots || [],
      about: doctorData?.about || "",
      photo: doctorData?.photo || "",
    });
  }, [doctorData]);

  // ------------------------------
  // Basic Input Handler
  // ------------------------------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileInputChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const uploaded = await uploadImageToCloudinary(file);  
    console.log("Uploaded image URL:", uploaded.url);

    setFormData({ 
      ...formData, 
      photo: uploaded.url  // <-- FIXED
    });

  } catch (err) {
    console.error("Upload error:", err);
  }
};


    const updateProfileHandler = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${BASE_URL}/doctors/${doctorData?._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });


      const result = await res.json();

      if (!res.ok) {
        throw Error(result.message);
      }

      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ------------------------------
  // Reusable add item
  // ------------------------------
  const addItem = (key, item) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], item],
    }));
  };

  // ------------------------------
  // Reusable change handler
  // ------------------------------
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updatedItems = [...prev[key]];
      updatedItems[index][name] = value;

      return {
        ...prev,
        [key]: updatedItems,
      };
    });
  };

  // ------------------------------
  // Delete item
  // ------------------------------
  const deleteItem = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // ------------------------------
  // QUALIFICATIONS
  // ------------------------------
  const addQualification = (e) => {
    e.preventDefault();
    addItem("qualifications", {
      startingData: "",
      endingData: "",
      degree: "",
      university: "",
    });
  };

  const handleQualificationChange = (e, index) => {
    handleReusableInputChangeFunc("qualifications", index, e);
  };

  const deleteQualification = (e, index) => {
    e.preventDefault();
    deleteItem("qualifications", index);
  };

  // ------------------------------
  // EXPERIENCES
  // ------------------------------
  const addExperience = (e) => {
    e.preventDefault();

    // ✅ FIX: add experience item
    addItem("experiences", {
      startingData: "",
      endingData: "",
      position: "",
      hospital: "",
    });
  };

  const handleExperienceChange = (e, index) => {
    handleReusableInputChangeFunc("experiences", index, e);
  };

  const deleteExperience = (e, index) => {
    e.preventDefault();
    deleteItem("experiences", index);
  };

  // ------------------------------
  // TIME SLOTS
  // ------------------------------
  const addTimeSlot = (e) => {
    e.preventDefault();

    addItem("timeSlots", {
      day: "",
      startingTime: "",
      endingTime: "",
    });
  };

  const handleTimeSlotChange = (e, index) => {
    handleReusableInputChangeFunc("timeSlots", index, e);
  };

  const deleteTimeSlot = (e, index) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  };

  // ---------------------------------------------------------
  // RETURN JSX
  // ---------------------------------------------------------
  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>

      <form>
        {/* ---------------- NAME ---------------- */}
        <div className="mb-5">
          <p className="form_label">Name*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form_input"
          />
        </div>

        {/* ---------------- EMAIL ---------------- */}
        <div className="mb-5">
          <p className="form_label">Email*</p>
          <input
            type="text"
            name="email"
            value={formData.email}
            className="form_input"
            disabled
          />
        </div>

        {/* ---------------- PHONE ---------------- */}
        <div className="mb-5">
          <p className="form_label">Phone*</p>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form_input"
          />
        </div>

        {/* ---------------- BIO ---------------- */}
        <div className="mb-5">
          <p className="form_label">Bio*</p>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="form_input"
          />
        </div>

        {/* ---------------- Gender / SPECIALIZATION / PRICE ---------------- */}
        <div className="grid grid-cols-3 gap-5 mb-[30px]">
          <div>
            <p className="form_label">Gender*</p>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form_input py-3.5"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <p className="form_label">Specialization*</p>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="form_input py-3.5"
            >
              <option value="">Select</option>
              <option value="surgeon">Surgeon</option>
              <option value="neurologist">Neurologist</option>
              <option value="dermatologist">Dermatologist</option>
            </select>
          </div>

          <div>
            <p className="form_label">Ticket Price*</p>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              className="form_input"
            />
          </div>
        </div>

        {/* ---------------- QUALIFICATIONS ---------------- */}
        <div className="mb-5">
          <p className="form_label">Qualifications*</p>

          {formData.qualifications.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form_label">Starting Date*</p>
                  <input
                    type="date"
                    name="startingData"
                    value={item.startingData}
                    className="form_input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>

                <div>
                  <p className="form_label">Ending Date*</p>
                  <input
                    type="date"
                    name="endingData"
                    value={item.endingData}
                    className="form_input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form_label">Degree*</p>
                  <input
                    type="text"
                    name="degree"
                    value={item.degree}
                    className="form_input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>

                <div>
                  <p className="form_label">University*</p>
                  <input
                    type="text"
                    name="university"
                    value={item.university}
                    className="form_input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>
              </div>

              <button
                onClick={(e) => deleteQualification(e, index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-3 mb-[30px]"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}

          <button
            onClick={addQualification}
            className="bg-black text-white py-2 px-5 rounded"
          >
            Add Qualification
          </button>
        </div>

        {/* ---------------- EXPERIENCES ---------------- */}
        <div className="mb-5">
          <p className="form_label">Experiences*</p>

          {formData.experiences.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form_label">Starting Date*</p>
                  <input
                    type="date"
                    name="startingData"
                    value={item.startingData}
                    className="form_input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>

                <div>
                  <p className="form_label">Ending Date*</p>
                  <input
                    type="date"
                    name="endingData"
                    value={item.endingData}
                    className="form_input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="form_label">Position*</p>
                  <input
                    type="text"
                    name="position"
                    value={item.position}
                    className="form_input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>

                <div>
                  <p className="form_label">Hospital*</p>
                  <input
                    type="text"
                    name="hospital"
                    value={item.hospital}
                    className="form_input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
              </div>

              <button
                onClick={(e) => deleteExperience(e, index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-3 mb-[30px]"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}

          <button
            onClick={addExperience}
            className="bg-black text-white py-2 px-5 rounded"
          >
            Add Experience
          </button>
        </div>

        {/* ---------------- TIME SLOTS ---------------- */}
        <div className="mb-5">
          <p className="form_label">Time Slots*</p>

          {formData.timeSlots.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-[30px]">
                <div>
                  <p className="form_label">Day*</p>
                  <select
                    name="day"
                    value={item.day}
                    className="form_input py-3.5"
                    onChange={(e) => handleTimeSlotChange(e, index)}
                  >
                    <option value="">Select</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                  </select>
                </div>

                <div>
                  <p className="form_label">Starting Time*</p>
                  <input
                    type="time"
                    name="startingTime"
                    value={item.startingTime}
                    className="form_input"
                    onChange={(e) => handleTimeSlotChange(e, index)}
                  />
                </div>

                <div>
                  <p className="form_label">Ending Time*</p>
                  <input
                    type="time"
                    name="endingTime"
                    value={item.endingTime}
                    className="form_input"
                    onChange={(e) => handleTimeSlotChange(e, index)}
                  />
                </div>

                <div className="flex items-center">
                  <button
                    onClick={(e) => deleteTimeSlot(e, index)}
                    className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-6"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addTimeSlot}
            className="bg-black text-white py-2 px-5 rounded"
          >
            Add Time Slot
          </button>
        </div>

        {/* ---------------- ABOUT ---------------- */}
        <div className="mb-5">
          <p className="form_label">About*</p>
          <textarea
            name="about"
            rows={5}
            className="form_input"
            value={formData.about}
            onChange={handleInputChange}
          />
        </div>

        {/* ---------------- PHOTO UPLOAD ---------------- */}
        <div className="mb-5 flex items-center gap-3">
          {(formData.photo || doctorData?.photo) && (
  <figure className="w-[60px] h-[60px] rounded-full border overflow-hidden">
    <img
      src={
        formData.photo ||
        doctorData?.photo ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      alt="profile"
      className="w-full h-full object-cover rounded-full"
    />
  </figure>
)}


          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              id="customFile"
              accept=".jpg,.png"
              onChange={handleFileInputChange}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute w-full h-full flex items-center justify-center text-center bg-blue-200 text-black font-semibold rounded-lg cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="bg-primaryColor text-white py-3 px-4 w-full rounded-lg text-[18px]"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
