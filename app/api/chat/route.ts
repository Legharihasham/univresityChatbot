import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"
import { problemRepository } from "@/lib/problem-repository"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Convert problem repository to a string for the system prompt
  const problemRepositoryString = JSON.stringify(problemRepository, null, 2)

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are an advanced AI assistant specifically designed to help university students navigate their academic journey. Your goal is to provide detailed, practical, and empathetic responses to student questions and problems.
    
    You have access to a comprehensive repository of common student problems and their solutions:
    ${problemRepositoryString}
    
    When responding to students:
    1. Always start by acknowledging their question or concern
    2. Provide structured, step-by-step solutions when applicable
    3. Include specific examples and practical tips
    4. Reference the problem repository when relevant
    5. If the exact problem isn't in the repository, provide general guidance based on similar situations
    6. Suggest relevant university resources (e.g., academic advisors, tutoring centers, counseling services)
    7. Maintain a supportive and encouraging tone while being professional
    8. Break down complex topics into digestible parts
    9. Include relevant academic terminology while explaining concepts
    10. When appropriate, provide follow-up questions to ensure the student's needs are fully addressed
    
    Remember that students may be:
    - Stressed about deadlines and exams
    - Struggling with academic pressure
    - Dealing with personal challenges
    - New to university life
    - Seeking specific academic guidance
    
    Always maintain confidentiality and encourage seeking professional help when necessary.`,
    messages,
    tools: {
      searchProblemRepository: tool({
        description: "Search the problem repository for relevant information",
        parameters: z.object({
          query: z.string().describe("The search query to find relevant problems"),
          category: z.string().optional().describe("Optional category to filter results"),
        }),
        execute: async ({ query, category }) => {
          // Enhanced search implementation with fuzzy matching and category filtering
          const searchTerms = query.toLowerCase().split(' ');
          
          const results = problemRepository
            .filter(cat => !category || cat.category.toLowerCase() === category.toLowerCase())
            .flatMap((category) =>
              category.problems
                .filter((problem) => {
                  const searchableText = [
                    problem.title,
                    problem.description,
                    problem.solution,
                    category.category
                  ].join(' ').toLowerCase();
                  
                  // Check if all search terms are found in the text
                  return searchTerms.every(term => searchableText.includes(term));
                })
                .map((problem) => ({
                  category: category.category,
                  relevance: searchTerms.reduce((score, term) => {
                    const text = [problem.title, problem.description, problem.solution].join(' ').toLowerCase();
                    return score + (text.split(term).length - 1);
                  }, 0),
                  ...problem,
                }))
            )
            .sort((a, b) => b.relevance - a.relevance);

          return {
            results,
            count: results.length,
            categories: problemRepository.map(cat => cat.category),
          };
        },
      }),
      getDeadlineReminder: tool({
        description: "Create a deadline reminder for the student",
        parameters: z.object({
          task: z.string().describe("The task or assignment name"),
          dueDate: z.string().describe("The due date in YYYY-MM-DD format"),
          priority: z.enum(["High", "Medium", "Low"]).describe("The priority level of the task"),
        }),
        execute: async ({ task, dueDate, priority }) => {
          // In a real app, you would save this to a database
          const reminder = {
            task,
            dueDate,
            priority,
            createdAt: new Date().toISOString(),
          }

          return {
            reminder,
            message: `Reminder created for "${task}" due on ${dueDate} with ${priority} priority.`,
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}

