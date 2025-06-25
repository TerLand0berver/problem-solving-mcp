# 🚀 Problem Solving MCP Server - Quick Start

## ✅ Server Ready!

Your Problem Solving MCP Server has been successfully built and is ready to use!

## 🎯 Core Features

### 📊 15 Powerful MCP Tools
- **create_problem** - Create problem definition
- **solve_problem** - Intelligent problem solving (core function)
- **get_role_recommendations** - Get role configuration suggestions
- **check_solution** - Check solution quality
- **eisenhower_matrix_analysis** - Important-urgent quadrant analysis
- **optimize_parallel_execution** - Parallel execution optimization
- **get_execution_report** - Get execution report
- Plus 8 other management and analysis tools

### 🎭 Intelligent Team Configuration
- Automatically recommend 3-12 member teams based on problem complexity
- 12 professional role types available
- Smart role matching and work allocation

### 🔍 Multi-dimensional Quality Assurance
- Comprehensive checks on completeness, feasibility, quality, risk, and timeline
- Automatically generate improvement suggestions
- Comprehensive scoring (0-100 points)

### ⚡ Parallel Processing Optimization
- Automatically detect repetitive tasks
- Intelligently expand team size (up to 30 members)
- Optimize parallel execution efficiency (target 2.5x improvement)

## 🔧 Using in Cursor

### 1. Open Cursor Settings
Press `Ctrl/Cmd + ,` to open settings, search for "MCP"

### 2. Add Server Configuration
```json
{
  "mcpServers": {
    "problem-solving": {
      "command": "node",
      "args": ["/path/to/problem-solving-mcp/dist/index.js"],
      "cwd": "/path/to/problem-solving-mcp",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

> **Note**: Replace `/path/to/problem-solving-mcp` with your actual project path

### 3. Restart Cursor
Configuration takes effect after restarting Cursor

## 🖥️ Using in Claude Desktop

### 1. Find Configuration File
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 2. Edit Configuration File
```json
{
  "mcpServers": {
    "problem-solving": {
      "command": "node",
      "args": ["/path/to/problem-solving-mcp/dist/index.js"],
      "cwd": "/path/to/problem-solving-mcp",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

> **Note**: Replace `/path/to/problem-solving-mcp` with your actual project path

### 3. Restart Claude Desktop

## 🎯 Quick Test

After configuration, try the following commands:

### 1. Create Problem
```
Please help me create a problem: Develop AI customer service system, develop intelligent customer service system for e-commerce platform, supporting multi-turn dialogue, sentiment analysis, and automatic replies, domain is software development, complexity score 8
```

### 2. Get Role Recommendations
```
Please recommend suitable team role configuration for the newly created problem
```

### 3. Solve Problem
```
Please start solving this problem and generate a complete solution
```

### 4. Analyze Priority
```
Please use the Eisenhower Matrix to analyze the task priorities of this project
```

## 📈 Advanced Usage

### Parallel Processing Optimization
```
Please analyze the parallel execution potential of this project and optimize team configuration to improve efficiency
```

### Quality Check
```
Please check the quality of the generated solution and provide improvement suggestions
```

### Execution Report
```
Please generate a detailed project execution report, including timeline, resource allocation, and risk assessment
```

## 🔍 Troubleshooting

### Server Cannot Start
1. Confirm Node.js version >= 18
2. Run `npm install` to install dependencies
3. Run `npm run build` to rebuild

### Tools Not Available
1. Check if configuration file path is correct
2. Confirm server is running
3. Restart client application

### Permission Issues
1. Ensure sufficient file system permissions
2. May require administrator privileges on Windows

## 📚 More Information

- Detailed configuration guide: `INSTALLATION.md`
- Usage examples: `examples/example-usage.md`
- Project documentation: `README.md`

## 🎉 Start Using

Your Problem Solving MCP Server is now fully ready!

Enjoy the powerful features of intelligent problem solving! 🚀✨ 