import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'node:path';
import ExportMessagesData, {
  Message,
  MessageObjectType,
} from 'src/models/ExportMessages.interface';
import TermObject from 'src/models/TermObject.type';
import { createHmac } from 'node:crypto';

@Injectable()
export class DatasetService {
  private terms_words: TermObject[] = [];

  constructor() {
    this.load();
  }

  public get data() {
    return this.terms_words;
  }

  private load(): void {
    const raw_data = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'data', 'messages.json'),
        'utf-8',
      ),
    ) as ExportMessagesData;
    for (const message of raw_data.messages) {
      const parsed_msgs = this.getWordsFromSuitableMsg(message);
      if (!parsed_msgs || parsed_msgs.length === 0) continue;
      for (const parsed_term of parsed_msgs) {
        const existent_id = this.terms_words.findIndex(
          (term) => term.hash === parsed_term.hash,
        );
        if (existent_id === -1) {
          this.terms_words.push(parsed_term);
        } else {
          for (const mean of parsed_term.meanings) {
            this.terms_words[existent_id].meanings.push(mean);
          }
        }
      }
    }
    this.terms_words = this.terms_words
      .flat()
      .filter((t: TermObject) => t.term && t.meanings)
      .map((term) => {
        term.meanings = [...new Set(term.meanings)];
        return term;
      });
  }

  private getWordsFromSuitableMsg(
    message: Message,
  ): TermObject[] | undefined {
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
    return terms.flat();
  }

  private parseWordsPairs(pair: string): TermObject | undefined {
    const splitted = pair.split('-').map((c) => c.replace(/;/, '').trim());
    if (splitted.length === 2)
      return {
        hash: createHmac('sha1', splitted[0]).digest('hex'),
        term: splitted[0],
        meanings: splitted[1].split(',').map((m) => m.trim()),
      };
  }
}
