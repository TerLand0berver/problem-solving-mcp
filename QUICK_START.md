# 🚀 问题解决MCP服务器 - 快速开始

## ✅ 服务器已就绪！

您的问题解决MCP服务器已经成功构建并准备使用！

## 🎯 核心功能

### 📊 15个强大的MCP工具
- **create_problem** - 创建问题定义
- **solve_problem** - 智能解决问题（核心功能）
- **get_role_recommendations** - 获取角色配置建议
- **check_solution** - 检查解决方案质量
- **eisenhower_matrix_analysis** - 重要紧急4分法分析
- **optimize_parallel_execution** - 并行执行优化
- **get_execution_report** - 获取执行报告
- 以及8个其他管理和分析工具

### 🎭 智能团队配置
- 根据问题复杂度自动推荐3-12人团队
- 12种专业角色类型可选
- 智能角色匹配和工作分配

### 🔍 多维度质量保证
- 完整性、可行性、质量、风险、时间线全面检查
- 自动生成改进建议
- 综合评分（0-100分）

### ⚡ 并行处理优化
- 自动检测重复性高的任务
- 智能扩展团队规模（最多30人）
- 优化并行执行效率（目标2.5倍提升）

## 🔧 在Cursor中使用

### 1. 打开Cursor设置
按 `Ctrl/Cmd + ,` 打开设置，搜索 "MCP"

### 2. 添加服务器配置
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

### 3. 重启Cursor
配置生效后重启Cursor

## 🖥️ 在Claude Desktop中使用

### 1. 找到配置文件
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 2. 编辑配置文件
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

### 3. 重启Claude Desktop

## 🎯 快速测试

配置完成后，尝试以下命令：

### 1. 创建问题
```
请帮我创建一个问题：开发AI客服系统，为电商平台开发智能客服系统，支持多轮对话、情感分析和自动回复，领域是软件开发，复杂度8分
```

### 2. 获取角色建议
```
请为刚创建的问题推荐合适的团队角色配置
```

### 3. 解决问题
```
请开始解决这个问题，生成完整的解决方案
```

### 4. 分析优先级
```
请使用重要紧急4分法分析这个项目的任务优先级
```

## 📈 高级用法

### 并行处理优化
```
请分析这个项目的并行执行潜力，并优化团队配置以提高效率
```

### 质量检查
```
请检查生成的解决方案的质量，并提供改进建议
```

### 执行报告
```
请生成详细的项目执行报告，包含时间线、资源分配和风险评估
```

## 🔍 故障排除

### 服务器无法启动
1. 确认Node.js版本 >= 18
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build` 重新构建

### 工具不可用
1. 检查配置文件路径是否正确
2. 确认服务器正在运行
3. 重启客户端应用

### 权限问题
1. 确保有足够的文件系统权限
2. Windows上可能需要管理员权限

## 📚 更多信息

- 详细配置指南：`INSTALLATION.md`
- 使用示例：`examples/example-usage.md`
- 项目文档：`README.md`

## 🎉 开始使用

您的问题解决MCP服务器现在已经完全准备就绪！

享受智能问题解决的强大功能吧！ 🚀✨ 