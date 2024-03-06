import { useMutation, useQueryClient} from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.length < 5) {
      dispatch( { type:'SET', payload: `Anecdote must be at least 5 letters` })
      setTimeout(() => {dispatch({ type:'EMPTY' })}, 5000)
    } else {
    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatch({ type:'SET', payload: `You added ${content}`})
    setTimeout(() => {dispatch({ type:'EMPTY' })}, 5000)
}}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
