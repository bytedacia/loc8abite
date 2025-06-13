import React from "react";

interface ResultModalProps {
  result: string | null;
  show: boolean;
  score: number | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, show, score }) => {
  if (!show || result === null || score === null) return null;

  return (
    <div className="result-modal">
      <div className="modal-content">
        <h2>{score === 100 ? "🎉 Correct!" : ""}</h2>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default ResultModal;
