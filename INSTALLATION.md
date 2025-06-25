# 🚀 问题解决MCP服务器 - 安装配置指南

## 📋 概述

这是一个专为问题分解和多角色协同解决方案设计的MCP（Model Context Protocol）服务器。它能够智能分析问题复杂度，组建专业团队，并通过多角色协作生成高质量的解决方案。

## 🛠️ 安装步骤

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd problem-solving-mcp
```

### 2. 安装依赖
```bash
npm install
```

### 3. 构建项目
```bash
npm run build
```

### 4. 验证安装
```bash
npm start
```

## 🔧 配置方法

### 在 Cursor 中使用

1. **打开 Cursor 设置**
   - 按 `Ctrl/Cmd + ,` 打开设置
   - 搜索 "MCP" 或 "Model Context Protocol"

2. **添加 MCP 服务器配置**
   在 Cursor 的 MCP 配置中添加：
   ```json
   {
     "mcpServers": {
       "problem-solving": {
         "command": "node",
         "args": ["C:/Users/TerLa/Desktop/keee/dist/index.js"],
         "cwd": "C:/Users/TerLa/Desktop/keee",
         "env": {
           "NODE_ENV": "production"
         }
       }
     }
   }
   ```

3. **重启 Cursor**
   配置生效后重启 Cursor

### 在 Claude Desktop 中使用

1. **找到配置文件位置**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **编辑配置文件**
   ```json
   {
     "mcpServers": {
       "problem-solving": {
         "command": "node",
         "args": ["C:/Users/TerLa/Desktop/keee/dist/index.js"],
         "cwd": "C:/Users/TerLa/Desktop/keee",
         "env": {
           "NODE_ENV": "production"
         }
       }
     }
   }
   ```

3. **重启 Claude Desktop**

### 使用 NPM 全局安装（推荐）

1. **发布到 npm（可选）**
   ```bash
   npm publish
   ```

2. **全局安装**
   ```bash
   npm install -g problem-solving-mcp
   ```

3. **配置（使用 npx）**
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

## 🎯 可用工具

安装成功后，您将获得以下15个强大的工具：

### 核心工具
- **create_problem** - 创建问题定义
- **solve_problem** - 智能解决问题
- **get_role_recommendations** - 获取角色配置建议
- **check_solution** - 检查解决方案质量

### 管理工具
- **get_problem_history** - 查看问题历史
- **get_team_status** - 查看团队状态
- **update_team_member** - 更新团队成员
- **assign_task** - 分配任务

### 分析工具
- **eisenhower_matrix_analysis** - 重要紧急4分法分析
- **analyze_task_dependencies** - 任务依赖分析
- **optimize_parallel_execution** - 并行执行优化
- **get_execution_report** - 获取执行报告

### 反思工具
- **create_reflection** - 创建反思记录
- **get_reflection_summary** - 获取反思总结
- **improve_solution** - 改进解决方案

## 🚀 快速开始

### 1. 创建第一个问题
```
使用 create_problem 工具：
- title: "开发AI客服系统"
- description: "为电商平台开发智能客服系统，支持多轮对话、情感分析和自动回复"
- domain: "software_development"
- complexity_score: 8
```

### 2. 获取角色建议
```
使用 get_role_recommendations 工具：
- problem_id: "刚创建的问题ID"
```

### 3. 开始解决问题
```
使用 solve_problem 工具：
- problem_id: "问题ID"
```

### 4. 查看结果
```
使用 get_execution_report 工具查看详细的执行报告
```

## 🔍 故障排除

### 常见问题

1. **服务器启动失败**
   - 检查 Node.js 版本（需要 >= 18）
   - 确保所有依赖已正确安装
   - 检查路径配置是否正确

2. **工具不可用**
   - 确认 MCP 服务器已正确启动
   - 检查配置文件格式是否正确
   - 重启客户端应用

3. **权限问题**
   - 确保有足够的文件系统权限
   - 在 Windows 上可能需要管理员权限

### 调试模式

启用调试模式：
```bash
npm run dev
```

查看详细日志：
```bash
NODE_ENV=development npm start
```

## 📊 性能优化

### 团队扩展策略
- 自动检测重复性高的任务
- 智能扩展团队规模（最多30人）
- 优化并行执行效率（目标2.5倍提升）

### 资源分配
- 基于能力的工作量分配
- 避免资源冲突
- 动态负载均衡

## 🤝 支持与贡献

- 📧 邮箱：your-email@example.com
- 🐛 问题反馈：[GitHub Issues](https://github.com/your-repo/issues)
- 📖 文档：[Wiki](https://github.com/your-repo/wiki)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

🎉 **恭喜！您已成功配置问题解决MCP服务器！**

现在您可以在 Cursor 或 Claude Desktop 中享受智能问题解决的强大功能了！ 