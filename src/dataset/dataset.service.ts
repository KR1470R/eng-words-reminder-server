import { Injectable } from '@nestjs/common';
import fs from 'fs';
import ExportMessagesData, {
  Message,
  MessageObjectType,
} from 'src/models/ExportMessages.interface';
import TermObject from 'src/models/TermObject.type';
import { createHmac } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class DatasetService {
  private readonly logger = new Logger();
  private terms_words: TermObject[] = [];
  private data_path: string;

  constructor(private configService: ConfigService) {
    this.data_path = this.configService.get('DATA_PATH');
    if (this.configService.get('SERVER_ENV') === 'demo') {
      this.logger.warn('Skipping dataset loading on demo');
    } else this.load();
  }

  public get data() {
    return this.terms_words;
  }

  private load(): void {
    const raw_data = JSON.parse(
      fs.readFileSync(this.data_path, 'utf-8'),
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
