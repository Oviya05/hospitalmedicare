import React from "react";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";

const UploadImage = () => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const url = await uploadImageToCloudinary(file);
      console.log("Uploaded image URL:", url);
      alert("Upload successful!");
    } catch (err) {
      alert("Upload failed: " + err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload Image to Cloudinary</h2>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default UploadImage;