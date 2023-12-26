import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = ({good, neutral, bad}) => {
  if (good+neutral+bad === 0) {
    return (
    <div> 
      <h2>statistics</h2> 
      No feedback given
      </div>)
  }
  return (
  <div>
  <h2>statistics</h2>    
  <table>
  <tbody>
  <StatisticLine text="good" value ={good} />
  <StatisticLine text="neutral" value ={neutral} />
  <StatisticLine text="bad" value ={bad} />
  <StatisticLine text="all" value ={<All good={good} neutral={neutral} bad={bad} />} />
  <StatisticLine text="average" value ={<Average good={good} neutral={neutral} bad={bad} />} />
  <StatisticLine text="positive" value ={<Positive good={good} neutral={neutral} bad={bad} />} />
  </tbody>
  </table>
</div>)
}

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return (<tr><td>{props.text} </td>
    <td>{props.value} %</td></tr>)
  }
  return (<tr><td>{props.text} </td>
          <td>{props.value}</td></tr>)
}

const All = ({good, neutral, bad}) => (good+neutral+bad)

const Average = ({good, neutral, bad}) => {
  if (good+neutral+bad === 0) {
    return (0)
  }
  return ((good-bad)/(good+neutral+bad))
}

const Positive = ({good, neutral, bad}) => ((good/(good+neutral+bad))*100)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => {
    console.log('good value now', newValue)
    setGood(newValue)
  }

  const setToNeutral = newValue => {
    console.log('neutral value now', newValue)
    setNeutral(newValue)
  }

  const setToBad = newValue => {
    console.log('bad value now', newValue)
    setBad(newValue)
  }
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
      </div>

  )
}

export default App