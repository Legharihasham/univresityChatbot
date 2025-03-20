// Simple analytics tracking
// In a production app, you would use a proper analytics service

type QuestionCategory = "academic" | "technical" | "administrative" | "other"

interface QuestionData {
  question: string
  category: QuestionCategory
  timestamp: string
  userId?: string
}

// Mock database - in a real app, use a proper database
const questionDatabase: QuestionData[] = []

export function trackQuestion(question: string, category: QuestionCategory, userId?: string) {
  const questionData: QuestionData = {
    question,
    category,
    timestamp: new Date().toISOString(),
    userId,
  }

  questionDatabase.push(questionData)

  // In a real app, you would send this to your analytics service
  console.log("Question tracked:", questionData)

  // For demo purposes, save to localStorage
  const savedAnalytics = localStorage.getItem("question_analytics") || "[]"
  const analytics = JSON.parse(savedAnalytics)
  analytics.push(questionData)
  localStorage.setItem("question_analytics", JSON.stringify(analytics))

  return questionData
}

export function getQuestionAnalytics() {
  // In a real app, you would fetch this from your analytics service

  // For demo purposes, get from localStorage
  const savedAnalytics = localStorage.getItem("question_analytics") || "[]"
  return JSON.parse(savedAnalytics)
}

export function getCategoryDistribution() {
  const analytics = getQuestionAnalytics()

  const distribution = {
    academic: 0,
    technical: 0,
    administrative: 0,
    other: 0,
  }

  analytics.forEach((item: QuestionData) => {
    distribution[item.category]++
  })

  return distribution
}

