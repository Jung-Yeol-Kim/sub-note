/**
 * Color Palette Showcase - Scholar's Spectrum Theme
 * Demonstrates all available colors in the new diverse palette
 */

export function ColorPaletteShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Scholar's Spectrum</h2>
        <p className="text-muted-foreground">
          A vibrant, diverse color palette for focused learning
        </p>
      </div>

      {/* Primary Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Primary Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch
            color="bg-primary"
            text="text-primary-foreground"
            label="Primary"
            description="Deep Teal - Knowledge & Clarity"
          />
          <ColorSwatch
            color="bg-secondary"
            text="text-secondary-foreground"
            label="Secondary"
            description="Royal Purple - Wisdom & Mastery"
          />
          <ColorSwatch
            color="bg-accent"
            text="text-accent-foreground"
            label="Accent"
            description="Amber - Energy & Focus"
          />
          <ColorSwatch
            color="bg-destructive"
            text="text-destructive-foreground"
            label="Destructive"
            description="Red - Errors & Warnings"
          />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ColorSwatch
            color="bg-success"
            text="text-success-foreground"
            label="Success"
            description="Emerald - Correct Answers"
          />
          <ColorSwatch
            color="bg-warning"
            text="text-warning-foreground"
            label="Warning"
            description="Amber - Important Notes"
          />
          <ColorSwatch
            color="bg-info"
            text="text-info-foreground"
            label="Info"
            description="Blue - Information"
          />
        </div>
      </section>

      {/* Highlight Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">
          Study Highlight Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch
            color="bg-highlight-pink"
            text="text-primary-foreground"
            label="Highlight Pink"
            description="Important Items"
          />
          <ColorSwatch
            color="bg-highlight-cyan"
            text="text-primary-foreground"
            label="Highlight Cyan"
            description="Links & References"
          />
          <ColorSwatch
            color="bg-highlight-violet"
            text="text-primary-foreground"
            label="Highlight Violet"
            description="Advanced Topics"
          />
          <ColorSwatch
            color="bg-highlight-lime"
            text="text-primary-foreground"
            label="Highlight Lime"
            description="New Concepts"
          />
        </div>
      </section>

      {/* Chart Colors */}
      <section>
        <h3 className="text-xl font-semibold mb-4">
          Chart & Data Visualization Colors
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div
              key={num}
              className={`bg-chart-${num} h-24 rounded-lg flex items-end justify-center p-2`}
            >
              <span className="text-xs font-mono text-background/80">
                {num}
              </span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Full spectrum of 8 vibrant colors for rich data visualization
        </p>
      </section>

      {/* Usage Examples */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4">
          {/* Button Examples */}
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-all">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-all">
              Accent Button
            </button>
            <button className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-all">
              Success
            </button>
          </div>

          {/* Badge Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-highlight-pink text-white text-sm rounded-full">
              Important
            </span>
            <span className="px-3 py-1 bg-highlight-cyan text-white text-sm rounded-full">
              Reference
            </span>
            <span className="px-3 py-1 bg-highlight-violet text-white text-sm rounded-full">
              Advanced
            </span>
            <span className="px-3 py-1 bg-highlight-lime text-white text-sm rounded-full">
              New
            </span>
          </div>

          {/* Alert Examples */}
          <div className="space-y-2">
            <div className="p-4 bg-success/10 border-l-4 border-success rounded-lg">
              <p className="text-success font-semibold">Success!</p>
              <p className="text-sm">Your answer has been submitted correctly.</p>
            </div>
            <div className="p-4 bg-warning/10 border-l-4 border-warning rounded-lg">
              <p className="text-warning font-semibold">Warning</p>
              <p className="text-sm">Please review your answer before submitting.</p>
            </div>
            <div className="p-4 bg-info/10 border-l-4 border-info rounded-lg">
              <p className="text-info font-semibold">Information</p>
              <p className="text-sm">This topic appears frequently in recent exams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Examples */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Gradient Combinations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <p className="text-white font-bold text-lg">
              Knowledge Spectrum
            </p>
          </div>
          <div className="h-32 rounded-xl bg-gradient-to-br from-highlight-cyan via-highlight-violet to-highlight-pink flex items-center justify-center">
            <p className="text-white font-bold text-lg">
              Study Highlights
            </p>
          </div>
          <div className="h-32 rounded-xl bg-gradient-to-br from-chart-1 via-chart-3 to-chart-5 flex items-center justify-center">
            <p className="text-white font-bold text-lg">
              Data Visualization
            </p>
          </div>
          <div className="h-32 rounded-xl bg-gradient-to-br from-success via-info to-secondary flex items-center justify-center">
            <p className="text-white font-bold text-lg">
              Progressive Learning
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({
  color,
  text,
  label,
  description,
}: {
  color: string;
  text: string;
  label: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={`${color} ${text} h-24 rounded-lg flex items-center justify-center font-semibold transition-all hover:scale-105 hover:shadow-lg`}
      >
        {label}
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
