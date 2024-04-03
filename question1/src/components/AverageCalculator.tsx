import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AverageCalculator: React.FC = () => {
  const [numberId, setNumberId] = useState<string>('');
  const [result, setResult] = useState<{ windowPrevState: number[]; windowCurrState: number[]; numbers: number[]; avg: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9876/numbers/${numberId}`);
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (numberId) {
      fetchData();
    }
  }, [numberId]);

  const handleNumberIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberId(e.target.value);
  };

  return (
    <div>
      <input type="text" value={numberId} onChange={handleNumberIdChange} placeholder="Enter number ID" />
      {result && (
        <div>
          <p>Window Previous State: {result.windowPrevState.join(', ')}</p>
          <p>Window Current State: {result.windowCurrState.join(', ')}</p>
          <p>Numbers: {result.numbers.join(', ')}</p>
          <p>Average: {result.avg}</p>
        </div>
      )}
    </div>
  );
};

export default AverageCalculator;