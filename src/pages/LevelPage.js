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
print("Hello, World!")

By default, the print() function adds a newline character at the end of its output, which means that each call to print() will start on a new line.
If you want to print multiple items on the same line, you can use the \`end\` parameter of the print() function to specify what should be printed at the end of the output instead of a newline character.
Example:
print("Hello", end=" ")
print("World!")
Output:
Hello World!
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
      },
      4: {
        title: "Comment Lines",
        content: `
### Comments in Python
Comments are lines in your code that are ignored by the Python interpreter. They are used to explain what the code does, making it easier for others (or yourself in the future) to understand the logic behind it.
They are also useful for temporarily disabling parts of your code during testing or debugging.

### Single-line Comments
In Python, you can create a single-line comment by starting the line with the hash symbol (#).
Example:

# This is a single-line comment

### Multi-line Comments
For longer comments that span multiple lines, you can use triple quotes (''' or """).
Example:
"""
This is a multi-line comment.
It can span multiple lines and is often used for documentation.
"""
        `
      }
    },
    2: {  
      1: {
        title: "Declaring Variables",
        content: `
### Variables in Python
A variable is used to store data. In Python, you need not declare the type of a variable; it is determined automatically based on the value you assign to it. 
This is known as dynamic typing.

Example:
x = 5
name = "Alice"

You can also change the value of a variable after it has been assigned.
Naming conventions:
- Variable names should start with a letter or an underscore (_).
- They can contain letters, numbers, and underscores.
- Variable names are case-sensitive (e.g., myVar and myvar are different variables).  
- Variable names cannot be the same as Python keywords (e.g., if, for, while, etc.).

        `
      },

      2: {
        title: "Data Type Basics",
        content: `
### Common Data Types

- int → Whole numbers
- float → Decimal numbers
- str → Text
- bool → True or False

Example:
age = 25
price = 9.99
name = "John"
is_student = True

Other data types include lists, tuples, dictionaries, and sets, which we will cover in later lessons.

        `
      },
      3: {
        title: "Casting in Python",
        content: `
Casting is the process of converting a variable from one data type to another. In Python, you can use built-in functions to perform casting.
Casting can be done using the following functions:
- int() → Converts a value to an integer
- float() → Converts a value to a float
- str() → Converts a value to a string
- bool() → Converts a value to a boolean

Example:
x = "10" # x is a string
y = int(x)  # y will be 10 (integer)

z = 3.14
w = int(z)  # w will be 3 (integer, decimal part is truncated)
        `
      },
    },
    3: {
      1: {
        title: "If-Else Statements",
        content: `
### Control Flow with If-Else Statements
Control flow statements allow you to make decisions in your code based on certain conditions. The most common control flow statement is the if-else statement.
Indentation is crucial in Python, as it defines the scope of loops, functions, and other code blocks. Unlike other programming languages that use curly braces to define code blocks, Python uses indentation (usually 4 spaces) to indicate which statements belong to which blocks.
Example:
age = 18
if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")
Output:
You are an adult.

You can also use elif (short for "else if") to check multiple conditions.
        `
      },
      2: {
        title: "Loops",
        content: `
### Loops in Python
Loops are used to execute a block of code repeatedly. Python has two main types of loops:
1. for loops
2. while loops

#### For Loops
A for loop is used to iterate over a sequence (like a list, tuple, or string).

Example:
for i in range(5):
    print(i)
Output:
0
1
2
3
4

#### While Loops
A while loop continues to execute as long as a condition is true.

Example:
count = 0
while count < 5:
    print(count)
    count += 1
Output:
0
1
2
3
4

        `
      }
    },
    4: {
       1: {
    title: "Introduction to Strings",
    content: `
### What is a String?
A string is a sequence of characters enclosed in single or double quotes.
In python, strings can be represented using either single quotes (' ') or double quotes (" ").

Example:
name = "Alice"
message = 'Hello World'

You can also have quote characters inside a string by using the opposite type of quotes to enclose the string.
Example:
quote = "She said, 'Hello!'"
quote2 = 'He said, "Hi!"'

Strings are immutable in Python, meaning they cannot be changed after creation.
    `
  },

  2: {
    title: "String Slicing",
    content: `
### String Slicing
Slicing allows you to extract a portion of a string.

Syntax:
string[start:end]
end is exclusive, meaning the character at the end index is not included in the result.

Example:
text = "Python"
print(text[0:4]) or print(text[:4])  # Output: Pyth

Negative indexing:
print(text[-1])    # n
    `
  },

  3: {
    title: "String Modification & Concatenation",
    content: `
### Modifying Strings
Strings are immutable, but you can create modified copies.

Example:
text = "hello"
print(text.upper())
print(text.lower())

### Concatenation
You can join strings using the + operator.

first = "Hello"
second = "World"
print(first + " " + second)

### Escape Characters
Escape characters allow special formatting inside strings.

Examples:
print("He said \\"Hello\\"")
print("Line1\\nLine2")
    `
  },

  4: {
    title: "String Formatting",
    content: `
### String Formatting

Using f-strings (recommended):
name = "Alice"
age = 25
print(f"My name is {name} and I am {age} years old.")

Using format():
print("My name is {} and I am {}".format(name, age))
    `
  },

  5: {
    title: "Common String Methods",
    content: `
### Useful String Methods

text = "  python programming  "

print(text.strip())      # removes whitespace
print(text.replace("python", "Java"))
print(text.split())
print(text.find("pro"))
print(text.startswith("python"))
print(text.endswith("ing"))
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
        className="prose prose-invert whitespace-pre-wrap">{level.content}</div>
        
    </div>
  );
};

export default LevelPage;
