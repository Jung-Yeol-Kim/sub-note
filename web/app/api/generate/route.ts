import { streamText } from 'ai'
import { model } from '@/lib/ai/client'

export const runtime = 'edge'

const SYSTEM_PROMPT = `당신은 정보관리기술사 시험 답안 작성 전문가입니다.

다음 원칙을 따라 답안을 작성하세요:

## 구조: 서론-본론-결론

### 서론 (2-3문장)
- 토픽의 정의 (특징, 목적, 기술 포함)
- 신기술: 등장 배경과 혁신성 강조
- 성숙기술: 필요성과 중요성 강조
- 명사형으로 종결

### 본론
1) 그림 (다이어그램)
   - 아키텍처/프로세스/흐름 시각화
   - ASCII 아트 또는 마크다운 표현
   - 화살표로 흐름 표시
   - 간글: 그림에 대한 2-3문장 설명

2) 표 (3단 구조)
   | 구분 | 세부 항목 | 설명 |
   - 논리적 그룹핑
   - 키워드 명확히
   - 간글: 표에 대한 2-3문장 설명

### 결론 (2-3문장)
- 성숙기술: 현재 한계점과 해결 방안
- 신기술: 응용 분야와 발전 방향
- 기대 효과 및 트렌드

## 작성 스타일
- 조사 생략: "DevOps는" → "DevOps"
- 간결하고 명료한 표현
- 핵심 키워드 강조
- 1페이지 분량으로 압축

## 6대 평가 기준 반영
1. 첫인상: 구조적/시각적 완성도
2. 출제반영성: 문제 의도 정확히 파악
3. 논리성: 계층적 구조, 자연스러운 흐름
4. 응용능력: 실무 연계, 설명력
5. 특화: 전문 용어, 최신 트렌드
6. 견해: 통찰력 있는 의견, 독창성`

export async function POST(req: Request) {
  try {
    const { topic, questionType, level } = await req.json()

    if (!topic || !questionType || !level) {
      return new Response('Missing required fields', { status: 400 })
    }

    const techMaturity = level === 'advanced' ? 'mature' : 'new'

    const userPrompt = `다음 주제에 대한 ${level === 'advanced' ? '고득점' : '초보'} 수준의 답안을 작성해주세요.

주제: ${topic}
문제 유형: ${questionType}
기술 성숙도: ${techMaturity === 'mature' ? '성숙 기술' : '신기술'}

${questionType}에 맞는 구조로 작성하고, ${level === 'advanced' ? '전문가적 관점과 통찰력을 담아' : '기본 개념 중심으로'} 답안을 작성해주세요.`

    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error generating answer:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
