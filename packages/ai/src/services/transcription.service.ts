/**
 * Transcription Service
 * Transcreve áudio usando OpenAI Whisper API
 */

import OpenAI from 'openai';
import { AIConfig, getAIConfig } from '../config';
import { Speaker, TranscriptSegment } from '@omni/types';

export interface TranscriptionOptions {
  language?: string;
  prompt?: string;
  temperature?: number;
}

export interface TranscriptionResult {
  text: string;
  duration: number;
  confidence: number;
  language: string;
}

export class TranscriptionService {
  private openai: OpenAI;
  private config: AIConfig;

  constructor(config?: AIConfig) {
    this.config = config || getAIConfig();
    this.openai = new OpenAI({
      apiKey: this.config.openaiApiKey,
    });
  }

  /**
   * Transcreve um buffer de áudio
   */
  async transcribe(
    audioBuffer: Buffer,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      const file = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

      const transcription = await this.openai.audio.transcriptions.create({
        file,
        model: this.config.whisperModel || 'whisper-1',
        language: options.language || this.config.language || 'pt',
        prompt: options.prompt,
        temperature: options.temperature || 0,
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        duration: (transcription as any).duration || 0,
        confidence: 1.0, // Whisper não retorna confidence, assumir alto
        language: transcription.language || 'pt',
      };
    } catch (error: any) {
      console.error('Erro ao transcrever áudio:', error);
      throw new Error(`Falha na transcrição: ${error.message}`);
    }
  }

  /**
   * Detecta quem está falando (lead ou comercial)
   * Esta é uma implementação simplificada. Em produção, você usaria
   * diarização de speakers ou análise de padrões de fala
   */
  detectSpeaker(
    _text: string,
    previousSegments: TranscriptSegment[]
  ): Speaker {
    // Estratégia simples: alternar entre speakers
    if (previousSegments.length === 0) {
      return Speaker.COMERCIAL; // Primeira fala é geralmente do comercial
    }

    const lastSpeaker = previousSegments[previousSegments.length - 1].speaker;
    return lastSpeaker === Speaker.COMERCIAL ? Speaker.LEAD : Speaker.COMERCIAL;
  }

  /**
   * Cria um segmento de transcrição completo
   */
  createSegment(
    result: TranscriptionResult,
    speaker: Speaker,
    startTime: number
  ): TranscriptSegment {
    return {
      id: `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: result.text,
      speaker,
      timestamp: Date.now(),
      startTime,
      endTime: startTime + result.duration * 1000,
      confidence: result.confidence,
    };
  }

  /**
   * Limpa e normaliza o texto transcrito
   */
  cleanText(inputText: string): string {
    return inputText
      .trim()
      .replace(/\s+/g, ' ') // Remover espaços múltiplos
      .replace(/\.{2,}/g, '.') // Remover pontos múltiplos
      .toLowerCase();
  }
}

