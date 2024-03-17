import { useState } from 'react';

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <th>{text}</th>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ feedback }) => {
  const { good, neutral, bad } = feedback;
  const allValues = Array.from(Object.values(feedback));
  const all = allValues.reduce((a, b) => a + b);
  const average = all && (good - bad) / all;
  const positive = all && (good / all) * 100;

  if (!all) {
    return (
      <div>
        <h2>stadistics</h2>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h2>stadistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="positive" value={positive} />
          <StatisticLine text="average" value={average} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [feedback, setFeedBack] = useState({ good: 0, neutral: 0, bad: 0 });

  const setCorrectFeedback = (state) => {
    return () => setFeedBack({ ...feedback, [state]: feedback[state] + 1 });
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={setCorrectFeedback('good')} />
      <Button text="neutral" onClick={setCorrectFeedback('neutral')} />
      <Button text="bad" onClick={setCorrectFeedback('bad')} />
      <Statistics feedback={feedback} />
    </div>
  );
};

export default App;
