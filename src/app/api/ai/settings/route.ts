import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'src/app/config/ai-settings.json');

export async function GET() {
  try {
    const fileExists = await fs.access(CONFIG_FILE)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      const defaultSettings = {
        model: 'gpt-4',
        systemPrompt: 'You are a helpful assistant.',
        openaiApiKey: '',
        anthropicApiKey: '',
        openRouterApiKey: '',
        googleApiKey: '',
        mistralApiKey: '',
        cohereApiKey: '',
      };
      await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
      await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultSettings, null, 2));
      return NextResponse.json(defaultSettings);
    }

    const settings = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf-8'));
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to read AI settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();

    // Validate settings
    if (!settings.model || !settings.systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate API keys format if provided
    if (settings.openaiApiKey && !settings.openaiApiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key format' },
        { status: 400 }
      );
    }

    if (settings.anthropicApiKey && !settings.anthropicApiKey.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'Invalid Anthropic API key format' },
        { status: 400 }
      );
    }

    if (settings.openRouterApiKey && !settings.openRouterApiKey.startsWith('sk-or-')) {
      return NextResponse.json(
        { error: 'Invalid Open Router API key format' },
        { status: 400 }
      );
    }

    // Create config directory if it doesn't exist
    await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });

    // Save settings
    await fs.writeFile(CONFIG_FILE, JSON.stringify(settings, null, 2));

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving AI settings:', error);
    return NextResponse.json(
      { error: 'Failed to save AI settings' },
      { status: 500 }
    );
  }
}
