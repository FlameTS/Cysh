"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface ClassificationResult {
  label: "safe" | "abusive" | "harassment" | "sarcasm" | "dangerous"
  reasons: string[]
  sentiment?: string
}

export default function MessageClassifier() {
  const [message, setMessage] = useState("")
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClassify = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("https://your-flask-backend-url/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while classifying the message")
    } finally {
      setIsLoading(false)
    }
  }

  const getLabelColor = (label: string) => {
    switch (label) {
      case "safe":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "abusive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "harassment":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "dangerous":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "sarcasm":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Message Safety Classifier</h1>
          <p className="text-muted-foreground">Analyze messages for safety, sentiment, and potential issues</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Enter Message</CardTitle>
            <CardDescription>Type or paste the message you want to classify below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />

            <Button onClick={handleClassify} disabled={!message.trim() || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classifying...
                </>
              ) : (
                "Classify"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="w-full border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive">
                <h3 className="font-semibold mb-2">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Classification Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Label:</span>
                <Badge className={getLabelColor(result.label)}>
                  {result.label.charAt(0).toUpperCase() + result.label.slice(1)}
                </Badge>
              </div>

              {result.sentiment && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sentiment:</span>
                  <Badge variant="outline">
                    {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                  </Badge>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-sm font-medium">Reasons:</span>
                <ul className="space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
