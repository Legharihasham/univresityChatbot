"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, LogOut } from "lucide-react"

interface AuthButtonProps {
  isLoggedIn: boolean
  onLogin: (email: string, password: string) => void
  onLogout: () => void
}

export default function AuthButton({ isLoggedIn, onLogin, onLogout }: AuthButtonProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    onLogin(email, password)
    setOpen(false)
    setEmail("")
    setPassword("")
  }

  if (isLoggedIn) {
    return (
      <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <LogIn className="h-4 w-4" />
        <span>Login</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Student Login</DialogTitle>
            <DialogDescription>Login to save your chat history and access personalized support.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

