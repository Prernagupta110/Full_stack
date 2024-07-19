import React from 'react';

const Header = (props) => (
  <div>
    <h1>{props.course}</h1>
  </div>
);

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
    return(
        parts.map(part=> <Part key={part.id} part={part}/>)
    )
}

const Total = ({ parts }) =>{ 
    const total_Exercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <p>
            <strong>total of {total_Exercises} exercises</strong>
        </p>
    )
}

const Course = ({course}) =>{
    return(
        course.map(course=>
            <div key={course.id}>
                <Header course={course.name} />
                <Content parts={course.parts} />
                <Total parts={course.parts} />
            </div>
        )
    )
}

export default Course