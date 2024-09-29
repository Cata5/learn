'use client'
import { useState } from 'react';

export default function Home() {
  const [translations, setTranslations] = useState([{ german: '', romanian: '' }]);
  const [name, setName] = useState('');

  const handleAddTranslation = () => {
    setTranslations([...translations, { german: '', romanian: '' }]);
  };

  const handleChange = (index, field, value) => {
    const newTranslations = [...translations];
    newTranslations[index][field] = value;
    setTranslations(newTranslations);
  };

  const handleSave = async () => {
    const response = await fetch('/api/translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, translations }),
    });
    if (response.ok) {
      alert('Translations saved!');
      setTranslations([{ german: '', romanian: '' }]); // Reset the form
      setName('');
    } else {
      alert('Error saving translations.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Translations</h1>
      <input
        type="text"
        placeholder="Enter file name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      {translations.map((translation, index) => (
        <div key={index} className="flex mb-2 space-x-2">
          <input
            type="text"
            placeholder="German"
            value={translation.german}
            onChange={(e) => handleChange(index, 'german', e.target.value)}
            className="border p-2 flex-1"
          />
          <input
            type="text"
            placeholder="Romanian"
            value={translation.romanian}
            onChange={(e) => handleChange(index, 'romanian', e.target.value)}
            className="border p-2 flex-1"
          />
        </div>
      ))}
      <button
        onClick={handleAddTranslation}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Add More
      </button>
      <button
        onClick={handleSave}
        className="bg-green-500 text-white p-2 rounded mt-2"
      >
        Save
      </button>
    </div>
  );
}
