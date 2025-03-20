"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getQuestionAnalytics, getCategoryDistribution } from "@/lib/analytics"

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any[]>([])
  const [distribution, setDistribution] = useState<any>({})

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setAnalytics(getQuestionAnalytics())
    setDistribution(getCategoryDistribution())
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Recent Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Question Categories</CardTitle>
                  <CardDescription>Distribution of questions by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(distribution).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="capitalize">{category}</span>
                        <span className="font-medium">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Questions</CardTitle>
                  <CardDescription>Number of questions asked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{analytics.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Questions</CardTitle>
                <CardDescription>Latest questions asked by students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((item, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="font-medium">{item.question}</div>
                        <div className="text-sm text-muted-foreground flex justify-between">
                          <span className="capitalize">{item.category}</span>
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

