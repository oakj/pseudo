| Question Title                  | Question ID                             | Test Case (summary)                                                                 | Reason for Removal                                      |
|----------------------------------|-----------------------------------------|-------------------------------------------------------------------------------------|---------------------------------------------------------|
| Valid Parentheses                | 9d8abe9c-316d-4e12-b288-5c5540db940e    | `"value": "(" + "[".repeat(5000) + "]".repeat(5000) + ")"`                          | Not valid JSON; uses JavaScript string concatenation    |
| Find Median from Data Stream     | 8004809c-4523-4daf-bb2d-8344c4f1cb54    | `"operations": generateLargeOperations(50000), "values": generateLargeValues(50000)`| Not valid JSON; uses function calls                     |
| 3Sum                             | ea42cfe2-7e25-44e4-8e89-3c85661fa68a    | `"value": Array.from({length: 3000}, (_, i) => i % 3 - 1)`                          | Not valid JSON; uses JavaScript array generator         |
| Best Time to Buy and Sell Stock  | cb8b2437-6618-42ce-a771-41a7b01cca4f    | `"value": Array.from({length: 100000}, (_, i) => i % 2 === 0 ? 1 : 2)`              | Not valid JSON; uses JavaScript array generator         |
| Merge k Sorted Lists             | ec1e64cb-a249-47cd-9a80-ddc45ff37836    | `"value": generateKSortedLists(10000, 500)`                                         | Not valid JSON; uses function call                      |
| Word Ladder                      | cfde29c8-d215-420d-bfec-e632d781be9d    | `"beginWord": generateWord(10), "endWord": generateWord(10), "wordList": generateWordList(5000, 10)` | Not valid JSON; uses function calls                     |
| Number of Islands                | beef45e6-0e2f-4ced-8a02-793660d1cba1    | `"value": generateLargeIslandGrid(300, 300)`                                        | Not valid JSON; uses function call                      |


---

### Valid Parentheses (9d8abe9c-316d-4e12-b288-5c5540db940e)
```json
{
    "input": {
        "value": "(" + "[".repeat(5000) + "]".repeat(5000) + ")",
        "type": "string"
    },
    "output": {
        "value": true,
        "type": "boolean"
    },
    "explanation": "Large nested structure with 5000 pairs of brackets",
    "is_performance_test": true
}
```

---

### Find Median from Data Stream (8004809c-4523-4daf-bb2d-8344c4f1cb54)
```json
{
    "operations": generateLargeOperations(50000),
    "values": generateLargeValues(50000),
    "type": "operations",
    "explanation": "Maximum number of operations",
    "is_performance_test": true
}
```

---

### 3Sum (ea42cfe2-7e25-44e4-8e89-3c85661fa68a)
```json
{
    "input": {
        "value": Array.from({length: 3000}, (_, i) => i % 3 - 1),
        "type": "array"
    },
    "output": {
        "value": "LARGE_OUTPUT",
        "type": "array_of_arrays"
    },
    "explanation": "Large input with repeating pattern",
    "is_performance_test": true
}
```

---

### Best Time to Buy and Sell Stock (cb8b2437-6618-42ce-a771-41a7b01cca4f)
```json
{
    "input": {
        "value": Array.from({length: 100000}, (_, i) => i % 2 === 0 ? 1 : 2),
        "type": "array"
    },
    "output": {
        "value": 1,
        "type": "integer"
    },
    "explanation": "Large input with alternating prices",
    "is_performance_test": true
}
```

---

### Merge k Sorted Lists (ec1e64cb-a249-47cd-9a80-ddc45ff37836)
```json
{
    "input": {
        "value": generateKSortedLists(10000, 500),
        "type": "array_of_linked_lists"
    },
    "output": {
        "value": "LARGE_OUTPUT",
        "type": "linked_list"
    },
    "explanation": "Large input with maximum constraints",
    "is_performance_test": true
}
```

---

### Word Ladder (cfde29c8-d215-420d-bfec-e632d781be9d)
```json
{
    "input": {
        "beginWord": generateWord(10),
        "endWord": generateWord(10),
        "wordList": generateWordList(5000, 10),
        "type": "word_ladder"
    },
    "output": {
        "value": "LARGE_OUTPUT",
        "type": "integer"
    },
    "explanation": "Maximum constraints test",
    "is_performance_test": true
}
```

---

### Number of Islands (beef45e6-0e2f-4ced-8a02-793660d1cba1)
```json
{
    "input": {
        "value": generateLargeIslandGrid(300, 300),
        "type": "matrix"
    },
    "output": {
        "value": "LARGE_OUTPUT",
        "type": "integer"
    },
    "explanation": "Large grid with multiple islands",
    "is_performance_test": true
}
```
