---
slug: my-first-agent-project
title: 我的Agent处女作
date: 2026-03-06
authors: [beststar]
tags: [技术]
keywords: [AI,Agent,技术原理]
image: https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/cover.png
---

本是传统派的我在读研最初便与师兄说明自己抵触参与大模型应用相关方向，觉得它不过是一种ChatBot没什么营养。如今AI又发展了两年，当自己真正站在时代的风口，只感觉手足无措，时代裹挟下的个人坚守实在愚蠢，底线突破只在一瞬之间，大呼真香。

<!-- truncate -->

## 写在最前
欢迎访问并使用我的[AI Agent](https://www.agentstar.online/)。

![我的处女作1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/cover.png)
> BestStar AI Agent V1.0

目前经过迭代已接入[DeepSeek-V4](https://platform.deepseek.com/)，支持切换使用flash和pro模型，UI界面也进行了更新，暂不适配移动端显示效果，后续会继续完善。
![我的处女作2](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/agent2.png)
> BestStar AI Agent V2.0

AI发展的速度超乎了我们的想象，在读研刚进组时24年中旬，我们还在用着网页版的KIMI复制粘贴代码来写Python脚本，在这不到两年的时间里，我个人经历了KIMI、Grok、Copilot、Claude Code、Gemini、Cursor等等一些列AI相关产品，目睹着AI对产业的一次次产生的革命性影响，对它的看法也从悄然改变，从原本的抵触（本科时我从未使用过ChatGPT，当时还是3.5版本，只在做毕设写论文时用过文心一言降重）到现在的共生。

## 学习契机
正如开篇所讲，我本身是一个很抵触大模型应用相关方向的人，但自gemini 3.0问世后风向明显开始有些不对了，研发岗的工作受到了很大冲击，一个令人毛骨悚然的现实是，去年25年过年时火遍全网的新闻是国产大模型 DeepSeek 的发布问世，而仅一年时间，26年年初已是 OpenClaw 的全网爆火，无数个人开发者的产出的概念新颖的 Agent 一天天刷新着排行榜，我意识到不能再一意孤行下去了，再不与时代接轨真的有被淘汰的风险。

于是为了拓展自己的比较优势与横向技术栈，我决定转变态度，开始彻底拥抱AI Agent相关的技术，尝试自己去做一些Agent应用。

## 基础知识补习
在此之前，读研的一年半时间里，我没少听过这方面的名词：LangChain、LangGraph、Ollama、RAG、MCP、Skills......但这些东西都是什么我完全没有了解。AI Agent给我的第一印象就是它像是个名词学工程，没过几天就蹦出个新词，一个新名词就又是一个新技术，技术更迭速度之快以至于网友锐评：AI时代，只要你学的够慢，就可以什么都不用学。
![学的慢](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/slow.png)

就像 OpenClaw 刚在全网爆火的时候，个人开发者争先通过 Claude Code 来帮助自己在本地部署，甚至出现腾讯深圳总部大楼下腾讯云的工程师免费帮安装 OpenClaw 的情况，被大家戏称新时代“领鸡蛋”，当然其实也是腾讯云为了推销自家的轻量级应用服务器。不过只要晚一步上手尝试，就完全不用自己尝试，现在微信、支付宝等等大厂自家的app都接入了 OpenClaw ，已经不用自己费劲部署，拿来用就行了。
![腾讯安虾](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/openclaw.jpg)

但是为了能自己亲手搭建出一个agent应用，我觉得从头了解一遍相关概念还是有必要的，不过倒是不用过于深刻地去理解其中原理，毕竟我也不是这方面的专家，如果你想在这方面深入学习甚至以此求职，可以参考这个[仓库](https://github.com/bcefghj/ai-agent-interview-guide)。

下面简单介绍一下我个人对这些概念的理解。

### 大语言模型LLM——一切的起点
LLM 本质上是根据上文，来预测下一个字的“文字接龙引擎”，LLM 没有记忆，不会联网，不会执行任务，只是个强大的文本生成器。于是为了使 LLM 听话，就有了：
- **Prompt**：提示词，给 LLM 的输入文本，告诉它要做什么。
- **Context**：上下文，LLM 生成文本时可以参考的文本信息，通常是 Prompt 的一部分。
- **Memory**：记忆，LLM 生成文本时可以参考的文本信息，通常是 Prompt 的一部分，但它是动态变化的，可以在 Agent 应用中不断更新。将历史对话拼入上下文，实现多轮对话。

### Agent智能体
LLM 的问题在于它自己不会查资料、不会写文件、不会调接口，于是在外层为它包装一层程序，就有了 Agent 智能体，作为“调度器”。

Agent需要完成的工作是：
- 理解用户需求；
- 判断是否需要查阅资料、调用工具；
- 将结果拼回 Prompt 返回给 LLM；
- 将最终结果返回给用户；

Agent本身并不具备智能，它只是把“不需要智能的固定逻辑”写成了代码，真正的语言理解还是 LLM 在做。

### LLM致命问题
LLM 存在着两个致命的问题——**训练数据过时**以及**幻觉**。

**训练数据过时**很好理解，为什么大模型厂商一直在不断迭代推出自家模型的新版本，一方面是在模型技术上不断优化，另一方面也是在不断更新训练数据。就好比我们人类的知识也会过时一样，LLM 的知识也会过时，所以需要不断地更新训练数据来让它跟上时代的步伐。

**幻觉**是指 LLM 生成的文本虽然看起来很合理，但实际上是完全错误的。比如让它写一段代码，生成的代码看起来很合理，但实际上是完全无法运行的。你一定遇到过在用 AI 辅助写论文时，他为你生成了一大段他说服了自己的文本或参考文献，事实上文本根本逻辑不合理、参考文献根本不存在的情况。

为了解决这两个问题，于是为 Agent 引入了：
- **Search**：联网搜索，让 Agent 具备查找事实公开数据的能力，解决训练数据过时问题。在这里推荐一个联网搜索API——[Tavily](https://www.tavily.com/)。
- **RAG**：即 Retrieval Augmented Generation，检索增强生成，让 Agent 具备查找私有数据的能力，解决训练数据过时问题。RAG 的核心思想是将用户输入的查询与一个文档库中的文档进行匹配，找到相关的文档，然后将这些文档作为上下文提供给 LLM，让它在生成文本时参考这些文档，从而提高生成文本的准确性和相关性。

本质上都是为了给 LLM 补充外部知识，解决它“缺少数据”、“编造”的问题。

### 工具调用
但现在大模型只能输出自然语言，我们写出的代码并不能理解解析自然语言，为了让代码也可以解析大模型的输出结果，于是我们约定大模型的输出格式为JSON结构，来告诉大模型需要调用什么工具，这便是Function Calling。

Function Calling 是一种协议而不是一种技术，只是目前已基本弃用，被Tool Calling和MCP取代了。

### MCP——多模态工具调用
随着大模型需要调用的工具越来越多，为了让这些别调用的工具能标准化接入，就需要统一他们的规范：
- 工具如何注册？
- 参数如何传递？
- 输出如何返回？

这套规范就是 MCP（Multi-modal Tool Calling Protocol，多模态工具调用协议）。MCP 定义了工具的注册、参数传递和输出返回的标准化流程，使得不同的工具可以无缝接入 Agent 应用中。

![MCP](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/mcp.png)

### 复杂任务
当任务变长变复杂，为了能够处理复杂任务，于是就有了：
- **LangChain**：一个开源框架，提供了构建 Agent 应用的基础设施和工具，帮助开发者快速搭建自己的 Agent 应用。
- **Workflow**：工作流，指的是一系列有序的任务步骤，Agent 可以按照预定义的工作流来执行复杂任务。
- **Skills**：技能，指的是 Agent 可以执行的具体功能模块，比如查询天气、翻译文本、生成代码等。通过组合不同的技能，Agent 可以完成更复杂的任务。
- **SubAgent**：子智能体，指的是在一个主智能体中嵌套的智能体，可以独立执行特定的任务，主智能体可以调用子智能体来完成更复杂的任务。

他们的目的都是为了在保证**稳定**的前提下，降低开发与使用成本。

总体来说，LLM 负责“理解与生成”，Agent 负责“调度与执行”。

### Harness Engineering
对于Harness Engineering这个概念，我个人的理解是：

如果说 LLM 是一切的核心，那么 Agent 就是包裹在 LLM 外层以更好使用 LLM 的“外壳”程序，而为了更好地使用Agent，就需要一个“外壳的外壳”，也就是以上提到的Prompt、Context、Memory、Search、RAG、Function Calling、MCP、Workflow、Skills、SubAgent等等这些东西的集合体，而为了让这个集合体更好地发挥作用，就要对他们进行调校整合，进行“Harness”，这个聚合整合成的套在Agent外层的“外壳的外壳”就是Harness Engineering。

LLM 决定了 Agent 能力的上限，而 Harness Engineering 则决定了 Agent 能力的发挥程度的下限。

### Agent与MCP和API
Agent 是面向任务目标的智能体，它本身并不关心底层技术实现，也就是 Agent 并不清楚且不需要清楚它调用的工具是通过Function Calling、Tool Calling还是MCP来调用的。Agent只需要知道它需要调用一个工具，传递什么参数，得到什么结果就可以了。

MCP 是 Agent 的“API”，Agent 通过调用第三方服务的API来与第三方服务进行交互。

![AMA](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/ama.png)

### Skills
最近（2026年3月）AI Agent领域依然较火的概念应该算是 Skills 了，Skills 是 Agent 的技能模块，指的是Agent可以执行的具体功能模块，比如查询天气、翻译文本、生成代码等。通过组合不同的技能，Agent可以完成更复杂的任务。它更像是 Agent 使用 MCP 完成一些任务时，产生的重复性工作整合成的工具包，所以事实上常说的 Skills 替代 MCP 的说法并不准确，MCP 是工具调用的协议，而 Skills 是工具调用的工具包，二者是不同层次的概念。

Skills 通过固定的规则和标准化能力，保证结果的稳定和一致，Skills 的使用需明确两个问题：
- 这件事是否重复？
- 这件事是否能够标准化？

由此可以看出 Skills 适合：
- 重复性工作
- 标准化输出
- 知识沉淀

Skills 构建的核心是**元数据**、**行动指南**和**资源文件**。

## 最小可实现架构MVA
LLM-based Agent 最小可实现架构（MVA）是指在构建一个基于大语言模型的智能体时，所需要的最基本的组件和流程。MVA 的核心思想是通过最简单的方式来实现一个功能完整的智能体，以便快速验证想法和迭代开发。包括：
- 记住前后说了什么
- 扮演什么角色、会干什么
- 根据需求进行工作

用工程化的角度来描述这三点就是：
- 上下文窗口，对话状态管理
- 系统提示词、角色注入
- 工具调用、外部能力扩展

目前使用较多“MVA”如下：
- Basic Prompt + Loop
- **ReAct**
- Plan-and-Execute
- ReWOO
- Full Agent

### ReAct架构
重点介绍下目前相对较成熟，使用较为广泛的 ReAct 架构。

ReAct 并非前端框架 React，而是 Reasoning and Acting 的缩写，指的是在 Agent 应用中，智能体在进行推理（Reasoning）的同时，也能够执行（Acting）一些操作，比如调用工具、更新记忆等。即：
```txt
ReAct = Reasoning + Acting
```
这是一个`观察 → 思考 → 行动 → 再观察`的循环过程，智能体在每一步都会根据当前的观察和思考来决定下一步的行动，从而不断地迭代和优化自己的行为。

### 经典Demo——Weather Agent
在了解了以上的基础知识后，我就开始尝试自己搭建一个 Agent 应用了。事实上可以对 Agent 再进行抽象：
```
Agent = ReAct + Tools + UI
```
而 ReAct 也可以再抽象为：
```txt
ReAct = LLM + Prompt + Memory + Loop
```

在此细分基础上，我们从0搭建实现一个天气查询Agent，主要是三部分：
- Prompt
- Tools
- Agent Loop

#### Prompt
```md
你是天气查询的工具型助手，回答要简洁。
可用工具（action 的 tool 属性需与下列名称一致）：

- getTime: 返回当前 time 字符串，参数为空。
- getWeather: 返回模拟天气信息字符串，参数为 JSON，如 {"city":"南京","time":"2026-02-27 10:00"}。

回复格式（严格使用 XML，小写标签）：
<thought>对问题的简短思考</thought>
<action tool="工具名">工具输入</action> <!-- 若需要工具 -->
等待 <observation> 后再继续思考。
如果已可直接回答，则输出：
<final>最终回答（中文，必要时引用数据来源）</final>

规则：

- 每次仅调用一个工具；工具输入要尽量具体。
- 当用户只问“现在几点”时，优先调用 getTime。
- 查询天气时，必须调用 getWeather，并提供 city 和 time 两个字段。
- 如果拿到 observation 后有了答案，应输出 <final> 而不是重复调用。
- 未知工具时要说明，但仍用 XML 格式。
- 避免幻觉，不确定时请说明。
```

#### Tools
构建获取当前时间的`getCurrentTime`工具和获取天气的`getWeather`工具，`getWeather`工具通过与第三方天气API交互来获取天气信息，并且支持从输入中解析出时间参数以提供更准确的天气查询结果。

<details>
<summary>📝点击展开查看完整`TOOLKIT`工具包代码</summary>

```ts
getCurrentTime: async () => {
    return new Date().toISOString()
},

getWeather: async (input: string) => {
    let city = input.trim()
    let timeFromInput = ''

    if (input.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(input) as {
                city?: string
                time?: string
            }
            city = parsed.city?.trim() || city
            timeFromInput = parsed.time?.trim() || ''
        } catch {
            // 保持向后兼容，继续按纯城市名处理
        }
    }

    if (!city) {
        return '缺少城市参数，无法查询天气。'
    }

    try {
        const geocodeResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`,
        )
        if (!geocodeResp.ok) {
            return `地理编码服务暂时不可用（${geocodeResp.status}），请稍后重试。`
        }

        const geocodeData = (await geocodeResp.json()) as {
            results?: Array<{ latitude: number; longitude: number; name: string }>
        }
        const location = geocodeData.results?.[0]
        if (!location) {
            return `未找到城市 ${city}，请尝试更具体的城市名。`
        }

        const weatherResp = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&timezone=Asia%2FShanghai`,
        )
        if (!weatherResp.ok) {
            return `天气服务暂时不可用（${weatherResp.status}），请稍后重试。`
        }

        const weatherData = (await weatherResp.json()) as {
            current?: {
                temperature_2m?: number
                weather_code?: number
            }
        }

        const current = weatherData.current
        if (
            !current ||
            typeof current.temperature_2m !== 'number' ||
            typeof current.weather_code !== 'number'
        ) {
            return `天气服务未返回 ${city} 的有效数据，请稍后重试。`
        }

        const timeNote = timeFromInput ? `（查询时间：${timeFromInput}）` : ''
        const weatherText = weatherCodeToText(current.weather_code)
        return `${location.name}${timeNote} 当前天气：${weatherText}，温度 ${current.temperature_2m}°C`
    } catch {
        return `无法获取 ${city} 的天气，请检查城市名称是否正确。`
    }
}
```

</details>

#### Agent Loop
这是这个 Agent 能够进行 ReAct 的核心部分，AgentLoop 函数实现了一个循环，在每一轮中，Agent 根据当前的对话历史调用 LLM 生成新的文本输出，然后解析这个输出，判断是否需要调用工具，如果需要调用工具，就根据工具的名称和输入参数调用相应的工具函数，并将工具的输出作为新的观察（observation）添加到对话历史中，继续下一轮循环。循环会持续进行，直到 LLM 输出了一个最终回答（final）或者达到最大轮数限制。

<details>
<summary>📝点击展开查看完整`AgentLoop`完整代码</summary>

```ts
async function AgentLoop(question: string) {
    const systemPrompt = await readFile('prompt.md', 'utf-8')

    const history: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
    ]

    for (let step = 0; step < 10; step++) {
        const assistantText = await callLLMs(history)
        console.log(`\n[LLM 第 ${step + 1} 轮输出]\n${assistantText}\n`)
        history.push({ role: 'assistant', content: assistantText })

        const parsed = parseAssistant(assistantText)
        if (parsed.final) {
            return parsed.final
        }

        if (parsed.action) {
            const toolAliasMap: Record<string, ToolName> = {
                getTime: 'getCurrentTime',
            }

            const normalizedToolName =
                toolAliasMap[parsed.action.tool] || parsed.action.tool
            const toolFn = TOOLKIT[normalizedToolName as ToolName]
            let observation: string

            if (toolFn) {
                observation = await toolFn(parsed.action.input)
            } else {
                observation = `未知工具: ${parsed.action.tool}`
            }

            console.log(`<observation>${observation}</observation>\n`)

            history.push({
                role: 'user',
                content: `<observation>${observation}</observation>`,
            })
            continue
        }

        break // 未产生 action 或 final
    }

    return '未能生成最终回答，请重试或调整问题。'
}
```

</details>

具体调用大模型以及规范输出的代码请参考我的[GitHub仓库](https://github.com/beststarli/weather-agent)，这里就不展开了。

最终交互效果如下，这个 Agent 的交互“UI”也就是终端了。可以明显看到 Agent 在进行“观察”、“决策”、“自主执行”的过程：
![weather1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/weather1.png)

## 个人Agent
在完成了天气查询Agent的搭建后，基本对 Agent 应用开发的主体有了清晰的了解，于是决定采用成熟方案开发一个真正公网联网可用的个人Agent，来满足我个人的交互需求。

### 技术栈介绍
#### 前后端架构
在前后端架构选择上，我放弃了传统的前后端分离架构，也是为了更好地让自己拓展全栈开发的能力，选择了 [Next.js](https://nextjs.org/) 作为主架构，这样通过Next.js脚手架本身内置的TailWind CSS和App Router Handler功能，可以快速搭建出一个功能完整的Agent应用。

#### AI编排层
在AI调度上使用Vercel官方封装彻底的[AI SDK by Vercel](https://ai-sdk.dev/)，减小实现模型调用与流式输出的实现难度。

#### LLM模型选择
由于只是一个偏技术验证的Demo项目，且个人日常需求并不需要太强大的模型，所以在LLM模型的选择上，我选择了[DeepSeek API](https://platform.deepseek.com/)，足够便宜也足够满足需求了。

#### 外部能力服务
主要是使用了[Tavily](https://www.tavily.com/)的联网搜索API来增强Agent的联网搜索能力。

### 具体实现
完成代码请见我的[GitHub仓库](https://github.com/beststarli/beststar-ai-agent)。

#### 前端UI设计
毕竟是本人的主要工作方向，所以手搓组件还是很简单的，这里有几个卡点在于实现大模型输出内容时，始终保持聊天框处于新输出内容消息的底部，且用户的向上滚动行为不会因消息输出而重置至底部；另外就是输入框悬浮在对话框之上，通过添加边界样式模糊来掩盖对话框背景断层。前端交互UI设计如下：
![UI](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/blog/tech/agent/cover.png)

#### 联网搜索工具
编写创建联网搜索工具函数`createSearchTool`，该函数接受一个Tavily API作为参数，返回一个工具对象，工具对象包含工具描述、输入格式标准以及执行函数。执行函数会根据输入的搜索关键词调用Tavily的搜索API，并返回搜索结果。

<details>
<summary>📝点击展开查看完整`createSearchTool`完整代码</summary>

```ts
export function createSearchTool(tavilyApiKey?: string) {
    return tool({
        description: '搜索互联网以获取最新的新闻、实时信息或详细的百科知识。',
        inputSchema: jsonSchema<{ query: string }>({
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: '搜索关键词',
                },
            },
            required: ['query'],
            additionalProperties: false,
        }),
        execute: async ({ query }) => {
            console.log(`正在为用户搜索: ${query}...`);

            if (!tavilyApiKey) {
                throw new Error('TAVILY_API_KEY 未配置');
            }

            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query,
                    search_depth: 'basic',
                    max_results: 5,
                }),
            });

            if (!response.ok) {
                throw new Error(`Tavily 请求失败: ${response.status}`);
            }

            const data = (await response.json()) as {
                results?: Array<{
                    title?: string;
                    url?: string;
                    content?: string;
                }>;
            };

            return (data.results ?? []).map((item) => ({
                title: item.title,
                url: item.url,
                content: item.content,
            }));
        },
    });
}
```

</details>

#### Agent核心逻辑
利用Next.js的App Router Handler功能，在文件即路由中实现`POST`请求，它首先调取OpenAI SDK创建一个DeepSeek API的客户端实例，然后从请求体中获取用户输入的消息，创建一个联网搜索工具，并将工具注册到Agent中。接着调用`streamText`函数来执行Agent的ReAct循环，生成LLM的输出，并将结果以流式响应的形式返回给前端。

<details>
<summary>📝点击展开查看完整`POST`完整代码</summary>

```ts
export async function POST(req: Request) {
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!deepseekApiKey) {
        return new Response('DEEPSEEK_API_KEY 未配置', { status: 500 });
    }

    const deepseek = createOpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: deepseekApiKey,
    });

    const { messages }: { messages: UIMessage[] } = await req.json();
    const searchTool = createSearchTool(tavilyApiKey);

    const tools = {
        getWeather: weatherTool,
        webSearch: searchTool,
    };

    const result = streamText({
        model: deepseek.chat('deepseek-chat'),
        messages: await convertToModelMessages(messages, { tools }),
        tools,
        stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
}
```

</details>

#### 前端与Agent交互
在前端主要实现消息发送的handleSubmit函数，当用户提交消息时，首先阻止默认的表单提交行为，然后获取输入框中的文本内容，如果文本不为空，则清空输入框，并调用Vercel AI SDK的`useChat`中的`sendMessage`函数将用户输入的消息发送给后端Agent进行处理。同时，使用`useEffect`钩子来监听消息列表的变化，每当有新消息添加时，自动将滚动容器滚动到底部，以确保用户始终看到最新的消息。

```ts
const { messages, sendMessage } = useChat();
const [input, setInput] = useState('');
const scrollContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
}, [messages]);

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput('');
    await sendMessage({ text });
};
```

至此就大功告成了，一个快速简单的个人Agent主体就搭建完成了。

### Agent应用部署
由于框架本身使用的就是Vercel官方的Next.js，所以部署也非常简单，直接将代码push到GitHub仓库，并在Vercel平台上连接该仓库进行部署即可。部署完成后，就可以通过访问Vercel提供的URL来使用这个Agent了。然后仿照我的[博客搭建教程](/blog/how-to-build-my-blog)中[域名代理](/blog/how-to-build-my-blog#域名代理)的教程，来实现国内ip访问。

## 思考与展望
事实上以上完成的两个 Agent 应用只是非常简单的Demo，本质还是只是在和大模型本身进行对话，对 Agent 的能力扩展十分有限，还局限于类似 ChatBot 的交互形式。

但是要做到生产级别的 Agent 应用，就必须明确有一个具体的开发需求，现在都在传言Saas时代即将结束，但是软件工程的整体开发范式理念似乎得到了更深的强调，尤其是在 Vibe Coding 的过程中，开发者需要更好地理解用户需求、软件架构设计，才能更清晰地知道如何利用 Agent 来实现这些需求。总之，目前我自己思考的问题是：

> ***我该如何正确地搭建并使用 Agent 为我的工作赋能增效？***

自己仍需继续学习探索，来回答这个问题。

## 参考与鸣谢
- [**ai-agent-interview-guide**](https://github.com/bcefghj/ai-agent-interview-guide)
- [**🔥从聊天到干活：三分钟搞懂 LLM、Agent、RAG、Skill**](https://juejin.cn/post/7608782906941308968)
- [**AI Skills：前端新的效率神器！**](https://juejin.cn/post/7598807837868539930)
- [**从零构建一个 Mini Claude Code：面向初学者的 Agent 开发实战指南**](https://juejin.cn/post/7612129754633633819)
- [**Harness Engineering：2026 年 AI 编程的核心战场**](https://juejin.cn/post/7628448241537597476)

