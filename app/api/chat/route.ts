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
    system: `You are a helpful AI assistant for students. Your goal is to provide supportive, accurate, and helpful responses to student questions and problems.
    
    You have access to a repository of common student problems and their solutions:
    ${problemRepositoryString}
    
    When responding to students:
    1. Be empathetic and understanding of their challenges
    2. Provide clear, actionable advice
    3. Reference the problem repository when relevant
    4. If you don't have specific information, provide general guidance and suggest resources
    5. Always maintain a supportive and encouraging tone
    
    Remember that students may be stressed or frustrated, so be patient and kind in your responses.`,
    messages,
    tools: {
      searchProblemRepository: tool({
        description: "Search the problem repository for relevant information",
        parameters: z.object({
          query: z.string().describe("The search query to find relevant problems"),
        }),
        execute: async ({ query }) => {
          // Simple search implementation - in a real app, use a more sophisticated search
          const results = problemRepository.flatMap((category) =>
            category.problems
              .filter(
                (problem) =>
                  problem.title.toLowerCase().includes(query.toLowerCase()) ||
                  problem.description.toLowerCase().includes(query.toLowerCase()) ||
                  problem.solution.toLowerCase().includes(query.toLowerCase()),
              )
              .map((problem) => ({
                category: category.category,
                ...problem,
              })),
          )

          return {
            results,
            count: results.length,
          }
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

