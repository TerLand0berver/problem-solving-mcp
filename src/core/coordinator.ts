import { v4 as uuidv4 } from 'uuid';
import { Problem, Team, Solution, Task, Priority, TaskStatus, Role, Reflection, TaskAnalysis, RoleSubdivision, TeamExpansionStrategy, ParallelExecutionPlan } from '../types.js';
import { RoleCreator } from './role-creator.js';
import { ResultChecker, CheckResult } from './result-checker.js';
import { ParallelOptimizer } from './parallel-optimizer.js';

/**
 * 协调者接口 - 定义协调者的核心功能
 */
export interface ICoordinator {
  solveProblem(problem: Problem): Promise<ProblemSolutionResult>;
  createTeam(problem: Problem): Promise<Team>;
  generateSolution(problem: Problem, team: Team): Promise<Solution>;
  executeSolution(solution: Solution, team: Team): Promise<ExecutionResult>;
}

/**
 * 问题解决结果
 */
export interface ProblemSolutionResult {
  problem: Problem;
  team: Team;
  solution: Solution;
  checkResult: CheckResult;
  executionResult?: ExecutionResult;
  reflections: Reflection[];
  success: boolean;
  summary: string;
}

/**
 * 执行结果
 */
export interface ExecutionResult {
  id: string;
  solution_id: string;
  team_id: string;
  completed_tasks: string[];
  in_progress_tasks: string[];
  blocked_tasks: string[];
  success_rate: number;
  actual_timeline: string;
  lessons_learned: string[];
  created_at: Date;
}

/**
 * 协调者 - 负责协调整个问题解决流程
 */
export class Coordinator implements ICoordinator {
  private roleCreator: RoleCreator;
  private resultChecker: ResultChecker;
  private parallelOptimizer: ParallelOptimizer;
  private problemHistory: Map<string, ProblemSolutionResult> = new Map();

  constructor() {
    this.roleCreator = new RoleCreator();
    this.resultChecker = new ResultChecker();
    this.parallelOptimizer = new ParallelOptimizer();
  }

  /**
   * 解决问题的主流程
   */
  public async solveProblem(problem: Problem): Promise<ProblemSolutionResult> {
    console.log(`开始解决问题: ${problem.title}`);
    
    try {
      // 1. 创建团队
      const team = await this.createTeam(problem);
      console.log(`团队创建完成，共 ${team.roles.length} 个角色`);

      // 2. 生成解决方案
      const solution = await this.generateSolution(problem, team);
      console.log(`解决方案生成完成`);

      // 3. 检查解决方案
      const checkResult = await this.resultChecker.checkSolution(solution, team);
      console.log(`解决方案检查完成，评分: ${checkResult.overall_score}/100`);

      // 4. 如果方案不合格，进行改进
      let finalSolution = solution;
      let finalCheckResult = checkResult;
      
      if (!checkResult.approved) {
        console.log('解决方案需要改进...');
        const improvedSolution = await this.improveSolution(solution, team, checkResult);
        finalCheckResult = await this.resultChecker.checkSolution(improvedSolution, team);
        finalSolution = improvedSolution;
      }

      // 5. 执行解决方案（如果获得批准）
      let executionResult: ExecutionResult | undefined;
      if (finalCheckResult.approved) {
        executionResult = await this.executeSolution(finalSolution, team);
        console.log(`解决方案执行完成，成功率: ${executionResult.success_rate * 100}%`);
      }

      // 6. 进行反思和总结
      const reflections = await this.conductReflection(team, finalSolution, executionResult);

      // 7. 生成最终结果
      const result: ProblemSolutionResult = {
        problem,
        team,
        solution: finalSolution,
        checkResult: finalCheckResult,
        executionResult,
        reflections,
        success: finalCheckResult.approved && (executionResult?.success_rate || 0) > 0.7,
        summary: this.generateSummary(problem, team, finalSolution, finalCheckResult, executionResult)
      };

      // 保存到历史记录
      this.problemHistory.set(problem.id, result);

      return result;

    } catch (error) {
      console.error('问题解决过程中发生错误:', error);
      throw error;
    }
  }

  /**
   * 创建团队
   */
  public async createTeam(problem: Problem): Promise<Team> {
    // 使用角色创建者创建角色
    const roles = this.roleCreator.createTeamRoles(problem);
    
    // 选择协调者（通常是项目经理）
    const coordinatorRole = roles.find(role => role.type === 'project_manager') || roles[0];

    // 创建初始任务
    const tasks = await this.createInitialTasks(problem, roles);

    // 创建基础团队
    let team: Team = {
      id: uuidv4(),
      name: `${problem.title} 解决团队`,
      problem_id: problem.id,
      roles,
      role_subdivisions: [],
      tasks,
      task_analyses: [],
      expansion_strategy: undefined,
      parallel_execution_plan: undefined,
      reflections: [],
      coordinator_id: coordinatorRole.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true
    };

    // 🚀 并行优化处理
    team = await this.optimizeTeamForParallelism(team);

    return team;
  }

  /**
   * 生成解决方案
   */
  public async generateSolution(problem: Problem, team: Team): Promise<Solution> {
    // 分析问题并制定实施计划
    const implementationPlan = this.createImplementationPlan(team);
    
    // 评估风险
    const riskAssessment = this.assessRisks(problem, team);
    
    // 定义成功指标
    const successMetrics = this.defineSuccessMetrics(problem);

    const solution: Solution = {
      id: uuidv4(),
      problem_id: problem.id,
      team_id: team.id,
      title: `${problem.title} 解决方案`,
      description: this.generateSolutionDescription(problem, team),
      implementation_plan: implementationPlan,
      risk_assessment: riskAssessment,
      success_metrics: successMetrics,
      estimated_timeline: this.estimateTimeline(team.tasks),
      estimated_cost: this.estimateCost(team),
      created_at: new Date(),
      updated_at: new Date(),
      status: 'draft'
    };

    return solution;
  }

  /**
   * 执行解决方案
   */
  public async executeSolution(solution: Solution, team: Team): Promise<ExecutionResult> {
    console.log('开始执行解决方案...');

    // 模拟执行过程
    const completedTasks: string[] = [];
    const inProgressTasks: string[] = [];
    const blockedTasks: string[] = [];

    // 按优先级执行任务
    const sortedTasks = this.sortTasksByPriority(team.tasks);
    
    for (const task of sortedTasks) {
      const executionSuccess = await this.executeTask(task, team);
      
      if (executionSuccess) {
        completedTasks.push(task.id);
        task.status = TaskStatus.COMPLETED;
        task.completion_date = new Date();
      } else {
        // 检查是否被阻塞
        const isBlocked = this.isTaskBlocked(task, team.tasks);
        if (isBlocked) {
          blockedTasks.push(task.id);
          task.status = TaskStatus.BLOCKED;
        } else {
          inProgressTasks.push(task.id);
          task.status = TaskStatus.IN_PROGRESS;
        }
      }
    }

    const successRate = completedTasks.length / team.tasks.length;
    
    const executionResult: ExecutionResult = {
      id: uuidv4(),
      solution_id: solution.id,
      team_id: team.id,
      completed_tasks: completedTasks,
      in_progress_tasks: inProgressTasks,
      blocked_tasks: blockedTasks,
      success_rate: successRate,
      actual_timeline: this.calculateActualTimeline(team.tasks),
      lessons_learned: this.extractLessonsLearned(team.tasks),
      created_at: new Date()
    };

    return executionResult;
  }

  /**
   * 改进解决方案
   */
  private async improveSolution(solution: Solution, team: Team, checkResult: CheckResult): Promise<Solution> {
    const improvedSolution = { ...solution };
    improvedSolution.id = uuidv4();
    improvedSolution.updated_at = new Date();

    // 根据检查结果改进方案
    for (const issue of checkResult.issues) {
      switch (issue.category) {
        case 'completeness':
          if (issue.description.includes('实施计划')) {
            improvedSolution.implementation_plan = this.enhanceImplementationPlan(solution.implementation_plan);
          }
          if (issue.description.includes('成功指标')) {
            improvedSolution.success_metrics = this.enhanceSuccessMetrics(solution.success_metrics);
          }
          break;
          
        case 'risk':
          improvedSolution.risk_assessment = this.enhanceRiskAssessment(solution.risk_assessment);
          break;
          
        case 'timeline':
          // 重新估算时间
          improvedSolution.estimated_timeline = this.reestimateTimeline(team.tasks);
          break;
      }
    }

    return improvedSolution;
  }

  /**
   * 进行反思
   */
  private async conductReflection(team: Team, solution: Solution, executionResult?: ExecutionResult): Promise<Reflection[]> {
    const reflections: Reflection[] = [];

    // 团队反思
    const teamReflection: Reflection = {
      id: uuidv4(),
      team_id: team.id,
      phase: 'team_formation',
      what_worked_well: [
        '角色分工明确',
        '技能互补性好',
        '沟通渠道畅通'
      ],
      what_could_improve: [
        '初期磨合时间较长',
        '部分角色工作量分配不均'
      ],
      lessons_learned: [
        '多角色协同需要更好的协调机制',
        '并行工作需要更清晰的接口定义'
      ],
      action_items: [
        {
          item: '建立更完善的团队协作流程',
          assigned_to: team.coordinator_id,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ],
      created_at: new Date(),
      created_by: team.coordinator_id
    };

    reflections.push(teamReflection);

    // 如果有执行结果，添加执行反思
    if (executionResult) {
      const executionReflection: Reflection = {
        id: uuidv4(),
        team_id: team.id,
        phase: 'execution',
        what_worked_well: executionResult.success_rate > 0.8 ? ['执行效率高', '任务完成质量好'] : ['团队协作良好'],
        what_could_improve: executionResult.blocked_tasks.length > 0 ? ['减少任务阻塞', '提高并行度'] : [],
        lessons_learned: executionResult.lessons_learned,
        action_items: [],
        created_at: new Date(),
        created_by: team.coordinator_id
      };

      reflections.push(executionReflection);
    }

    return reflections;
  }

  // 辅助方法
  private async createInitialTasks(problem: Problem, roles: Role[]): Promise<Task[]> {
    const tasks: Task[] = [];

    // 根据问题复杂度和角色创建任务
    const complexity = problem.complexity_score;

    // 分析阶段任务
    tasks.push({
      id: uuidv4(),
      title: '问题深度分析',
      description: '对问题进行全面深入的分析，明确需求和约束',
      priority: Priority.URGENT_IMPORTANT,
      assigned_roles: roles.filter(role => role.type === 'analyst').map(role => role.id),
      dependencies: [],
      status: TaskStatus.PENDING,
      estimated_hours: complexity * 2,
      deliverables: ['需求分析报告', '约束条件清单'],
      created_at: new Date(),
      updated_at: new Date()
    });

    // 设计阶段任务
    if (roles.some(role => role.type === 'designer')) {
      tasks.push({
        id: uuidv4(),
        title: '方案设计',
        description: '设计解决方案的架构和流程',
        priority: Priority.NOT_URGENT_IMPORTANT,
        assigned_roles: roles.filter(role => role.type === 'designer' || role.type === 'analyst').map(role => role.id),
        dependencies: [tasks[0].id],
        status: TaskStatus.PENDING,
        estimated_hours: complexity * 3,
        deliverables: ['设计方案', '架构图'],
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // 实施阶段任务
    if (roles.some(role => role.type === 'developer')) {
      tasks.push({
        id: uuidv4(),
        title: '方案实施',
        description: '实施解决方案',
        priority: Priority.URGENT_IMPORTANT,
        assigned_roles: roles.filter(role => role.type === 'developer').map(role => role.id),
        dependencies: tasks.length > 1 ? [tasks[1].id] : [tasks[0].id],
        status: TaskStatus.PENDING,
        estimated_hours: complexity * 5,
        deliverables: ['实施成果', '部署文档'],
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return tasks;
  }

  private createImplementationPlan(team: Team): any[] {
    const phases = [
      {
        phase: '分析阶段',
        tasks: team.tasks.filter(task => task.title.includes('分析')).map(task => task.id),
        timeline: '1-2周',
        resources_needed: ['分析工具', '调研资源']
      },
      {
        phase: '设计阶段',
        tasks: team.tasks.filter(task => task.title.includes('设计')).map(task => task.id),
        timeline: '2-3周',
        resources_needed: ['设计工具', '原型平台']
      },
      {
        phase: '实施阶段',
        tasks: team.tasks.filter(task => task.title.includes('实施')).map(task => task.id),
        timeline: '3-6周',
        resources_needed: ['开发环境', '测试环境']
      }
    ];

    return phases;
  }

  private assessRisks(problem: Problem, team: Team): any[] {
    const risks = [
      {
        risk: '技术风险',
        probability: problem.complexity_score > 7 ? 0.6 : 0.3,
        impact: 4,
        mitigation: '加强技术调研，准备备选方案'
      },
      {
        risk: '时间风险',
        probability: 0.4,
        impact: 3,
        mitigation: '合理安排任务优先级，准备资源调配'
      }
    ];

    return risks;
  }

  private defineSuccessMetrics(problem: Problem): string[] {
    return [
      '解决方案满足所有成功标准',
      '项目按时完成',
      '质量达到预期标准',
      '团队协作效率高'
    ];
  }

  private generateSolutionDescription(problem: Problem, team: Team): string {
    return `针对"${problem.title}"问题，我们组建了${team.roles.length}人专业团队，采用多角色协同的方式，通过系统性分析、创新设计和高效实施，提供全面的解决方案。团队将充分利用各角色的专业优势，确保方案的可行性和高质量交付。`;
  }

  private estimateTimeline(tasks: Task[]): string {
    const totalHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0);
    const weeks = Math.ceil(totalHours / 40);
    return `预计 ${weeks} 周`;
  }

  private estimateCost(team: Team): number {
    // 简化的成本估算
    return team.roles.length * 5000; // 假设每个角色成本5000
  }

  private sortTasksByPriority(tasks: Task[]): Task[] {
    const priorityOrder = {
      [Priority.URGENT_IMPORTANT]: 0,
      [Priority.NOT_URGENT_IMPORTANT]: 1,
      [Priority.URGENT_NOT_IMPORTANT]: 2,
      [Priority.NOT_URGENT_NOT_IMPORTANT]: 3
    };

    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  private async executeTask(task: Task, team: Team): Promise<boolean> {
    // 模拟任务执行
    const complexity = task.estimated_hours || 1;
    const teamCapability = team.roles.length;
    const successProbability = Math.min(0.9, teamCapability / complexity);
    
    return Math.random() < successProbability;
  }

  private isTaskBlocked(task: Task, allTasks: Task[]): boolean {
    return task.dependencies.some(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.status !== TaskStatus.COMPLETED;
    });
  }

  private calculateActualTimeline(tasks: Task[]): string {
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
    const actualHours = completedTasks.reduce((sum, task) => sum + (task.actual_hours || task.estimated_hours || 0), 0);
    const weeks = Math.ceil(actualHours / 40);
    return `实际用时 ${weeks} 周`;
  }

  private extractLessonsLearned(tasks: Task[]): string[] {
    const lessons = ['团队协作是成功的关键'];
    
    const blockedTasks = tasks.filter(task => task.status === TaskStatus.BLOCKED);
    if (blockedTasks.length > 0) {
      lessons.push('需要更好地管理任务依赖关系');
    }

    return lessons;
  }

  private enhanceImplementationPlan(originalPlan: any[]): any[] {
    return originalPlan.map(phase => ({
      ...phase,
      timeline: phase.timeline,
      resources_needed: [...phase.resources_needed, '质量检查工具'],
      milestones: [`${phase.phase}完成检查点`]
    }));
  }

  private enhanceSuccessMetrics(originalMetrics: string[]): string[] {
    return [
      ...originalMetrics,
      '用户满意度达到85%以上',
      '解决方案可维护性良好'
    ];
  }

  private enhanceRiskAssessment(originalRisks: any[]): any[] {
    return [
      ...originalRisks,
      {
        risk: '沟通风险',
        probability: 0.3,
        impact: 2,
        mitigation: '建立定期沟通机制，使用协作工具'
      }
    ];
  }

  private reestimateTimeline(tasks: Task[]): string {
    const adjustedHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0) * 1.2, 0);
    const weeks = Math.ceil(adjustedHours / 40);
    return `重新评估 ${weeks} 周`;
  }

  private generateSummary(problem: Problem, team: Team, solution: Solution, checkResult: CheckResult, executionResult?: ExecutionResult): string {
    let summary = `问题"${problem.title}"解决方案总结：\n\n`;
    summary += `团队规模：${team.roles.length}人\n`;
    summary += `方案评分：${checkResult.overall_score}/100\n`;
    summary += `方案状态：${checkResult.approved ? '已批准' : '需改进'}\n`;
    
    if (executionResult) {
      summary += `执行成功率：${(executionResult.success_rate * 100).toFixed(1)}%\n`;
      summary += `完成任务：${executionResult.completed_tasks.length}/${team.tasks.length}\n`;
    }

    summary += `\n主要特点：多角色协同、并行处理、系统性解决方案`;

    return summary;
  }

  /**
   * 获取问题解决历史
   */
  public getProblemHistory(): Map<string, ProblemSolutionResult> {
    return this.problemHistory;
  }

  /**
   * 获取特定问题的解决结果
   */
  public getProblemResult(problemId: string): ProblemSolutionResult | undefined {
    return this.problemHistory.get(problemId);
  }

  /**
   * 🚀 优化团队以支持并行处理
   */
  private async optimizeTeamForParallelism(team: Team): Promise<Team> {
    console.log('🔍 开始分析团队并行优化潜力...');
    
    // 1. 分析所有任务的重复性和工作量
    const taskAnalyses = this.parallelOptimizer.analyzeAllTasks(team);
    team.task_analyses = taskAnalyses;
    
    console.log(`📊 完成 ${taskAnalyses.length} 个任务分析`);
    
    // 2. 创建团队扩展策略
    const expansionStrategy = this.parallelOptimizer.createExpansionStrategy(team);
    team.expansion_strategy = expansionStrategy;
    
    // 3. 检查是否需要扩展团队
    const shouldExpand = this.parallelOptimizer.shouldExpandTeam(team, taskAnalyses);
    
    if (shouldExpand) {
      console.log('🎭 检测到需要扩展团队，开始创建角色细分...');
      
      // 4. 执行团队扩展
      const roleSubdivisions = this.parallelOptimizer.expandTeam(team, taskAnalyses);
      team.role_subdivisions = roleSubdivisions;
      
      console.log(`✨ 创建了 ${roleSubdivisions.length} 个角色细分`);
      
      // 5. 重新分配任务到细分角色
      const optimizationResult = this.parallelOptimizer.optimizeTaskAllocation(team);
      team.tasks = optimizationResult.optimizedTasks;
      
      console.log('📋 任务重新分配完成');
      console.log(optimizationResult.allocationReport);
    }
    
    // 6. 创建并行执行计划
    const parallelExecutionPlan = this.parallelOptimizer.createParallelExecutionPlan(team);
    team.parallel_execution_plan = parallelExecutionPlan;
    
    console.log(`⚡ 并行执行计划创建完成:`);
    console.log(`   - 串行预估时间: ${parallelExecutionPlan.total_estimated_time} 小时`);
    console.log(`   - 并行预估时间: ${parallelExecutionPlan.parallel_estimated_time} 小时`);
    console.log(`   - 效率提升: ${(parallelExecutionPlan.efficiency_improvement * 100).toFixed(1)}%`);
    
    // 7. 风险提示
    if (parallelExecutionPlan.risk_factors.length > 0) {
      console.log('⚠️  并行处理风险提示:');
      parallelExecutionPlan.risk_factors.forEach(risk => {
        console.log(`   - ${risk}`);
      });
    }
    
    return team;
  }

  /**
   * 🎯 获取团队并行优化报告
   */
  public getParallelOptimizationReport(teamId: string): string {
    const result = Array.from(this.problemHistory.values()).find(r => r.team.id === teamId);
    if (!result) return '未找到团队信息';
    
    const team = result.team;
    let report = '📊 **团队并行优化报告**\n\n';
    
    // 基本信息
    report += `🏷️ **团队名称**: ${team.name}\n`;
    report += `👤 **基础角色数量**: ${team.roles.length}\n`;
    report += `🎭 **细分角色数量**: ${team.role_subdivisions.length}\n`;
    report += `📋 **任务总数**: ${team.tasks.length}\n\n`;
    
    // 任务分析统计
    if (team.task_analyses.length > 0) {
      const avgRepetitiveness = team.task_analyses.reduce((sum, analysis) => sum + analysis.repetitiveness_score, 0) / team.task_analyses.length;
      const avgWorkload = team.task_analyses.reduce((sum, analysis) => sum + analysis.workload_score, 0) / team.task_analyses.length;
      const parallelizableTasks = team.task_analyses.filter(analysis => analysis.parallelizable).length;
      
      report += `📈 **任务分析统计**:\n`;
      report += `   - 平均重复性评分: ${avgRepetitiveness.toFixed(1)}/10\n`;
      report += `   - 平均工作量评分: ${avgWorkload.toFixed(1)}/10\n`;
      report += `   - 可并行任务数量: ${parallelizableTasks}/${team.task_analyses.length}\n`;
      report += `   - 并行化率: ${((parallelizableTasks / team.task_analyses.length) * 100).toFixed(1)}%\n\n`;
    }
    
    // 扩展策略信息
    if (team.expansion_strategy) {
      const strategy = team.expansion_strategy;
      report += `🎯 **扩展策略**:\n`;
      report += `   - 重复性阈值: ${strategy.trigger_conditions.min_repetitiveness_score}/10\n`;
      report += `   - 工作量阈值: ${strategy.trigger_conditions.min_workload_score}/10\n`;
      report += `   - 最大角色负载: ${strategy.trigger_conditions.max_single_role_workload}%\n`;
      report += `   - 目标并行效率: ${strategy.efficiency_targets.target_parallel_efficiency}x\n\n`;
    }
    
    // 角色细分详情
    if (team.role_subdivisions.length > 0) {
      report += `🎭 **角色细分详情**:\n`;
      team.role_subdivisions.forEach(subdivision => {
        report += `   - ${subdivision.subdivision_name}: ${subdivision.specialization}\n`;
        report += `     负载容量: ${subdivision.workload_capacity}%, 当前负载: ${subdivision.current_workload}%\n`;
        report += `     并行效率: ${subdivision.parallel_efficiency}x\n`;
      });
      report += '\n';
    }
    
    // 并行执行计划
    if (team.parallel_execution_plan) {
      const plan = team.parallel_execution_plan;
      report += `⚡ **并行执行计划**:\n`;
      report += `   - 串行总时间: ${plan.total_estimated_time} 小时\n`;
      report += `   - 并行总时间: ${plan.parallel_estimated_time} 小时\n`;
      report += `   - 效率提升: ${(plan.efficiency_improvement * 100).toFixed(1)}%\n`;
      report += `   - 执行阶段数: ${plan.execution_phases.length}\n`;
      
      if (plan.risk_factors.length > 0) {
        report += `   - 风险因素: ${plan.risk_factors.length} 个\n`;
        plan.risk_factors.forEach(risk => {
          report += `     • ${risk}\n`;
        });
      }
    }
    
    return report;
  }
} 