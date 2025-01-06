import { kv } from '@vercel/kv';

// 生成唯一ID的函数
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// 词语记录的类型定义
export interface WordRecord {
  id: string;
  word: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  context?: string;
  pronunciation?: string;
  notes?: string;
  relatedWords?: string[];
  isPartOfSentence?: boolean;
}

// 将 WordRecord 转换为普通对象的辅助函数
function toPlainObject(record: WordRecord): Record<string, unknown> {
  return Object.entries(record).reduce((acc, [key, value]) => {
    acc[key] = value === undefined ? null : value;
    return acc;
  }, {} as Record<string, unknown>);
}

// 将普通对象转换回 WordRecord 的辅助函数
function toWordRecord(record: Record<string, unknown>): WordRecord {
  return {
    id: String(record.id),
    word: String(record.word),
    category: String(record.category),
    createdAt: Number(record.createdAt),
    updatedAt: Number(record.updatedAt),
    context: record.context ? String(record.context) : undefined,
    pronunciation: record.pronunciation ? String(record.pronunciation) : undefined,
    notes: record.notes ? String(record.notes) : undefined,
    relatedWords: Array.isArray(record.relatedWords) ? record.relatedWords.map(String) : undefined,
    isPartOfSentence: record.isPartOfSentence ? Boolean(record.isPartOfSentence) : undefined,
  };
}

// 数据库操作类
export class WordsDB {
  // 添加新词语
  static async addWord(wordData: Omit<WordRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<WordRecord> {
    const now = Date.now();
    const id = generateId();
    
    const wordRecord: WordRecord = {
      id,
      word: wordData.word,
      category: wordData.category,
      context: wordData.context,
      pronunciation: wordData.pronunciation,
      notes: wordData.notes,
      relatedWords: wordData.relatedWords,
      isPartOfSentence: wordData.isPartOfSentence,
      createdAt: now,
      updatedAt: now,
    };

    // 存储词语记录
    await kv.hset(`word:${id}`, toPlainObject(wordRecord));
    
    // 添加到分类集合
    await kv.sadd(`category:${wordRecord.category}`, id);
    // 添加到时间线
    await kv.zadd('timeline', { score: now, member: id });

    return wordRecord;
  }

  // 获取词语记录
  static async getWord(id: string): Promise<WordRecord | null> {
    const record = await kv.hgetall(`word:${id}`);
    if (!record || Object.keys(record).length === 0) return null;
    return toWordRecord(record);
  }

  // 获取某个分类的所有词语
  static async getWordsByCategory(category: string): Promise<WordRecord[]> {
    const ids = (await kv.smembers(`category:${category}`)).map(String);
    const words = await Promise.all(
      ids.map(id => this.getWord(id))
    );
    return words.filter((word): word is WordRecord => word !== null);
  }

  // 获取最近添加的词语
  static async getRecentWords(limit: number = 10): Promise<WordRecord[]> {
    const ids = (await kv.zrange('timeline', -limit, -1)).map(String);
    const words = await Promise.all(
      ids.map(id => this.getWord(id))
    );
    return words.filter((word): word is WordRecord => word !== null);
  }

  // 更新词语记录
  static async updateWord(id: string, updates: Partial<WordRecord>): Promise<WordRecord | null> {
    const word = await this.getWord(id);
    if (!word) return null;

    const updatedWord: WordRecord = {
      ...word,
      ...updates,
      id,
      updatedAt: Date.now(),
    };

    // 存储更新后的记录
    await kv.hset(`word:${id}`, toPlainObject(updatedWord));
    
    // 如果分类改变了，需要更新分类索引
    if (updates.category && updates.category !== word.category) {
      await kv.srem(`category:${word.category}`, id);
      await kv.sadd(`category:${updates.category}`, id);
    }

    return updatedWord;
  }

  // 删除词语记录
  static async deleteWord(id: string): Promise<boolean> {
    const word = await this.getWord(id);
    if (!word) return false;

    await kv.del(`word:${id}`);
    await kv.srem(`category:${word.category}`, id);
    await kv.zrem('timeline', id);

    return true;
  }

  // 获取所有分类的统计信息
  static async getCategoryStats(): Promise<Record<string, number>> {
    const categories = [
      "动物", "食物", "动作", "物品", "交通",
      "情感", "人物", "日常用语", "其他"
    ];

    const stats: Record<string, number> = {};
    await Promise.all(
      categories.map(async (category) => {
        stats[category] = await kv.scard(`category:${category}`);
      })
    );

    return stats;
  }
} 