"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"

// Sample problem repository data
const problemCategories = [
  {
    id: "academic",
    name: "Academic",
    problems: [
      {
        id: "time-management",
        title: "Time Management",
        description: "Struggling to balance coursework and other responsibilities",
        solution:
          "Create a weekly schedule with dedicated time blocks for each task. Prioritize assignments based on deadlines and importance. Consider using the Pomodoro technique (25 minutes of focused work followed by a 5-minute break).",
      },
      {
        id: "exam-preparation",
        title: "Exam Preparation",
        description: "Difficulty preparing effectively for exams",
        solution:
          "Start studying at least two weeks before the exam. Break down the material into manageable sections. Use active recall techniques like practice tests and flashcards instead of passive reading. Form study groups to discuss complex topics.",
      },
      {
        id: "research-skills",
        title: "Research Skills",
        description: "Challenges with finding reliable sources for assignments",
        solution:
          "Utilize your university library databases rather than general internet searches. Learn to evaluate source credibility by checking author credentials, publication date, and peer review status. Consult with librarians who specialize in your field of study.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical",
    problems: [
      {
        id: "programming-errors",
        title: "Programming Errors",
        description: "Common programming errors and debugging strategies",
        solution:
          "Use systematic debugging approaches: check error messages, use print statements or debuggers to trace execution, and test with simplified inputs. Break down complex problems into smaller, testable components. Utilize version control to track changes.",
      },
      {
        id: "software-installation",
        title: "Software Installation",
        description: "Issues with installing required software for courses",
        solution:
          "Follow official documentation carefully. Check system requirements before installation. Use virtual environments or containers to avoid conflicts. Contact IT support for university-specific software issues or licensing questions.",
      },
    ],
  },
  {
    id: "administrative",
    name: "Administrative",
    problems: [
      {
        id: "course-registration",
        title: "Course Registration",
        description: "Navigating the course registration process",
        solution:
          "Review the academic calendar for registration dates. Meet with your academic advisor to plan your course schedule. Prepare a list of alternative courses in case your first choices are unavailable. Check for any holds on your account before registration opens.",
      },
      {
        id: "financial-aid",
        title: "Financial Aid",
        description: "Understanding financial aid options and deadlines",
        solution:
          "Complete the FAFSA as early as possible. Research scholarship opportunities specific to your program. Meet with a financial aid counselor to understand your options. Keep track of all application deadlines and required documentation.",
      },
    ],
  },
]

export default function ProblemRepository() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("academic")

  const filteredProblems = problemCategories.flatMap((category) =>
    category.problems
      .filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .map((problem) => ({ ...problem, category: category.id })),
  )

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Problem Repository</CardTitle>
        <CardDescription>Browse common student problems and their solutions</CardDescription>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Search Results</h3>
            {filteredProblems.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredProblems.map((problem) => (
                  <AccordionItem key={problem.id} value={problem.id}>
                    <AccordionTrigger className="text-left">
                      <div>
                        <div className="font-medium">{problem.title}</div>
                        <div className="text-sm text-muted-foreground">{problem.description}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4">
                        <h4 className="font-medium mb-2">Solution:</h4>
                        <p className="text-sm">{problem.solution}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No problems found matching your search.</div>
            )}
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              {problemCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {problemCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Accordion type="single" collapsible className="w-full">
                  {category.problems.map((problem) => (
                    <AccordionItem key={problem.id} value={problem.id}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-medium">{problem.title}</div>
                          <div className="text-sm text-muted-foreground">{problem.description}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4">
                          <h4 className="font-medium mb-2">Solution:</h4>
                          <p className="text-sm">{problem.solution}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

