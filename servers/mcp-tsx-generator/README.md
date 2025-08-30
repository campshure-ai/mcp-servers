# TSX Vibe-Coding Tools MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with powerful TSX component generation capabilities. This enables LLMs like Claude to understand your project context and generate production-ready React components with intelligent awareness of your codebase.

## 🚀 Why MCP Server?

Converting to an MCP server provides several major advantages:

### 🤖 **AI-Native Development**
- **Context Awareness**: AI can understand your project structure, dependencies, and conventions
- **Intelligent Generation**: Components generated with awareness of existing patterns
- **Real-time Analysis**: Live project analysis and recommendations
- **Seamless Integration**: Works directly within AI chat interfaces

### 🔄 **Enhanced Developer Experience**
- **Natural Language**: Generate components using conversational descriptions
- **Project Understanding**: AI learns your project conventions automatically
- **Continuous Improvement**: AI suggests optimizations based on your codebase
- **Zero Context Switching**: Generate components without leaving your AI assistant

### 🎯 **Production Benefits**
- **Consistency**: AI ensures components follow your established patterns
- **Quality Assurance**: Built-in analysis and recommendations
- **Team Collaboration**: Shared understanding through AI assistance
- **Documentation**: Auto-generated component documentation


## 🚀 Project Structure

```
mcp-tsx-generator/
├── src/
│   └── mcp-server.ts          # Main MCP server file
├── dist/                      # Built files (generated)
├── package.json               # JSON with correct config
├── tsconfig.json              # TypeScript configuration
├── test-mcp.js                # Test script
└── README.md                  # Documentation
```

## 🛠 Build and Run

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Test MCP Connection
```bash
npm run test:mcp
```

## 🎯 Usage Examples

### 1. Generate a Button Component
```json
{
  "method": "tools/call",
  "params": {
    "name": "generate_component",
    "arguments": {
      "template": "component-minimal",
      "name": "Button",
      "props": [
        {"name": "label", "type": "string"},
        {"name": "onClick", "type": "() => void"}
      ]
    }
  }
}
```

### 2. Generate a Form Component
```json
{
  "method": "tools/call",
  "params": {
    "name": "generate_component", 
    "arguments": {
      "template": "component-form",
      "name": "LoginForm",
      "withTests": true,
      "withStories": true
    }
  }
}
```

### 3. List Available Templates
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_templates",
    "arguments": {
      "search": "form"
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Error: "Cannot find module"
```bash
# Make sure you have type: "module" in package.json
# Install missing dependencies:
npm install @modelcontextprotocol/sdk zod
```

#### Error: "Permission denied"
```bash
# Fix file permissions after build:
chmod +x dist/mcp-server.js
```

#### Server won't start
```bash
# Check Node version (needs 18+):
node --version

# Clean install:
rm -rf node_modules package-lock.json
npm install
```

#### MCP Client Connection Issues
```bash
# Test with stdio directly:
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | npm run dev
```

## 🚀 Claude Desktop Integration

### 1. Install the MCP Server
```bash
npm install -g .
```

### 2. Add to Claude Desktop Config

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "vibe-tsx-generator": {
      "command": "mcp-tsx-generator",
      "args": [],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

The MCP server will now be available in Claude Desktop!

## 🎯 Testing with Claude

Once connected, you can ask Claude:

> "Create a responsive card component with title, description, and action button props"

Claude will use the MCP server to:
1. Analyze your request
2. Choose the appropriate template  
3. Generate the component with TypeScript
4. Include tests and proper accessibility
5. Show you the generated files

## 📊 Performance Monitoring

### Add Logging
```typescript
// Add to mcp-server.ts
console.error(`[${new Date().toISOString()}] Generated ${validated.name} in ${Date.now() - startTime}ms`);
```

### Monitor Usage
```bash
# Watch logs
tail -f ~/.cache/claude/logs/mcp-server.log
```

## 🎉 What's Working Now

✅ **Self-contained MCP server** with embedded templates  
✅ **No external dependencies** on missing files  
✅ **Proper ES module support** with correct imports  
✅ **Built-in component generation** for React/TypeScript  
✅ **Accessibility features** and best practices  
✅ **Test and story generation** capabilities  
✅ **Project structure analysis** tools  

The fixed implementation eliminates all import errors and provides a working MCP server that can generate production-ready TSX components!

## 🚀 Next Steps

1. **Test the server**: `npm run dev`
2. **Build for production**: `npm run build`  
3. **Connect to Claude Desktop** using the config above
4. **Start generating components** with natural language!

Your MCP server is now ready to revolutionize your component development workflow! 🎯

## 📦 Installation

### Global Installation

```bash
npm install -g @campshure-ai/mcp-tsx-generator
```

### Project Installation

```bash
npm install --save-dev @campshure-ai/mcp-tsx-generator
```

## ⚙️ Configuration

### For Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "vibe-tsx-generator": {
      "command": "mcp-tsx-generator",
      "args": [],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### For Other MCP Clients

```json
{
  "server": {
    "command": ["node", "/path/to/vibe-tools/dist/mcp-server.js"],
    "args": [],
    "cwd": "/path/to/your/project"
  }
}
```

### Environment Variables

```bash
# Optional: Enable debug logging
export VIBE_DEBUG=true

# Optional: Disable telemetry
export VIBE_TELEMETRY=false

# Optional: Custom config file
export VIBE_CONFIG_PATH=/path/to/vibe.config.json
```

## 🛠 Available Tools

The MCP server provides these tools to AI assistants:

### 1. `generate_component`
Generate production-ready TSX components with full TypeScript support.

**Parameters:**
- `template`: Template ID (component-minimal, component-form, layout-page, etc.)
- `name`: Component name in PascalCase
- `props`: Array of prop definitions with types
- `outputDir`: Custom output directory
- `withTests`: Generate test files (default: true)
- `withStories`: Generate Storybook stories (default: false)
- `accessibility`: Include accessibility features (default: true)
- `animations`: Include animation utilities (default: false)

**Example Usage by AI:**
```
I need a form component called "UserRegistration" with email, password, and confirmPassword fields, including validation and accessibility features.
```

### 2. `list_templates`
List and filter available component templates.

**Parameters:**
- `category`: Filter by category (component, layout, hook, util)
- `tags`: Filter by tags array
- `search`: Search query string

### 3. `analyze_project`
Analyze project structure and provide architectural recommendations.

**Parameters:**
- `directory`: Project directory to analyze
- `includeRecommendations`: Include improvement suggestions

### 4. `configure_project`
Configure vibe-tools settings for the current project.

**Parameters:**
- `framework`: react | next | vite
- `styling`: tailwind | styled-components | css-modules | emotion
- `typescript`: boolean
- `testing`: jest | vitest | none
- `storybook`: boolean

### 5. `read_file` / `write_file`
Read and write files in the project for context understanding.

### 6. `get_project_context`
Get comprehensive project information including dependencies, structure, and conventions.

### 7. `suggest_improvements`
Analyze existing components and suggest improvements.

## 🎯 Usage Examples

### Natural Language Component Generation

**User to AI:**
> "Create a responsive card component for displaying user profiles with avatar, name, bio, and social links. Include hover animations and accessibility features."

**AI Response:**
The AI will use the MCP server to:
1. Analyze your project structure
2. Choose the appropriate template
3. Generate the component with your project's conventions
4. Include tests and documentation
5. Provide the generated code

### Project Analysis

**User to AI:**
> "Analyze my React project and suggest improvements for component organization."

**AI Response:**
The AI will:
1. Scan your project structure
2. Identify patterns and conventions
3. Suggest architectural improvements
4. Recommend missing tests or documentation
5. Propose component refactoring opportunities

### Configuration Management

**User to AI:**
> "Set up my project to use Next.js with Tailwind CSS and Vitest for testing."

**AI Response:**
The AI will automatically configure your project settings and reinitialize the generator with the new configuration.

## 🔧 Development

### Building the MCP Server

```bash
# Clone the repository
git clone https://github.com/campshure-ai/mcp-servers/mcp-tsx-generator.git
cd mcp-tsx-generator

# Install dependencies
npm install

# Build the server
npm run build

# Test the server
npm run test:mcp
```

### Testing MCP Connection

```javascript
// test-mcp-connection.js
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testConnection() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/mcp-server.js']
  });

  const client = new Client({
    name: 'test-client',
    version: '1.0.0'
  }, {
    capabilities: {}
  });

  await client.connect(transport);
  
  // Test listing templates
  const result = await client.request({
    method: 'tools/call',
    params: {
      name: 'list_templates',
      arguments: {}
    }
  });

  console.log('Templates:', result);
  await client.close();
}

testConnection().catch(console.error);
```

### Custom Template Development

```typescript
// src/templates/custom-template.ts
export const customTemplate: Template = {
  id: 'component-custom',
  name: 'Custom Component',
  version: '1.0.0',
  description: 'A custom component template',
  tags: ['component', 'custom'],
  dependencies: ['react'],
  devDependencies: ['@types/react'],
  files: [
    {
      path: '{{name}}/{{name}}.tsx',
      content: (config, props) => generateCustomComponent(config, props),
    },
    {
      path: '{{name}}/{{name}}.test.tsx',
      content: (config, props) => generateCustomTest(config, props),
    }
  ],
  hooks: {
    preGenerate: async () => {
      // Pre-generation logic
    },
    postGenerate: async (files) => {
      // Post-generation logic
      console.log(`Generated ${files.length} files`);
    }
  }
};
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY templates ./templates

EXPOSE 3000

CMD ["node", "dist/mcp-server.js"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-tsx-generator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mcp-tsx-generator
  template:
    metadata:
      labels:
        app: mcp-tsx-generator
    spec:
      containers:
      - name: mcp-server
        image: vibe-tools/mcp-tsx-generator:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: VIBE_TELEMETRY
          value: "false"
```

### AWS Lambda Deployment

```typescript
// lambda-handler.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { VibeCodeMCPServer } from './mcp-server';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const server = new VibeCodeMCPServer();
  
  // Process MCP request from API Gateway
  const mcpRequest = JSON.parse(event.body || '{}');
  const response = await server.handleRequest(mcpRequest);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
};
```

## 🔒 Security

### Security Features

- **Input Validation**: All inputs validated with Zod schemas
- **Path Traversal Protection**: Prevents access outside project directory
- **Sanitized Output**: All generated code is sanitized
- **Rate Limiting**: Built-in rate limiting for API calls
- **Audit Logging**: Optional audit logging for enterprise use

### Security Configuration

```json
{
  "security": {
    "enableRateLimit": true,
    "maxRequestsPerMinute": 30,
    "enableAuditLog": true,
    "restrictedPaths": ["/etc", "/usr", "/var"],
    "allowedExtensions": [".ts", ".tsx", ".js", ".jsx", ".json", ".md"]
  }
}
```

## 📊 Monitoring & Analytics

### Built-in Metrics

- Component generation count
- Template usage statistics
- Performance metrics
- Error rates and types
- Project analysis insights

### Telemetry Integration

```typescript
// Optional telemetry configuration
{
  "telemetry": {
    "enabled": true,
    "endpoint": "https://analytics.vibe-tools.dev",
    "anonymize": true,
    "includeMetrics": ["usage", "performance", "errors"]
  }
}
```

## 🎮 AI Assistant Integration Examples

### With Claude

```
Human: Create a modern dashboard component with sidebar navigation, header, and main content area. Use Tailwind for styling and include responsive breakpoints.

Claude: I'll help you create a comprehensive dashboard component using the vibe-tools MCP server. Let me analyze your project first and then generate the appropriate components.

[Claude uses get_project_context to understand the project]
[Claude uses generate_component with layout-dashboard template]
[Claude provides the generated code with explanations]
```

### With Custom AI

```python
# Example integration with custom AI system
import mcp_client

async def generate_component_with_ai(user_prompt):
    # Parse user intent
    intent = parse_component_intent(user_prompt)
    
    # Use MCP server to generate component
    result = await mcp_client.call_tool(
        'generate_component',
        {
            'template': intent.template,
            'name': intent.component_name,
            'props': intent.props,
            'accessibility': True,
            'withTests': True
        }
    )
    
    return result
```

## 🔄 Continuous Integration

### GitHub Actions Integration

```yaml
name: MCP Server Test
on: [push, pull_request]

jobs:
  test-mcp:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build MCP server
        run: npm run build
        
      - name: Test MCP connection
        run: npm run test:mcp
        
      - name: Test component generation
        run: |
          echo '{"method": "tools/call", "params": {"name": "generate_component", "arguments": {"template": "component-minimal", "name": "TestComponent"}}}' | node dist/mcp-server.js
```

## 📚 Advanced Usage

### Batch Component Generation

```typescript
// Batch generate multiple components
const components = [
  { template: 'component-minimal', name: 'Header' },
  { template: 'component-minimal', name: 'Footer' },
  { template: 'component-form', name: 'ContactForm' },
  { template: 'layout-page', name: 'HomePage' }
];

for (const component of components) {
  await mcpClient.callTool('generate_component', component);
}
```

### Project Migration

```typescript
// Migrate existing components to vibe-tools patterns
const existingComponents = await scanExistingComponents();

for (const component of existingComponents) {
  const improvements = await mcpClient.callTool(
    'suggest_improvements',
    { componentPath: component.path }
  );
  
  // Apply improvements or regenerate with better template
  if (improvements.severity === 'high') {
    await regenerateComponent(component, improvements.suggestedTemplate);
  }
}
```

## 🎯 Best Practices

### For AI Assistants

1. **Always analyze project context first** using `get_project_context`
2. **Use appropriate templates** based on component requirements
3. **Include accessibility features** by default
4. **Generate tests** for all components
5. **Follow project conventions** detected by the analyzer

### For Developers

1. **Configure project properly** using `configure_project`
2. **Review generated code** before committing
3. **Customize templates** for project-specific needs
4. **Monitor usage metrics** for optimization
5. **Keep templates updated** with latest best practices

## 🐛 Troubleshooting

### Common Issues

**MCP Connection Failed**
```bash
# Check server status
node dist/mcp-server.js --version

# Test with minimal client
npm run test:mcp
```

**Component Generation Failed**
```bash
# Enable debug mode
export VIBE_DEBUG=true
node dist/mcp-server.js
```

**Template Not Found**
```bash
# List available templates
echo '{"method": "tools/call", "params": {"name": "list_templates", "arguments": {}}}' | node dist/mcp-server.js
```

### Debug Mode

```bash
# Enable comprehensive debugging
export VIBE_DEBUG=true
export VIBE_LOG_LEVEL=verbose
node dist/mcp-server.js
```

## 🔗 Resources

- [MCP Specification](https://modelcontextprotocol.io/docs)
- [Claude Desktop MCP Guide](https://claude.ai/docs/mcp)
- [Vibe Tools Documentation](https://vibe-tools.dev/docs)
- [TypeScript React Best Practices](https://react.dev/learn/typescript)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 💡 Why This Approach Is Revolutionary

### Traditional vs MCP-Powered Development

| Traditional | MCP-Powered |
|------------|-------------|
| Manual component creation | AI-generated with context awareness |
| Copy-paste from examples | Custom generation based on project patterns |
| Inconsistent patterns | Enforced consistency through AI |
| Manual documentation | Auto-generated docs and tests |
| Limited project understanding | Deep project analysis and insights |

### The Future of AI-Assisted Development

This MCP server represents the future of developer tools:
- **Contextual Intelligence**: AI that understands your project deeply
- **Seamless Integration**: No context switching between tools
- **Continuous Learning**: AI that learns from your codebase patterns
- **Production Ready**: Enterprise-grade reliability and security

Ready to revolutionize your component development workflow? Install the MCP server and experience the future of AI-powered coding! 🚀