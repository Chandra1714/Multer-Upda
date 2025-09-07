import React, { useEffect, useState } from "react";
import "./Form.css"; 

const API_URL = import.meta.env.VITE_API_URL ;

const Form = () => {
  const [fileinput, setfileinput] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("uploadedImages"));
    if (saved && saved.length > 0) {
      setImages(saved);
    }
  }, []);

  const onChangeHandle = (e) => setfileinput([...e.target.files]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleImage = async (e) => {
    e.preventDefault();
    if (fileinput.length === 0) return;

    try {
      let uploaded = [];

      for (const file of fileinput) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_URL}/api/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

        const data = await response.json();

        const imgRes = await fetch(`${API_URL}/api/image/${data.id}`);
        if (!imgRes.ok) throw new Error("Failed to fetch uploaded image");

        const arrayBuffer = await imgRes.arrayBuffer();
        const base64 = arrayBufferToBase64(arrayBuffer);
        const url = `data:image/png;base64,${base64}`;

        uploaded.push(url);
      }

      const allImages = [...images, ...uploaded];
      setImages(allImages);
      localStorage.setItem("uploadedImages", JSON.stringify(allImages));

      setfileinput([]);
      document.getElementById("fileInput").value = "";

    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleImage} className="upload-form">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={onChangeHandle}
        />
        <button type="submit">Upload</button>
      </form>

      {images.length > 0 && (
        <div className="gallery">
          <h3>Uploaded Images:</h3>
          <div className="image-grid">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Uploaded ${i}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
