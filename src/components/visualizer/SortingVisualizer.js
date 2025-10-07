import React, { useState, useEffect, useCallback } from 'react';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(30);

  // Generate a new random array
  const resetArray = useCallback(() => {
    if (sorting) return;
    setCompleted(false);

    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(randomIntFromInterval(5, 80));
    }
    setArray(newArray);
  }, [sorting, size]);

  // Initialize array on component mount or size change
  useEffect(() => {
    resetArray();
  }, [resetArray]);

  // Helper function to get random numbers
  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Sort the array based on the selected algorithm
  const sortArray = () => {
    if (sorting) return;
    setSorting(true);
    
    switch (algorithm) {
      case 'bubble':
        bubbleSort();
        break;
      case 'merge':
        mergeSort();
        break;
      case 'quick':
        quickSort();
        break;
      default:
        bubbleSort();
    }
  };

  // Bubble Sort Implementation
  const bubbleSort = async () => {
    const animations = getBubbleSortAnimations([...array]);
    const arrayBars = document.getElementsByClassName('array-bar');
    
    for (let i = 0; i < animations.length; i++) {
      const [barOneIdx, barTwoIdx, swap] = animations[i];
      
      const barOneStyle = arrayBars[barOneIdx].style;
      const barTwoStyle = arrayBars[barTwoIdx].style;
      
      setTimeout(() => {
        // Highlight bars being compared
        barOneStyle.backgroundColor = '#F97316';
        barTwoStyle.backgroundColor = '#F97316';
        
        // If we need to swap
        if (swap) {
          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;
          
          // Update the actual array
          const newArray = [...array];
          const temp = newArray[barOneIdx];
          newArray[barOneIdx] = newArray[barTwoIdx];
          newArray[barTwoIdx] = temp;
          setArray(newArray);
        }
        
        // Reset the color after a short delay
        setTimeout(() => {
          barOneStyle.backgroundColor = '#0EA5E9';
          barTwoStyle.backgroundColor = '#0EA5E9';
          
          // Check if this is the last animation
          if (i === animations.length - 1) {
            finishSorting();
          }
        }, speed / 2);
      }, i * speed);
    }
  };
  
  // Helper function to get bubble sort animations
  const getBubbleSortAnimations = (arr) => {
    const animations = [];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Push the pair of indices we're comparing and whether we swap
        animations.push([j, j + 1, arr[j] > arr[j + 1]]);
        
        if (arr[j] > arr[j + 1]) {
          // Swap arr[j] and arr[j + 1]
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    
    return animations;
  };
  
  // Placeholder for other sorting algorithms
  const mergeSort = () => {
    // Implementation would go here
    setSorting(false);
    setCompleted(true);
  };
  
  const quickSort = () => {
    // Implementation would go here
    setSorting(false);
    setCompleted(true);
  };

  // Called when sorting is done
  const finishSorting = () => {
    setSorting(false);
    setCompleted(true);
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="algorithm" className="block text-sm font-medium mb-1">
            Algorithm
          </label>
          <select
            id="algorithm"
            className="input"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={sorting}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="size" className="block text-sm font-medium mb-1">
            Array Size
          </label>
          <input
            id="size"
            type="range"
            min="10"
            max="100"
            value={size}
            className="w-40"
            onChange={(e) => setSize(parseInt(e.target.value))}
            disabled={sorting}
          />
        </div>
        
        <div>
          <label htmlFor="speed" className="block text-sm font-medium mb-1">
            Speed
          </label>
          <input
            id="speed"
            type="range"
            min="5"
            max="100"
            value={speed}
            className="w-40"
            onChange={(e) => setSpeed(105 - parseInt(e.target.value))}
            disabled={sorting}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mb-8">
        <button
          onClick={resetArray}
          className="btn-secondary"
          disabled={sorting}
        >
          Generate New Array
        </button>
        <button
          onClick={sortArray}
          className="btn-primary"
          disabled={sorting || completed}
        >
          {sorting ? 'Sorting...' : 'Sort!'}
        </button>
      </div>
      
      <div className="relative h-64 w-full bg-dark-lightest rounded-md overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
          {array.map((value, idx) => (
            <div
              className="array-bar transition-all duration-100 ease-in-out"
              key={idx}
              style={{
                backgroundColor: completed ? '#10B981' : '#0EA5E9',
                height: `${value}%`,
                width: `${100 / size}%`,
                display: 'inline-block',
                margin: '0 1px'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">How it works:</h3>
        <div className="bg-dark-lightest rounded-md p-4 text-sm">
          <p className="mb-3">
            <span className="font-mono text-primary">Bubble Sort</span> is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Time Complexity: O(n²) in worst and average cases</li>
            <li>Space Complexity: O(1)</li>
            <li>Stable: Yes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
