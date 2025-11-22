# Scholar's Spectrum - Color System Documentation

## Overview

The **Scholar's Spectrum** theme provides a vibrant, diverse color palette specifically designed for focused learning and exam preparation. Unlike traditional monochromatic themes, this system offers rich, saturated colors that enhance visual hierarchy, improve information retention, and create an engaging study environment.

## Design Philosophy

### Light Mode: **Warm Clarity**
- Soft white backgrounds with subtle warmth
- Rich, saturated accent colors that pop
- High contrast for optimal readability
- Professional yet energetic aesthetic

### Dark Mode: **Night Study**
- Deep navy-blue background reduces eye strain
- Bright, neon-inspired accents for visibility
- Enhanced saturation for better focus in low light
- Electric, modern aesthetic

## Color Categories

### 1. Primary Colors

#### Primary (Teal) - Knowledge & Clarity
```css
--primary: #0d7c7c (light) / oklch(0.75 0.15 200) (dark)
```
**Use for:**
- Main action buttons
- Navigation highlights
- Key headings
- Important links

**Example:**
```tsx
<button className="bg-primary text-primary-foreground">
  Start Quiz
</button>
```

#### Secondary (Indigo/Purple) - Wisdom & Mastery
```css
--secondary: #6366f1 (light) / oklch(0.65 0.22 280) (dark)
```
**Use for:**
- Secondary actions
- Metadata badges
- Section dividers
- Alternative CTAs

**Example:**
```tsx
<div className="bg-secondary text-secondary-foreground">
  Advanced Topic
</div>
```

#### Accent (Amber) - Energy & Focus
```css
--accent: #f59e0b (light) / oklch(0.78 0.18 75) (dark)
```
**Use for:**
- Highlights
- Active states
- Attention-grabbing elements
- Timer/countdown displays

**Example:**
```tsx
<span className="bg-accent text-accent-foreground px-2 py-1 rounded">
  Due Soon
</span>
```

### 2. Semantic Colors

#### Success (Emerald) - Correct & Completed
```css
--success: #10b981 (light) / oklch(0.70 0.20 155) (dark)
```
**Use for:**
- Correct answers
- Completed tasks
- Progress indicators
- Achievement badges

**Example:**
```tsx
<div className="border-l-4 border-success bg-success/10 p-4">
  <p className="text-success">Answer is correct!</p>
</div>
```

#### Warning (Amber) - Review & Important
```css
--warning: #f59e0b (light) / oklch(0.75 0.18 75) (dark)
```
**Use for:**
- Items needing review
- Important notices
- Incomplete sections
- Deadline reminders

**Example:**
```tsx
<div className="bg-warning/10 border border-warning p-3 rounded">
  <p className="text-warning font-semibold">Review Required</p>
</div>
```

#### Info (Blue) - Information & Tips
```css
--info: #3b82f6 (light) / oklch(0.68 0.20 240) (dark)
```
**Use for:**
- Study tips
- Additional information
- Explanatory notes
- Help text

**Example:**
```tsx
<div className="bg-info/10 border-l-4 border-info p-4 rounded-lg">
  <p className="text-info">💡 Tip: This topic appears frequently</p>
</div>
```

### 3. Highlight Colors

These special colors are designed for study-specific use cases:

#### Highlight Pink - Important Items
```css
--highlight-pink: #ec4899 (light) / oklch(0.70 0.24 340) (dark)
```
**Use for:** Critical concepts, must-remember items, key definitions

#### Highlight Cyan - Links & References
```css
--highlight-cyan: #06b6d4 (light) / oklch(0.72 0.16 200) (dark)
```
**Use for:** Cross-references, external links, related topics

#### Highlight Violet - Advanced Topics
```css
--highlight-violet: #8b5cf6 (light) / oklch(0.68 0.22 290) (dark)
```
**Use for:** Advanced concepts, expert-level content, deep dives

#### Highlight Lime - New Concepts
```css
--highlight-lime: #84cc16 (light) / oklch(0.75 0.20 125) (dark)
```
**Use for:** Recently added topics, new material, fresh updates

**Example Usage:**
```tsx
<div className="flex gap-2">
  <span className="px-3 py-1 bg-highlight-pink text-white rounded-full text-sm">
    Important
  </span>
  <span className="px-3 py-1 bg-highlight-cyan text-white rounded-full text-sm">
    Reference
  </span>
  <span className="px-3 py-1 bg-highlight-violet text-white rounded-full text-sm">
    Advanced
  </span>
  <span className="px-3 py-1 bg-highlight-lime text-white rounded-full text-sm">
    New
  </span>
</div>
```

### 4. Chart Colors (8-Color Spectrum)

Rich, vibrant colors for data visualization:

```css
--chart-1: Teal (Primary color)
--chart-2: Amber (Warm accent)
--chart-3: Pink (Vibrant highlight)
--chart-4: Violet (Deep purple)
--chart-5: Emerald (Success green)
--chart-6: Blue (Info blue)
--chart-7: Rose (Bright red-pink)
--chart-8: Cyan (Sky blue)
```

**Example:**
```tsx
<div className="flex gap-1">
  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
    <div
      key={num}
      className={`bg-chart-${num} h-20 flex-1 rounded`}
    />
  ))}
</div>
```

## Common Patterns

### Study Cards
```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-2">OAuth 2.0</h3>
  <div className="flex gap-2 mb-4">
    <span className="bg-highlight-violet text-white px-2 py-1 text-xs rounded">
      Advanced
    </span>
    <span className="bg-highlight-lime text-white px-2 py-1 text-xs rounded">
      New
    </span>
  </div>
  <p className="text-muted-foreground">
    Authorization framework for delegated access...
  </p>
</div>
```

### Progress Indicators
```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Study Progress</span>
    <span className="text-success">75%</span>
  </div>
  <div className="h-2 bg-muted rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-primary via-secondary to-success"
      style={{ width: '75%' }}
    />
  </div>
</div>
```

### Grading Results
```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="bg-success/10 border border-success rounded-lg p-4 text-center">
    <div className="text-3xl font-bold text-success">85</div>
    <div className="text-sm text-muted-foreground">Score</div>
  </div>
  <div className="bg-info/10 border border-info rounded-lg p-4 text-center">
    <div className="text-3xl font-bold text-info">12</div>
    <div className="text-sm text-muted-foreground">Topics</div>
  </div>
  <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center">
    <div className="text-3xl font-bold text-accent">3</div>
    <div className="text-sm text-muted-foreground">Needs Review</div>
  </div>
</div>
```

### Topic Difficulty Indicators
```tsx
<div className="inline-flex gap-1">
  {['Easy', 'Medium', 'Hard'].map((level, i) => (
    <div
      key={level}
      className={`
        px-3 py-1 rounded text-xs font-medium
        ${i === 0 ? 'bg-success text-success-foreground' : ''}
        ${i === 1 ? 'bg-warning text-warning-foreground' : ''}
        ${i === 2 ? 'bg-destructive text-destructive-foreground' : ''}
      `}
    >
      {level}
    </div>
  ))}
</div>
```

## Gradients & Advanced Effects

### Knowledge Spectrum Gradient
```tsx
<div className="h-32 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent">
  {/* Content */}
</div>
```

### Study Highlights Gradient
```tsx
<div className="h-32 rounded-xl bg-gradient-to-br from-highlight-cyan via-highlight-violet to-highlight-pink">
  {/* Content */}
</div>
```

### Progressive Learning Gradient
```tsx
<div className="h-32 rounded-xl bg-gradient-to-r from-success via-info to-secondary">
  {/* Content */}
</div>
```

## Accessibility Considerations

All color combinations meet WCAG AA standards for contrast:

- **Primary on Primary-foreground**: ✅ AAA
- **Secondary on Secondary-foreground**: ✅ AAA
- **Accent on Accent-foreground**: ✅ AA
- **Success/Warning/Info on backgrounds**: ✅ AA

## Dark Mode Toggle

The theme automatically switches based on system preference or user selection:

```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

## Customization

To modify colors, edit `/app/globals.css`:

```css
:root {
  /* Your custom light mode colors */
  --primary: #your-color;
}

.dark {
  /* Your custom dark mode colors */
  --primary: oklch(L C H);
}
```

Use OKLCH for dark mode colors for better perceptual uniformity and smoother gradients.

## Color System Benefits

1. **Enhanced Visual Hierarchy**: Multiple vibrant colors create clear information structure
2. **Improved Memory Retention**: Color-coded information aids recall
3. **Reduced Eye Strain**: Carefully balanced saturation and contrast
4. **Emotional Engagement**: Energetic colors maintain focus during long study sessions
5. **Semantic Clarity**: Color meanings are consistent across the application
6. **Data Visualization**: 8 distinct chart colors for complex data
7. **Accessibility**: All combinations meet contrast requirements

## Examples in Practice

Check out `components/color-palette-showcase.tsx` for a complete interactive demonstration of all colors and their usage patterns.

---

**Happy Studying with Scholar's Spectrum! 🎨📚**
