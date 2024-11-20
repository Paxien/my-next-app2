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

          <Card>
            <CardHeader>
              <CardTitle>Header Navigation</CardTitle>
              <CardDescription>
                Customize the appearance and behavior of the main navigation header
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings/header">
                <Button>
                  Customize Header
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}