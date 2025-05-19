import React from 'react';

interface ResultModalProps {
  result: string | null;
  show: boolean;
  onNext: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, show, onNext }) => {
  if (!show) return null;
  return (
    <div className="result-modal">
      <div style={{ color: result?.includes('Correct!') ? 'green' : 'red' }}>{result}</div>
      <button onClick={onNext}>Next Photo</button>
    </div>
  );
};

export default ResultModal;
