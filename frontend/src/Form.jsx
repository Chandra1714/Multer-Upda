import React, { useEffect, useState } from "react";

// Backend API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Form = () => {
  const [fileinput, setfileinput] = useState(null);
  const [selectedimage, setselectedimage] = useState(null);

  // Load saved image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("selectedimage");
    if (savedImage) {
      setselectedimage(savedImage);
    }
  }, []);

  // Handle file selection
  const onChangeHandle = (e) => setfileinput(e.target.files[0]);

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Handle image upload
  const handleImage = async (e) => {
    e.preventDefault();
    if (!fileinput) return;

    const formData = new FormData();
    formData.append("image", fileinput);

    try {
      // Upload image to backend
      const response = await fetch(`${API_URL}/api/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

      const data = await response.json();
      console.log("Upload response:", data);

      // Fetch uploaded image from backend
      const imgRes = await fetch(`${API_URL}/api/image/${data.id}`);
      if (!imgRes.ok) throw new Error("Failed to fetch uploaded image");

      const arrayBuffer = await imgRes.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      const url = `data:image/png;base64,${base64}`; // Adjust mime type dynamically if needed

      setselectedimage(url);
      localStorage.setItem("selectedimage", url); // persist across reloads/devices

    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <form onSubmit={handleImage}>
        <input type="file" accept="image/*" onChange={onChangeHandle} />
        <br /><br />
        <button type="submit">Upload Image</button>
      </form>

      {selectedimage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Image:</h3>
          <img
            src={selectedimage}
            alt="Uploaded"
            width="200"
            style={{ borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Form;
