import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { keys } = await req.json();

    // Read existing .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      // File doesn't exist yet, that's ok
    }

    // Parse existing environment variables
    const envVars = envContent.split('\n').reduce((acc: Record<string, string>, line) => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        acc[key.trim()] = valueParts.join('=').trim();
      }
      return acc;
    }, {});

    // Update or add new values
    Object.entries(keys).forEach(([key, value]) => {
      if (value) {
        envVars[key] = value as string;
      }
    });

    // Convert back to .env format
    const newEnvContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write back to .env file
    await fs.writeFile(envPath, newEnvContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving API keys:', error);
    return NextResponse.json(
      { error: 'Failed to save API keys' },
      { status: 500 }
    );
  }
}
