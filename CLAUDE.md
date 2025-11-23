# CLAUDE.md

> Guide to using Claude Code with the IT Professional Examination (정보관리기술사) Sub-note Repository

## Overview

This repository is optimized for use with **Claude Code**, featuring custom skills and workflows to help prepare for the Korean IT Professional Examination. Claude can assist with topic generation, answer grading, keyword analysis, exam analysis, and more.

### Mentoring-Centered Learning Philosophy

The platform is built around insights from actual exam passers who emphasized:
- **Mentoring is Essential**: Very difficult to pass alone
- **Daily Writing Practice**: 2+ months of daily practice is the key to success
- **Structured Feedback**: Specific guidance to improve from 4 points to 5 points
- **Long-term Mindset**: Psychological support and encouragement matter
- **Smart Review**: Spaced repetition prevents burnout and ensures retention

The system integrates these principles through:
- Mentoring dashboard with D-Day tracking and learning streaks
- Daily writing challenges with 30-day goals
- Mock exam system with immediate AI feedback
- Spaced repetition review algorithm
- Community study groups and mentor matching
- Psychological support (encouragement, milestones, slump detection)

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
| **skill-creator** | Guide for creating new custom skills | When you need specialized workflows |
| **frontend-design** | Create distinctive, production-grade frontend interfaces | Building web UI components |
| **document-skills** | Work with PDF, DOCX, PPTX, XLSX files | Processing office documents |

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
- **Mentoring Dashboard**: D-Day counter, learning streaks, weekly plans, daily check-ins
- **Mock Exam System**: Timer-based practice with immediate AI feedback (6 evaluation criteria)
- **Smart Review**: Spaced repetition algorithm for optimal retention
- **Daily Writing Challenge**: Build consistent writing habits with 30-day streaks
- **Study Groups**: Community learning, mentor-mentee matching
- **Psychological Support**: Encouragement messages, milestones, slump detection
- **Interactive AI Chat**: Real-time conversation with Claude and GPT models
- **Sub-notes Management**: Full CRUD with category organization
- **AI Evaluations**: Detailed feedback on your answers

**Tech Stack:**
- Next.js 16 (React 19) with App Router
- PostgreSQL (Neon) + Drizzle ORM
- AI SDK (Anthropic Claude & OpenAI)
- Tailwind CSS 4 + Radix UI components
- Better Auth for authentication
- TypeScript

**When to Use:**
- **CLI (Claude Code)**: For generating content, analyzing exams, automating workflows
- **Web App**: For interactive study sessions, browsing materials, visual learning

## Common Workflows

### 1. Creating a New Sub-note

```markdown
1. Ask Claude: "Generate a sub-note for [topic name]"
   → Uses topic-generator skill
   → Saves to sub-notes/ai/ or category folders

2. Review and grade: "Grade this answer"
   → Uses grading skill
   → Provides scores and feedback

3. Analyze keywords: "Analyze keywords in this answer"
   → Uses keyword-analyzer skill
   → Identifies missing critical terms

4. Refine and categorize:
   → Move to appropriate category (02_소프트웨어공학, 05_정보보안, etc.)
   → Or keep in sub-notes/ai/ for further refinement
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

2. Mentoring Dashboard (/mentoring):
   → Track D-Day countdown to exam
   → Monitor learning streaks and consistency
   → Set weekly goals and daily check-ins
   → View encouragement messages
   → Celebrate milestones

3. Mock Exam Practice (/mock-exam):
   → Take timed practice exams (4-hour full or partial)
   → Write answers in real-time
   → Get immediate AI feedback with 6 evaluation criteria
   → Track improvement over time

4. Smart Review (/review):
   → Follow spaced repetition schedule
   → Review topics at optimal intervals
   → Random review mode for variety
   → Track memory retention rates

5. Daily Writing Challenge (/writing-challenge):
   → Practice writing daily (20-minute sessions)
   → Build 30-day streaks
   → Analyze writing patterns
   → Get quality feedback from AI

6. Community Learning (/study-groups):
   → Join study groups by target exam date
   → Find mentors or become one
   → Schedule regular study sessions
   → Share progress with peers
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
│   ├── trend-topic-predictor/ # Topic prediction
│   ├── skill-creator/       # Create custom skills
│   ├── frontend-design/     # Frontend UI generation
│   └── document-skills/     # PDF, DOCX, PPTX, XLSX tools
│       ├── pdf/
│       ├── docx/
│       ├── pptx/
│       └── xlsx/

├── itpe-assistant/          # Web Application (Next.js)
│   ├── app/                 # Next.js App Router pages
│   │   ├── mentoring/       # Mentoring dashboard
│   │   ├── mock-exam/       # Mock exam system
│   │   ├── review/          # Smart review (spaced repetition)
│   │   ├── writing-challenge/ # Daily writing challenge
│   │   ├── study-groups/    # Community & mentoring
│   │   ├── sub-notes/       # Sub-notes CRUD
│   │   ├── topics/          # Exam topics
│   │   ├── community/       # Shared notes
│   │   └── ai-suggestions/  # AI topic recommendations
│   ├── components/          # React components
│   │   ├── ai-elements/     # AI chat components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── navigation/      # Sidebar & nav
│   │   ├── mock-exam/       # Mock exam components
│   │   ├── auth/            # Authentication
│   │   └── ui/              # Reusable UI (shadcn)
│   ├── db/                  # Database schema (Drizzle)
│   ├── lib/                 # Utility functions & types
│   ├── hooks/               # React hooks
│   ├── public/              # Static assets
│   └── package.json         # Dependencies & scripts

├── scripts/                 # Exam analysis tools
│   ├── exam_data_helper.py  # Input exam data
│   ├── analyze.py           # Analyze & match to syllabus
│   ├── report_generator.py  # Generate markdown reports
│   ├── parse_exam_txt.py    # Parse exam text files
│   ├── analyze_exam_trends.py # Trend analysis
│   ├── analyze_tech_keywords.py # Keyword frequency
│   ├── analyze_duplicates.py # Find duplicate questions
│   └── add_exam_data.py     # Batch add exam data

├── data/                    # Analysis data
│   ├── syllabus/            # Official exam syllabus
│   ├── exam_results/        # Analysis results (JSON)
│   ├── 샘플_답안/           # Sample answers
│   ├── exam.txt             # Raw exam data
│   ├── 정보관리기술사_출제기준.pdf # Official syllabus PDF
│   ├── 답안지(표).pdf       # Answer sheet template
│   └── 깍두기_19칸.pdf      # Practice grid template

├── reports/                 # Generated analysis reports
├── sub-notes/               # Topic sub-notes by category
│   ├── ai/                  # AI-generated answers
│   ├── 02_소프트웨어공학/   # Software Engineering
│   ├── 04_컴퓨터시스템및정보통신/ # Computer Systems & Telecom
│   ├── 05_정보보안/         # Information Security
│   └── 06_최신기술/         # Latest Technologies

├── study-plan/              # Study schedules and plans
└── docs/                    # Documentation
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

# Database setup
pnpm db:push      # Push schema to database
pnpm db:studio    # Open database GUI
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run migrations

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

## Development Conventions

### Sub-notes Organization

**Category Structure**:
- `02_소프트웨어공학/` - Software Engineering topics
- `04_컴퓨터시스템및정보통신/` - Computer Systems & Telecommunications
- `05_정보보안/` - Information Security
- `06_최신기술/` - Latest Technologies
- `ai/` - AI-generated answers for review

**File Naming**: Use descriptive names in Korean (e.g., `OAuth_2.0_인증.md`)

### Web App Development

**Component Organization**:
- `components/ui/` - Reusable shadcn components
- `components/dashboard/` - Dashboard-specific widgets
- `components/[feature]/` - Feature-specific components
- `app/[route]/` - Page components and server actions

**Database Operations**:
- Use server actions in `app/[route]/actions.ts`
- Define schema in `db/schema.ts`
- Use Drizzle ORM for type-safe queries

**Styling**:
- Tailwind CSS 4 with "Study Atelier" theme
- Warm cream backgrounds (#fcfaf7)
- Forest green accents (#3d5a4c)
- Bronze/gold highlights (#c49a6c)
- Crimson Pro for headings, Geist Sans for body

### Analysis Scripts

**Data Flow**:
1. Input raw exam data via `exam_data_helper.py`
2. Analyze with `analyze.py` → outputs JSON to `data/exam_results/`
3. Generate reports with `report_generator.py` → outputs MD to `reports/`

**Python Version**: Python 3.x required for all scripts

## Contributing

When working with Claude on this repository:

1. **Generate** new sub-notes in `sub-notes/ai/`
2. **Categorize** refined notes into appropriate category folders
3. **Analyze** exam data using scripts
4. **Update** study plans based on progress
5. **Commit** changes with clear messages

### Git Workflow
- Branch naming: Use descriptive names (e.g., `feature/mock-exam`, `fix/db-schema`)
- Commit messages: Clear, concise, in English or Korean
- For web app: Test locally before committing

## Resources

### Documentation
- **README.md**: Project overview and structure (Korean)
- **CLAUDE.md**: This file - comprehensive AI assistant guide
- **itpe-assistant/README.md**: Web application setup guide
- **scripts/README.md**: Detailed guide for analysis scripts
- **IMPLEMENTATION_SUMMARY.md**: Mentoring platform implementation details
- **INTEGRATION_COMPLETE.md**: Web app integration completion notes
- **USECHAT_GUIDE.md**: Guide for using AI chat features
- **.claude/skills/**: Individual skill documentation

### Analysis & Reports
- **reports/**: Past exam analysis reports (markdown)
- **data/exam_results/**: Detailed analysis data (JSON)
- **data/샘플_답안/**: Sample answer sheets

### Templates & References
- **data/답안지(표).pdf**: Official answer sheet template
- **data/깍두기_19칸.pdf**: Practice grid template (19 boxes)
- **data/정보관리기술사_출제기준.pdf**: Official exam syllabus

## AI Assistant Best Practices

When working with this codebase as an AI assistant:

### Understanding Context
- **Read before writing**: Always read existing files before modifying
- **Check categories**: Determine which category (02, 04, 05, 06) a topic belongs to
- **Review templates**: Check `data/샘플_답안/` for reference formats
- **Understand current state**: Use `scripts/analyze.py` output to see what's been analyzed

### Generating Content
- **Topic answers**: Follow the strict format (Definition → Explanation with diagram/table → Considerations)
- **Korean style**: Use 조사 생략 (omit particles), professional technical tone
- **Diagrams**: Create clear ASCII diagrams showing relationships
- **Tables**: Always use 3-column format (구분 | 세부 항목 | 설명)

### Code Modifications
- **Web app changes**:
  - Update schema in `db/schema.ts` first
  - Create server actions in `actions.ts`
  - Test with `pnpm dev` before committing
- **Python scripts**: Maintain compatibility with existing JSON formats
- **Skills**: Follow the skill template structure from `skill-creator`

### File Operations
- **Preserve formatting**: Maintain existing indentation and style
- **Categorize correctly**: Place sub-notes in appropriate category folders
- **Update indexes**: If adding significant content, update README files

### Analysis Tasks
- **Use existing scripts**: Don't recreate analysis tools that already exist
- **JSON format**: Maintain consistency with existing `data/exam_results/` structure
- **Korean file names**: Keep Korean naming in `data/` and `sub-notes/`

### Communication
- **Be bilingual**: Support both Korean and English naturally
- **Explain choices**: When categorizing or structuring, explain reasoning
- **Offer alternatives**: Provide multiple approaches when applicable
- **Reference files**: Always include file paths when discussing specific content

## Contact & Feedback

When asking Claude for help:
- Be specific about what you want to achieve
- Reference file paths when discussing specific content
- Ask for explanations if you don't understand the approach
- Request multiple alternatives when appropriate

---

**Happy studying with Claude Code! 화이팅! 🚀**
