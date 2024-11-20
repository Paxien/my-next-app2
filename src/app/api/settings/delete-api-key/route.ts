import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    // Read existing .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: 'No .env file found' },
        { status: 404 }
      );
    }

    // Parse and filter out the key to delete
    const newEnvContent = envContent
      .split('\n')
      .filter(line => {
        const [envKey] = line.split('=');
        return envKey.trim() !== key;
      })
      .join('\n');

    // Write back to .env file
    await fs.writeFile(envPath, newEnvContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
