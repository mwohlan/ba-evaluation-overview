import type { Timestamp } from '@firebase/firestore'

export interface Settings {
  loadDbIntoMemory: boolean
  parallelizePipeline: boolean
  parallelizeSparqlQueries: boolean
}

export interface MetricConfig {
  name: string
  resourceNormalizer: string
  weight: number
  normalzingStrategy: string
}

export interface NlpConfig {
  nGrams: string
  formatters: string[]
  wordAlternatives: string[]
  additionalWords: string[]
}

export interface RuntimeStats {
  totalTime: number
  numberOfQuestions: number
  totalQuestionProcessingTime: number
  averageQuestionProcessingTime: number
  numberOfQueries: number
  totalQueryTime: number
  averageQueryTime: number
}

export interface Answer {
  query: string
  values: string[]
  fScore: number
}

export interface ResourceScore {
  metric: string
  score: number
  normalizer: string
}

export interface Resource {
  name: string
  resourceScores: ResourceScore[]
}

export interface QuestionResult {
  created: Timestamp
  id: number
  fScore: number
  originalQuestion: string
  answers: Answer[]
  resources: Resource[]
  benchQuery: string
  benchAnswers: string[]
  benchResources: string[]
  likelyFailReasons: string[]
  evaluationId: string
}

export interface EvaluationResult {
  runtimeStats: RuntimeStats
  avgFScore: number
  questionResults: QuestionResult[]
}

export interface TrainingConfig {
  trainingFilter: number[]
  testFilter: number[]
  testSet: string
  trainingSet: string
}

export interface Evaluation {
  settings: Settings
  metricConfigs: MetricConfig[]
  nlpConfig: NlpConfig
  created: Timestamp
  trainingKey: number
  firestoreId: string
  evaluationResult: EvaluationResult
  trainingConfig: TrainingConfig
}

export interface TotalScore {
  raw: number
  normalized: number
  weighted: number
  normalizedWeighted: number
}

export interface Score {
  weight: number
  raw: number
  normalized: number
  weighted: number
  normalizedWeighted: number
}

export interface QueryScore {
  metric: string
  score: Score
}

export interface QueryTemplate {
  created: Timestamp
  template: string
  totalScore: TotalScore
  queryScores: QueryScore[]
  resources: Resource[]
  answers: Answer[]
  evaluationId: string
  questionId: number
}

export interface CorrectAnswer {
  query: string
  values: string[]
}

export interface Question {
  id: number
  nGrams: string[]
  additionalWords: string[]
  evaluationId: string
  created: Timestamp
  matchedItems: string[]
  matchedProperties: string[]
  correctAnswer: CorrectAnswer
}
