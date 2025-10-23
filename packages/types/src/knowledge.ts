export enum KnowledgeType {
  SERVICE = 'service',
  TREATMENT = 'treatment',
  FAQ = 'faq',
  PROMOTION = 'promotion',
  POLICY = 'policy',
}

export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  title: string;
  content: string;
  metadata?: {
    price?: number;
    duration?: string;
    category?: string;
    tags?: string[];
    effectiveFrom?: Date;
    effectiveUntil?: Date;
    [key: string]: any;
  };
  searchVector?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchKnowledgeDto {
  query: string;
  type?: KnowledgeType;
  limit?: number;
  includeInactive?: boolean;
}

export interface CreateKnowledgeDto {
  type: KnowledgeType;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface UpdateKnowledgeDto {
  title?: string;
  content?: string;
  metadata?: Record<string, any>;
  active?: boolean;
}

