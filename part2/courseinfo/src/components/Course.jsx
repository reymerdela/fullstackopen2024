const Header = ({ title }) => {
  return <h2>{title}</h2>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  const countExercises = (prev, curr) => prev + curr.exercises;
  const total = parts.reduce(countExercises, 0);

  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
      <p>
        <strong>total of {total} exercises</strong>
      </p>
    </>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

export default Course;
