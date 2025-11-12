-- Seed Dummy Problem for Code Duel Testing
-- Problem: Find Maximum Number in Array

-- Insert a standalone problem (not tied to any lesson) for Code Duel
INSERT INTO public.problems (
    lesson_id,
    title,
    description,
    difficulty,
    language,
    starter_code,
    solution_code,
    tests_public,
    tests_hidden,
    time_limit_ms,
    memory_limit_mb,
    xp_reward
) VALUES (
    NULL, -- Not tied to any lesson, standalone for Code Duel
    'Find Maximum Number in Array',
    E'Write a function that takes an array of numbers and returns the maximum value.\n\n**Example:**\n- Input: [3, 7, 2, 9, 1]\n- Output: 9\n\n**Constraints:**\n- The array will have at least 1 element\n- All elements are integers\n- Array length ≤ 10,000',
    'beginner',
    'python',
    E'def find_max(arr):\n    """\n    Find and return the maximum number in the array.\n    \n    Args:\n        arr: List of integers\n    \n    Returns:\n        The maximum integer in the array\n    """\n    # Write your code here\n    pass',
    E'def find_max(arr):\n    """\n    Find and return the maximum number in the array.\n    \n    Args:\n        arr: List of integers\n    \n    Returns:\n        The maximum integer in the array\n    """\n    return max(arr)',
    -- Public test cases (shown to users)
    '[
        {
            "name": "Test 1: Simple array",
            "input": "print(find_max([3, 7, 2, 9, 1]))",
            "expected_output": "9"
        },
        {
            "name": "Test 2: Single element",
            "input": "print(find_max([5]))",
            "expected_output": "5"
        },
        {
            "name": "Test 3: Negative numbers",
            "input": "print(find_max([-5, -2, -8, -1]))",
            "expected_output": "-1"
        }
    ]'::jsonb,
    -- Hidden test cases (for evaluation only)
    '[
        {
            "name": "Test 4: Large array",
            "input": "print(find_max([100, 500, 250, 750, 300]))",
            "expected_output": "750"
        },
        {
            "name": "Test 5: All same numbers",
            "input": "print(find_max([7, 7, 7, 7]))",
            "expected_output": "7"
        },
        {
            "name": "Test 6: Mix positive and negative",
            "input": "print(find_max([-10, 5, -3, 20, 15]))",
            "expected_output": "20"
        }
    ]'::jsonb,
    5000,  -- 5 second time limit
    256,   -- 256 MB memory limit
    50     -- 50 XP reward for beginner problem
);

-- Add a JavaScript/TypeScript version
INSERT INTO public.problems (
    lesson_id,
    title,
    description,
    difficulty,
    language,
    starter_code,
    solution_code,
    tests_public,
    tests_hidden,
    time_limit_ms,
    memory_limit_mb,
    xp_reward
) VALUES (
    NULL,
    'Find Maximum Number in Array',
    E'Write a function that takes an array of numbers and returns the maximum value.\n\n**Example:**\n- Input: [3, 7, 2, 9, 1]\n- Output: 9\n\n**Constraints:**\n- The array will have at least 1 element\n- All elements are integers\n- Array length ≤ 10,000',
    'beginner',
    'javascript',
    E'/**\n * Find and return the maximum number in the array.\n * @param {number[]} arr - Array of integers\n * @returns {number} The maximum integer in the array\n */\nfunction findMax(arr) {\n    // Write your code here\n    \n}',
    E'/**\n * Find and return the maximum number in the array.\n * @param {number[]} arr - Array of integers\n * @returns {number} The maximum integer in the array\n */\nfunction findMax(arr) {\n    return Math.max(...arr);\n}',
    '[
        {
            "name": "Test 1: Simple array",
            "input": "[3, 7, 2, 9, 1]",
            "expected_output": "9"
        },
        {
            "name": "Test 2: Single element",
            "input": "[5]",
            "expected_output": "5"
        },
        {
            "name": "Test 3: Negative numbers",
            "input": "[-5, -2, -8, -1]",
            "expected_output": "-1"
        }
    ]'::jsonb,
    '[
        {
            "name": "Test 4: Large array",
            "input": "[100, 500, 250, 750, 300]",
            "expected_output": "750"
        },
        {
            "name": "Test 5: All same numbers",
            "input": "[7, 7, 7, 7]",
            "expected_output": "7"
        },
        {
            "name": "Test 6: Mix positive and negative",
            "input": "[-10, 5, -3, 20, 15]",
            "expected_output": "20"
        }
    ]'::jsonb,
    5000,
    256,
    50
);

-- Add a Java version
INSERT INTO public.problems (
    lesson_id,
    title,
    description,
    difficulty,
    language,
    starter_code,
    solution_code,
    tests_public,
    tests_hidden,
    time_limit_ms,
    memory_limit_mb,
    xp_reward
) VALUES (
    NULL,
    'Find Maximum Number in Array',
    E'Write a function that takes an array of numbers and returns the maximum value.\n\n**Example:**\n- Input: [3, 7, 2, 9, 1]\n- Output: 9\n\n**Constraints:**\n- The array will have at least 1 element\n- All elements are integers\n- Array length ≤ 10,000',
    'beginner',
    'java',
    E'public class Solution {\n    /**\n     * Find and return the maximum number in the array.\n     * @param arr Array of integers\n     * @return The maximum integer in the array\n     */\n    public static int findMax(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}',
    E'public class Solution {\n    /**\n     * Find and return the maximum number in the array.\n     * @param arr Array of integers\n     * @return The maximum integer in the array\n     */\n    public static int findMax(int[] arr) {\n        int max = arr[0];\n        for (int num : arr) {\n            if (num > max) {\n                max = num;\n            }\n        }\n        return max;\n    }\n}',
    '[
        {
            "name": "Test 1: Simple array",
            "input": "[3, 7, 2, 9, 1]",
            "expected_output": "9"
        },
        {
            "name": "Test 2: Single element",
            "input": "[5]",
            "expected_output": "5"
        },
        {
            "name": "Test 3: Negative numbers",
            "input": "[-5, -2, -8, -1]",
            "expected_output": "-1"
        }
    ]'::jsonb,
    '[
        {
            "name": "Test 4: Large array",
            "input": "[100, 500, 250, 750, 300]",
            "expected_output": "750"
        },
        {
            "name": "Test 5: All same numbers",
            "input": "[7, 7, 7, 7]",
            "expected_output": "7"
        },
        {
            "name": "Test 6: Mix positive and negative",
            "input": "[-10, 5, -3, 20, 15]",
            "expected_output": "20"
        }
    ]'::jsonb,
    5000,
    256,
    50
);

-- Verify the problems were inserted
SELECT id, title, language, difficulty, xp_reward 
FROM public.problems 
WHERE title = 'Find Maximum Number in Array'
ORDER BY language;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully seeded 3 dummy problems (Python, JavaScript, Java) for Code Duel testing!';
    RAISE NOTICE 'Problem Title: Find Maximum Number in Array';
    RAISE NOTICE 'Difficulty: Beginner';
    RAISE NOTICE 'Languages: python, javascript, java';
END $$;
