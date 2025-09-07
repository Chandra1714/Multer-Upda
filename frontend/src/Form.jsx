import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Form = () => {
  const [fileinput, setfileinput] = useState(null);
  const [selectedimage, setselectedimage] = useState(null);

  useEffect(() => {
    const savedimage = localStorage.getItem("selectedimage");
    if (savedimage) {
      setselectedimage(savedimage);
    }
  }, []);

  const onChangeHandle = (e) => setfileinput(e.target.files[0]);

  const handleImage = async (e) => {
    e.preventDefault();
    if (!fileinput) return;

    const formData = new FormData();
    formData.append("image", fileinput);

    try {
      // 🔹 Upload image
      const response = await fetch(`${API_URL}/api/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);

      // ✅ handle both `id` and `_id`
      const imageId = data.id || data._id;

      if (!imageId) {
        throw new Error("No image ID returned from backend");
      }

      // 🔹 Fetch uploaded image
      const imgRes = await fetch(`${API_URL}/api/image/${imageId}`);
      if (!imgRes.ok) {
        throw new Error("Failed to fetch uploaded image");
      }

      const blob = await imgRes.blob();
      const url = URL.createObjectURL(blob);

      setselectedimage(url);
      localStorage.setItem("selectedimage", url);
    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleImage}>
        <input type="file" accept="image/*" onChange={onChangeHandle} />
        <br />
        <button type="submit">Upload Image</button>
      </form>

      {selectedimage && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={selectedimage} alt="Uploaded" width="200" />
        </div>
      )}
    </div>
  );
};

export default Form;
