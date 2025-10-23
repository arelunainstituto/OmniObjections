/**
 * Objection Detector Service
 * Detecta objeções nas falas do lead usando NLP
 */

import { Objection, ObjectionCategory, ObjectionDetectionResult } from '@omni/types';

export class ObjectionDetectorService {
  private objections: Objection[] = [];

  /**
   * Carrega objeções da base de dados
   */
  loadObjections(objections: Objection[]): void {
    this.objections = objections.filter((o) => o.active);
  }

  /**
   * Detecta se há uma objeção no texto
   */
  detect(text: string, context?: string): ObjectionDetectionResult {
    const normalizedText = this.normalizeText(text);
    const contextNormalized = context ? this.normalizeText(context) : '';

    // Procurar por padrões que correspondam às objeções conhecidas
    for (const objection of this.objections) {
      for (const pattern of objection.patterns) {
        const normalizedPattern = this.normalizeText(pattern);
        
        if (normalizedText.includes(normalizedPattern)) {
          // Calcular confiança baseada na correspondência
          const confidence = this.calculateConfidence(
            normalizedText,
            normalizedPattern,
            contextNormalized
          );

          if (confidence >= 0.6) {
            return {
              detected: true,
              objection,
              confidence,
              matchedPattern: pattern,
              context: text,
            };
          }
        }
      }
    }

    // Usar heurísticas adicionais para detectar objeções não mapeadas
    const heuristicResult = this.detectByHeuristics(text);
    if (heuristicResult) {
      return heuristicResult;
    }

    return {
      detected: false,
      confidence: 0,
      context: text,
    };
  }

  /**
   * Detecta múltiplas objeções em um texto
   */
  detectMultiple(text: string, context?: string): ObjectionDetectionResult[] {
    const results: ObjectionDetectionResult[] = [];
    const sentences = this.splitIntoSentences(text);

    for (const sentence of sentences) {
      const result = this.detect(sentence, context);
      if (result.detected) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Calcula a confiança da detecção
   */
  private calculateConfidence(
    text: string,
    pattern: string,
    context: string
  ): number {
    let confidence = 0.7; // Base

    // Aumentar confiança se for uma correspondência exata
    if (text === pattern) {
      confidence += 0.2;
    }

    // Aumentar confiança se a palavra-chave estiver isolada
    const patternWords = pattern.split(' ');
    const textWords = text.split(' ');
    const isolatedMatch = patternWords.every((word) => textWords.includes(word));
    if (isolatedMatch) {
      confidence += 0.1;
    }

    // Ajustar confiança baseado no contexto
    if (context && this.hasNegativeContext(context)) {
      confidence += 0.05;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Detecta objeções por heurísticas (palavras-chave gerais)
   */
  private detectByHeuristics(text: string): ObjectionDetectionResult | null {
    const normalizedText = this.normalizeText(text);

    // Heurísticas para preço
    if (
      normalizedText.match(
        /\b(caro|preço|investimento|valor|não posso|não tenho dinheiro)\b/
      )
    ) {
      return {
        detected: true,
        confidence: 0.6,
        context: text,
        objection: {
          category: ObjectionCategory.PRICE,
          keyword: 'preço (detectado)',
        } as Objection,
      };
    }

    // Heurísticas para timing
    if (
      normalizedText.match(
        /\b(pensar|depois|mais tarde|não é o momento|não estou pronto)\b/
      )
    ) {
      return {
        detected: true,
        confidence: 0.6,
        context: text,
        objection: {
          category: ObjectionCategory.TIMING,
          keyword: 'timing (detectado)',
        } as Objection,
      };
    }

    // Heurísticas para confiança
    if (
      normalizedText.match(/\b(não conheço|nunca ouvi|confiável|seguro|garantia)\b/)
    ) {
      return {
        detected: true,
        confidence: 0.6,
        context: text,
        objection: {
          category: ObjectionCategory.TRUST,
          keyword: 'confiança (detectado)',
        } as Objection,
      };
    }

    return null;
  }

  /**
   * Verifica se o contexto tem palavras negativas
   */
  private hasNegativeContext(context: string): boolean {
    const negativeWords = [
      'mas',
      'porém',
      'todavia',
      'contudo',
      'entretanto',
      'não',
      'nunca',
      'problema',
      'difícil',
    ];

    return negativeWords.some((word) => context.includes(word));
  }

  /**
   * Normaliza texto para comparação
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s]/g, '') // Remover pontuação
      .trim();
  }

  /**
   * Divide texto em sentenças
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Obtém estatísticas das objeções detectadas
   */
  getStats(): Record<ObjectionCategory, number> {
    const stats: Record<ObjectionCategory, number> = {
      [ObjectionCategory.PRICE]: 0,
      [ObjectionCategory.TIMING]: 0,
      [ObjectionCategory.COMPETITION]: 0,
      [ObjectionCategory.TRUST]: 0,
      [ObjectionCategory.NEED]: 0,
      [ObjectionCategory.AUTHORITY]: 0,
      [ObjectionCategory.OTHER]: 0,
    };

    this.objections.forEach((objection) => {
      stats[objection.category]++;
    });

    return stats;
  }
}

