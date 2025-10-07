// src/pages/LevelPage.js
import React from "react";
import { useParams } from "react-router-dom";

const levelContent = {
  1: {
    1: {
      1: {
        title: "Welcome to Python!",
        content: `
### What is Python?
Python is a high-level, interpreted programming language known for its simplicity and readability. 
It allows developers to focus on solving problems rather than dealing with complex syntax.
It is very simple to use and comes with a ton of libraries.

### Origin
Python was created by Guido van Rossum and first released in 1991. 
It was designed with code readability in mind and emphasizes using clear, straightforward syntax.
        `
      },
      2: {
        title: "Print Statement",
        content: `
### The print() Function
The print() function in Python is used to display output on the screen.
Just like in other programming languages, it helps you communicate with the user by showing messages, results, or any other information.

Messages can be either enclosed with single quotes(' ') or double quotes(" ").
Example:
\`\`\`python
print("Hello, World!")
\`\`\`
        `
      },
      3: {
        title: "Using print()",
        content: `
The print() function can take multiple arguments, separated by commas, and will print them all on the same line with a space in between by default.
That's because the print() function by default adds a newline character (\n) at the end of its output.

### Printing in the same line :
You can change this behavior by using the \`end\` parameter of the print() function.
Example:
print("Hello", end=" ")
print("World!")
Output:
Hello World!
        `
      }
    }
  }
};

const LevelPage = () => {
  const { moduleId, lessonId, levelId } = useParams();
  const level = levelContent[moduleId]?.[lessonId]?.[levelId];

  if (!level)
    return <h2 className="text-center text-red-400 mt-10">Level content not found</h2>;

  return (
    <div className="p-8 text-gray-200 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">{level.title}</h1>
      <div
        className="prose prose-invert"
        dangerouslySetInnerHTML={{ __html: level.content.replace(/\n/g, "<br/>") }}
      />
    </div>
  );
};

export default LevelPage;
