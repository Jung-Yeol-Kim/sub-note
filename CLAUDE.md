# CLAUDE.md

> Guide to using Claude Code with the IT Professional Examination (정보관리기술사) Sub-note Repository

## Overview

This repository is optimized for use with **Claude Code**, featuring custom skills and workflows to help prepare for the Korean IT Professional Examination. Claude can assist with topic generation, answer grading, keyword analysis, exam analysis, and more.

## Quick Start

### Using Claude Code Skills

This repository includes specialized Claude Code skills in `.claude/skills/`. To use them:

```bash
# In Claude Code, simply mention or invoke the skill name:
topic-generator      # Generate structured answer sheets
grading             # Grade your practice answers
keyword-analyzer    # Analyze keyword coverage
answer-reviewer     # Get detailed feedback on answers
topic-comparer      # Compare multiple answer versions
```

### Available Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **topic-generator** | Generate structured answer sheets following exam format | Creating new sub-notes for topics |
| **grading** | Score answers based on 6 evaluation criteria | Evaluating practice answers |
| **keyword-analyzer** | Extract and analyze keywords, identify missing terms | Checking concept coverage |
| **answer-reviewer** | Provide line-by-line detailed review | Getting in-depth feedback |
| **topic-comparer** | Compare multiple answer versions | Tracking improvement over time |
| **template-selector** | Choose appropriate answer template | When unsure which format to use |
| **mock-exam-generator** | Generate realistic practice questions | Creating practice exams |
| **study-planner** | Create personalized study plans | Planning study schedule |
| **trend-topic-predictor** | Predict likely exam topics | Strategic exam preparation |

### Using the Web Interface (itpe-assistant)

This repository includes a **Next.js web application** for a more interactive study experience:

```bash
# Navigate to the web app directory
cd itpe-assistant

# Install dependencies (first time only)
pnpm install

# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

**Features:**
- **Interactive AI Chat**: Converse with AI assistants (Claude, GPT) for real-time study help
- **Visual Interface**: Browse sub-notes, view diagrams, and organize study materials
- **Integrated Skills**: Access all Claude Code skills through a web UI
- **Study Dashboard**: Track progress, view analytics, and manage study plans

**Tech Stack:**
- Next.js 16 (React 19)
- AI SDK (Anthropic & OpenAI support)
- Tailwind CSS + Radix UI components
- TypeScript

**When to Use:**
- **CLI (Claude Code)**: For generating content, analyzing exams, automating workflows
- **Web App**: For interactive study sessions, browsing materials, visual learning

## Common Workflows

### 1. Creating a New Sub-note

```markdown
1. Ask Claude: "Generate a sub-note for [topic name]"
   → Uses topic-generator skill
   → Saves to sub-notes/ai/

2. Review and grade: "Grade this answer"
   → Uses grading skill
   → Provides scores and feedback

3. Analyze keywords: "Analyze keywords in this answer"
   → Uses keyword-analyzer skill
   → Identifies missing critical terms

4. Refine and save to sub-notes/human/
```

### 2. Analyzing Past Exam Questions

```markdown
1. "Analyze exam data for round [XXX]"
   → Claude will use scripts/analyze.py
   → Matches questions to syllabus

2. "Generate analysis report for rounds [XXX-YYY]"
   → Uses report_generator.py
   → Creates markdown reports in reports/

3. "What topics are trending?"
   → Uses trend-topic-predictor skill
   → Provides topic predictions
```

### 3. Practice and Review

```markdown
1. "Generate a mock exam on [topic/category]"
   → Uses mock-exam-generator skill
   → Creates realistic practice questions

2. Write your answer

3. "Grade my answer and provide detailed feedback"
   → Uses grading + answer-reviewer skills
   → Gets scores and improvement suggestions

4. "Compare this with my previous answer"
   → Uses topic-comparer skill
   → Shows progress and differences
```

### 4. Using the Web Interface for Interactive Study

```markdown
1. Start the web app:
   cd itpe-assistant && pnpm dev

2. Interactive Learning:
   → Browse sub-notes with visual UI
   → Chat with AI for real-time explanations
   → View diagrams and tables in formatted layout

3. Practice Sessions:
   → Use web interface for mock exams
   → Submit answers through web form
   → Get instant feedback with visual highlights

4. Progress Tracking:
   → View study statistics on dashboard
   → Track completed topics and weak areas
   → Visualize learning trends over time
```

## Working with Claude

### Best Practices

**1. Be Specific**
```markdown
✅ "Generate a sub-note for OAuth 2.0 focusing on grant types"
❌ "Make a note about OAuth"

✅ "Grade this answer and identify missing keywords"
❌ "Is this good?"
```

**2. Use Iterative Refinement**
```markdown
1. Generate initial answer
2. Grade and get feedback
3. Analyze keywords
4. Revise based on feedback
5. Compare with previous version
6. Repeat until satisfied
```

**3. Leverage Skills Together**
```markdown
# Comprehensive review workflow
1. topic-generator → Create answer
2. grading → Get score
3. keyword-analyzer → Check coverage
4. answer-reviewer → Get detailed feedback
5. Revise answer
6. topic-comparer → Compare versions
```

### Example Prompts

**Topic Generation**
```
"Generate a sub-note for Zero Trust Architecture with focus on implementation strategies"

"Create an answer sheet for Kubernetes security best practices"
```

**Grading and Feedback**
```
"Grade my answer on API Gateway patterns"

"Provide detailed line-by-line review of this OAuth answer"

"What keywords am I missing in this cloud architecture answer?"
```

**Exam Analysis**
```
"Analyze exam round 135 and match to syllabus"

"Generate a report comparing rounds 135-137"

"What security topics appear most frequently in recent exams?"
```

**Study Planning**
```
"Create a 3-month study plan focusing on my weak areas in networking"

"Predict likely topics for the next exam based on recent trends"
```

## Repository Structure Guide for Claude

```
sub-note/
├── .claude/skills/          # Claude Code Skills
│   ├── topic-generator/     # Answer sheet generation
│   ├── grading/             # Answer grading with criteria
│   ├── keyword-analyzer/    # Keyword extraction & analysis
│   ├── answer-reviewer/     # Detailed line-by-line review
│   ├── topic-comparer/      # Compare answer versions
│   ├── template-selector/   # Template recommendation
│   ├── mock-exam-generator/ # Practice question generation
│   ├── study-planner/       # Study plan creation
│   └── trend-topic-predictor/ # Topic prediction

├── itpe-assistant/          # Web Application (Next.js)
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ai-elements/     # AI chat components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Dependencies & scripts

├── scripts/                 # Exam analysis tools
│   ├── exam_data_helper.py  # Input exam data
│   ├── analyze.py           # Analyze & match to syllabus
│   └── report_generator.py  # Generate markdown reports

├── data/                    # Analysis data
│   ├── syllabus/            # Official exam syllabus
│   └── exam_results/        # Analysis results (JSON)

├── reports/                 # Generated analysis reports
├── sub-notes/
│   ├── ai/                  # AI-generated answers
│   └── human/               # Human-refined answers

└── study-plan/              # Study schedules and plans
```

## Answer Format Requirements

Claude is trained to follow this specific format for exam answers:

### Structure
```
1. Definition
   - Clear definition including features/purpose/technology

2. [Topic Name] Explanation
   1) Structure/Process/Architecture (Diagram)
      [Visual diagram showing relationships]
      - Brief explanation of diagram

   2) Classification/Types/Features (Table)
      | Category | Item | Description |
      |----------|------|-------------|

      - Brief explanation of table

3. (Optional) Additional Notes/Considerations
```

### Style Guidelines
- **Concise**: Omit particles (조사 생략)
- **Structured**: Clear hierarchy and grouping
- **Visual**: Include diagrams and 3-column tables
- **Keywords**: Emphasize technical terms
- **Length**: Fit within 1 page
- **Tone**: Professional, technical

## Tips for Maximum Efficiency

### 1. Batch Processing
```markdown
"Analyze exam rounds 130, 131, 132, 133, and 134, then generate a comprehensive trend report"
```

### 2. Chain Skills
```markdown
"Generate a sub-note for API Gateway, grade it, analyze keywords, and provide improvement suggestions"
```

### 3. Context Awareness
```markdown
# Claude remembers context within conversation
1. "Generate sub-note for OAuth 2.0"
2. "Now grade it"  # Claude knows what "it" refers to
3. "Compare with the version in sub-notes/human/"
4. "What keywords am I missing?"
```

### 4. File Operations
```markdown
"Read all sub-notes in sub-notes/ai/ and identify which topics need refinement"

"Compare all my answers on security topics and identify common weaknesses"
```

## Advanced Features

### Custom Analysis
```markdown
"Analyze the frequency of blockchain-related questions in the last 10 exams"

"Which syllabus categories have the highest question-to-category ratio?"
```

### Personalized Feedback
```markdown
"Based on my answers in sub-notes/human/, what are my writing patterns and areas for improvement?"

"Create a study plan focusing on topics I haven't covered yet"
```

### Trend Analysis
```markdown
"What emerging technologies are likely to appear in the next exam?"

"Analyze the correlation between technology trends and exam topics over the past 2 years"
```

## Troubleshooting

### Skill Not Working
```bash
# Check if skill exists
ls .claude/skills/

# Verify skill structure
cat .claude/skills/[skill-name]/skill.md
```

### Web App Issues
```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Install dependencies
cd itpe-assistant && pnpm install

# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm dev

# Check port availability
lsof -i :3000  # If port 3000 is busy
```

### Analysis Script Issues
```bash
# Check Python dependencies
python --version  # Should be Python 3.x

# Verify data files exist
ls data/syllabus/
ls data/exam_results/
```

### Getting Better Results

**Instead of:** "Make this better"
**Try:** "Grade this answer, identify missing keywords, and suggest specific improvements to the definition and table structure"

**Instead of:** "Analyze the exam"
**Try:** "Analyze exam round 135, match questions to syllabus categories, and identify trending topics in the security domain"

## Contributing

When working with Claude on this repository:

1. **Generate** new sub-notes in `sub-notes/ai/`
2. **Refine** and personalize in `sub-notes/human/`
3. **Analyze** exam data using scripts
4. **Update** study plans based on progress
5. **Commit** changes with clear messages

## Resources

- **README.md**: Project overview and structure
- **itpe-assistant/README.md**: Web application setup guide
- **scripts/README.md**: Detailed guide for analysis scripts
- **.claude/skills/**: Individual skill documentation
- **reports/**: Past exam analysis reports

## Contact & Feedback

When asking Claude for help:
- Be specific about what you want to achieve
- Reference file paths when discussing specific content
- Ask for explanations if you don't understand the approach
- Request multiple alternatives when appropriate

---

**Happy studying with Claude Code! 화이팅! 🚀**
