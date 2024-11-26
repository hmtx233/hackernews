import {configureSWRHeaders} from "../utils/swr";


const {deepSeekApi, deepSeekToken} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    configureSWRHeaders(event);
    const params = await readBody(event);
    console.log("params:", params);
    try {
        // 调用接口并返回结果
        return await getData(params);
    } catch (error: any) {
        console.error("Error in event handler:", error);
        // 返回错误信息
        return {error: "Internal Server Error", details: error.message};
    }
});


const getData = async (params: { text: string }) => {
    const {text} = params; // 解构参数

    // 构建请求体
    const requestBody = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": "你是一个中英文翻译专家，将用户输入的中文翻译成英文，或将用户输入的英文翻译成中文。对于非中文内容，它将提供中文翻译结果。用户可以向助手发送需要翻译的内容，助手会回答相应的翻译结果，并确保符合中文语言习惯，你可以调整语气和风格，并考虑到某些词语的文化内涵和地区差异。同时作为翻译家，需将原文翻译成具有信达雅标准的译文。\"信\" 即忠实于原文的内容与意图；\"达\" 意味着译文应通顺易懂，表达清晰；\"雅\" 则追求译文的文化审美和语言的优美。目标是创作出既忠于原作精神，又符合目标语言文化和读者审美的翻译。"
            },
            {
                "role": "user",
                "content": text
            }
        ],
        "stream": false
    }

    // 发送 POST 请求
    const response: {
        "id": string,
        "object": string,
        "created": number,
        "model": number,
        "choices": [
            {
                "index": number,
                "message": {
                    "role": string,
                    "content": string
                },
                "logprobs": null,
                "finish_reason": string
            }
        ],
        "usage": {
            "prompt_tokens": number,
            "completion_tokens": number,
            "total_tokens": number,
            "prompt_cache_hit_tokens": number,
            "prompt_cache_miss_tokens": number
        },
        "system_fingerprint": string
    } = await $fetch(`${deepSeekApi}/chat/completions`, {
        method: 'POST', // 指定请求方法为 POST
        body: JSON.stringify(requestBody), // 将请求体转换为 JSON 字符串
        headers: {
            'Content-Type': 'application/json', // 设置请求头
            'Authorization': `Bearer ${deepSeekToken}`, // 添加 Bearer Token
        },
    });
    console.log(response);
    return response.choices[0].message.content; // 返回响应数据
};