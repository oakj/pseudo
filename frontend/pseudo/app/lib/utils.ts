import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserQuestionData, UserQuestionFile } from "../types/api/userQuestions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Maps UserQuestionData to UserQuestionFile format
 * @param data The UserQuestionData object to convert
 * @returns A UserQuestionFile formatted object
 */
export function mapToUserQuestionFile(data: UserQuestionData): UserQuestionFile {
  return {
    user_id: data.user_id,
    question_id: data.question_id,
    submission: data.submission ? {
      solution: data.submission.solution,
      timestamp: data.submission.timestamp
    } : undefined,
    hint_chat: {
      messages: data.hint_chat.messages.map(msg => ({
        from: msg.from,
        message: msg.message,
        timestamp: msg.timestamp
      }))
    }
  };
}

/**
 * Creates an empty UserQuestionFile structure
 * @param userId The user's ID
 * @param questionId The question's ID
 * @returns An empty UserQuestionFile structure
 */
export function createEmptyUserQuestionFile(userId: string, questionId: string): UserQuestionData {
  return {
    user_id: userId,
    question_id: questionId,
    submission: {
      solution: {
        lines: []
      },
      timestamp: new Date().toISOString()
    },
    hint_chat: {
      messages: []
    }
  };
}