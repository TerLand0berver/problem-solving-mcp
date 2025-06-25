import { v4 as uuidv4 } from 'uuid';
import {
  Team,
  Task,
  TaskAnalysis,
  RoleSubdivision,
  TeamExpansionStrategy,
  ParallelExecutionPlan,
  ExecutionPhase,
  ParallelTaskGroup,
  ResourceAllocation,
  RoleType,
  TaskStatus,
  Priority
} from '../types.js';

/**
 * 并行优化器 - 负责分析任务重复性、扩展团队、优化并行执行
 */
export class ParallelOptimizer {
  
  /**
   * 分析任务的重复性和工作量
   */
  analyzeTaskWorkload(task: Task): TaskAnalysis {
    const analysis: TaskAnalysis = {
      id: uuidv4(),
      task_id: task.id,
      repetitiveness_score: this.calculateRepetitiveness(task),
      workload_score: this.calculateWorkload(task),
      complexity_score: this.calculateComplexity(task),
      parallelizable: this.isParallelizable(task),
      subdivision_potential: this.calculateSubdivisionPotential(task),
      estimated_hours: task.estimated_hours || 8,
      skill_requirements: this.extractSkillRequirements(task),
      created_at: new Date()
    };

    return analysis;
  }

  /**
   * 批量分析团队中的所有任务
   */
  analyzeAllTasks(team: Team): TaskAnalysis[] {
    return team.tasks.map(task => this.analyzeTaskWorkload(task));
  }

  /**
   * 检查是否需要扩展团队
   */
  shouldExpandTeam(team: Team, taskAnalyses: TaskAnalysis[]): boolean {
    const strategy = team.expansion_strategy;
    if (!strategy) return false;

    const highRepetitiveTasks = taskAnalyses.filter(
      analysis => analysis.repetitiveness_score >= strategy.trigger_conditions.min_repetitiveness_score
    );

    const highWorkloadTasks = taskAnalyses.filter(
      analysis => analysis.workload_score >= strategy.trigger_conditions.min_workload_score
    );

    const highParallelPotentialTasks = taskAnalyses.filter(
      analysis => analysis.subdivision_potential >= strategy.trigger_conditions.min_parallel_potential
    );

    // 检查单角色工作负载
    const roleWorkloads = this.calculateRoleWorkloads(team);
    const overloadedRoles = Object.values(roleWorkloads).filter(
      workload => workload > strategy.trigger_conditions.max_single_role_workload
    );

    return (
      highRepetitiveTasks.length > 0 ||
      highWorkloadTasks.length > 0 ||
      highParallelPotentialTasks.length > 0 ||
      overloadedRoles.length > 0
    );
  }

  /**
   * 创建团队扩展策略
   */
  createExpansionStrategy(team: Team): TeamExpansionStrategy {
    return {
      id: uuidv4(),
      team_id: team.id,
      trigger_conditions: {
        min_repetitiveness_score: 6, // 重复性评分 >= 6 触发扩展
        min_workload_score: 7, // 工作量评分 >= 7 触发扩展
        max_single_role_workload: 80, // 单角色工作负载 > 80% 触发扩展
        min_parallel_potential: 5 // 并行潜力 >= 5 触发扩展
      },
      expansion_rules: {
        max_subdivisions_per_role: 5, // 每个角色最多细分5个
        workload_distribution_strategy: 'capacity_based', // 基于能力分配工作量
        priority_roles: [
          RoleType.DEVELOPER, // 开发工程师优先扩展
          RoleType.TESTER, // 测试工程师优先扩展
          RoleType.DESIGNER, // 设计师优先扩展
          RoleType.ANALYST // 分析师优先扩展
        ]
      },
      efficiency_targets: {
        target_parallel_efficiency: 2.5, // 目标并行效率 2.5倍
        max_team_size: 30, // 最大团队规模 30人
        min_efficiency_improvement: 1.5 // 最小效率提升 1.5倍
      },
      created_at: new Date()
    };
  }

  /**
   * 执行团队扩展
   */
  expandTeam(team: Team, taskAnalyses: TaskAnalysis[]): RoleSubdivision[] {
    const strategy = team.expansion_strategy;
    if (!strategy) return [];

    const subdivisions: RoleSubdivision[] = [];
    
    // 分析需要扩展的角色
    const expansionNeeds = this.analyzeExpansionNeeds(team, taskAnalyses, strategy);
    
    for (const need of expansionNeeds) {
      const roleSubdivisions = this.createRoleSubdivisions(need, strategy);
      subdivisions.push(...roleSubdivisions);
    }

    return subdivisions;
  }

  /**
   * 创建并行执行计划
   */
  createParallelExecutionPlan(team: Team): ParallelExecutionPlan {
    const totalEstimatedTime = this.calculateTotalTime(team.tasks);
    const executionPhases = this.createExecutionPhases(team);
    const parallelEstimatedTime = this.calculateParallelTime(executionPhases);
    const efficiencyImprovement = totalEstimatedTime / parallelEstimatedTime;
    
    return {
      id: uuidv4(),
      team_id: team.id,
      total_estimated_time: totalEstimatedTime,
      parallel_estimated_time: parallelEstimatedTime,
      efficiency_improvement: efficiencyImprovement,
      execution_phases: executionPhases,
      resource_allocation: this.createResourceAllocation(team),
      risk_factors: this.identifyRiskFactors(team),
      created_at: new Date()
    };
  }

  // ==================== 私有方法 ====================

  private calculateRepetitiveness(task: Task): number {
    let score = 0;
    
    // 基于任务描述分析重复性
    const description = task.description.toLowerCase();
    const repetitiveKeywords = [
      '重复', '批量', '多个', '每个', '所有', '统一', '标准化', 
      '模板', '复制', '相同', '类似', '重复性', '批处理'
    ];
    
    repetitiveKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 1;
    });
    
    // 基于任务标题分析
    const title = task.title.toLowerCase();
    if (title.includes('批量') || title.includes('多个')) score += 2;
    if (title.includes('重复') || title.includes('统一')) score += 2;
    
    // 基于预估工时
    const hours = task.estimated_hours || 8;
    if (hours > 40) score += 2; // 超过40小时的大任务
    if (hours > 80) score += 2; // 超过80小时的超大任务
    
    return Math.min(score, 10);
  }

  private calculateWorkload(task: Task): number {
    const hours = task.estimated_hours || 8;
    let score = 0;
    
    // 基于工时评分
    if (hours <= 8) score = 2;
    else if (hours <= 16) score = 4;
    else if (hours <= 32) score = 6;
    else if (hours <= 64) score = 8;
    else score = 10;
    
    // 基于优先级调整
    switch (task.priority) {
      case Priority.URGENT_IMPORTANT:
        score += 1;
        break;
      case Priority.NOT_URGENT_IMPORTANT:
        score += 0.5;
        break;
    }
    
    // 基于依赖关系调整
    if (task.dependencies && task.dependencies.length > 3) {
      score += 1; // 复杂依赖增加工作量
    }
    
    return Math.min(score, 10);
  }

  private calculateComplexity(task: Task): number {
    let score = 0;
    
    const description = task.description.toLowerCase();
    const complexKeywords = [
      '算法', '架构', '设计', '优化', '集成', '复杂', '高级',
      '创新', '研发', '分析', '建模', '框架', '系统'
    ];
    
    complexKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 0.5;
    });
    
    // 基于依赖关系
    const dependencyCount = task.dependencies?.length || 0;
    score += Math.min(dependencyCount * 0.5, 3);
    
    // 基于角色数量
    const roleCount = task.assigned_roles?.length || 1;
    if (roleCount > 2) score += 1;
    if (roleCount > 4) score += 1;
    
    return Math.min(score, 10);
  }

  private isParallelizable(task: Task): boolean {
    const description = task.description.toLowerCase();
    
    // 不可并行的关键词
    const sequentialKeywords = [
      '顺序', '依次', '先后', '串行', '单一', '唯一',
      '集中', '统一处理', '整体'
    ];
    
    for (const keyword of sequentialKeywords) {
      if (description.includes(keyword)) return false;
    }
    
    // 可并行的关键词
    const parallelKeywords = [
      '并行', '同时', '分别', '独立', '模块', '组件',
      '批量', '多个', '分组', '并发'
    ];
    
    for (const keyword of parallelKeywords) {
      if (description.includes(keyword)) return true;
    }
    
    // 基于工时判断
    const hours = task.estimated_hours || 8;
    return hours > 16; // 超过16小时的任务通常可以细分
  }

  private calculateSubdivisionPotential(task: Task): number {
    let score = 0;
    
    // 基于工时
    const hours = task.estimated_hours || 8;
    if (hours > 16) score += 2;
    if (hours > 40) score += 3;
    if (hours > 80) score += 3;
    
    // 基于描述中的可分解性
    const description = task.description.toLowerCase();
    const subdivisibleKeywords = [
      '模块', '组件', '部分', '阶段', '步骤', '层次',
      '分类', '分组', '多个', '各种', '不同'
    ];
    
    subdivisibleKeywords.forEach(keyword => {
      if (description.includes(keyword)) score += 0.5;
    });
    
    // 基于可并行性
    if (this.isParallelizable(task)) score += 2;
    
    return Math.min(score, 10);
  }

  private extractSkillRequirements(task: Task): string[] {
    const description = task.description.toLowerCase();
    const title = task.title.toLowerCase();
    const text = `${title} ${description}`;
    
    const skillKeywords = {
      '前端开发': ['前端', 'html', 'css', 'javascript', 'react', 'vue', 'angular'],
      '后端开发': ['后端', 'api', '数据库', 'sql', 'java', 'python', 'node'],
      '测试': ['测试', 'test', '质量', '验证', '检查'],
      '设计': ['设计', 'ui', 'ux', '界面', '用户体验', '原型'],
      '分析': ['分析', '需求', '业务', '流程', '建模'],
      '项目管理': ['管理', '协调', '计划', '进度', '资源']
    };
    
    const requirements: string[] = [];
    
    for (const [skill, keywords] of Object.entries(skillKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        requirements.push(skill);
      }
    }
    
    return requirements.length > 0 ? requirements : ['通用技能'];
  }

  private calculateRoleWorkloads(team: Team): Record<string, number> {
    const roleWorkloads: Record<string, number> = {};
    
    // 初始化角色工作负载
    team.roles.forEach(role => {
      roleWorkloads[role.id] = 0;
    });
    
    // 计算任务分配的工作负载
    team.tasks.forEach(task => {
      const taskHours = task.estimated_hours || 8;
      const assignedRoles = task.assigned_roles || [];
      const hoursPerRole = taskHours / Math.max(assignedRoles.length, 1);
      
      assignedRoles.forEach(roleId => {
        if (roleWorkloads[roleId] !== undefined) {
          roleWorkloads[roleId] += hoursPerRole;
        }
      });
    });
    
    // 转换为百分比（假设每个角色每周工作40小时）
    const weeklyHours = 40;
    for (const roleId in roleWorkloads) {
      roleWorkloads[roleId] = (roleWorkloads[roleId] / weeklyHours) * 100;
    }
    
    return roleWorkloads;
  }

  private analyzeExpansionNeeds(
    team: Team, 
    taskAnalyses: TaskAnalysis[], 
    strategy: TeamExpansionStrategy
  ): Array<{
    roleType: RoleType,
    reason: string,
    suggestedSubdivisions: number,
    workloadDistribution: number[]
  }> {
    const needs: Array<{
      roleType: RoleType,
      reason: string,
      suggestedSubdivisions: number,
      workloadDistribution: number[]
    }> = [];
    
    const roleWorkloads = this.calculateRoleWorkloads(team);
    
    // 分析每个角色的扩展需求
    team.roles.forEach(role => {
      const workload = roleWorkloads[role.id] || 0;
      const relevantTasks = this.getRelevantTasks(team.tasks, role.type);
      const relevantAnalyses = taskAnalyses.filter(analysis => 
        relevantTasks.some(task => task.id === analysis.task_id)
      );
      
      let shouldExpand = false;
      let reason = '';
      let suggestedSubdivisions = 1;
      
      // 检查工作负载过载
      if (workload > strategy.trigger_conditions.max_single_role_workload) {
        shouldExpand = true;
        reason += `工作负载过载(${workload.toFixed(1)}%)；`;
        suggestedSubdivisions = Math.ceil(workload / 80); // 目标80%利用率
      }
      
      // 检查高重复性任务
      const highRepetitiveTasks = relevantAnalyses.filter(
        analysis => analysis.repetitiveness_score >= strategy.trigger_conditions.min_repetitiveness_score
      );
      if (highRepetitiveTasks.length > 0) {
        shouldExpand = true;
        reason += `发现${highRepetitiveTasks.length}个高重复性任务；`;
        suggestedSubdivisions = Math.max(suggestedSubdivisions, Math.min(highRepetitiveTasks.length, 3));
      }
      
      // 检查高工作量任务
      const highWorkloadTasks = relevantAnalyses.filter(
        analysis => analysis.workload_score >= strategy.trigger_conditions.min_workload_score
      );
      if (highWorkloadTasks.length > 1) {
        shouldExpand = true;
        reason += `发现${highWorkloadTasks.length}个高工作量任务；`;
        suggestedSubdivisions = Math.max(suggestedSubdivisions, Math.min(highWorkloadTasks.length, 4));
      }
      
      if (shouldExpand && strategy.expansion_rules.priority_roles.includes(role.type)) {
        // 计算工作量分配
        const distribution = this.calculateWorkloadDistribution(
          suggestedSubdivisions,
          strategy.expansion_rules.workload_distribution_strategy
        );
        
        needs.push({
          roleType: role.type,
          reason: reason.trim(),
          suggestedSubdivisions: Math.min(suggestedSubdivisions, strategy.expansion_rules.max_subdivisions_per_role),
          workloadDistribution: distribution
        });
      }
    });
    
    return needs;
  }

  private createRoleSubdivisions(
    need: {
      roleType: RoleType,
      reason: string,
      suggestedSubdivisions: number,
      workloadDistribution: number[]
    },
    strategy: TeamExpansionStrategy
  ): RoleSubdivision[] {
    const subdivisions: RoleSubdivision[] = [];
    
    for (let i = 0; i < need.suggestedSubdivisions; i++) {
      const subdivision: RoleSubdivision = {
        id: uuidv4(),
        parent_role_type: need.roleType,
        subdivision_name: this.generateSubdivisionName(need.roleType, i + 1),
        specialization: this.generateSpecialization(need.roleType, i + 1),
        assigned_tasks: [],
        workload_capacity: 100,
        current_workload: 0,
        parallel_efficiency: this.calculateParallelEfficiency(need.roleType),
        created_at: new Date()
      };
      
      subdivisions.push(subdivision);
    }
    
    return subdivisions;
  }

  private generateSubdivisionName(roleType: RoleType, index: number): string {
    const roleNames = {
      [RoleType.DEVELOPER]: '开发工程师',
      [RoleType.TESTER]: '测试工程师',
      [RoleType.DESIGNER]: '设计师',
      [RoleType.ANALYST]: '系统分析师',
      [RoleType.RESEARCHER]: '研究员',
      [RoleType.PROJECT_MANAGER]: '项目经理',
      [RoleType.DOMAIN_EXPERT]: '领域专家',
      [RoleType.STRATEGIST]: '战略规划师',
      [RoleType.COMMUNICATOR]: '沟通协调员',
      [RoleType.QUALITY_ASSURER]: '质量保证专员',
      [RoleType.RISK_MANAGER]: '风险管理专员',
      [RoleType.INNOVATOR]: '创新专员'
    };
    
    const baseName = roleNames[roleType] || '专业人员';
    return `${baseName}${String.fromCharCode(64 + index)}`; // A, B, C...
  }

  private generateSpecialization(roleType: RoleType, index: number): string {
    const specializations: Record<RoleType, string[]> = {
      [RoleType.DEVELOPER]: [
        '前端界面开发', '后端API开发', '数据库设计', '系统集成', '性能优化'
      ],
      [RoleType.TESTER]: [
        '功能测试', '性能测试', '自动化测试', '集成测试', '用户验收测试'
      ],
      [RoleType.DESIGNER]: [
        '用户界面设计', '用户体验设计', '交互设计', '视觉设计', '原型设计'
      ],
      [RoleType.ANALYST]: [
        '需求分析', '业务流程分析', '系统架构分析', '数据分析', '风险分析'
      ],
      [RoleType.RESEARCHER]: [
        '市场调研', '技术调研', '竞品分析', '用户研究', '可行性研究'
      ],
      [RoleType.PROJECT_MANAGER]: [
        '项目规划', '进度管理', '资源协调', '风险管控', '团队管理'
      ],
      [RoleType.DOMAIN_EXPERT]: [
        '业务咨询', '技术指导', '标准制定', '最佳实践', '知识传递'
      ],
      [RoleType.STRATEGIST]: [
        '战略规划', '目标制定', '路线图设计', '决策支持', '趋势分析'
      ],
      [RoleType.COMMUNICATOR]: [
        '内部沟通', '外部协调', '会议组织', '信息传递', '关系维护'
      ],
      [RoleType.QUALITY_ASSURER]: [
        '质量标准', '流程审核', '质量检查', '改进建议', '合规验证'
      ],
      [RoleType.RISK_MANAGER]: [
        '风险识别', '风险评估', '应对策略', '监控预警', '应急处理'
      ],
      [RoleType.INNOVATOR]: [
        '创新设计', '技术探索', '概念验证', '原型开发', '创意实现'
      ]
    };
    
    const roleSpecializations = specializations[roleType] || ['专业技能'];
    return roleSpecializations[(index - 1) % roleSpecializations.length];
  }

  private calculateParallelEfficiency(roleType: RoleType): number {
    // 不同角色类型的并行效率系数
    const efficiencyMap = {
      [RoleType.DEVELOPER]: 1.8, // 开发任务并行效率高
      [RoleType.TESTER]: 1.6, // 测试任务并行效率中等
      [RoleType.DESIGNER]: 1.4, // 设计任务并行效率中等
      [RoleType.ANALYST]: 1.2, // 分析任务并行效率较低
      [RoleType.RESEARCHER]: 1.3,
      [RoleType.PROJECT_MANAGER]: 1.1, // 管理任务并行效率最低
      [RoleType.DOMAIN_EXPERT]: 1.2,
      [RoleType.STRATEGIST]: 1.1,
      [RoleType.COMMUNICATOR]: 1.3,
      [RoleType.QUALITY_ASSURER]: 1.5,
      [RoleType.RISK_MANAGER]: 1.2,
      [RoleType.INNOVATOR]: 1.4
    };
    
    return efficiencyMap[roleType] || 1.2;
  }

  private calculateWorkloadDistribution(
    subdivisions: number,
    strategy: 'even' | 'capacity_based' | 'skill_based'
  ): number[] {
    switch (strategy) {
      case 'even':
        return new Array(subdivisions).fill(100 / subdivisions);
      
      case 'capacity_based':
        // 能力递减分配：第一个人承担更多工作
        const capacityWeights = [];
        for (let i = 0; i < subdivisions; i++) {
          capacityWeights.push(1 - (i * 0.1)); // 每个后续人员减少10%能力
        }
        const totalWeight = capacityWeights.reduce((sum, weight) => sum + weight, 0);
        return capacityWeights.map(weight => (weight / totalWeight) * 100);
      
      case 'skill_based':
        // 技能导向分配：根据专业化程度分配
        const skillWeights = [];
        for (let i = 0; i < subdivisions; i++) {
          skillWeights.push(0.8 + (i * 0.1)); // 专业化程度递增
        }
        const totalSkillWeight = skillWeights.reduce((sum, weight) => sum + weight, 0);
        return skillWeights.map(weight => (weight / totalSkillWeight) * 100);
      
      default:
        return new Array(subdivisions).fill(100 / subdivisions);
    }
  }

  private createExecutionPhases(team: Team): ExecutionPhase[] {
    const phases: ExecutionPhase[] = [];
    
    // 按优先级和依赖关系对任务分组
    const taskGroups = this.groupTasksByPhase(team.tasks);
    
    taskGroups.forEach((tasks, index) => {
      const parallelGroups = this.createParallelTaskGroups(tasks, team);
      
      const phase: ExecutionPhase = {
        id: uuidv4(),
        phase_name: `执行阶段 ${index + 1}`,
        sequence_order: index + 1,
        parallel_tasks: parallelGroups,
        dependencies: index > 0 ? [phases[index - 1].id] : [],
        estimated_duration: Math.max(...parallelGroups.map(group => group.estimated_duration)),
        critical_path: this.isCriticalPath(tasks)
      };
      
      phases.push(phase);
    });
    
    return phases;
  }

  private groupTasksByPhase(tasks: Task[]): Task[][] {
    // 简化实现：按优先级分组
    const phases: Task[][] = [];
    
    // 第一阶段：紧急且重要的任务
    const urgentImportant = tasks.filter(task => task.priority === Priority.URGENT_IMPORTANT);
    if (urgentImportant.length > 0) phases.push(urgentImportant);
    
    // 第二阶段：重要但不紧急的任务
    const importantNotUrgent = tasks.filter(task => task.priority === Priority.NOT_URGENT_IMPORTANT);
    if (importantNotUrgent.length > 0) phases.push(importantNotUrgent);
    
    // 第三阶段：其他任务
    const otherTasks = tasks.filter(task => 
      task.priority !== Priority.URGENT_IMPORTANT && 
      task.priority !== Priority.NOT_URGENT_IMPORTANT
    );
    if (otherTasks.length > 0) phases.push(otherTasks);
    
    return phases.length > 0 ? phases : [tasks]; // 至少返回一个阶段
  }

  private createParallelTaskGroups(tasks: Task[], team: Team): ParallelTaskGroup[] {
    const groups: ParallelTaskGroup[] = [];
    const processedTasks = new Set<string>();
    
    tasks.forEach(task => {
      if (processedTasks.has(task.id)) return;
      
      // 找到可以与当前任务并行执行的任务
      const parallelTasks = [task];
      const assignedRoles = new Set(task.assigned_roles || []);
      
      tasks.forEach(otherTask => {
        if (otherTask.id === task.id || processedTasks.has(otherTask.id)) return;
        
        // 检查是否有角色冲突
        const otherRoles = new Set(otherTask.assigned_roles || []);
        const hasRoleConflict = [...assignedRoles].some(role => otherRoles.has(role));
        
        // 检查是否有依赖关系
        const hasDependency = task.dependencies?.includes(otherTask.id) || 
                             otherTask.dependencies?.includes(task.id);
        
        if (!hasRoleConflict && !hasDependency) {
          parallelTasks.push(otherTask);
          otherTask.assigned_roles?.forEach(role => assignedRoles.add(role));
        }
      });
      
      // 标记已处理的任务
      parallelTasks.forEach(t => processedTasks.add(t.id));
      
      const group: ParallelTaskGroup = {
        id: uuidv4(),
        group_name: `并行组 ${groups.length + 1}`,
        tasks: parallelTasks.map(t => t.id),
        assigned_roles: [...assignedRoles],
        estimated_duration: Math.max(...parallelTasks.map(t => t.estimated_hours || 8)),
        parallel_efficiency: this.calculateGroupParallelEfficiency(parallelTasks, team),
        resource_conflicts: this.identifyResourceConflicts(parallelTasks, team)
      };
      
      groups.push(group);
    });
    
    return groups;
  }

  private calculateGroupParallelEfficiency(tasks: Task[], team: Team): number {
    if (tasks.length <= 1) return 1.0;
    
    // 基于任务数量和角色效率计算
    let totalEfficiency = 0;
    const uniqueRoles = new Set<string>();
    
    tasks.forEach(task => {
      task.assigned_roles?.forEach(roleId => uniqueRoles.add(roleId));
    });
    
    uniqueRoles.forEach(roleId => {
      const role = team.roles.find(r => r.id === roleId);
      if (role) {
        totalEfficiency += this.calculateParallelEfficiency(role.type);
      }
    });
    
    return totalEfficiency / Math.max(uniqueRoles.size, 1);
  }

  private identifyResourceConflicts(tasks: Task[], team: Team): string[] {
    const conflicts: string[] = [];
    const roleUsage: Record<string, number> = {};
    
    // 统计角色使用情况
    tasks.forEach(task => {
      task.assigned_roles?.forEach(roleId => {
        roleUsage[roleId] = (roleUsage[roleId] || 0) + 1;
      });
    });
    
    // 识别冲突
    for (const [roleId, usage] of Object.entries(roleUsage)) {
      if (usage > 1) {
        const role = team.roles.find(r => r.id === roleId);
        conflicts.push(`角色 ${role?.name || roleId} 被分配给 ${usage} 个并行任务`);
      }
    }
    
    return conflicts;
  }

  private calculateTotalTime(tasks: Task[]): number {
    return tasks.reduce((total, task) => total + (task.estimated_hours || 8), 0);
  }

  private calculateParallelTime(phases: ExecutionPhase[]): number {
    return phases.reduce((total, phase) => total + phase.estimated_duration, 0);
  }

  private createResourceAllocation(team: Team): ResourceAllocation[] {
    const allocations: ResourceAllocation[] = [];
    
    team.role_subdivisions.forEach(subdivision => {
      const allocation: ResourceAllocation = {
        id: uuidv4(),
        role_subdivision_id: subdivision.id,
        allocated_hours: 40, // 每周40小时
        utilization_rate: subdivision.current_workload,
        peak_periods: [],
        availability_windows: []
      };
      
      allocations.push(allocation);
    });
    
    return allocations;
  }

  private identifyRiskFactors(team: Team): string[] {
    const risks: string[] = [];
    
    // 检查团队规模风险
    const totalSize = team.roles.length + team.role_subdivisions.length;
    if (totalSize > 20) {
      risks.push('团队规模过大，可能导致沟通复杂度增加');
    }
    
    // 检查角色细分风险
    const subdivisionCount = team.role_subdivisions.length;
    if (subdivisionCount > team.roles.length * 2) {
      risks.push('角色细分过多，可能导致协调成本增加');
    }
    
    // 检查并行复杂度风险
    const parallelTaskCount = team.tasks.filter(task => 
      (task as any).assigned_subdivision_ids && (task as any).assigned_subdivision_ids.length > 0
    ).length;
    if (parallelTaskCount > team.tasks.length * 0.7) {
      risks.push('并行任务比例过高，可能增加集成风险');
    }
    
    return risks;
  }

  private isCriticalPath(tasks: Task[]): boolean {
    // 简化实现：如果包含高优先级任务，则认为是关键路径
    return tasks.some(task => task.priority === Priority.URGENT_IMPORTANT);
  }

  private getRelevantTasks(tasks: Task[], roleType: RoleType): Task[] {
    // 根据角色类型过滤相关任务
    return tasks.filter(task => {
      const description = task.description.toLowerCase();
      const title = task.title.toLowerCase();
      
      switch (roleType) {
        case RoleType.DEVELOPER:
          return description.includes('开发') || description.includes('编程') || 
                 description.includes('代码') || title.includes('开发');
        case RoleType.TESTER:
          return description.includes('测试') || description.includes('验证') || 
                 description.includes('质量') || title.includes('测试');
        case RoleType.DESIGNER:
          return description.includes('设计') || description.includes('界面') || 
                 description.includes('用户体验') || title.includes('设计');
        case RoleType.ANALYST:
          return description.includes('分析') || description.includes('需求') || 
                 description.includes('建模') || title.includes('分析');
        default:
          return true; // 其他角色处理所有任务
      }
    });
  }

  /**
   * 优化任务分配
   */
  optimizeTaskAllocation(team: Team): { 
    optimizedTasks: Task[], 
    allocationReport: string 
  } {
    const optimizedTasks = [...team.tasks];
    const roleCapacities = this.calculateRoleCapacities(team);
    
    // 重新分配过载的任务
    for (const task of optimizedTasks) {
      if (task.assigned_roles) {
        const newAssignment = this.rebalanceTaskAssignment(task, roleCapacities, team);
        task.assigned_roles = newAssignment.roleIds;
        (task as any).assigned_subdivision_ids = newAssignment.subdivisionIds;
      }
    }

    const report = this.generateAllocationReport(team, optimizedTasks, roleCapacities);
    
    return { optimizedTasks, allocationReport: report };
  }

  private calculateRoleCapacities(team: Team): Record<string, number> {
    const capacities: Record<string, number> = {};
    
    // 原始角色容量
    team.roles.forEach(role => {
      capacities[role.id] = 40; // 每周40小时基础容量
    });
    
    // 细分角色容量
    team.role_subdivisions.forEach(subdivision => {
      capacities[subdivision.id] = subdivision.workload_capacity * 0.4; // 转换为小时
    });
    
    return capacities;
  }

  private rebalanceTaskAssignment(
    task: Task, 
    roleCapacities: Record<string, number>, 
    team: Team
  ): { roleIds: string[], subdivisionIds: string[] } {
    const result = {
      roleIds: [...(task.assigned_roles || [])],
      subdivisionIds: [...((task as any).assigned_subdivision_ids || [])]
    };
    
    // 如果任务工作量大，尝试分配给细分角色
    const taskHours = task.estimated_hours || 8;
    if (taskHours > 16) {
      const availableSubdivisions = team.role_subdivisions.filter(sub => 
        sub.current_workload < 80 && // 工作负载小于80%
        task.assigned_roles?.some(roleId => {
          const role = team.roles.find(r => r.id === roleId);
          return role && sub.parent_role_type === role.type;
        })
      );
      
      if (availableSubdivisions.length > 0) {
        result.subdivisionIds = availableSubdivisions.slice(0, 2).map(sub => sub.id);
      }
    }
    
    return result;
  }

  private generateAllocationReport(
    team: Team, 
    optimizedTasks: Task[], 
    roleCapacities: Record<string, number>
  ): string {
    let report = '📊 **任务分配优化报告**\n\n';
    
    // 统计信息
    const totalTasks = optimizedTasks.length;
    const parallelTasks = optimizedTasks.filter(task => 
      (task as any).assigned_subdivision_ids && (task as any).assigned_subdivision_ids.length > 0
    ).length;
    
    report += `📋 **任务统计**:\n`;
    report += `- 总任务数: ${totalTasks}\n`;
    report += `- 并行处理任务: ${parallelTasks}\n`;
    report += `- 并行化率: ${((parallelTasks / totalTasks) * 100).toFixed(1)}%\n\n`;
    
    // 角色利用率
    report += `👥 **角色利用率**:\n`;
    const roleWorkloads = this.calculateRoleWorkloads(team);
    Object.entries(roleWorkloads).forEach(([roleId, workload]) => {
      const role = team.roles.find(r => r.id === roleId);
      if (role) {
        const status = workload > 90 ? '🔴 过载' : workload > 70 ? '🟡 繁忙' : '🟢 正常';
        report += `- ${role.name}: ${workload.toFixed(1)}% ${status}\n`;
      }
    });
    
    // 细分角色统计
    if (team.role_subdivisions.length > 0) {
      report += `\n🎭 **角色细分统计**:\n`;
      report += `- 细分角色数量: ${team.role_subdivisions.length}\n`;
      team.role_subdivisions.forEach(subdivision => {
        report += `- ${subdivision.subdivision_name}: ${subdivision.specialization} (负载: ${subdivision.current_workload}%)\n`;
      });
    }
    
    return report;
  }
} 