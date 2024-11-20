import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Read existing .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      // File doesn't exist yet, return empty object
      return NextResponse.json({});
    }

    // Parse existing environment variables
    const envVars = envContent.split('\n').reduce((acc: Record<string, string>, line) => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        // Join value parts in case the value contains = characters
        acc[key.trim()] = valueParts.join('=').split('#')[0].trim();
      }
      return acc;
    }, {});

    return NextResponse.json(envVars);
  } catch (error) {
    console.error('Error getting API keys:', error);
    return NextResponse.json(
      { error: 'Failed to get API keys' },
      { status: 500 }
    );
  }
}
