"use client";

import { useState } from "react";

export default function AddParagraph() {
  const [title, setTitle] = useState(""); // Title input
  const [paragraphs, setParagraphs] = useState([{ id: 1, text: "" }]);

  const addParagraph = () => {
    setParagraphs([...paragraphs, { id: paragraphs.length + 1, text: "" }]);
  };

  const removeParagraph = (id) => {
    setParagraphs(paragraphs.filter((p) => p.id !== id));
  };

  const handleChange = (id, value) => {
    setParagraphs(
      paragraphs.map((p) => (p.id === id ? { ...p, text: value } : p))
    );
  };

  const handleSave = async () => {
    if (!title) {
      alert("Please enter a title for the file.");
      return;
    }

    const response = await fetch("/api/paragraphs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: title, paragraphs }),
    });

    if (response.ok) {
      alert("Paragraphs saved successfully.");
      setTitle("");
      setParagraphs([{ id: 1, text: "" }]);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Add Romanian Paragraphs</h1>

        {/* Title input */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Title (file name):</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 p-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the file title"
          />
        </div>

        {/* Paragraphs input */}
        {paragraphs.map((paragraph) => (
          <div key={paragraph.id} className="mb-4 flex items-center">
            <textarea
              className="w-full bg-gray-800 border border-gray-600 p-2 rounded-lg"
              value={paragraph.text}
              onChange={(e) => handleChange(paragraph.id, e.target.value)}
              placeholder="Enter Romanian paragraph"
            />
            {paragraphs.length > 1 && (
              <button
                onClick={() => removeParagraph(paragraph.id)}
                className="ml-4 text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={addParagraph}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Paragraph
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Save Paragraphs
          </button>
        </div>
      </div>
    </div>
  );
}
