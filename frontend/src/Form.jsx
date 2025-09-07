import React, { useEffect, useState } from "react";

// API_URL points to your Render backend base (no /api/image)
const API_URL = import.meta.env.VITE_API_URL ;

const Form = () => {
  const [fileinput, setfileinput] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // Load saved images from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedImages"));
    if (saved) setSelectedImages(saved);
  }, []);

  // Handle file selection (multiple)
  const onChangeHandle = (e) => setfileinput(Array.from(e.target.files));

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
    if (fileinput.length === 0) return;

    try {
      const formData = new FormData();
      fileinput.forEach((file) => formData.append("images", file));

      // ✅ Upload images
     const response = await fetch(`${API_URL}/api/image/upload`, {
  method: "POST",
  body: formData,
});

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

      const data = await response.json();

      // Fetch each uploaded image
      const newImages = [];
      for (const img of data.uploaded) {
        const imgRes = await fetch(`${API_URL}/api/image/${img.id}`);
        if (!imgRes.ok) throw new Error("Failed to fetch uploaded image");

        const arrayBuffer = await imgRes.arrayBuffer();
        const url = `data:image/png;base64,${arrayBufferToBase64(arrayBuffer)}`;
        newImages.push(url);
      }

      const allImages = [...selectedImages, ...newImages];
      setSelectedImages(allImages);
      localStorage.setItem("selectedImages", JSON.stringify(allImages));

      // Reset file input
      setfileinput([]);
      document.getElementById("fileInput").value = "";

    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <form onSubmit={handleImage}>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={onChangeHandle}
        />
        <br /><br />
        <button type="submit">Upload Image(s)</button>
      </form>

      {selectedImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Images:</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            {selectedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Uploaded ${index}`}
                width="200"
                style={{ borderRadius: "8px" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
