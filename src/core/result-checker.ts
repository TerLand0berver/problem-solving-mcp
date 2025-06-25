import { v4 as uuidv4 } from 'uuid';
import { Solution, Task, Team, Priority, TaskStatus } from '../types.js';

/**
 * 检查结果和质量评估
 */
export interface CheckResult {
  id: string;
  solution_id: string;
  overall_score: number; // 0-100
  completeness_score: number;
  feasibility_score: number;
  quality_score: number;
  risk_score: number;
  timeline_score: number;
  issues: CheckIssue[];
  recommendations: string[];
  approved: boolean;
  checked_at: Date;
  checker_notes: string;
}

export interface CheckIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'completeness' | 'feasibility' | 'quality' | 'risk' | 'timeline' | 'other';
  description: string;
  suggested_fix: string;
  affected_tasks: string[];
}

/**
 * 结果检查者 - 负责检查和验证解决方案的质量
 */
export class ResultChecker {
  private checkHistory: Map<string, CheckResult[]> = new Map();

  /**
   * 检查解决方案
   */
  public async checkSolution(solution: Solution, team: Team): Promise<CheckResult> {
    const checkId = uuidv4();
    const issues: CheckIssue[] = [];
    
    // 执行各项检查
    const completenessScore = this.checkCompleteness(solution, team, issues);
    const feasibilityScore = this.checkFeasibility(solution, team, issues);
    const qualityScore = this.checkQuality(solution, team, issues);
    const riskScore = this.checkRiskAssessment(solution, issues);
    const timelineScore = this.checkTimeline(solution, team, issues);

    // 计算总分
    const overallScore = this.calculateOverallScore({
      completeness: completenessScore,
      feasibility: feasibilityScore,
      quality: qualityScore,
      risk: riskScore,
      timeline: timelineScore
    });

    // 生成建议
    const recommendations = this.generateRecommendations(issues);

    // 确定是否批准
    const approved = this.determineApproval(overallScore, issues);

    const result: CheckResult = {
      id: checkId,
      solution_id: solution.id,
      overall_score: overallScore,
      completeness_score: completenessScore,
      feasibility_score: feasibilityScore,
      quality_score: qualityScore,
      risk_score: riskScore,
      timeline_score: timelineScore,
      issues,
      recommendations,
      approved,
      checked_at: new Date(),
      checker_notes: this.generateCheckerNotes(overallScore, issues)
    };

    // 保存检查历史
    if (!this.checkHistory.has(solution.id)) {
      this.checkHistory.set(solution.id, []);
    }
    this.checkHistory.get(solution.id)!.push(result);

    return result;
  }

  /**
   * 检查完整性
   */
  private checkCompleteness(solution: Solution, team: Team, issues: CheckIssue[]): number {
    let score = 100;

    if (!solution.implementation_plan || solution.implementation_plan.length === 0) {
      issues.push({
        id: uuidv4(),
        severity: 'critical',
        category: 'completeness',
        description: '缺少实施计划',
        suggested_fix: '需要制定详细的实施计划',
        affected_tasks: []
      });
      score -= 20;
    }

    if (!solution.success_metrics || solution.success_metrics.length === 0) {
      issues.push({
        id: uuidv4(),
        severity: 'medium',
        category: 'completeness',
        description: '缺少成功指标',
        suggested_fix: '定义明确的成功指标',
        affected_tasks: []
      });
      score -= 10;
    }

    return Math.max(0, score);
  }

  /**
   * 检查可行性
   */
  private checkFeasibility(solution: Solution, team: Team, issues: CheckIssue[]): number {
    let score = 100;

    const totalEstimatedHours = team.tasks.reduce((sum, task) => 
      sum + (task.estimated_hours || 0), 0
    );
    
    const availableHours = team.roles.length * 40 * 4;
    
    if (totalEstimatedHours > availableHours * 1.2) {
      issues.push({
        id: uuidv4(),
        severity: 'high',
        category: 'feasibility',
        description: '预估工作量超出团队容量',
        suggested_fix: '重新评估任务工作量',
        affected_tasks: []
      });
      score -= 15;
    }

    return Math.max(0, score);
  }

  /**
   * 检查质量
   */
  private checkQuality(solution: Solution, team: Team, issues: CheckIssue[]): number {
    let score = 100;

    if (!solution.description || solution.description.length < 100) {
      issues.push({
        id: uuidv4(),
        severity: 'medium',
        category: 'quality',
        description: '解决方案描述过于简单',
        suggested_fix: '提供更详细的描述',
        affected_tasks: []
      });
      score -= 12;
    }

    return Math.max(0, score);
  }

  /**
   * 检查风险评估
   */
  private checkRiskAssessment(solution: Solution, issues: CheckIssue[]): number {
    let score = 100;

    if (!solution.risk_assessment || solution.risk_assessment.length === 0) {
      issues.push({
        id: uuidv4(),
        severity: 'high',
        category: 'risk',
        description: '缺少风险评估',
        suggested_fix: '进行全面的风险识别和评估',
        affected_tasks: []
      });
      score -= 20;
    }

    return Math.max(0, score);
  }

  /**
   * 检查时间线
   */
  private checkTimeline(solution: Solution, team: Team, issues: CheckIssue[]): number {
    let score = 100;

    const tasksWithoutEstimate = team.tasks.filter(task => 
      !task.estimated_hours || task.estimated_hours <= 0
    );

    if (tasksWithoutEstimate.length > 0) {
      issues.push({
        id: uuidv4(),
        severity: 'medium',
        category: 'timeline',
        description: `${tasksWithoutEstimate.length} 个任务缺少时间估算`,
        suggested_fix: '为所有任务提供时间估算',
        affected_tasks: tasksWithoutEstimate.map(task => task.id)
      });
      score -= 15;
    }

    return Math.max(0, score);
  }

  /**
   * 计算总分
   */
  private calculateOverallScore(scores: any): number {
    const weights = {
      completeness: 0.25,
      feasibility: 0.25,
      quality: 0.2,
      risk: 0.15,
      timeline: 0.15
    };

    return Math.round(
      scores.completeness * weights.completeness +
      scores.feasibility * weights.feasibility +
      scores.quality * weights.quality +
      scores.risk * weights.risk +
      scores.timeline * weights.timeline
    );
  }

  /**
   * 生成建议
   */
  private generateRecommendations(issues: CheckIssue[]): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push('立即解决所有关键问题');
    }

    const highIssues = issues.filter(issue => issue.severity === 'high');
    if (highIssues.length > 0) {
      recommendations.push('优先解决高严重性问题');
    }

    return recommendations;
  }

  /**
   * 确定是否批准
   */
  private determineApproval(overallScore: number, issues: CheckIssue[]): boolean {
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    return criticalIssues.length === 0 && overallScore >= 60;
  }

  /**
   * 生成检查者备注
   */
  private generateCheckerNotes(overallScore: number, issues: CheckIssue[]): string {
    return `整体评分: ${overallScore}/100\n发现 ${issues.length} 个问题`;
  }

  /**
   * 获取检查历史
   */
  public getCheckHistory(solutionId: string): CheckResult[] {
    return this.checkHistory.get(solutionId) || [];
  }

  /**
   * 获取最新检查结果
   */
  public getLatestCheckResult(solutionId: string): CheckResult | null {
    const history = this.getCheckHistory(solutionId);
    return history.length > 0 ? history[history.length - 1] : null;
  }
} 