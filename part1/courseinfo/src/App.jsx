function Header({ course: { name } }) {
  return <h1>{name}</h1>;
}
function Content({ parts }) {
  return (
    <div>
      {parts.map((part, index) => {
        return (
          <p key={index}>
            {part.name} {part.exercises}
          </p>
        );
      })}
    </div>
  );
}

function Total({ total }) {
  const totalExercises = total.reduce((prev, curr) => {
    return prev + curr.exercises;
  }, 0);
  return <p>Number of exercises {totalExercises}</p>;
}

function App() {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  };
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total total={course.parts} />
    </div>
  );
}

function hola() {}

export default App;
