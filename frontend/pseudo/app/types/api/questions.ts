export interface QuestionData {
  description: string;
  constraints: string[];
  boilerplate_solution: {
    language: string;
    pseudocode: string;
  };
  hints: string[];
}

export interface Question {
  question_id: string;
  title: string;
  difficulty: string;
  is_solved: boolean;
  saved_to_collection?: boolean;
  design_patterns?: string[];
} 