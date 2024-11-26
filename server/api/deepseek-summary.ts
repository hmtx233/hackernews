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
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Please provide the URL to summarize in chinese: Input URL (e.g.," + text + " )Output Format:- 摘要: <Generated summary, not exceeding 500 words>"
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