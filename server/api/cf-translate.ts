import {configureSWRHeaders} from "../utils/swr";


const {translateToken,apiUrl} = useRuntimeConfig();

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
        text: text,
    };

    // 发送 POST 请求
    const response: any = await $fetch(`${apiUrl}/api/translate`, {
        method: 'POST', // 指定请求方法为 POST
        body: JSON.stringify(requestBody), // 将请求体转换为 JSON 字符串
        headers: {
            'Content-Type': 'application/json', // 设置请求头
            'Authorization': `Bearer ${translateToken}`, // 添加 Bearer Token
        },
    });
    console.log(response);
    return response; // 返回响应数据
};