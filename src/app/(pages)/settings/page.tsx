"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for OpenAI and other services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/api-keys">
                <Button>
                  Manage API Keys
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Add more settings cards here as needed */}
        </div>
      </div>
    </div>
  );
}