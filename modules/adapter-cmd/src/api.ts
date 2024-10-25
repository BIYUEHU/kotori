/*
 * @Author: Hotaru biyuehuya@gmail.com
 * @Blog: https://hotaru.icu
 * @Date: 2023-09-29 14:31:13
 * @LastEditors: Hotaru biyuehuya@gmail.com
 * @LastEditTime: 2024-08-04 12:09:25
 */
import { Api, type Message } from 'kotori-bot'
import type CmdAdapter from './adapter'

export class CmdApi extends Api {
  public readonly adapter: CmdAdapter

  public constructor(adapter: CmdAdapter) {
    super(adapter)
    this.adapter = adapter
  }

  public getSupportedEvents(): ReturnType<Api['getSupportedEvents']> {
    return ['on_message']
  }

  public async sendPrivateMsg(message: Message, userId: string) {
    this.adapter.send('send_private_msg', { user_id: userId, message: this.adapter.elements.decode(message) })
    this.adapter.ctx.emit('send', { api: this, messageId: String(this.adapter.messageId) })
    return { messageId: String(this.adapter.messageId), time: Date.now() }
  }
}

export default CmdApi
