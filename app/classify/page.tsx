"use client";

import { useState } from "react";

export default function ClassifyPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ text: string; label: string }[]>([]);

  const getColor = (label: string) => {
    switch (label.toLowerCase()) {
      case "safe":
        return "text-green-600 font-semibold";
      case "sarcasm":
        return "text-yellow-600 font-semibold";
      case "abusive":
      case "harassment":
      case "dangerous":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data.label);

      // Add to history (keep last 10)
      setHistory((prev) => [{ text, label: data.label }, ...prev].slice(0, 10));
    } catch (error) {
      console.error(error);
      setResult("Error connecting to backend");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Message Classifier</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          className="w-full p-2 border rounded mb-3"
          rows={4}
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading || !text}
        >
          {loading ? "Classifying..." : "Classify"}
        </button>
      </form>

      {result && (
        <div className="mt-4 text-lg">
          <span className="font-semibold">Result: </span>
          <span className={getColor(result)}>{result}</span>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-lg font-bold mb-2">History</h2>
          <ul className="space-y-1">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b pb-1 text-sm"
              >
                <span className="truncate max-w-[70%]">{item.text}</span>
                <span className={getColor(item.label)}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
