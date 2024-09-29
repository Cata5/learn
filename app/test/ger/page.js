"use client";
import { useState, useEffect } from 'react';

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [mode, setMode] = useState('germanToRomanian'); // Default mode
  const [usedWords, setUsedWords] = useState([]); // Track used words
  const [totalWords, setTotalWords] = useState(0); // Total number of words
  const [wordData, setWordData] = useState([]); // Store the fetched word data

  useEffect(() => {
    // Fetch available test files
    const fetchTests = async () => {
      const res = await fetch('/api/translations');
      const fileList = await res.json();
      setTests(fileList);
    };
    fetchTests();
  }, []);

  const handleTestSelection = async (event) => {
    const fileName = event.target.value;
    setSelectedTest(fileName);
    
    if (fileName) {
      const response = await fetch(`/api/translations/${fileName}`);
      const data = await response.json();
      setWordData(data); // Set the fetched data
      setTotalWords(data.length); // Set total words
      setUsedWords([]); // Reset used words
      setCorrectCount(0); // Reset correct count
      setIncorrectCount(0); // Reset incorrect count
      setUserAnswer(''); // Clear input
      fetchRandomWord(data); // Pass the actual data
      setFeedback(''); // Reset feedback when selecting a new test
    }
  };

  const fetchRandomWord = (data) => {
    // Filter out used words
    const availableWords = data.filter(word => !usedWords.includes(word));
    
    if (availableWords.length > 0) {
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(randomWord);
      setUsedWords(prev => [...prev, randomWord]); // Add to used words
    } else {
      setCurrentWord(null); // No more words available
      setFeedback('All words have been used!'); // Indicate all words have been tested
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (currentWord) {
      let correctAnswer = '';
      
      // Determine the correct answer based on the mode
      if (mode === 'germanToRomanian') {
        correctAnswer = currentWord.romanian;
      } else if (mode === 'romanianToGerman') {
        correctAnswer = currentWord.german;
      }

      if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        setFeedback('Correct!');
        setCorrectCount(prev => prev + 1); // Increment correct count
      } else {
        setFeedback(`Incorrect! The correct answer is: ${correctAnswer}`);
        setIncorrectCount(prev => prev + 1); // Increment incorrect count
      }

      // Reset input and fetch a new word
      setUserAnswer('');
      fetchRandomWord(wordData); // Pass the fetched word data
    }
  };

  const handleRetake = () => {
    // Reset all states to start over
    setUsedWords([]);
    setCorrectCount(0);
    setIncorrectCount(0);
    setUserAnswer('');
    setFeedback('');
    setCurrentWord(null); // Reset current word to null to trigger word fetching
    fetchRandomWord(wordData); // Fetch a new word
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-5">
      <h1 className="text-3xl mb-4">German Translation Test</h1>

      <select onChange={handleTestSelection} value={selectedTest} className="bg-white text-black mb-4 p-2 rounded">
        <option value="">Select a test</option>
        {tests.map((test) => (
          <option key={test} value={test}>{test}</option>
        ))}
      </select>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="germanToRomanian"
            checked={mode === 'germanToRomanian'}
            onChange={() => setMode('germanToRomanian')}
          />
          German to Romanian
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="romanianToGerman"
            checked={mode === 'romanianToGerman'}
            onChange={() => setMode('romanianToGerman')}
          />
          Romanian to German
        </label>
        <label>
          <input
            type="radio"
            value="none"
            checked={mode === 'none'}
            onChange={() => setMode('none')}
          />
          Both (Show nothing)
        </label>
      </div>

      {currentWord && mode !== 'none' && (
        <div className="bg-gray-800 p-5 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-xl mb-4">
            {mode === 'germanToRomanian' && `${currentWord.german} = ?`}
            {mode === 'romanianToGerman' && `${currentWord.romanian} = ?`}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border p-2 mb-2 w-full rounded text-black"
              placeholder="Your answer"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Submit</button>
          </form>
          {feedback && <p className="mt-2">{feedback}</p>}
        </div>
      )}

      {mode === 'none' && currentWord && (
        <div className="bg-gray-800 p-5 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-xl mb-4">Translate both words!</h2>
          <p>What is "{currentWord.german}" in Romanian and "{currentWord.romanian}" in German?</p>
        </div>
      )}

      <div className="mt-5 text-lg">
        <p>Total Words: <span className="text-yellow-400">{totalWords}</span></p>
        <p>Correct Answers: <span className="text-green-400">{correctCount}</span></p>
        <p>Incorrect Answers: <span className="text-red-400">{incorrectCount}</span></p>
      </div>

      {currentWord === null && totalWords > 0 && (
        <button onClick={handleRetake} className="mt-5 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
          Retake Test
        </button>
      )}
    </div>
  );
};

export default TestPage;
