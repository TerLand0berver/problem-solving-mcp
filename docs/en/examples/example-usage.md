# 🎯 Problem Solving MCP Server - Usage Examples

## 📋 Complete Project Example: AI Customer Service System

This example demonstrates how to use the Problem Solving MCP Server to develop a complete AI customer service system for an e-commerce platform.

### 🎬 Step 1: Create Problem Definition

**Command:**
```
Please help me create a problem: Develop AI customer service system, develop intelligent customer service system for e-commerce platform, supporting multi-turn dialogue, sentiment analysis, and automatic replies, domain is software development, complexity score 8
```

**Expected Result:**
```json
{
  "problem_id": "prob_001",
  "title": "Develop AI Customer Service System",
  "description": "Develop intelligent customer service system for e-commerce platform, supporting multi-turn dialogue, sentiment analysis, and automatic replies",
  "domain": "software_development",
  "complexity_score": 8,
  "created_at": "2024-01-15T10:00:00Z",
  "status": "created"
}
```

### 🎭 Step 2: Get Role Recommendations

**Command:**
```
Please recommend suitable team role configuration for problem prob_001
```

**Expected Result:**
```json
{
  "problem_id": "prob_001",
  "recommended_team_size": 9,
  "core_roles": [
    {
      "role_type": "analyst",
      "reason": "Analyze customer service requirements and user behavior patterns",
      "priority": "high"
    },
    {
      "role_type": "developer",
      "reason": "Implement AI dialogue system and backend services",
      "priority": "high"
    },
    {
      "role_type": "researcher",
      "reason": "Research NLP technologies and sentiment analysis algorithms",
      "priority": "high"
    }
  ],
  "supporting_roles": [
    {
      "role_type": "designer",
      "reason": "Design user interface and interaction experience"
    },
    {
      "role_type": "tester",
      "reason": "Test system functionality and performance"
    },
    {
      "role_type": "project_manager",
      "reason": "Coordinate project progress and resource allocation"
    }
  ]
}
```

### 🚀 Step 3: Start Problem Solving

**Command:**
```
Please start solving problem prob_001 and generate a complete solution
```

**Expected Result:**
The system will automatically:
1. Create a 9-member professional team
2. Generate detailed solution plan
3. Assign specific tasks to each role
4. Create project timeline
5. Identify potential risks

### 📊 Step 4: Priority Analysis

**Command:**
```
Please use the Eisenhower Matrix to analyze the task priorities of problem prob_001
```

**Expected Result:**
```json
{
  "problem_id": "prob_001",
  "eisenhower_analysis": {
    "urgent_important": [
      {
        "task": "Set up development environment",
        "reason": "Foundation for all subsequent development work",
        "estimated_time": "1 day"
      },
      {
        "task": "Define API specifications",
        "reason": "Critical for team collaboration and integration",
        "estimated_time": "2 days"
      }
    ],
    "not_urgent_important": [
      {
        "task": "Research advanced NLP models",
        "reason": "Long-term system optimization",
        "estimated_time": "1 week"
      },
      {
        "task": "Design system architecture",
        "reason": "Foundation for scalable system",
        "estimated_time": "3 days"
      }
    ],
    "urgent_not_important": [
      {
        "task": "Prepare project documentation template",
        "reason": "Can be delegated to junior team members",
        "estimated_time": "0.5 day"
      }
    ],
    "not_urgent_not_important": [
      {
        "task": "Research competitor products",
        "reason": "Nice to have but not critical for MVP",
        "estimated_time": "2 days"
      }
    ]
  }
}
```

### ⚡ Step 5: Parallel Processing Optimization

**Command:**
```
Please analyze the parallel execution potential of problem prob_001 and optimize team configuration to improve efficiency
```

**Expected Result:**
```json
{
  "problem_id": "prob_001",
  "optimization_analysis": {
    "repetitive_tasks_detected": [
      {
        "task_type": "API development",
        "repetition_score": 0.8,
        "workload_score": 0.9,
        "recommendation": "Expand development team"
      },
      {
        "task_type": "Model training",
        "repetition_score": 0.7,
        "workload_score": 0.8,
        "recommendation": "Add ML specialists"
      }
    ],
    "team_expansion": {
      "original_size": 9,
      "expanded_size": 15,
      "new_roles": [
        "Backend Developer #2",
        "Frontend Developer #2", 
        "ML Engineer #2",
        "DevOps Engineer",
        "UI/UX Designer #2",
        "QA Engineer #2"
      ]
    },
    "efficiency_improvement": {
      "estimated_speedup": "2.3x",
      "parallel_task_groups": 4,
      "critical_path_reduction": "40%"
    }
  }
}
```

### 🔍 Step 6: Quality Check

**Command:**
```
Please check the quality of the solution for problem prob_001 and provide improvement suggestions
```

**Expected Result:**
```json
{
  "problem_id": "prob_001",
  "quality_assessment": {
    "overall_score": 85,
    "dimensions": {
      "completeness": {
        "score": 90,
        "feedback": "Solution covers all major requirements"
      },
      "feasibility": {
        "score": 85,
        "feedback": "Technical approach is sound and achievable"
      },
      "quality": {
        "score": 80,
        "feedback": "Good code structure, needs more error handling"
      },
      "risk_management": {
        "score": 85,
        "feedback": "Major risks identified with mitigation plans"
      },
      "timeline": {
        "score": 85,
        "feedback": "Realistic timeline with appropriate buffers"
      }
    },
    "identified_issues": [
      {
        "severity": "medium",
        "category": "technical",
        "description": "Lack of detailed error handling strategy",
        "suggestion": "Add comprehensive error handling and logging framework"
      },
      {
        "severity": "low",
        "category": "process",
        "description": "Missing performance benchmarks",
        "suggestion": "Define specific performance metrics and testing criteria"
      }
    ],
    "improvement_suggestions": [
      "Add automated testing pipeline",
      "Include security audit checklist",
      "Define monitoring and alerting strategy"
    ]
  }
}
```

### 📈 Step 7: Get Execution Report

**Command:**
```
Please generate a detailed project execution report for problem prob_001
```

**Expected Result:**
```json
{
  "problem_id": "prob_001",
  "execution_report": {
    "project_overview": {
      "title": "AI Customer Service System",
      "status": "in_planning",
      "team_size": 15,
      "estimated_duration": "12 weeks",
      "budget_estimate": "$120,000"
    },
    "timeline": {
      "phases": [
        {
          "phase": "Planning & Design",
          "duration": "2 weeks",
          "start_date": "2024-01-15",
          "end_date": "2024-01-29",
          "deliverables": ["Requirements document", "System architecture", "UI/UX designs"]
        },
        {
          "phase": "Development",
          "duration": "6 weeks", 
          "start_date": "2024-01-30",
          "end_date": "2024-03-12",
          "deliverables": ["Core API", "Frontend interface", "ML models"]
        },
        {
          "phase": "Testing & Integration",
          "duration": "3 weeks",
          "start_date": "2024-03-13",
          "end_date": "2024-04-02",
          "deliverables": ["Test reports", "Integration documentation"]
        },
        {
          "phase": "Deployment & Launch",
          "duration": "1 week",
          "start_date": "2024-04-03",
          "end_date": "2024-04-09",
          "deliverables": ["Production deployment", "Launch documentation"]
        }
      ]
    },
    "resource_allocation": {
      "development": "60%",
      "testing": "20%",
      "design": "10%",
      "management": "10%"
    },
    "risk_assessment": {
      "high_risks": [
        {
          "risk": "NLP model accuracy below requirements",
          "probability": "medium",
          "impact": "high",
          "mitigation": "Parallel development of multiple model approaches"
        }
      ],
      "medium_risks": [
        {
          "risk": "Integration complexity with existing systems",
          "probability": "high",
          "impact": "medium", 
          "mitigation": "Early prototype and integration testing"
        }
      ]
    }
  }
}
```

## 🔄 Step 8: Create Reflection

**Command:**
```
Please create a reflection record for the planning phase of problem prob_001
```

**Expected Result:**
```json
{
  "reflection_id": "refl_001",
  "problem_id": "prob_001",
  "phase": "planning",
  "insights": [
    "Team expansion significantly improved parallel processing capability",
    "Eisenhower Matrix helped prioritize critical path tasks effectively",
    "Quality assessment revealed important technical gaps early"
  ],
  "lessons_learned": [
    "Early parallel optimization analysis saves significant time later",
    "Multi-dimensional quality checks prevent costly rework",
    "Role specialization improves both quality and efficiency"
  ],
  "improvements_for_next_time": [
    "Include security specialist from the beginning",
    "Add more detailed performance requirements upfront",
    "Consider user experience testing earlier in timeline"
  ]
}
```

## 💡 Advanced Usage Patterns

### Pattern 1: Iterative Improvement
```bash
# Create problem → Get recommendations → Solve → Check quality → Improve → Repeat
create_problem → get_role_recommendations → solve_problem → check_solution → improve_solution
```

### Pattern 2: Parallel Optimization Workflow
```bash
# Solve problem → Analyze parallel potential → Optimize → Execute with expanded team
solve_problem → optimize_parallel_execution → update_team_member → assign_task
```

### Pattern 3: Comprehensive Analysis
```bash
# Create problem → Eisenhower analysis → Dependency analysis → Execution report
create_problem → eisenhower_matrix_analysis → analyze_task_dependencies → get_execution_report
```

## 🎯 Best Practices

### 1. Problem Definition
- **Be Specific**: Include clear requirements and constraints
- **Set Appropriate Complexity**: Use 1-10 scale accurately
- **Choose Right Domain**: Select the most relevant domain

### 2. Team Configuration
- **Trust Recommendations**: The system analyzes complexity intelligently
- **Consider Parallel Optimization**: For complex projects, analyze parallel potential early
- **Balance Roles**: Ensure good mix of technical and management roles

### 3. Quality Assurance
- **Check Early and Often**: Use quality checks throughout the process
- **Address Issues Promptly**: Don't let medium/high severity issues accumulate
- **Iterate Based on Feedback**: Use improvement suggestions actively

### 4. Execution Management
- **Monitor Progress**: Regular execution reports keep projects on track
- **Manage Dependencies**: Use dependency analysis for complex workflows
- **Learn from Experience**: Create reflections for continuous improvement

## 🚀 Quick Command Reference

| Use Case | Command Template |
|----------|------------------|
| Create new problem | `create_problem(title, description, domain, complexity_score)` |
| Get team suggestions | `get_role_recommendations(problem_id)` |
| Solve problem | `solve_problem(problem_id)` |
| Check quality | `check_solution(problem_id)` |
| Analyze priorities | `eisenhower_matrix_analysis(problem_id)` |
| Optimize parallel execution | `optimize_parallel_execution(problem_id)` |
| Get execution report | `get_execution_report(problem_id)` |
| Create reflection | `create_reflection(problem_id, phase, insights, lessons_learned)` |

---

🎉 **You now have a complete understanding of how to use the Problem Solving MCP Server!**

Start with simple problems and gradually work your way up to complex multi-team projects. The system will learn and improve with each use! 🚀✨ 