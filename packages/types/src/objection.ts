export enum ObjectionCategory {
  PRICE = 'price',
  TIMING = 'timing',
  COMPETITION = 'competition',
  TRUST = 'trust',
  NEED = 'need',
  AUTHORITY = 'authority',
  OTHER = 'other',
}

export interface Objection {
  id: string;
  keyword: string;
  category: ObjectionCategory;
  patterns: string[];
  defaultReply: string;
  priority: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ObjectionDetectionResult {
  detected: boolean;
  objection?: Objection;
  confidence: number;
  matchedPattern?: string;
  context: string;
}

export interface CreateObjectionDto {
  keyword: string;
  category: ObjectionCategory;
  patterns: string[];
  defaultReply: string;
  priority?: number;
}

export interface UpdateObjectionDto {
  keyword?: string;
  category?: ObjectionCategory;
  patterns?: string[];
  defaultReply?: string;
  priority?: number;
  active?: boolean;
}

