import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 从环境变量获取配置
const MINGDAO_API_KEY = process.env.MINGDAO_API_KEY;
const MINGDAO_API_SECRET = process.env.MINGDAO_API_SECRET;
const MINGDAO_BASE_URL = process.env.MINGDAO_BASE_URL;

// 生成签名
function generateSign(apiSecret: string) {
  // 明道云签名算法：MD5(apiSecret + 当前时间戳)
  const timestamp = Date.now().toString();
  const sign = crypto.createHash('md5').update(apiSecret + timestamp).digest('hex');
  return sign;
}

export async function POST(request: Request) {
  try {
    // 检查环境变量是否配置
    if (!MINGDAO_API_KEY || !MINGDAO_API_SECRET || !MINGDAO_BASE_URL) {
      return NextResponse.json(
        { error: '明道云 API 配置不完整，请检查环境变量' },
        { status: 500 }
      );
    }

    // 从请求中获取数据
    const data = await request.json();
    const { worksheetId, controls } = data;

    // 验证必要参数
    if (!worksheetId || !controls) {
      return NextResponse.json(
        { error: '缺少必要参数：worksheetId 或 controls' },
        { status: 400 }
      );
    }

    // 生成签名
    const sign = generateSign(MINGDAO_API_SECRET);

    // 构建请求体
    const requestBody = {
      appKey: MINGDAO_API_KEY,
      sign,
      worksheetId,
      controls,
      triggerWorkflow: true // 可选，是否触发工作流
    };

    // 发送请求到明道云 API
    const apiUrl = `${MINGDAO_BASE_URL}/open/worksheet/addRow`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 解析响应
    const result = await response.json();

    // 返回结果
    if (response.ok) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: '明道云 API 请求失败', details: result },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('添加记录时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误', message: (error as Error).message },
      { status: 500 }
    );
  }
}
