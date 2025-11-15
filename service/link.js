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

function generatorHash(url) {
  const sha256 = crypto.createHash('sha256');
  const hex = sha256.update(url).digest('hex');
  return hex.slice(8, 24);
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
