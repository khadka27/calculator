"use client";

import { useState, useEffect, useRef } from "react";
import { FaBackspace } from "react-icons/fa";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const Calculator = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const evaluateInput = () => {
    try {
      const evalResult = eval(input).toString();
      setResult(evalResult);
      setHistory([...history, `${input} = ${evalResult}`]);
      setInput("");
    } catch {
      setResult("Error");
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === "=") {
      evaluateInput();
    } else if (value === "C") {
      handleClear();
    } else {
      setInput(input + value);
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;
    if (/\d|\+|\-|\*|\/|\./.test(key)) {
      setIsActive(true);
      setInput(input + key);
      setTimeout(() => setIsActive(false), 100); // Briefly show the press effect
    } else if (key === "Enter") {
      setIsActive(true);
      evaluateInput();
      setTimeout(() => setIsActive(false), 100); // Briefly show the press effect
    } else if (key === "Backspace") {
      setIsActive(true);
      handleDelete();
      setTimeout(() => setIsActive(false), 100); // Briefly show the press effect
    } else if (key === "Escape") {
      setIsActive(true);
      handleClear();
      setTimeout(() => setIsActive(false), 100); // Briefly show the press effect
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, input]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-80 bg-gray-900 rounded-lg shadow-lg p-4">
          <PerfectScrollbar className="mb-4" style={{ maxHeight: "120px" }}>
            <div
              ref={inputRef}
              className={`text-xl font-mono break-all ${
                isActive ? "bg-gray-800" : ""
              }`}
              style={{ minHeight: "60px" }}
            >
              {input || result}
            </div>
          </PerfectScrollbar>
          <button onClick={handleDelete} className="text-xl mb-4">
            <FaBackspace />
          </button>
          <div className="grid grid-cols-4 gap-2">
            {[
              "7",
              "8",
              "9",
              "/",
              "4",
              "5",
              "6",
              "*",
              "1",
              "2",
              "3",
              "-",
              "0",
              ".",
              "C",
              "+",
              "=",
            ].map((value) => (
              <button
                key={value}
                className={`bg-orange-500 hover:bg-orange-600 rounded p-4 text-xl font-mono text-white ${
                  value === "=" ? "col-span-4" : ""
                }`}
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-80 bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-mono">History</h2>
            <button
              className="bg-red-500 hover:bg-red-600 rounded p-2 text-sm font-mono"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          </div>
          <PerfectScrollbar style={{ height: "calc(100vh - 200px)" }}>
            <ul className="list-disc list-inside">
              {history.map((entry, index) => (
                <li key={index} className="text-sm font-mono">
                  {entry}
                </li>
              ))}
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
