import { useState } from 'react'

function Button({ handleClick, text }) {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  );
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [most, setMost] = useState(0)
  const [vote, setVotes] = useState(Array(7).fill(0))

  const voteAnec = () =>{
    const copy = [...vote]
    copy[selected]++
    setVotes(copy)
    let maxValue = copy.indexOf(Math.max(...copy));
    setMost(maxValue)
  }
  const random_num = ()=>Math.floor(Math.random() * 7) 
  const update= ()=>setSelected(random_num())

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br></br>
      has {vote[selected]} votes<br></br>
      <Button handleClick = {voteAnec} text = 'vote'/>
      <Button handleClick = {update} text = 'next anecdote'/>
      <h1>Anecdote with most votes</h1>
      {anecdotes[most]}<br></br>
      has {vote[most]} votes
    </div>
  )
}

export default App
