# 📦 Problem Solving MCP Server - Installation Guide

## 🔧 System Requirements

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Operating System**: Windows, macOS, or Linux
- **Memory**: At least 512MB available RAM
- **Storage**: At least 100MB free disk space

## ⚡ Quick Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/problem-solving-mcp.git
cd problem-solving-mcp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Project
```bash
npm run build
```

### 4. Verify Installation
```bash
npm start
```

## 🔧 Configuration Methods

### Using in Cursor

1. **Open Cursor Settings**
   - Press `Ctrl/Cmd + ,` to open settings
   - Search for "MCP" or "Model Context Protocol"

2. **Add MCP Server Configuration**
   Add the following configuration to Cursor's MCP settings:
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
   
   > **Important**: Replace `/path/to/problem-solving-mcp` with your actual project path.
   > 
   > **Example paths**:
   > - Windows: `C:\\Users\\YourName\\Projects\\problem-solving-mcp`
   > - macOS/Linux: `/Users/YourName/Projects/problem-solving-mcp`

3. **Restart Cursor**
   Restart Cursor after configuration

### Using in Claude Desktop

1. **Find Configuration File Location**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Edit Configuration File**
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
   
   > **Important**: Replace `/path/to/problem-solving-mcp` with your actual project path.

3. **Restart Claude Desktop**

### Using NPM Global Installation (Recommended)

1. **Publish to npm (Optional)**
   ```bash
   npm publish
   ```

2. **Global Installation**
   ```bash
   npm install -g problem-solving-mcp
   ```

3. **Configuration (Using npx)**
   ```json
   {
     "mcpServers": {
       "problem-solving": {
         "command": "npx",
         "args": ["problem-solving-mcp"],
         "env": {
           "NODE_ENV": "production"
         }
       }
     }
   }
   ```

## 🎯 Available Tools

After successful installation, you will have access to the following 15 powerful tools:

### Core Tools
- **create_problem** - Create problem definition
- **solve_problem** - Intelligent problem solving
- **get_role_recommendations** - Get role configuration suggestions
- **check_solution** - Check solution quality

### Management Tools
- **get_problem_history** - View problem history
- **get_team_status** - View team status
- **update_team_member** - Update team member
- **assign_task** - Assign tasks

### Analysis Tools
- **eisenhower_matrix_analysis** - Important-urgent quadrant analysis
- **analyze_task_dependencies** - Task dependency analysis
- **optimize_parallel_execution** - Parallel execution optimization
- **get_execution_report** - Get execution report

### Reflection Tools
- **create_reflection** - Create reflection record
- **get_reflection_summary** - Get reflection summary
- **improve_solution** - Improve solution

## 🚀 Quick Start

### 1. Create Your First Problem
```
Use the create_problem tool:
- title: "Develop AI Customer Service System"
- description: "Develop intelligent customer service system for e-commerce platform, supporting multi-turn dialogue, sentiment analysis, and automatic replies"
- domain: "software_development"
- complexity_score: 8
```

### 2. Get Role Recommendations
```
Use the get_role_recommendations tool:
- problem_id: "newly created problem ID"
```

### 3. Start Solving the Problem
```
Use the solve_problem tool:
- problem_id: "problem ID"
```

### 4. View Results
```
Use the get_execution_report tool to view detailed execution report
```

## 🔍 Troubleshooting

### Common Issues

1. **Server Startup Failure**
   - Check Node.js version (requires >= 18)
   - Ensure all dependencies are properly installed
   - Verify path configuration is correct

2. **Tools Not Available**
   - Confirm MCP server is running correctly
   - Check configuration file format
   - Restart client application

3. **Permission Issues**
   - Ensure sufficient file system permissions
   - May require administrator privileges on Windows

### Debug Mode

Enable debug mode:
```bash
npm run dev
```

View detailed logs:
```bash
NODE_ENV=development npm start
```

## 📊 Performance Optimization

### Team Expansion Strategy
- Automatically detect repetitive tasks
- Intelligently expand team size (up to 30 members)
- Optimize parallel execution efficiency (target 2.5x improvement)

### Resource Allocation
- Capability-based workload distribution
- Avoid resource conflicts
- Dynamic load balancing

## 🤝 Support and Contribution

- 📧 Email: your-email@example.com
- 🐛 Bug Reports: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Documentation: [Wiki](https://github.com/your-repo/wiki)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

🎉 **Congratulations! You have successfully configured the Problem Solving MCP Server!**

Now you can enjoy the powerful features of intelligent problem solving in Cursor or Claude Desktop! 