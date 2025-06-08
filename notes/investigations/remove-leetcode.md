Using any references to Leetcode could be a legal issue so we want to remove anything related to Leetcode.

We will need to review removing Leetcode references from the following places:
- [X] public.question table in Supabase
- [X] remove references to the question.leetcode_id field in any stored procedures/sql queries
    - [X] For each stored procedure, re-run it in Supabase console to update the function
        - [X] SelectQuestionsByUserId
            - [X] changed locally
            - [X] changed in supabase
- [X] questions json files, there is a leetcode_id field and file name is the leetcode_id
    - [X] For each file (stored locally in the repo AND the files stored in Supabase storage), rename the file to be {question_id}.json
        - [X] L-1 "Two Sum" -> b788a7db-c05d-4769-b231-2db1a6482a5e
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-3 "Longest Substring Without Repeating Characters" -> 087405c7-79ca-490d-bbcb-b7d31f72112a
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-15 "3Sum" -> ea42cfe2-7e25-44e4-8e89-3c85661fa68a
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-20 "Valid Parentheses" -> 9d8abe9c-316d-4e12-b288-5c5540db940e
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-23 "Merge k Sorted Lists" -> ec1e64cb-a249-47cd-9a80-ddc45ff37836
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-102 "Binary Tree Level Order Traversal" -> 781d865f-376f-495f-ab4b-52e3e9b2e35c
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-121 "Best Time to Buy and Sell Stock" -> cb8b2437-6618-42ce-a771-41a7b01cca4f
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-127 "Word Ladder" -> cfde29c8-d215-420d-bfec-e632d781be9d
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-200 "Number of Islands" -> beef45e6-0e2f-4ced-8a02-793660d1cba1
            - [X] changed locally
            - [X] changed in supabase
        - [X] L-295 "Find Median from Data Stream" -> 8004809c-4523-4daf-bb2d-8344c4f1cb54
            - [X] changed locally
            - [X] changed in supabase
- [ ] finally, review any references by searching the repo: https://github.com/search?q=repo%3Aoakj%2Fpseudo%20leetcode&type=code

How will we remove this?
1. Remove the fields from the databases (Supabase SQL and Supabase Storage)
2. This will cause a chain reaction of failues in the app. We just need to fix them.
3. Do a final check of any references to the term `leetcode` in the repo