import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { v4 as uuidv4 } from 'uuid';

import { Problem, Team, Solution, Task, Role, Reflection, Priority, TaskStatus, RoleType } from './types.js';
import { Coordinator } from './core/coordinator.js';
import { RoleCreator } from './core/role-creator.js';
import { ResultChecker } from './core/result-checker.js';
import { TOOLS } from './tools.js';

export class ProblemSolvingServer {
  private server: Server;
  private coordinator: Coordinator;
  private roleCreator: RoleCreator;
  private resultChecker: ResultChecker;
  
  private problems: Map<string, Problem> = new Map();
  private teams: Map<string, Team> = new Map();
  private solutions: Map<string, Solution> = new Map();
  private reflections: Map<string, Reflection[]> = new Map();

  constructor() {
    this.server = new Server({
      name: 'problem-solving-mcp',
      version: '1.0.0',
      capabilities: {
        tools: {}
      }
    });

    this.coordinator = new Coordinator();
    this.roleCreator = new RoleCreator();
    this.resultChecker = new ResultChecker();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Object.values(TOOLS).map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_problem':
            return await this.handleCreateProblem(args);
          case 'solve_problem':
            return await this.handleSolveProblem(args);
          case 'get_role_recommendations':
            return await this.handleGetRoleRecommendations(args);
          case 'check_solution':
            return await this.handleCheckSolution(args);
          case 'get_problem_history':
            return await this.handleGetProblemHistory(args);
          case 'get_team_status':
            return await this.handleGetTeamStatus(args);
          case 'eisenhower_matrix_analysis':
            return await this.handleEisenhowerMatrixAnalysis(args);
          default:
            throw new Error(`未知工具: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : '未知错误'}`
            }
          ]
        };
      }
    });
  }

  private async handleCreateProblem(args: any) {
    const problem: Problem = {
      id: uuidv4(),
      title: args.title,
      description: args.description,
      domain: args.domain,
      complexity_score: args.complexity_score,
      constraints: args.constraints || [],
      success_criteria: args.success_criteria || [],
      stakeholders: args.stakeholders || [],
      created_at: new Date(),
      updated_at: new Date()
    };

    this.problems.set(problem.id, problem);

    return {
      content: [
        {
          type: 'text',
          text: `✅ 问题创建成功！\n\n` +
                `🎯 **问题ID**: ${problem.id}\n` +
                `📋 **标题**: ${problem.title}\n` +
                `🏷️ **领域**: ${problem.domain}\n` +
                `📊 **复杂度**: ${problem.complexity_score}/10\n` +
                `⚠️ **约束条件**: ${problem.constraints.length > 0 ? problem.constraints.join(', ') : '无'}\n` +
                `🎯 **成功标准**: ${problem.success_criteria.length > 0 ? problem.success_criteria.join(', ') : '待定义'}\n\n` +
                `📝 **描述**: ${problem.description}\n\n` +
                `💡 **下一步**: 使用 \`solve_problem\` 工具开始解决这个问题`
        }
      ]
    };
  }

  private async handleSolveProblem(args: any) {
    const problem = this.problems.get(args.problem_id);
    if (!problem) {
      throw new Error(`问题 ${args.problem_id} 不存在`);
    }

    const result = await this.coordinator.solveProblem(problem);
    
    this.teams.set(result.team.id, result.team);
    this.solutions.set(result.solution.id, result.solution);
    this.reflections.set(result.team.id, result.reflections);

    return {
      content: [
        {
          type: 'text',
          text: `🎉 **问题解决完成！**\n\n` +
                `${result.summary}\n\n` +
                `📊 **详细结果**:\n` +
                `- 团队ID: ${result.team.id}\n` +
                `- 解决方案ID: ${result.solution.id}\n` +
                `- 解决方案状态: ${result.checkResult.approved ? '✅ 已批准' : '❌ 需改进'}\n` +
                `- 整体评分: ${result.checkResult.overall_score}/100\n` +
                `- 执行成功率: ${result.executionResult ? `${(result.executionResult.success_rate * 100).toFixed(1)}%` : '未执行'}\n\n` +
                `🔍 **发现的问题**: ${result.checkResult.issues.length} 个\n` +
                `💡 **改进建议**: ${result.checkResult.recommendations.length} 条\n` +
                `🤔 **反思记录**: ${result.reflections.length} 条\n\n` +
                `${result.success ? '🎊 **项目成功完成！**' : '⚠️ **项目需要进一步改进**'}`
        }
      ]
    };
  }

  private async handleGetRoleRecommendations(args: any) {
    const problem = this.problems.get(args.problem_id);
    if (!problem) {
      throw new Error(`问题 ${args.problem_id} 不存在`);
    }

    const recommendations = this.roleCreator.getRoleRecommendations(problem);

    return {
      content: [
        {
          type: 'text',
          text: `🎭 **角色配置建议**\n\n` +
                `📊 **推荐团队规模**: ${recommendations.team_size} 人\n\n` +
                `👥 **推荐角色**:\n` +
                recommendations.recommended_roles.map((role, index) => 
                  `${index + 1}. ${this.getRoleDisplayName(role)}`
                ).join('\n') + '\n\n' +
                `💭 **推荐理由**:\n${recommendations.reasoning}`
        }
      ]
    };
  }

  private async handleCheckSolution(args: any) {
    const solution = this.solutions.get(args.solution_id);
    if (!solution) {
      throw new Error(`解决方案 ${args.solution_id} 不存在`);
    }

    const team = this.teams.get(solution.team_id);
    if (!team) {
      throw new Error(`团队 ${solution.team_id} 不存在`);
    }

    const checkResult = await this.resultChecker.checkSolution(solution, team);

    return {
      content: [
        {
          type: 'text',
          text: `🔍 **解决方案检查结果**\n\n` +
                `📊 **总体评分**: ${checkResult.overall_score}/100\n` +
                `✅ **批准状态**: ${checkResult.approved ? '已批准' : '需改进'}\n\n` +
                `📈 **各项评分**:\n` +
                `- 完整性: ${checkResult.completeness_score}/100\n` +
                `- 可行性: ${checkResult.feasibility_score}/100\n` +
                `- 质量: ${checkResult.quality_score}/100\n` +
                `- 风险: ${checkResult.risk_score}/100\n` +
                `- 时间线: ${checkResult.timeline_score}/100\n\n` +
                `🚨 **发现问题**: ${checkResult.issues.length} 个\n` +
                checkResult.issues.map(issue => 
                  `- [${issue.severity.toUpperCase()}] ${issue.description}`
                ).join('\n') + '\n\n' +
                `💡 **改进建议**:\n` +
                checkResult.recommendations.map(rec => `- ${rec}`).join('\n')
        }
      ]
    };
  }

  private async handleGetProblemHistory(args: any) {
    const limit = args.limit || 10;
    const history = Array.from(this.coordinator.getProblemHistory().values()).slice(-limit);

    if (history.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: '📋 **问题历史记录为空**\n\n暂无解决过的问题记录。'
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `📋 **问题解决历史** (最近 ${history.length} 条)\n\n` +
                history.map((result, index) => 
                  `${index + 1}. **${result.problem.title}**\n` +
                  `   - 复杂度: ${result.problem.complexity_score}/10\n` +
                  `   - 团队规模: ${result.team.roles.length} 人\n` +
                  `   - 评分: ${result.checkResult.overall_score}/100\n` +
                  `   - 状态: ${result.success ? '✅ 成功' : '❌ 需改进'}\n`
                ).join('\n')
        }
      ]
    };
  }

  private async handleGetTeamStatus(args: any) {
    const team = this.teams.get(args.team_id);
    if (!team) {
      throw new Error(`团队 ${args.team_id} 不存在`);
    }

    const taskStats = {
      pending: team.tasks.filter(t => t.status === TaskStatus.PENDING).length,
      in_progress: team.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      completed: team.tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      blocked: team.tasks.filter(t => t.status === TaskStatus.BLOCKED).length,
      cancelled: team.tasks.filter(t => t.status === TaskStatus.CANCELLED).length
    };

    const progress = team.tasks.length > 0 ? (taskStats.completed / team.tasks.length * 100).toFixed(1) : '0';

    return {
      content: [
        {
          type: 'text',
          text: `👥 **团队状态报告**\n\n` +
                `🏷️ **团队名称**: ${team.name}\n` +
                `👤 **团队规模**: ${team.roles.length} 人\n` +
                `📊 **整体进度**: ${progress}%\n` +
                `📅 **创建时间**: ${team.created_at.toLocaleDateString()}\n\n` +
                `📋 **任务统计**:\n` +
                `- ⏳ 待处理: ${taskStats.pending} 个\n` +
                `- 🔄 进行中: ${taskStats.in_progress} 个\n` +
                `- ✅ 已完成: ${taskStats.completed} 个\n` +
                `- 🚫 已阻塞: ${taskStats.blocked} 个\n` +
                `- ❌ 已取消: ${taskStats.cancelled} 个\n\n` +
                `👥 **角色列表**:\n` +
                team.roles.map(role => 
                  `- ${role.name} (${this.getRoleDisplayName(role.type)}) - 专业度: ${role.expertise_level}/10`
                ).join('\n')
        }
      ]
    };
  }

  private async handleEisenhowerMatrixAnalysis(args: any) {
    const team = this.teams.get(args.team_id);
    if (!team) {
      throw new Error(`团队 ${args.team_id} 不存在`);
    }

    const matrix = this.analyzeEisenhowerMatrix(team.tasks);

    return {
      content: [
        {
          type: 'text',
          text: `📊 **重要紧急4分法分析**\n\n` +
                `🔥 **第一象限 (紧急且重要)**: ${matrix.urgent_important.length} 个任务\n` +
                matrix.urgent_important.map(task => `   - ${task.title}`).join('\n') + '\n\n' +
                `📋 **第二象限 (重要但不紧急)**: ${matrix.not_urgent_important.length} 个任务\n` +
                matrix.not_urgent_important.map(task => `   - ${task.title}`).join('\n') + '\n\n' +
                `⚡ **第三象限 (紧急但不重要)**: ${matrix.urgent_not_important.length} 个任务\n` +
                matrix.urgent_not_important.map(task => `   - ${task.title}`).join('\n') + '\n\n' +
                `📝 **第四象限 (既不紧急也不重要)**: ${matrix.not_urgent_not_important.length} 个任务\n` +
                matrix.not_urgent_not_important.map(task => `   - ${task.title}`).join('\n') + '\n\n' +
                `💡 **建议**:\n` +
                `- 立即处理第一象限任务\n` +
                `- 计划安排第二象限任务\n` +
                `- 委派处理第三象限任务\n` +
                `- 消除或推迟第四象限任务`
        }
      ]
    };
  }

  private getRoleDisplayName(roleType: RoleType | string): string {
    const roleNames: Record<string, string> = {
      'analyst': '系统分析师',
      'researcher': '研究员',
      'designer': '设计师',
      'developer': '开发工程师',
      'tester': '测试工程师',
      'project_manager': '项目经理',
      'domain_expert': '领域专家',
      'strategist': '战略规划师',
      'communicator': '沟通协调员',
      'quality_assurer': '质量保证专员',
      'risk_manager': '风险管理专员',
      'innovator': '创新专员'
    };
    return roleNames[roleType as string] || roleType as string;
  }

  private analyzeEisenhowerMatrix(tasks: Task[]) {
    return {
      urgent_important: tasks.filter(t => t.priority === Priority.URGENT_IMPORTANT),
      not_urgent_important: tasks.filter(t => t.priority === Priority.NOT_URGENT_IMPORTANT),
      urgent_not_important: tasks.filter(t => t.priority === Priority.URGENT_NOT_IMPORTANT),
      not_urgent_not_important: tasks.filter(t => t.priority === Priority.NOT_URGENT_NOT_IMPORTANT)
    };
  }

  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('问题解决MCP服务器已启动');
  }
} 