import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-heading font-bold text-foreground mb-6">
            정보관리기술사
            <span className="block text-primary mt-2">학습 플랫폼</span>
          </h1>
          <p className="text-xl text-secondary font-body max-w-2xl mx-auto mb-8">
            AI를 활용한 체계적인 답안 작성과 평가로
            정보관리기술사 시험을 준비하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/generate"
              className="px-8 py-4 bg-primary text-white font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              답안 생성 시작하기
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white dark:bg-brand-dark border-2 border-primary text-primary font-heading font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              기능 살펴보기
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="✨"
            title="AI 답안 생성"
            description="Claude AI를 활용하여 고득점 답안을 자동으로 생성합니다"
            color="brand-orange"
          />
          <FeatureCard
            icon="📊"
            title="6대 평가 기준"
            description="첫인상, 출제반영성, 논리성, 응용능력, 특화, 견해 기준으로 평가합니다"
            color="brand-blue"
          />
          <FeatureCard
            icon="🎯"
            title="초보 vs 고득점 비교"
            description="같은 주제로 초보와 고득점 답안을 비교하며 학습합니다"
            color="brand-green"
          />
        </div>

        {/* Answer Structure */}
        <div className="bg-muted rounded-2xl p-12">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-8 text-center">
            서론-본론-결론 구조
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-6 border border-primary">
              <h3 className="text-xl font-heading font-semibold text-primary mb-3">
                서론
              </h3>
              <ul className="text-sm text-foreground font-body space-y-2">
                <li>• 명확한 정의</li>
                <li>• 특징, 목적, 기술</li>
                <li>• 명사형 종결</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 border border-accent">
              <h3 className="text-xl font-heading font-semibold text-accent mb-3">
                본론
              </h3>
              <ul className="text-sm text-foreground font-body space-y-2">
                <li>• 아키텍처 다이어그램</li>
                <li>• 3단 구조 표</li>
                <li>• 각 항목별 간글</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 border-2 border-brand-green">
              <h3 className="text-xl font-heading font-semibold" style={{ color: '#788c5d' }}>
                결론
              </h3>
              <ul className="text-sm text-foreground font-body space-y-2">
                <li>• 한계점과 해결방안</li>
                <li>• 발전 방향</li>
                <li>• 기대 효과</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-secondary font-body mb-8">
            첫 답안을 생성하고 AI의 피드백을 받아보세요
          </p>
          <Link
            href="/generate"
            className="inline-block px-8 py-4 bg-primary text-white font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            답안 생성하기 →
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string
  title: string
  description: string
  color: string
}) {
  return (
    <div className="bg-white dark:bg-brand-dark border border-muted rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className={`text-xl font-heading font-semibold mb-3 text-${color}`}>
        {title}
      </h3>
      <p className="text-secondary font-body">
        {description}
      </p>
    </div>
  )
}
