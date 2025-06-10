export interface Collection {
  collection_id: string;
  collection_name: string;
  is_default?: boolean;
}

export interface CollectionQuestionRow {
  collection_id: string;
  collection_name: string;
  question_id: string;
  question_title: string;
  solved: boolean;
  blob_url: string;
  difficulty: string;
  design_patterns: string[];
}

export interface CollectionQuestion {
  user: {
    user_id: string;
  };
  collection: {
    collection_id: string;
    collection_name: string;
  };
  questions: Array<{
    question_id: string;
    question_title: string;
    solved: boolean;
    blob_url: string;
    difficulty: string;
    design_patterns: string[];
  }>;
} 