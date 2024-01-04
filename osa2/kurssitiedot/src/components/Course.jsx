import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = (props) => {
  const ExercisesSum = props.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (<div>
    <Header course={props.name} />
    <Content parts={props.parts} />
    <Total total={ExercisesSum} />
  </div>)
}

export default Course