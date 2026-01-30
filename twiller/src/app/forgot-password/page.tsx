"use client";

import { useState } from "react";
import axios from "../../lib/axiosinstance";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border border-border shadow-sm">
        <CardContent className="p-6 space-y-5">
          <h1 className="text-2xl font-bold text-center">
            Forgot Password
          </h1>

          <p className="text-sm text-muted-foreground text-center">
            Enter your registered email to reset your password
          </p>

          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Reset Password"}
          </Button>

          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
