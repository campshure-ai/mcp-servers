#!/usr/bin/env node

/**
 * @fileoverview Working MCP Server for TSX Vibe-Coding Tools
 * @version 1.0.0 - All TypeScript issues fixed
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// MCP Server Configuration
const SERVER_NAME = 'vibe-tsx-generator';
const SERVER_VERSION = '1.0.0';

// Configuration Schema
const ConfigSchema = z.object({
  framework: z.enum(['react', 'next', 'vite']).default('react'),
  styling: z.enum(['tailwind', 'styled-components', 'css-modules', 'emotion']).default('tailwind'),
  typescript: z.boolean().default(true),
  testing: z.enum(['jest', 'vitest', 'none']).default('vitest'),
  storybook: z.boolean().default(false),
  outputDir: z.string().default('./src/components'),
  eslint: z.boolean().default(true),
  prettier: z.boolean().default(true),
});

type Config = z.infer<typeof ConfigSchema>;

// Tool Schemas
const GenerateComponentSchema = z.object({
  template: z.string().describe('Template ID (e.g., component-minimal, component-form)'),
  name: z.string().describe('Component name in PascalCase'),
  props: z.array(z.object({
    name: z.string(),
    type: z.string(),
    optional: z.boolean().optional(),
    description: z.string().optional()
  })).optional().describe('Component props definition'),
  outputDir: z.string().optional().describe('Output directory (defaults to config)'),
  description: z.string().optional().describe('Component description'),
  withTests: z.boolean().default(true).describe('Generate test files'),
  withStories: z.boolean().default(false).describe('Generate Storybook stories'),
});

// Template System
interface Template {
  id: string;
  name: string;
  version: string;
  description: string;
  tags: string[];
  dependencies: string[];
  generate: (config: Config, props: any) => string;
}

class EmbeddedTemplateRegistry {
  private templates = new Map<string, Template>();

  constructor() {
    this.loadDefaultTemplates();
  }

  private loadDefaultTemplates() {
    this.register({
      id: 'component-minimal',
      name: 'Minimal Component',
      version: '1.0.0',
      description: 'Lightweight component with TypeScript support',
      tags: ['component', 'minimal'],
      dependencies: ['react'],
      generate: (config, props) => this.generateMinimalComponent(config, props)
    });

    this.register({
      id: 'component-form',
      name: 'Form Component',
      version: '1.0.0',
      description: 'Form component with validation',
      tags: ['component', 'form'],
      dependencies: ['react'],
      generate: (config, props) => this.generateFormComponent(config, props)
    });

    this.register({
      id: 'layout-page',
      name: 'Page Layout',
      version: '1.0.0',
      description: 'Full page layout with SEO',
      tags: ['layout', 'page'],
      dependencies: ['react'],
      generate: (config, props) => this.generatePageLayout(config, props)
    });
  }

  register(template: Template) {
    this.templates.set(template.id, template);
  }

  get(id: string): Template | undefined {
    return this.templates.get(id);
  }

  list(): Template[] {
    return Array.from(this.templates.values());
  }

  search(query: string): Template[] {
    const lowerQuery = query.toLowerCase();
    return this.list().filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.includes(lowerQuery))
    );
  }

  private generateMinimalComponent(config: Config, props: any): string {
    const { name, props: componentProps = [], description } = props;
    const propsInterface = componentProps.length > 0
      ? `interface ${name}Props {\n  ${componentProps.map((p: any) => `${p.name}: ${p.type};`).join('\n  ')}\n}`
      : `interface ${name}Props {}`;

    return `import React from 'react';

${propsInterface}

/**
 * ${name} component
 * @description ${description || 'A reusable component'}
 */
export const ${name}: React.FC<${name}Props> = ({ ${componentProps.map((p: any) => p.name).join(', ')} }) => {
  return (
    <div 
      className="${config.styling === 'tailwind' ? 'p-4 border rounded-lg' : 'component-container'}"
      data-testid="${name.toLowerCase()}"
      role="region"
      aria-label="${name}"
    >
      <h2 className="${config.styling === 'tailwind' ? 'text-xl font-semibold mb-2' : 'component-title'}">
        {${componentProps.find((p: any) => p.name === 'title')?.name || `'${name}'`}}
      </h2>
      <p className="${config.styling === 'tailwind' ? 'text-gray-600' : 'component-text'}">
        This is the ${name} component.
      </p>
    </div>
  );
};

${name}.displayName = '${name}';

export default ${name};
`;
  }

  private generateFormComponent(config: Config, props: any): string {
    const { name } = props;
    return `import React, { useState } from 'react';

interface ${name}Props {
  onSubmit: (data: FormData) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

interface FormData {
  email: string;
  password: string;
}

export const ${name}: React.FC<${name}Props> = ({ 
  onSubmit, 
  loading = false,
  className = '' 
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={\`space-y-4 max-w-md mx-auto \${className}\`}
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={\`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 \${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }\`}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={\`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 \${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }\`}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ${name};
`;
  }

  private generatePageLayout(config: Config, props: any): string {
    const { name } = props;
    return `import React, { ReactNode } from 'react';

interface ${name}Props {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const ${name}: React.FC<${name}Props> = ({
  children,
  title = 'Page Title',
  description = 'Page description',
  className = ''
}) => {
  return (
    <div className={\`min-h-screen bg-gray-50 \${className}\`}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-600">{description}</p>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Your App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ${name};
`;
  }
}

// Configuration Manager
class SimpleConfigManager {
  private configPath = 'vibe.config.json';
  private defaultConfig: Config = {
    framework: 'react',
    styling: 'tailwind',
    typescript: true,
    testing: 'vitest',
    storybook: false,
    outputDir: './src/components',
    eslint: true,
    prettier: true,
  };

  async load(): Promise<Config> {
    try {
      const content = await fs.readFile(this.configPath, 'utf8');
      const config = JSON.parse(content);
      return ConfigSchema.parse({ ...this.defaultConfig, ...config });
    } catch {
      return this.defaultConfig;
    }
  }

  async save(config: Partial<Config>): Promise<void> {
    const currentConfig = await this.load();
    const newConfig = { ...currentConfig, ...config };
    const validatedConfig = ConfigSchema.parse(newConfig);
    await fs.writeFile(this.configPath, JSON.stringify(validatedConfig, null, 2));
  }
}

// Component Generator
class SimpleComponentGenerator {
  constructor(
    private config: Config,
    private registry: EmbeddedTemplateRegistry
  ) { }

  async generate(templateId: string, name: string, options: any = {}): Promise<string[]> {
    const template = this.registry.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const outputDir = options.outputDir || path.join(this.config.outputDir, name);

    await fs.mkdir(outputDir, { recursive: true });

    const componentContent = template.generate(this.config, {
      name,
      ...options
    });

    const componentPath = path.join(outputDir, `${name}.tsx`);
    await fs.writeFile(componentPath, componentContent);

    const files = [componentPath];

    if (options.withTests) {
      const testContent = this.generateTestFile(name);
      const testPath = path.join(outputDir, `${name}.test.tsx`);
      await fs.writeFile(testPath, testContent);
      files.push(testPath);
    }

    if (options.withStories) {
      const storyContent = this.generateStoryFile(name);
      const storyPath = path.join(outputDir, `${name}.stories.tsx`);
      await fs.writeFile(storyPath, storyContent);
      files.push(storyPath);
    }

    const indexContent = `export { ${name} } from './${name}';`;
    const indexPath = path.join(outputDir, 'index.ts');
    await fs.writeFile(indexPath, indexContent);
    files.push(indexPath);

    return files;
  }

  private generateTestFile(name: string): string {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByTestId('${name.toLowerCase()}')).toBeInTheDocument();
  });
});
`;
  }

  private generateStoryFile(name: string): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
`;
  }
}

// Helper function for safe error handling
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

// Main MCP Server
class VibeCodeMCPServer {
  private server: Server;
  private generator!: SimpleComponentGenerator;
  private registry: EmbeddedTemplateRegistry;
  private configManager: SimpleConfigManager;

  constructor() {
    // Fixed: Use single argument for Server constructor
    this.server = new Server({
      name: SERVER_NAME,
      version: SERVER_VERSION,
    });

    this.registry = new EmbeddedTemplateRegistry();
    this.configManager = new SimpleConfigManager();
    this.setupServer();
  }

  private async setupServer() {
    try {
      const config = await this.configManager.load();
      this.generator = new SimpleComponentGenerator(config, this.registry);
    } catch (error) {
      const defaultConfig = ConfigSchema.parse({});
      this.generator = new SimpleComponentGenerator(defaultConfig, this.registry);
    }

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_component',
            description: 'Generate a new TSX component with production-ready features',
            inputSchema: GenerateComponentSchema.shape,
          },
          {
            name: 'list_templates',
            description: 'List available component templates',
            inputSchema: z.object({
              search: z.string().optional().describe('Search query')
            }).shape,
          },
          {
            name: 'get_project_info',
            description: 'Get information about the current project',
            inputSchema: z.object({}).shape,
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_component':
            return await this.handleGenerateComponent(args);

          case 'list_templates':
            return await this.handleListTemplates(args);

          case 'get_project_info':
            return await this.handleGetProjectInfo();

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${getErrorMessage(error)}`
        );
      }
    });
  }

  private async handleGenerateComponent(args: any) {
    const validated = GenerateComponentSchema.parse(args);

    try {
      const files = await this.generator.generate(
        validated.template,
        validated.name,
        {
          props: validated.props || [],
          description: validated.description,
          outputDir: validated.outputDir,
          withTests: validated.withTests,
          withStories: validated.withStories,
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: `✅ Successfully generated ${validated.name} component!\n\n` +
              `Template: ${validated.template}\n` +
              `Files created: ${files.length}\n\n` +
              `Files:\n${files.map(f => `  • ${f}`).join('\n')}\n\n` +
              `Features included:\n` +
              `  • TypeScript interfaces and proper typing\n` +
              `  • Accessibility features (ARIA labels, semantic HTML)\n` +
              `  • ${validated.withTests ? 'Unit tests' : 'No tests'}\n` +
              `  • ${validated.withStories ? 'Storybook stories' : 'No stories'}`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Failed to generate component: ${getErrorMessage(error)}`
      );
    }
  }

  private async handleListTemplates(args: any) {
    const { search } = args;

    let templates = this.registry.list();
    if (search) {
      templates = this.registry.search(search);
    }

    return {
      content: [
        {
          type: 'text',
          text: `📋 Available Templates (${templates.length}):\n\n` +
            templates.map(t =>
              `**${t.id}** (v${t.version})\n` +
              `  ${t.description}\n` +
              `  Tags: ${t.tags.join(', ')}\n`
            ).join('\n') +
            '\n💡 Use generate_component with any template ID.',
        },
      ],
    };
  }

  private async handleGetProjectInfo() {
    try {
      const config = await this.configManager.load();

      return {
        content: [
          {
            type: 'text',
            text: `🏗️ Project Configuration:\n\n` +
              `  • Framework: ${config.framework}\n` +
              `  • Styling: ${config.styling}\n` +
              `  • TypeScript: ${config.typescript}\n` +
              `  • Testing: ${config.testing}\n` +
              `  • Output Directory: ${config.outputDir}\n`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get project info: ${getErrorMessage(error)}`
      );
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Vibe TSX Generator MCP Server running on stdio');
  }
}

// Start the server
const server = new VibeCodeMCPServer();
server.run().catch((error) => {
  console.error('Server error:', getErrorMessage(error));
  process.exit(1);
});