import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(initializeAnecdotes())
    }, [])

    const anecdotes = useSelector(({ filter, anecdotes }) => {
        return filter  === '' 
          ? anecdotes
          : anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      })

    const handleVote = (id, content) => {
        dispatch(vote(id))
        dispatch(setNotification(`you voted '${content}'`, 10))

    }

    return(
        <div>
        {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote => 
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => handleVote(anecdote.id, anecdote.content)}>vote</button>
            </div>
            </div>
        )}
        </div>
        )}
export default Anecdotes