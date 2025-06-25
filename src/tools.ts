import { z } from 'zod';

// 创建问题工具的参数架构
export const CreateProblemSchema = z.object({
  title: z.string().describe('问题标题'),
  description: z.string().describe('问题详细描述'),
  domain: z.string().describe('问题所属领域'),
  complexity_score: z.number().min(1).max(10).describe('问题复杂度评分(1-10)'),
  constraints: z.array(z.string()).optional().describe('约束条件'),
  success_criteria: z.array(z.string()).optional().describe('成功标准'),
  stakeholders: z.array(z.string()).optional().describe('相关干系人')
});

// 解决问题工具的参数架构
export const SolveProblemSchema = z.object({
  problem_id: z.string().describe('问题ID')
});

// 获取角色建议工具的参数架构
export const GetRoleRecommendationsSchema = z.object({
  problem_id: z.string().describe('问题ID')
});

// 检查解决方案工具的参数架构
export const CheckSolutionSchema = z.object({
  solution_id: z.string().describe('解决方案ID')
});

// 获取问题历史工具的参数架构
export const GetProblemHistorySchema = z.object({
  limit: z.number().optional().describe('返回结果数量限制')
});

// 获取团队状态工具的参数架构
export const GetTeamStatusSchema = z.object({
  team_id: z.string().describe('团队ID')
});

// 更新任务状态工具的参数架构
export const UpdateTaskStatusSchema = z.object({
  task_id: z.string().describe('任务ID'),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked', 'cancelled']).describe('新状态'),
  notes: z.string().optional().describe('更新备注')
});

// 添加反思工具的参数架构
export const AddReflectionSchema = z.object({
  team_id: z.string().describe('团队ID'),
  phase: z.string().describe('反思阶段'),
  what_worked_well: z.array(z.string()).describe('做得好的方面'),
  what_could_improve: z.array(z.string()).describe('需要改进的方面'),
  lessons_learned: z.array(z.string()).describe('经验教训'),
  action_items: z.array(z.object({
    item: z.string(),
    assigned_to: z.string(),
    due_date: z.string().optional()
  })).optional().describe('行动项')
});

// 分析并行性工具的参数架构
export const AnalyzeParallelismSchema = z.object({
  team_id: z.string().describe('团队ID')
});

// 优化任务分配工具的参数架构
export const OptimizeTaskAllocationSchema = z.object({
  team_id: z.string().describe('团队ID'),
  optimization_strategy: z.enum(['workload_balance', 'skill_match', 'priority_focus']).optional().describe('优化策略')
});

// 生成进度报告工具的参数架构
export const GenerateProgressReportSchema = z.object({
  team_id: z.string().describe('团队ID'),
  report_type: z.enum(['summary', 'detailed', 'executive']).optional().describe('报告类型')
});

// 重要紧急矩阵分析工具的参数架构
export const EisenhowerMatrixAnalysisSchema = z.object({
  team_id: z.string().describe('团队ID')
});

// 风险评估工具的参数架构
export const AssessRisksSchema = z.object({
  problem_id: z.string().describe('问题ID'),
  additional_factors: z.array(z.string()).optional().describe('额外风险因素')
});

// 创建自定义角色工具的参数架构
export const CreateCustomRoleSchema = z.object({
  name: z.string().describe('角色名称'),
  type: z.string().describe('角色类型'),
  description: z.string().describe('角色描述'),
  skills: z.array(z.string()).describe('技能列表'),
  responsibilities: z.array(z.string()).describe('职责列表'),
  expertise_level: z.number().min(1).max(10).describe('专业水平(1-10)')
});

// 模拟执行工具的参数架构
export const SimulateExecutionSchema = z.object({
  solution_id: z.string().describe('解决方案ID'),
  simulation_params: z.object({
    success_rate_modifier: z.number().optional().describe('成功率修正因子'),
    time_pressure: z.number().optional().describe('时间压力因子'),
    resource_availability: z.number().optional().describe('资源可用性因子')
  }).optional().describe('模拟参数')
});

// 🚀 并行优化相关工具架构

// 分析任务工作量工具的参数架构
export const AnalyzeTaskWorkloadSchema = z.object({
  task_id: z.string().describe('任务ID')
});

// 扩展团队支持并行处理工具的参数架构
export const ExpandTeamForParallelSchema = z.object({
  team_id: z.string().describe('团队ID'),
  force_expansion: z.boolean().optional().describe('是否强制扩展（忽略触发条件）').default(false)
});

// 获取并行优化报告工具的参数架构
export const GetParallelOptimizationReportSchema = z.object({
  team_id: z.string().describe('团队ID')
});

// 优化工作负载分配工具的参数架构
export const OptimizeWorkloadDistributionSchema = z.object({
  team_id: z.string().describe('团队ID'),
  strategy: z.enum(['even', 'capacity_based', 'skill_based']).optional().describe('分配策略：平均分配、基于能力、基于技能').default('capacity_based')
});

// 创建并行执行计划工具的参数架构
export const CreateParallelExecutionPlanSchema = z.object({
  team_id: z.string().describe('团队ID')
});

// 导出所有工具定义
export const TOOLS = {
  create_problem: {
    name: 'create_problem',
    description: '创建一个新的待解决问题',
    inputSchema: CreateProblemSchema
  },
  
  solve_problem: {
    name: 'solve_problem',
    description: '解决指定的问题，创建团队并生成完整的解决方案',
    inputSchema: SolveProblemSchema
  },
  
  get_role_recommendations: {
    name: 'get_role_recommendations',
    description: '获取针对特定问题的角色配置建议',
    inputSchema: GetRoleRecommendationsSchema
  },
  
  check_solution: {
    name: 'check_solution',
    description: '检查和评估解决方案的质量',
    inputSchema: CheckSolutionSchema
  },
  
  get_problem_history: {
    name: 'get_problem_history',
    description: '获取问题解决历史记录',
    inputSchema: GetProblemHistorySchema
  },
  
  get_team_status: {
    name: 'get_team_status',
    description: '获取团队当前状态和任务进展',
    inputSchema: GetTeamStatusSchema
  },
  
  update_task_status: {
    name: 'update_task_status',
    description: '更新任务状态',
    inputSchema: UpdateTaskStatusSchema
  },
  
  add_reflection: {
    name: 'add_reflection',
    description: '添加团队反思记录',
    inputSchema: AddReflectionSchema
  },
  
  analyze_parallelism: {
    name: 'analyze_parallelism',
    description: '分析任务并行执行的可能性',
    inputSchema: AnalyzeParallelismSchema
  },
  
  optimize_task_allocation: {
    name: 'optimize_task_allocation',
    description: '优化任务分配，平衡工作负载',
    inputSchema: OptimizeTaskAllocationSchema
  },
  
  generate_progress_report: {
    name: 'generate_progress_report',
    description: '生成项目进度报告',
    inputSchema: GenerateProgressReportSchema
  },
  
  eisenhower_matrix_analysis: {
    name: 'eisenhower_matrix_analysis',
    description: '使用重要紧急4分法分析任务优先级',
    inputSchema: EisenhowerMatrixAnalysisSchema
  },
  
  assess_risks: {
    name: 'assess_risks',
    description: '评估问题和解决方案的风险',
    inputSchema: AssessRisksSchema
  },
  
  create_custom_role: {
    name: 'create_custom_role',
    description: '创建自定义角色',
    inputSchema: CreateCustomRoleSchema
  },
  
  simulate_execution: {
    name: 'simulate_execution',
    description: '模拟解决方案执行过程',
    inputSchema: SimulateExecutionSchema
  },

  // 🚀 并行优化工具
  analyze_task_workload: {
    name: 'analyze_task_workload',
    description: '分析单个任务的重复性和工作量，用于并行优化决策',
    inputSchema: AnalyzeTaskWorkloadSchema
  },
  
  expand_team_for_parallel: {
    name: 'expand_team_for_parallel',
    description: '为团队创建角色细分以支持并行处理重复性高的任务',
    inputSchema: ExpandTeamForParallelSchema
  },
  
  get_parallel_optimization_report: {
    name: 'get_parallel_optimization_report',
    description: '获取团队并行优化详细报告，包括任务分析、角色细分、执行计划等',
    inputSchema: GetParallelOptimizationReportSchema
  },
  
  optimize_workload_distribution: {
    name: 'optimize_workload_distribution',
    description: '优化团队工作负载分配，重新平衡任务分配以提高并行效率',
    inputSchema: OptimizeWorkloadDistributionSchema
  },
  
  create_parallel_execution_plan: {
    name: 'create_parallel_execution_plan',
    description: '为团队创建详细的并行执行计划，包括阶段划分和资源分配',
    inputSchema: CreateParallelExecutionPlanSchema
  }
} as const;

export type ToolName = keyof typeof TOOLS; 