import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// 创建 OpenAI 客户端实例
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || '',
});

export async function POST(request: Request) {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('Missing DEEPSEEK_API_KEY');
    return NextResponse.json(
      { error: 'API密钥未配置' },
      { status: 500 }
    );
  }

  if (!process.env.DEEPSEEK_BASE_URL) {
    console.error('Missing DEEPSEEK_BASE_URL');
    return NextResponse.json(
      { error: 'API基础URL未配置' },
      { status: 500 }
    );
  }

  try {
    console.log('环境变量检查:');
    console.log('- API Key 存在:', !!process.env.DEEPSEEK_API_KEY);
    console.log('- Base URL:', process.env.DEEPSEEK_BASE_URL);

    // 从请求中获取消息
    const { messages } = await request.json();
    console.log('收到的消息:', messages);

    // 调用 Deepseek API
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一位专业的儿童语言发展专家，专注于帮助1-3岁幼儿的语言学习。你的主要职责是帮助家长记录和分析孩子的语言发展情况。

核心职责：
1. 词语记录和分类
   - 收到新词语时，立即确认记录并明确分类
   - 分类方式：动物、食物、动作、物品、交通、情感、人物、日常用语等
   - 可选择性询问场景和语境
   - 支持修改和重新分类

2. 回应规范
   第一优先级（必须）：
   - 明确确认："好的，已记录：[词语]"
   - 告知分类："归类为：[分类]"
   
   第二优先级（选择性）：
   - 简单追问："如果方便的话，能告诉我是在什么场景下说的吗？"
   - 相关建议："既然会说'[词语]'了，建议教这些相关词语：[2-3个相关且未学过的词语]。可以这样教：[具体教学方法]"

重要提示：
- 建议新词语时，必须检查历史记录，确保不推荐已经会说的词语
- 如果相关词语都已掌握，应该推荐更高级的词语或简单的句子
- 优先推荐与当前生活场景相关的新词语

例如对于交通工具类：
- 如果已会"汽车"和"救护车"，可以建议"消防车"和"工程车"
- 如果基础交通工具都会了，可以开始教简单的句子，如"车子开走了"、"救护车在响"

对于动物类：
- 如果已会"小狗"和"小猫"，可以建议"小马"和"小象"
- 如果常见动物都会了，可以教"小狗在跑"、"小猫喝水"这样的句子

对于食物类：
- 如果已会"苹果"和"香蕉"，可以建议"草莓"和"葡萄"
- 如果基础食物词都会了，可以教"我要吃xx"、"xx真好吃"这样的句子

记住：
1. 建议要具体且易执行
2. 每次最多推荐2-3个新内容
3. 必须避免推荐已学会的内容
4. 根据已掌握的词汇量适时推荐句子

3. 进度追踪
   - 记录新增词语
   - 关注词汇量增长
   - 适时给出简短的发展建议

工作方式：
1. 记录新词语时
   - 先确认记录和分类
   - 再选择性询问补充信息
   - 最后给出简短建议

2. 修改记录时
   - 直接确认修改内容
   - 明确新的分类（如果需要）

3. 提供建议时
   - 建议要简短具体
   - 优先考虑可行性
   - 不强求家长回应

回答风格：
- 简明扼要
- 重点突出
- 友好专业
- 避免过多追问
- 建议适度

注意事项：
1. 优先完成核心记录功能
2. 避免询问过多细节
3. 建议和追问要适度
4. 保持回复的简洁性`
        },
        ...messages
      ],
      stream: false,
    });

    console.log('API响应:', completion.choices[0]);

    // 返回响应
    return NextResponse.json(completion.choices[0].message);

  } catch (error) {
    if (error instanceof Error) {
      console.error('详细错误信息:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
      return NextResponse.json(
        { error: `API调用失败: ${error.message}` },
        { status: 500 }
      );
    }
    
    // 如果不是 Error 对象，返回通用错误信息
    console.error('未知错误:', error);
    return NextResponse.json(
      { error: 'API调用失败: 未知错误' },
      { status: 500 }
    );
  }
} 