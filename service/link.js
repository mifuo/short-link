/*
 * @Author: zi.yang
 * @Date: 2024-12-11 19:47:42
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-04-09 14:46:27
 * @Description: 
 * @FilePath: /short-link/service/link.js
 */
import crypto from 'node:crypto';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

function generateRandomShortCode(length = 6) {
  // 使用 crypto.randomBytes 生成随机字节
  const randomBytes = crypto.randomBytes(length);  // 生成 length 字节的随机数
  return randomBytes.toString('base64') // 转为 base64 编码
    .replace(/\+/g, '-')  // 将 base64 编码中的 "+" 替换为 "-"（防止 URL 不兼容）
    .replace(/\//g, '_')  // 将 "/" 替换为 "_"（防止 URL 不兼容）
    .slice(0, length);  // 截取前 length 长度的字符
}

export function generatorHash(url) {
  // 生成完全随机的 6 位短码
  return generateRandomShortCode(6);
}

export function getUrl(short) {
  return supabase.from('links').select('*').eq('short', short)
}

export async function addUrl(req) {
  const link = req.body.url
  const short = generatorHash(link)
  const isExists = await getUrl(short)
  if (isExists.data.length) return { data: isExists.data[0] }
  return supabase.from('links').insert([{ link, short }]).select().single()
}
