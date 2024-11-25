import {configureSWRHeaders} from "../utils/swr";
import tencentcloud from "tencentcloud-sdk-nodejs-tmt";

const TmtClient = tencentcloud.tmt.v20180321.Client;

// 配置客户端
const clientConfig = {
    credential: {
        secretId: '',
        secretKey: '',
    },
    region: "ap-beijing",
    profile: {
        httpProfile: {
            endpoint: "tmt.tencentcloudapi.com",
        },
    },
};

// 定义事件处理器
defineEventHandler(async (event) => {
    configureSWRHeaders(event);
    const params = await readBody(event);
    // 从环境变量中读取密钥并直接赋值给对应的属性
    clientConfig.credential.secretId = process.env.TX_SECRET_ID || event.context.cloudflare.env.TX_SECRET_ID;
    clientConfig.credential.secretKey = process.env.TX_SECRET_KEY || event.context.cloudflare.env.TX_SECRET_KEY;
    // 调用接口
    return await getData(params, clientConfig);
});


// 获取数据
const getData = async (params: any, clientConfig: any) => {
    // 使用 clientConfig 创建 TmtClient 实例
    const client = new TmtClient(clientConfig);
    return client.TextTranslate(params).then(
        (data) => {
            console.log(data);
            return data;
        },
        (err) => {
            console.error("error", err);
            throw err; // 抛出错误，让调用者能够捕获到错误
        }
    );
};