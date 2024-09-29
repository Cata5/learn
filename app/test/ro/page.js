"use client";

import { useState, useEffect } from "react";

export default function PracticeParagraphs() {
  const [selectedFile, setSelectedFile] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctParagraph, setCorrectParagraph] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch("/api/paragraphs");
      const data = await response.json();
      setFiles(data.files);
    };
    fetchFiles();
  }, []);

  const handleFileChange = async (e) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);

    const response = await fetch(`/api/paragraphs/${fileName}`);
    const data = await response.json();
    setParagraphs(data);
    setCurrentParagraphIndex(0);
    setUserInput(""); // Reset user input when a new file is selected
    setShowResults(false); // Reset results display
  };

  const handleCheck = () => {
    const currentParagraph = paragraphs[currentParagraphIndex].text;
    if (userInput.trim() === currentParagraph.trim()) {
      setIsCorrect(true);
      setCorrectParagraph(""); // No correct paragraph to show
    } else {
      setIsCorrect(false);
      setCorrectParagraph(currentParagraph); // Show the correct paragraph
    }
    setShowResults(true);
  };

  const handleRetake = () => {
    setUserInput("");
    setShowResults(false);
    setIsCorrect(false);
    setCorrectParagraph("");
    setCurrentParagraphIndex(0);
  };

  const handleNext = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      setCurrentParagraphIndex(currentParagraphIndex + 1);
      setUserInput("");
      setShowResults(false);
      setIsCorrect(false);
      setCorrectParagraph("");
    }
  };

  // Function to highlight correct and incorrect words
  const highlightDifferences = (userInput, correctAnswer) => {
    const userWords = userInput.split(" ");
    const correctWords = correctAnswer.split(" ");
    const result = [];

    const maxLength = Math.max(userWords.length, correctWords.length);
    for (let i = 0; i < maxLength; i++) {
      const userWord = userWords[i] || ""; // Handle undefined words
      const correctWord = correctWords[i] || ""; // Handle undefined words

      if (userWord === correctWord) {
        result.push(<span key={i} className="text-green-500">{userWord} </span>);
      } else {
        result.push(
          <span key={i} className="text-red-500">
            {userWord} (<span className="text-red-500">{correctWord}</span>)
          </span>
        );
      }
    }

    return result;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Practice Romanian Paragraphs</h1>
      <div className="w-full max-w-md">
        <select
          value={selectedFile}
          onChange={handleFileChange}
          className="border border-gray-600 p-2 mb-4 w-full bg-gray-800 text-white rounded-lg"
        >
          <option value="">Select a paragraph collection</option>
          {files.map((file) => (
            <option key={file} value={file}>
              {file.replace(".json", "")}
            </option>
          ))}
        </select>

        {paragraphs.length > 0 && (
          <div>
            {!showResults && (
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={showResults} // Disable input after checking
                className="border border-gray-400 p-2 mb-4 w-full bg-gray-800 text-white rounded-lg"
                placeholder="Type your paragraph here..."
              />
            )}

            {!showResults && (
              <button
                onClick={handleCheck}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Check Paragraph
              </button>
            )}

            {showResults && (
              <div className="mt-6">
                <p className="text-lg">
                  {isCorrect ? "Well done!" : "Try again!"}
                </p>
                <div className="mt-4">
                  <p>Your Input:</p>
                  <div className="text-white">
                    {highlightDifferences(userInput, correctParagraph)}
                  </div>
                </div>
                <button
                  onClick={handleRetake}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mr-4"
                >
                  Retake Test
                </button>
                {currentParagraphIndex < paragraphs.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                  >
                    Next Paragraph
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
