import React, { useEffect, useState } from "react";

// ✅ API_URL already includes /api/image
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/image";

const Form = () => {
  const [fileinput, setfileinput] = useState([]);
  const [selectedimages, setselectedimages] = useState([]);

  // Load saved images from localStorage
  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("selectedimages"));
    if (savedImages) {
      setselectedimages(savedImages);
    }
  }, []);

  // Handle file selection (multiple allowed)
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

    const formData = new FormData();
    fileinput.forEach((file) => formData.append("images", file));

    try {
      // ✅ Upload to backend
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

      const data = await response.json();
      console.log("Upload response:", data);

      // ✅ Fetch each uploaded image
      const newImages = [];
      for (const img of data.uploaded) {
        const imgRes = await fetch(`${API_URL}/${img.id}`);
        if (!imgRes.ok) throw new Error("Failed to fetch uploaded image");

        const arrayBuffer = await imgRes.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuffer);
        const url = `data:${img.contentType};base64,${base64}`;
        newImages.push(url);
      }

      const updated = [...selectedimages, ...newImages];
      setselectedimages(updated);
      localStorage.setItem("selectedimages", JSON.stringify(updated));
    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <form onSubmit={handleImage}>
        <input type="file" accept="image/*" multiple onChange={onChangeHandle} />
        <br /><br />
        <button type="submit">Upload Image(s)</button>
      </form>

      {selectedimages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Images:</h3>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
            {selectedimages.map((img, index) => (
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
