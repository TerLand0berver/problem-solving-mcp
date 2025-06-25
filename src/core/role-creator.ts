import { v4 as uuidv4 } from 'uuid';
import { Role, RoleType, Problem } from '../types.js';

/**
 * 角色创建者 - 根据问题复杂程度创建合适的角色团队
 */
export class RoleCreator {
  private roleTemplates: Map<RoleType, Partial<Role>> = new Map();

  constructor() {
    this.initializeRoleTemplates();
  }

  /**
   * 初始化角色模板
   */
  private initializeRoleTemplates(): void {
    this.roleTemplates.set(RoleType.ANALYST, {
      name: '系统分析师',
      type: RoleType.ANALYST,
      description: '负责需求分析、系统设计和架构规划',
      skills: ['需求分析', '系统设计', '流程梳理', '数据建模'],
      responsibilities: ['分析问题本质', '定义需求规格', '设计系统架构', '制定技术方案'],
      expertise_level: 8
    });

    this.roleTemplates.set(RoleType.RESEARCHER, {
      name: '研究员',
      type: RoleType.RESEARCHER,
      description: '负责技术调研、市场分析和可行性研究',
      skills: ['信息收集', '数据分析', '市场调研', '技术评估'],
      responsibilities: ['收集相关信息', '分析市场趋势', '评估技术可行性', '提供决策支持'],
      expertise_level: 7
    });

    this.roleTemplates.set(RoleType.DESIGNER, {
      name: '设计师',
      type: RoleType.DESIGNER,
      description: '负责用户体验设计和界面设计',
      skills: ['UI设计', 'UX设计', '原型制作', '用户研究'],
      responsibilities: ['设计用户界面', '优化用户体验', '制作原型', '进行用户测试'],
      expertise_level: 8
    });

    this.roleTemplates.set(RoleType.DEVELOPER, {
      name: '开发工程师',
      type: RoleType.DEVELOPER,
      description: '负责系统开发和技术实现',
      skills: ['编程开发', '系统集成', '性能优化', '代码审查'],
      responsibilities: ['编写代码', '实现功能', '集成系统', '优化性能'],
      expertise_level: 8
    });

    this.roleTemplates.set(RoleType.TESTER, {
      name: '测试工程师',
      type: RoleType.TESTER,
      description: '负责质量保证和测试验证',
      skills: ['测试设计', '自动化测试', '性能测试', '安全测试'],
      responsibilities: ['设计测试用例', '执行测试', '缺陷跟踪', '质量评估'],
      expertise_level: 7
    });

    this.roleTemplates.set(RoleType.PROJECT_MANAGER, {
      name: '项目经理',
      type: RoleType.PROJECT_MANAGER,
      description: '负责项目管理和进度控制',
      skills: ['项目管理', '进度控制', '资源协调', '风险管理'],
      responsibilities: ['制定项目计划', '监控项目进度', '协调资源', '管理风险'],
      expertise_level: 9
    });

    this.roleTemplates.set(RoleType.DOMAIN_EXPERT, {
      name: '领域专家',
      type: RoleType.DOMAIN_EXPERT,
      description: '提供专业领域知识和指导',
      skills: ['专业知识', '行业经验', '标准规范', '最佳实践'],
      responsibilities: ['提供专业指导', '审核技术方案', '分享最佳实践', '解答专业问题'],
      expertise_level: 10
    });

    this.roleTemplates.set(RoleType.STRATEGIST, {
      name: '战略规划师',
      type: RoleType.STRATEGIST,
      description: '负责战略规划和决策支持',
      skills: ['战略规划', '决策分析', '竞争分析', '商业模式'],
      responsibilities: ['制定战略规划', '分析竞争环境', '支持决策制定', '评估商业价值'],
      expertise_level: 9
    });

    this.roleTemplates.set(RoleType.COMMUNICATOR, {
      name: '沟通协调员',
      type: RoleType.COMMUNICATOR,
      description: '负责团队沟通和协调工作',
      skills: ['沟通协调', '会议组织', '文档管理', '关系维护'],
      responsibilities: ['组织团队会议', '协调各方沟通', '管理项目文档', '维护干系人关系'],
      expertise_level: 7
    });

    this.roleTemplates.set(RoleType.QUALITY_ASSURER, {
      name: '质量保证专员',
      type: RoleType.QUALITY_ASSURER,
      description: '负责质量标准制定和质量控制',
      skills: ['质量管理', '标准制定', '流程优化', '审核评估'],
      responsibilities: ['制定质量标准', '监控质量指标', '优化工作流程', '进行质量审核'],
      expertise_level: 8
    });

    this.roleTemplates.set(RoleType.RISK_MANAGER, {
      name: '风险管理专员',
      type: RoleType.RISK_MANAGER,
      description: '负责风险识别和风险控制',
      skills: ['风险识别', '风险评估', '应急预案', '风险监控'],
      responsibilities: ['识别潜在风险', '评估风险影响', '制定应对策略', '监控风险状态'],
      expertise_level: 8
    });

    this.roleTemplates.set(RoleType.INNOVATOR, {
      name: '创新专员',
      type: RoleType.INNOVATOR,
      description: '负责创新思维和创新方案',
      skills: ['创新思维', '技术前瞻', '解决方案', '创意设计'],
      responsibilities: ['提出创新想法', '探索新技术', '设计创新方案', '推动创新实践'],
      expertise_level: 9
    });
  }

  /**
   * 根据问题创建合适的角色团队
   */
  public createTeamRoles(problem: Problem): Role[] {
    const complexity = problem.complexity_score;
    const domain = problem.domain.toLowerCase();
    
    // 根据复杂度确定团队规模
    const teamSize = this.calculateTeamSize(complexity);
    
    // 选择核心角色
    const coreRoles = this.selectCoreRoles(complexity, domain);
    
    // 选择支持角色
    const supportRoles = this.selectSupportRoles(complexity, domain, teamSize - coreRoles.length);
    
    // 合并并创建角色实例
    const selectedRoleTypes = [...coreRoles, ...supportRoles];
    return this.instantiateRoles(selectedRoleTypes, problem);
  }

  /**
   * 计算团队规模
   */
  private calculateTeamSize(complexity: number): number {
    if (complexity <= 3) return 3; // 简单问题：3人团队
    if (complexity <= 6) return Math.min(5 + Math.floor(complexity / 2), 8); // 中等复杂度：5-8人
    return Math.min(8 + Math.floor((complexity - 6) / 2), 12); // 高复杂度：8-12人
  }

  /**
   * 选择核心角色
   */
  private selectCoreRoles(complexity: number, domain: string): RoleType[] {
    const coreRoles: RoleType[] = [
      RoleType.ANALYST,      // 分析师是必需的
      RoleType.PROJECT_MANAGER // 项目经理是必需的
    ];

    // 根据领域添加必要角色
    if (domain.includes('技术') || domain.includes('开发') || domain.includes('软件')) {
      coreRoles.push(RoleType.DEVELOPER, RoleType.TESTER);
    }

    if (domain.includes('设计') || domain.includes('用户') || domain.includes('界面')) {
      coreRoles.push(RoleType.DESIGNER);
    }

    if (domain.includes('研究') || domain.includes('调研') || domain.includes('分析')) {
      coreRoles.push(RoleType.RESEARCHER);
    }

    // 高复杂度问题需要领域专家
    if (complexity >= 7) {
      coreRoles.push(RoleType.DOMAIN_EXPERT);
    }

    return coreRoles;
  }

  /**
   * 选择支持角色
   */
  private selectSupportRoles(complexity: number, domain: string, remainingSlots: number): RoleType[] {
    const supportRoles: RoleType[] = [];
    const availableRoles = [
      RoleType.STRATEGIST,
      RoleType.COMMUNICATOR,
      RoleType.QUALITY_ASSURER,
      RoleType.RISK_MANAGER,
      RoleType.INNOVATOR,
      RoleType.RESEARCHER,
      RoleType.DESIGNER,
      RoleType.DEVELOPER,
      RoleType.TESTER
    ];

    // 根据复杂度和领域特点选择支持角色
    const priorities = this.calculateRolePriorities(complexity, domain);
    
    // 按优先级排序并选择
    const sortedRoles = availableRoles.sort((a, b) => (priorities.get(b) || 0) - (priorities.get(a) || 0));
    
    for (let i = 0; i < Math.min(remainingSlots, sortedRoles.length); i++) {
      supportRoles.push(sortedRoles[i]);
    }

    return supportRoles;
  }

  /**
   * 计算角色优先级
   */
  private calculateRolePriorities(complexity: number, domain: string): Map<RoleType, number> {
    const priorities = new Map<RoleType, number>();

    // 基础优先级
    priorities.set(RoleType.COMMUNICATOR, 6);
    priorities.set(RoleType.QUALITY_ASSURER, 5);
    priorities.set(RoleType.RISK_MANAGER, complexity >= 6 ? 8 : 4);
    priorities.set(RoleType.STRATEGIST, complexity >= 7 ? 9 : 5);
    priorities.set(RoleType.INNOVATOR, complexity >= 8 ? 7 : 3);

    // 根据领域调整优先级
    if (domain.includes('创新') || domain.includes('新') || domain.includes('前沿')) {
      priorities.set(RoleType.INNOVATOR, (priorities.get(RoleType.INNOVATOR) || 0) + 3);
      priorities.set(RoleType.RESEARCHER, (priorities.get(RoleType.RESEARCHER) || 0) + 2);
    }

    if (domain.includes('风险') || domain.includes('安全') || domain.includes('合规')) {
      priorities.set(RoleType.RISK_MANAGER, (priorities.get(RoleType.RISK_MANAGER) || 0) + 4);
      priorities.set(RoleType.QUALITY_ASSURER, (priorities.get(RoleType.QUALITY_ASSURER) || 0) + 2);
    }

    if (domain.includes('战略') || domain.includes('规划') || domain.includes('决策')) {
      priorities.set(RoleType.STRATEGIST, (priorities.get(RoleType.STRATEGIST) || 0) + 3);
    }

    return priorities;
  }

  /**
   * 实例化角色
   */
  private instantiateRoles(roleTypes: RoleType[], problem: Problem): Role[] {
    const roles: Role[] = [];
    const usedTypes = new Set<RoleType>();

    for (const roleType of roleTypes) {
      if (usedTypes.has(roleType)) continue; // 避免重复角色
      
      const template = this.roleTemplates.get(roleType);
      if (!template) continue;

      const role: Role = {
        id: uuidv4(),
        name: template.name || `${roleType}专员`,
        type: roleType,
        description: template.description || `负责${roleType}相关工作`,
        skills: template.skills || [],
        responsibilities: template.responsibilities || [],
        expertise_level: template.expertise_level || 7,
        created_at: new Date(),
        is_active: true
      };

      // 根据问题特点调整角色
      this.customizeRoleForProblem(role, problem);
      
      roles.push(role);
      usedTypes.add(roleType);
    }

    return roles;
  }

  /**
   * 根据问题特点定制角色
   */
  private customizeRoleForProblem(role: Role, problem: Problem): void {
    // 根据问题领域调整角色技能和职责
    const domain = problem.domain.toLowerCase();
    const constraints = problem.constraints.join(' ').toLowerCase();

    if (domain.includes('ai') || domain.includes('人工智能') || domain.includes('机器学习')) {
      if (role.type === RoleType.DEVELOPER) {
        role.skills.push('机器学习', 'AI算法', '深度学习');
        role.responsibilities.push('实现AI算法', '优化模型性能');
      }
      if (role.type === RoleType.RESEARCHER) {
        role.skills.push('AI技术调研', '算法研究', '论文分析');
        role.responsibilities.push('调研最新AI技术', '分析算法可行性');
      }
    }

    if (constraints.includes('时间') || constraints.includes('紧急')) {
      // 提高专业水平以应对时间压力
      role.expertise_level = Math.min(10, role.expertise_level + 1);
      role.responsibilities.push('快速响应需求', '优化工作效率');
    }

    if (constraints.includes('预算') || constraints.includes('成本')) {
      if (role.type === RoleType.PROJECT_MANAGER || role.type === RoleType.STRATEGIST) {
        role.skills.push('成本控制', '预算管理');
        role.responsibilities.push('控制项目成本', '优化资源配置');
      }
    }
  }

  /**
   * 获取角色建议
   */
  public getRoleRecommendations(problem: Problem): {
    recommended_roles: RoleType[];
    reasoning: string;
    team_size: number;
  } {
    const complexity = problem.complexity_score;
    const teamSize = this.calculateTeamSize(complexity);
    const coreRoles = this.selectCoreRoles(complexity, problem.domain);
    const supportRoles = this.selectSupportRoles(complexity, problem.domain, teamSize - coreRoles.length);
    const recommendedRoles = [...coreRoles, ...supportRoles];

    const reasoning = this.generateRecommendationReasoning(problem, recommendedRoles, teamSize);

    return {
      recommended_roles: recommendedRoles,
      reasoning,
      team_size: teamSize
    };
  }

  /**
   * 生成推荐理由
   */
  private generateRecommendationReasoning(problem: Problem, roles: RoleType[], teamSize: number): string {
    const complexity = problem.complexity_score;
    const domain = problem.domain;

    let reasoning = `基于问题复杂度 ${complexity}/10 和领域特点 "${domain}"，推荐 ${teamSize} 人团队：\n\n`;

    reasoning += `核心角色：\n`;
    const coreRoles = roles.slice(0, Math.min(4, roles.length));
    coreRoles.forEach(role => {
      const template = this.roleTemplates.get(role);
      reasoning += `- ${template?.name || role}：${template?.description || '负责相关工作'}\n`;
    });

    if (roles.length > 4) {
      reasoning += `\n支持角色：\n`;
      const supportRoles = roles.slice(4);
      supportRoles.forEach(role => {
        const template = this.roleTemplates.get(role);
        reasoning += `- ${template?.name || role}：${template?.description || '负责相关工作'}\n`;
      });
    }

    reasoning += `\n团队配置考虑因素：\n`;
    if (complexity >= 7) {
      reasoning += `- 高复杂度问题需要领域专家和风险管理\n`;
    }
    if (problem.constraints.length > 0) {
      reasoning += `- 约束条件：${problem.constraints.join('、')}\n`;
    }
    reasoning += `- 确保角色互补，支持并行工作\n`;

    return reasoning;
  }
} 