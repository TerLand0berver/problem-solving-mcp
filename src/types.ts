import { z } from 'zod';

// 重要紧急4分法枚举
export enum Priority {
  URGENT_IMPORTANT = 'urgent_important',     // 紧急且重要 - 立即处理
  NOT_URGENT_IMPORTANT = 'not_urgent_important', // 不紧急但重要 - 计划处理
  URGENT_NOT_IMPORTANT = 'urgent_not_important', // 紧急但不重要 - 委派处理
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important' // 不紧急不重要 - 消除或推迟
}

// 角色类型枚举
export enum RoleType {
  ANALYST = 'analyst',           // 分析师
  RESEARCHER = 'researcher',     // 研究员
  DESIGNER = 'designer',         // 设计师
  DEVELOPER = 'developer',       // 开发者
  TESTER = 'tester',            // 测试员
  PROJECT_MANAGER = 'project_manager', // 项目经理
  DOMAIN_EXPERT = 'domain_expert',     // 领域专家
  STRATEGIST = 'strategist',     // 战略家
  COMMUNICATOR = 'communicator', // 沟通协调员
  QUALITY_ASSURER = 'quality_assurer', // 质量保证员
  RISK_MANAGER = 'risk_manager', // 风险管理员
  INNOVATOR = 'innovator'        // 创新者
}

// 任务状态
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled'
}

// 角色定义
export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(RoleType),
  description: z.string(),
  skills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  expertise_level: z.number().min(1).max(10),
  created_at: z.date(),
  is_active: z.boolean().default(true)
});

// 任务定义
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.nativeEnum(Priority),
  assigned_roles: z.array(z.string()), // 角色ID数组
  dependencies: z.array(z.string()),   // 依赖任务ID数组
  status: z.nativeEnum(TaskStatus),
  estimated_hours: z.number().optional(),
  actual_hours: z.number().optional(),
  start_date: z.date().optional(),
  due_date: z.date().optional(),
  completion_date: z.date().optional(),
  deliverables: z.array(z.string()),
  notes: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date()
});

// 问题定义
export const ProblemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  complexity_score: z.number().min(1).max(10), // 复杂度评分
  domain: z.string(),
  constraints: z.array(z.string()),
  success_criteria: z.array(z.string()),
  stakeholders: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date()
});

// 团队定义
export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  problem_id: z.string(),
  roles: z.array(RoleSchema),
  tasks: z.array(TaskSchema),
  coordinator_id: z.string(), // 协调者角色ID
  created_at: z.date(),
  updated_at: z.date(),
  is_active: z.boolean().default(true)
});

// 解决方案定义
export const SolutionSchema = z.object({
  id: z.string(),
  problem_id: z.string(),
  team_id: z.string(),
  title: z.string(),
  description: z.string(),
  implementation_plan: z.array(z.object({
    phase: z.string(),
    tasks: z.array(z.string()), // 任务ID数组
    timeline: z.string(),
    resources_needed: z.array(z.string())
  })),
  risk_assessment: z.array(z.object({
    risk: z.string(),
    probability: z.number().min(0).max(1),
    impact: z.number().min(1).max(5),
    mitigation: z.string()
  })),
  success_metrics: z.array(z.string()),
  estimated_timeline: z.string(),
  estimated_cost: z.number().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.enum(['draft', 'approved', 'in_progress', 'completed', 'cancelled'])
});

// 反思记录定义
export const ReflectionSchema = z.object({
  id: z.string(),
  team_id: z.string(),
  phase: z.string(),
  what_worked_well: z.array(z.string()),
  what_could_improve: z.array(z.string()),
  lessons_learned: z.array(z.string()),
  action_items: z.array(z.object({
    item: z.string(),
    assigned_to: z.string(),
    due_date: z.date().optional()
  })),
  created_at: z.date(),
  created_by: z.string() // 角色ID
});

// 任务重复性和工作量分析
export const TaskAnalysisSchema = z.object({
  id: z.string(),
  task_id: z.string(),
  repetitiveness_score: z.number().min(0).max(10), // 0-10, 重复性评分
  workload_score: z.number().min(0).max(10), // 0-10, 工作量评分
  complexity_score: z.number().min(0).max(10), // 0-10, 复杂度评分
  parallelizable: z.boolean(), // 是否可并行
  subdivision_potential: z.number().min(0).max(10), // 0-10, 细分潜力
  estimated_hours: z.number(), // 预估工时
  skill_requirements: z.array(z.string()), // 技能要求
  created_at: z.date()
});

// 角色细分配置
export const RoleSubdivisionSchema = z.object({
  id: z.string(),
  parent_role_type: z.nativeEnum(RoleType),
  subdivision_name: z.string(), // 细分角色名称，如"前端开发工程师A"、"前端开发工程师B"
  specialization: z.string(), // 专业化方向，如"React组件开发"、"API集成"
  assigned_tasks: z.array(z.string()), // 分配的任务ID列表
  workload_capacity: z.number().min(0).max(100), // 工作负载容量 0-100%
  current_workload: z.number().min(0).max(100), // 当前工作负载 0-100%
  parallel_efficiency: z.number().min(0).max(2), // 并行效率系数 0-2.0
  created_at: z.date()
});

// 团队扩展策略
export const TeamExpansionStrategySchema = z.object({
  id: z.string(),
  team_id: z.string(),
  trigger_conditions: z.object({
    min_repetitiveness_score: z.number().min(0).max(10), // 最小重复性评分阈值
    min_workload_score: z.number().min(0).max(10), // 最小工作量评分阈值
    max_single_role_workload: z.number().min(0).max(100), // 单角色最大工作负载阈值
    min_parallel_potential: z.number().min(0).max(10) // 最小并行潜力阈值
  }),
  expansion_rules: z.object({
    max_subdivisions_per_role: z.number().min(1).max(10), // 每个角色最大细分数量
    workload_distribution_strategy: z.enum(['even', 'capacity_based', 'skill_based']), // 工作量分配策略
    priority_roles: z.array(z.nativeEnum(RoleType)) // 优先扩展的角色类型
  }),
  efficiency_targets: z.object({
    target_parallel_efficiency: z.number().min(1).max(5), // 目标并行效率
    max_team_size: z.number().min(3).max(50), // 最大团队规模
    min_efficiency_improvement: z.number().min(0).max(5) // 最小效率提升要求
  }),
  created_at: z.date()
});

// 时间段
export const TimeSlotSchema = z.object({
  start_time: z.date(),
  end_time: z.date(),
  workload_intensity: z.number().min(0).max(100) // 工作强度 0-100%
});

// 资源分配
export const ResourceAllocationSchema = z.object({
  id: z.string(),
  role_subdivision_id: z.string(),
  allocated_hours: z.number(), // 分配的工时
  utilization_rate: z.number().min(0).max(100), // 利用率 0-100%
  peak_periods: z.array(TimeSlotSchema), // 高峰时段
  availability_windows: z.array(TimeSlotSchema) // 可用时间窗口
});

// 并行任务组
export const ParallelTaskGroupSchema = z.object({
  id: z.string(),
  group_name: z.string(),
  tasks: z.array(z.string()), // 任务ID列表
  assigned_roles: z.array(z.string()), // 分配的角色细分ID列表
  estimated_duration: z.number(),
  parallel_efficiency: z.number().min(0).max(2), // 该组的并行效率
  resource_conflicts: z.array(z.string()) // 资源冲突列表
});

// 执行阶段
export const ExecutionPhaseSchema = z.object({
  id: z.string(),
  phase_name: z.string(),
  sequence_order: z.number(), // 阶段顺序
  parallel_tasks: z.array(ParallelTaskGroupSchema),
  dependencies: z.array(z.string()), // 依赖的阶段ID
  estimated_duration: z.number(), // 预估持续时间
  critical_path: z.boolean() // 是否在关键路径上
});

// 并行执行计划
export const ParallelExecutionPlanSchema = z.object({
  id: z.string(),
  team_id: z.string(),
  total_estimated_time: z.number(), // 总预估时间（串行）
  parallel_estimated_time: z.number(), // 并行预估时间
  efficiency_improvement: z.number(), // 效率提升百分比
  execution_phases: z.array(ExecutionPhaseSchema),
  resource_allocation: z.array(ResourceAllocationSchema),
  risk_factors: z.array(z.string()),
  created_at: z.date()
});

// 更新任务Schema以支持并行处理
export const EnhancedTaskSchema = TaskSchema.extend({
  assigned_subdivision_ids: z.array(z.string()).optional(), // 分配的角色细分ID
  repetitiveness_score: z.number().min(0).max(10).optional(), // 重复性评分
  workload_score: z.number().min(0).max(10).optional(), // 工作量评分
  subdivision_potential: z.number().min(0).max(10).optional(), // 细分潜力
  parallel_group_id: z.string().optional() // 所属并行组ID
});

// 更新团队Schema以支持团队扩展
export const EnhancedTeamSchema = TeamSchema.extend({
  role_subdivisions: z.array(RoleSubdivisionSchema).default([]), // 角色细分
  task_analyses: z.array(TaskAnalysisSchema).default([]), // 任务分析
  expansion_strategy: TeamExpansionStrategySchema.optional(), // 扩展策略
  parallel_execution_plan: ParallelExecutionPlanSchema.optional(), // 并行执行计划
  reflections: z.array(ReflectionSchema).default([])
});

// 导出类型
export type Role = z.infer<typeof RoleSchema>;
export type Task = z.infer<typeof EnhancedTaskSchema>;
export type Problem = z.infer<typeof ProblemSchema>;
export type Team = z.infer<typeof EnhancedTeamSchema>;
export type Solution = z.infer<typeof SolutionSchema>;
export type Reflection = z.infer<typeof ReflectionSchema>;
export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>;
export type RoleSubdivision = z.infer<typeof RoleSubdivisionSchema>;
export type TeamExpansionStrategy = z.infer<typeof TeamExpansionStrategySchema>;
export type ParallelExecutionPlan = z.infer<typeof ParallelExecutionPlanSchema>;
export type ExecutionPhase = z.infer<typeof ExecutionPhaseSchema>;
export type ParallelTaskGroup = z.infer<typeof ParallelTaskGroupSchema>;
export type ResourceAllocation = z.infer<typeof ResourceAllocationSchema>;
export type TimeSlot = z.infer<typeof TimeSlotSchema>; 