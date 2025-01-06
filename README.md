# 宝宝说（BabyTalk）项目需求文档

## 项目概述
"宝宝说"（BabyTalk）是一个基于Deepseek大模型的智能语言学习记录和辅导系统，专注于帮助1-3岁幼儿的语言发展。系统通过智能对话界面，帮助家长记录和分析孩子已掌握的词语和句子，并提供科学的语言教育建议。

## 核心目标
- 通过智能对话实现便捷的语言学习记录
- 直观展示语言发展状况
- 提供个性化的语言教育建议
- 帮助家长更好地引导孩子的语言发展

## 功能设计

### 1. 智能对话系统
- 自然语言交互界面
- 支持多种对话场景：
  * 记录新词语/句子
  * 修改已有记录
  * 调整分类标签
  * 查询发展建议
  * 获取教育方法
- 上下文理解和记忆
- 智能纠错和确认机制

### 2. 词语记录系统
- 通过对话或快速录入新词语/句子
- AI自动进行语义分类（如：动物、食物、动作等）
- 支持通过对话修改和完善记录
- 记录学习时间和上下文
- 支持按类别管理和查看
- 支持添加备注和标记

### 3. 可视化展示系统
- 词语图谱展示
  * 按类别组织的思维导图
  * 词语关联关系展示
  * 交互式浏览和查询
- 数据统计面板
  * 总词汇量统计
  * 各类别词汇数量
  * 学习进度曲线
  * 最近学习记录
- 定期学习报告
  * 阶段性进步总结
  * 重点突破项目
  * 下一阶段目标建议

### 4. AI辅导建议系统
- 基于已掌握词汇推荐新词
- 根据语言发展规律给出建议
- 提供针对性的教学方法
- 回答家长的教育问题
- 生成个性化学习计划

## 界面设计

### 多页面设计
1. 主页（首页）
   - 左侧信息栏：
     * 数据概览（核心数据卡片）
     * 最近学习记录（时间轴展示）
     * 分类统计（简洁饼图）
     * 图谱预览（简化版图谱）
   - 右侧对话区：
     * AI对话窗口
     * 消息输入框
   - 所有预览模块支持点击跳转至对应详情页面

2. 词语图谱页面
   - 交互式图谱展示
   - 分类导航
   - 搜索和筛选
   - 词语详情查看
   - 编辑功能入口

3. 数据统计页面
   - 总体统计数据
   - 各类别统计
   - 学习进度曲线
   - 定期学习报告
   - 数据导出功能

4. 设置页面
   - 个人信息设置
   - 数据管理
   - 备份还原
   - 主题设置
   - 其他配置

### 导航设计
- 桌面端：顶部导航栏
  * Logo和品牌名称靠左
  * 导航菜单靠右
  * 简约的背景色变化交互
  * 清新的蓝色主题
- 移动端：底部标签栏
  * 首页
  * 图谱
  * 统计
  * 设置

### 设计风格
- 清新活泼的配色
- 简洁直观的布局
- 重要数据突出显示
- 图谱展示美观大方
- 响应式设计，适配各种屏幕
- 移动端优先的交互体验

## 使用流程

### 日常记录
- 快速录入新词语/句子
- AI自动分类并更新图谱
- 获取针对性建议
- 查看进步情况

### 定期回顾
- 浏览词语图谱
- 查看统计数据
- 阅读学习报告
- 规划学习目标

## 数据管理
- 自动保存所有记录
- 支持数据导出备份
- 定期生成学习报告
- 长期追踪发展曲线

## 技术方案

### 开发框架
- 前端框架：Next.js 14（App Router）
- UI框架：Tailwind CSS
- 状态管理：React Context + Hooks
- 图谱展示：D3.js/ECharts

### 部署环境
- 部署平台：Vercel
- 数据库：Upstash（Serverless Redis数据库）
- API路由：Vercel Serverless Functions

### 核心技术特点
1. **数据存储**
   - 词语和句子结构化存储
   - 自动分类标签系统
   - 时间序列记录
   - 关联关系管理
   - 使用Upstash Redis作为主数据库
     * 支持高性能的读写操作
     * 自动数据备份和恢复

   数据结构设计：
   ```typescript
   // 词语记录的类型定义
   interface WordRecord {
     // 基本信息
     id: string;           // 唯一标识符
     word: string;         // 词语内容
     category: string;     // 分类（动物/食物/动作等）
     createdAt: number;    // 记录时间戳
     updatedAt: number;    // 最后更新时间戳
     
     // 详细信息
     context?: string;     // 使用场景/上下文
     pronunciation?: string; // 发音情况（标准/不标准等）
     notes?: string;       // 额外备注
     
     // 关联信息
     relatedWords?: string[]; // 相关词语
     isPartOfSentence?: boolean; // 是否已经能用于造句
   }

   // 核心数据存储结构
   // 1. 词语记录：word:{id} -> Hash存储完整记录
   // 2. 分类索引：category:{name} -> Set存储该分类下的词语ID
   // 3. 时间线：timeline -> SortedSet按时间存储词语ID

   // 分类的类型定义
   type WordCategory =
     | "动物"
     | "食物"
     | "动作"
     | "物品"
     | "交通"
     | "情感"
     | "人物"
     | "日常用语"
     | "其他";
   ```

2. **API集成**
   - Deepseek API集成在Serverless Functions中
   - 实现智能分类和建议
   - 安全的API密钥管理
   - 技术细节：
     * 使用 OpenAI SDK 调用
     * Base URL: https://api.deepseek.com
     * 使用 deepseek-chat 模型（DeepSeek-V3）
     * 支持流式输出（stream 模式）
     * 需要配置的环境变量：
       - API Key
       - Base URL
       - Upstash Redis URL
       - Upstash Redis Token

3. **可视化实现**
   - 使用D3.js/ECharts实现图谱
   - 支持交互式操作
   - 自适应布局
   - 动态数据更新

4. **AI角色设定**
   - 语言发展专家角色
   - 根据年龄特点给出建议
   - 科学的教育方法指导
   - 积极正向的反馈机制

## 项目开发阶段

### 第一阶段：基础功能（MVP）
- [✓] 搭建Next.js项目基础框架
- [✓] 实现简单的对话界面
- [✓] 接入Deepseek API基础功能
- [✓] 设计基础AI角色提示词
- [✓] 实现智能对话的核心功能：
  * [✓] 词语录入对话流程
  * [✓] 记录修改对话流程
  * [✓] 分类调整对话流程
- [✓] 实现基础的词语存储功能
- [✓] 部署到Vercel验证可用性

### 第二阶段：多页面架构与数据展示
- [✓] 导航组件开发：
  * [✓] 创建独立导航组件
  * [✓] 实现页面状态管理
  * [✓] 响应式布局适配
  * [✓] 从MainLayout中解耦
  * [✓] 优化MainLayout支持可选侧边栏
  * [✓] 导航样式优化：
    - 简化Logo为简约气泡设计
    - 统一使用清新蓝色主题
    - 增大导航文字尺寸
    - 简化交互为背景色变化
    - 采用两端对齐的布局

- [ ] 基础数据API开发：
  * 实现词汇统计API（总量/分类/趋势）
  * 优化数据查询性能
  * 添加数据缓存机制

- [ ] 统计页面开发：
  * 页面布局设计
  * 核心统计卡片
  * 趋势图表实现
  * 分类统计图表
  * 数据导出功能

- [ ] 首页改版：
  * 左侧信息栏布局
  * 数据概览（简化版统计）
  * 最近记录（优化展示）
  * 分类统计（简化版图表）

- [ ] 词语图谱页面：
  * 页面布局设计
  * 气泡树形结构
  * 交互动画效果
  * 节点样式设计
  * 搜索和筛选

- [ ] 交互优化：
  * 页面切换动画
  * 数据加载状态
  * 错误处理机制
  * 响应式适配

### 第三阶段：教育建议
- [ ] 智能建议系统：
  * 建议展示界面设计
  * 场景推荐卡片样式
  * 交互动效优化
- [ ] 学习计划功能：
  * 计划展示界面设计
  * 进度追踪可视化
  * 练习建议展示样式

### 第四阶段：体验优化
- [ ] 移动端适配：
  * 响应式布局调整
  * 触摸交互优化
  * 移动端专属样式
- [ ] 体验优化：
  * 加载状态设计
  * 错误提示样式
  * 操作反馈效果
- [ ] 设置页面：
  * 页面布局设计
  * 表单交互优化
  * 主题切换效果

### 验收标准
每个阶段的验收标准：
1. 功能完整可用
2. 界面美观易用
3. 性能表现良好
4. 数据存储可靠
5. 用户体验良好

### 风险控制
- 每个阶段都先实现最小可用版本
- 在进入下一阶段前确保当前阶段稳定
- 保持频繁的功能验证和反馈
- 做好数据备份和保护
- 预留足够的调试和优化时间

