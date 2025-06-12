import React from "react";
import "./PhotoGuessMode.css";

interface ResultModalProps {
  result: string | null;
  show: boolean;
  score?: number | null;
}

function getScoreColor(score: number | null): string {
  if (score === null) return "#888";
  if (score >= 90) return "#2ecc40"; // green
  if (score >= 70) return "#b6e51d"; // lime
  if (score >= 40) return "#ffdc00"; // yellow
  if (score >= 20) return "#ff851b"; // orange
  return "#ff4136"; // red
}

const ResultModal: React.FC<ResultModalProps> = ({ result, show, score }) => {
  if (!show) return null;
  const lines = result ? result.split("\n") : [];
  return (
    <div className="result-modal">
      <div
        style={{
          color: getScoreColor(score ?? null),
          fontWeight: 600,
          fontSize: "1.2em",
        }}
      >
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default ResultModal;
