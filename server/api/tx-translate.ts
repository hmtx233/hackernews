import {configureSWRHeaders} from "../utils/swr";
import tencentcloud from "tencentcloud-sdk-nodejs-tmt";

const TmtClient = tencentcloud.tmt.v20180321.Client;
const config = useRuntimeConfig();

const clientConfig = {
    credential: {
        secretId: config.txSecretId,
        secretKey: config.txSecretKey,
    },
    region: "ap-beijing",
    profile: {
        httpProfile: {
            endpoint: "tmt.tencentcloudapi.com",
        },
    },
};
const client = new TmtClient(clientConfig);

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


const getData = async (params: any) => {
    try {
        const data = await client.TextTranslate(params);
        console.log("data:", data);
        return data;
    } catch (err) {
        console.error("error", err);
        // 抛出错误，让调用者能够捕获到错误
        throw err;
    }
};