export interface FileContext {
  path: string;
  content: string;
  language: string;
  cursor?: {
    line: number;
    column: number;
  };
}

export interface CommandResult {
  success: boolean;
  message: string;
  files?: FileContext[];
  error?: string;
  code?: string;
}

export const AI_COMMANDS = {
  ANALYZE: '/analyze',
  MODIFY: '/modify',
  LIST: '/list',
  HELP: '/help',
  UNDO: '/undo',
  SAVE: '/save',
  PREVIEW: '/preview',
  GENERATE: '/generate',
  APPLY: '/apply',
  EXPLAIN: '/explain',
} as const;

export interface CommandHandler {
  command: string;
  description: string;
  usage: string;
  examples: string[];
  handler: (args: string[], context: FileContext) => Promise<CommandResult>;
}

export function formatCommandInstructions(detailed: boolean = true): string {
  const commandGroups = {
    'File Operations': [AI_COMMANDS.ANALYZE, AI_COMMANDS.MODIFY, AI_COMMANDS.LIST],
    'Code Generation': [AI_COMMANDS.GENERATE, AI_COMMANDS.APPLY, AI_COMMANDS.EXPLAIN],
    'Changes': [AI_COMMANDS.PREVIEW, AI_COMMANDS.SAVE, AI_COMMANDS.UNDO],
    'Help': [AI_COMMANDS.HELP]
  };

  if (!detailed) {
    // Brief format for /help command
    const instructions = ['Available commands:'];
    Object.entries(commandGroups).forEach(([group, commands]) => {
      instructions.push(`\n${group}:`);
      commands.forEach(cmd => {
        const handler = COMMAND_HANDLERS[cmd];
        instructions.push(`- ${handler.command} - ${handler.description}`);
      });
    });
    return instructions.join('\n');
  }

  // Detailed format for initial instructions
  const instructions = ['# AI Code Editor Commands\n'];
  
  Object.entries(commandGroups).forEach(([group, commands]) => {
    instructions.push(`\n## ${group}\n`);
    commands.forEach(cmd => {
      const handler = COMMAND_HANDLERS[cmd];
      instructions.push(
        `### ${handler.command}`,
        `${handler.description}`,
        `\nUsage: \`${handler.usage}\``,
        '\nExamples:',
        ...handler.examples.map(ex => `- \`${ex}\``),
        '\n'
      );
    });
  });

  return instructions.join('\n');
}

export const COMMAND_HANDLERS: Record<string, CommandHandler> = {
  [AI_COMMANDS.ANALYZE]: {
    command: AI_COMMANDS.ANALYZE,
    description: 'Analyze the current file or a specific file/directory',
    usage: '/analyze [path] [-d for deep analysis]',
    examples: [
      '/analyze',
      '/analyze ./components -d',
      '/analyze utils/helpers.ts'
    ],
    handler: async (args, context) => {
      // Implementation will be added
      return {
        success: true,
        message: 'Analysis complete',
      };
    }
  },
  [AI_COMMANDS.MODIFY]: {
    command: AI_COMMANDS.MODIFY,
    description: 'Modify the current file or create a new one',
    usage: '/modify [path] [-c to create new]',
    examples: [
      '/modify',
      '/modify components/new-component.tsx -c',
      '/modify utils/helpers.ts'
    ],
    handler: async (args, context) => {
      // Implementation will be added
      return {
        success: true,
        message: 'Modification complete',
      };
    }
  },
  [AI_COMMANDS.LIST]: {
    command: AI_COMMANDS.LIST,
    description: 'List files in the current directory or specified path',
    usage: '/list [path] [-r for recursive]',
    examples: [
      '/list',
      '/list components -r',
      '/list utils'
    ],
    handler: async (args, context) => {
      // Implementation will be added
      return {
        success: true,
        message: 'Files listed',
      };
    }
  },
  [AI_COMMANDS.HELP]: {
    command: AI_COMMANDS.HELP,
    description: 'Show available commands and their usage',
    usage: '/help [command]',
    examples: [
      '/help',
      '/help analyze',
      '/help modify'
    ],
    handler: async (args, context) => {
      const commandName = args[0]?.startsWith('/') ? args[0] : args[0] ? `/${args[0]}` : null;
      
      if (commandName && COMMAND_HANDLERS[commandName]) {
        const cmd = COMMAND_HANDLERS[commandName];
        return {
          success: true,
          message: `Command: ${cmd.command}\nDescription: ${cmd.description}\nUsage: ${cmd.usage}\nExamples:\n${cmd.examples.map(e => `  ${e}`).join('\n')}`
        };
      }
      
      return {
        success: true,
        message: formatCommandInstructions(false)
      };
    }
  },
  [AI_COMMANDS.UNDO]: {
    command: AI_COMMANDS.UNDO,
    description: 'Undo the last modification',
    usage: '/undo',
    examples: ['/undo'],
    handler: async (args, context) => {
      return {
        success: true,
        message: 'Last change undone',
      };
    }
  },
  [AI_COMMANDS.SAVE]: {
    command: AI_COMMANDS.SAVE,
    description: 'Save current changes',
    usage: '/save [message]',
    examples: [
      '/save',
      '/save "Updated component styling"'
    ],
    handler: async (args, context) => {
      return {
        success: true,
        message: 'Changes saved',
      };
    }
  },
  [AI_COMMANDS.PREVIEW]: {
    command: AI_COMMANDS.PREVIEW,
    description: 'Preview changes before applying them',
    usage: '/preview',
    examples: ['/preview'],
    handler: async (args, context) => {
      return {
        success: true,
        message: 'Preview generated',
      };
    }
  },
  [AI_COMMANDS.GENERATE]: {
    command: AI_COMMANDS.GENERATE,
    description: 'Generate new code based on a description',
    usage: '/generate [type] [description]',
    examples: [
      '/generate component "A button with loading state"',
      '/generate hook "useWindowSize hook to track window dimensions"',
      '/generate util "Function to format date strings"'
    ],
    handler: async (args, context) => {
      const [type, ...descParts] = args;
      const description = descParts.join(' ');
      
      if (!type || !description) {
        return {
          success: false,
          message: 'Please provide both a type and description. Example: /generate component "A button with loading state"',
          error: 'Invalid arguments'
        };
      }

      // TODO: Implement AI code generation
      const generatedCode = `// Generated ${type} based on: ${description}\n// Implementation pending`;
      
      return {
        success: true,
        message: `Generated ${type} code based on your description`,
        code: generatedCode
      };
    }
  },
  [AI_COMMANDS.APPLY]: {
    command: AI_COMMANDS.APPLY,
    description: 'Apply generated or modified code to the editor',
    usage: '/apply [target] [-r to replace entire file]',
    examples: [
      '/apply',
      '/apply -r',
      '/apply cursor'
    ],
    handler: async (args, context) => {
      const replaceFile = args.includes('-r');
      const atCursor = args.includes('cursor');
      
      return {
        success: true,
        message: `Code applied ${replaceFile ? 'replacing entire file' : atCursor ? 'at cursor position' : 'at appropriate location'}`,
      };
    }
  },
  [AI_COMMANDS.EXPLAIN]: {
    command: AI_COMMANDS.EXPLAIN,
    description: 'Get an explanation of the current code or generated code',
    usage: '/explain [target]',
    examples: [
      '/explain',
      '/explain generated',
      '/explain function'
    ],
    handler: async (args, context) => {
      const target = args[0] || 'current';
      
      return {
        success: true,
        message: `Explanation of ${target} code:\n\nThis is a placeholder explanation. Implementation pending.`,
      };
    }
  }
};
