import { Injectable } from '@nestjs/common';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import ExportMessagesData, {
  Message,
  MessageObjectType,
} from 'src/models/ExportMessages.interface';
import TermObject from 'src/models/TermObject.type';

@Injectable()
export class DatasetService {
  private path: string;
  private terms_words: TermObject[] = [];

  constructor() {
    this.path = process.env.DATA_PATH;
    this.load();
  }

  private load(): void {
    const raw_data = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'data', 'messages.json'),
        'utf-8',
      ),
    ) as ExportMessagesData;
    for (const message of raw_data.messages) {
      const parsed = this.getWordsFromSuitableMsg(message);
      if (!parsed) continue;
      this.terms_words = [...this.terms_words, ...parsed];
    }
    this.terms_words = this.terms_words
      .flat()
      .filter((t: TermObject) => t.term && t.meanings);
  }

  private getWordsFromSuitableMsg(message: Message): TermObject[] | undefined {
    const commands = message.text_entities.filter(
      (msg: MessageObjectType) => msg.type === 'bot_command',
    );
    if (commands.length === 0) return;
    const terms = [];
    const plain_msgs = message.text_entities
      .filter((msg: MessageObjectType) => msg.type === 'plain')
      .map((msg: MessageObjectType) => msg.text);
    for (const txt of plain_msgs) {
      const word_pairs = txt
        .split('\n')
        .filter((c: string) => c && c.length)
        .map((p) => this.parseWordsPairs(p))
        .filter((t) => t !== undefined);
      if (word_pairs) terms.push(word_pairs);
    }
    return terms;
  }

  private parseWordsPairs(pair: string): TermObject | undefined {
    const splitted = pair.split('-').map((c) => c.replace(/;/, '').trim());
    if (splitted.length === 2)
      return {
        term: splitted[0],
        meanings: splitted[1].split(',').map((m) => m.trim()),
      };
  }
}
