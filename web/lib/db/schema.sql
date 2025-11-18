-- 정보관리기술사 학습 플랫폼 스키마

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 답안 테이블
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('정의형', '설명형', '비교형', '절차형', '분석형')),
  level TEXT NOT NULL CHECK (level IN ('basic', 'advanced')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 평가 테이블
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
  criteria TEXT NOT NULL CHECK (criteria IN ('첫인상', '출제반영성', '논리성', '응용능력', '특화', '견해')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 키워드 맵 테이블
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  keyword TEXT NOT NULL,
  definition TEXT,
  related_concepts JSONB DEFAULT '[]',
  difficulty TEXT CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  frequency INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(domain, keyword)
);

-- 학습 진도 테이블
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  completed_topics TEXT[] DEFAULT '{}',
  total_answers INTEGER DEFAULT 0,
  average_score FLOAT DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_topic ON answers(topic);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON answers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_answer_id ON evaluations(answer_id);
CREATE INDEX IF NOT EXISTS idx_keywords_domain ON keywords(domain);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- RLS 정책
-- 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own answers" ON answers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own evaluations" ON evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM answers
      WHERE answers.id = evaluations.answer_id
      AND answers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own progress" ON learning_progress
  FOR ALL USING (auth.uid() = user_id);

-- 키워드는 모두 public 읽기 가능
CREATE POLICY "Keywords are publicly readable" ON keywords
  FOR SELECT USING (true);
