/*
 * @Author: Hotaru biyuehuya@gmail.com
 * @Blog: https://hotaru.icu
 * @Date: 2023-09-29 14:31:09
 * @LastEditors: Hotaru biyuehuya@gmail.com
 * @LastEditTime: 2024-08-04 15:37:44
 */
import {
  Adapters,
  type AdapterConfig,
  type Context,
  type EventDataApiBase,
  MessageScope,
  Tsu,
  type Session
} from 'kotori-bot'
import WebSocket from 'ws'
import OnebotApi from './api'
import type { EventDataType } from './types'
import OnebotElements from './elements'

interface EventDataPoke extends EventDataApiBase {
  targetId: string

  groupId: string
}

declare module 'kotori-bot' {
  interface EventsMapping {
    onebot_poke(session: Session<EventDataPoke>): void
    literal_onebot_raw_data(data: EventDataType | object): void
  }
}

export const config = Tsu.Union(
  Tsu.Object({
    mode: Tsu.Literal('ws').describe('Connect mode: WebSocket'),
    port: Tsu.Number().port().describe('WebSocket server port'),
    address: Tsu.String()
      .regexp(/^ws(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)
      .default('ws://127.0.0.1')
      .describe('WebSocket address'),
    retry: Tsu.Number().int().min(1).default(10).describe('try reconnect times when disconnected')
  }),
  Tsu.Object({
    mode: Tsu.Literal('ws-reverse').describe('Connect mode: WebSocket Reverse')
  })
)

type OnebotConfig = Tsu.infer<typeof config> & AdapterConfig

const handleMsg = (msg: string) => msg.replace(/\[CQ:at,qq=(.*?)\]/g, '$1')

export class OnebotAdapter extends Adapters.WebSocket<OnebotApi, OnebotConfig, OnebotElements> {
  private readonly address: string

  private readonly isReverse: boolean

  public readonly config: OnebotConfig

  public readonly elements: OnebotElements

  public readonly api: OnebotApi

  public readonly platform = 'onebot'

  public constructor(ctx: Context, config: OnebotConfig, identity: string) {
    super(ctx, config, identity)
    this.config = config
    this.api = new OnebotApi(this)
    this.elements = new OnebotElements(this)
    this.address = this.config.mode === 'ws' ? `${this.config.address ?? 'ws://127.0.0.1'}:${this.config.port}` : ''
    this.isReverse = !this.address
    if (!this.isReverse) return
    this.connection = (ws) => {
      this.socket = ws
    }
  }

  public handle(data: EventDataType) {
    if (!('post_type' in data)) {
      this.ctx.emit('literal_onebot_raw_data', data)
      return
    }
    if (data.post_type === 'message' && data.message_type === 'private') {
      this.session('on_message', {
        type: MessageScope.PRIVATE,
        userId: String(data.user_id),
        messageId: String(data.message_id),
        message: handleMsg(data.raw_message),
        messageAlt: data.raw_message,
        sender: {
          nickname: data.sender.nickname
        },
        groupId: String(data.group_id),
        time: data.time
      })
    } else if (data.post_type === 'message' && data.message_type === 'group') {
      this.session('on_message', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        messageId: String(data.message_id),
        message: handleMsg(data.raw_message),
        messageAlt: data.raw_message,
        sender: {
          nickname: data.sender.nickname,
          role: data.sender.role ?? 'member'
        },
        groupId: String(data.group_id),
        time: data.time
      })
    } else if (data.post_type === 'notice' && data.notice_type === 'private_recall') {
      this.session('on_message_delete', {
        type: MessageScope.PRIVATE,
        userId: String(data.user_id),
        messageId: String(data.message_id),
        time: data.time
      })
    } else if (data.post_type === 'notice' && data.notice_type === 'group_recall') {
      this.session('on_message_delete', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        messageId: String(data.message_id),
        groupId: String(data.group_id),
        operatorId: String(data.user_id),
        time: data.time
      })
    } else if (data.post_type === 'request' && data.request_type === 'private') {
      this.session('on_request', {
        type: MessageScope.PRIVATE,
        userId: String(data.user_id),
        comment: String(data.comment),
        time: data.time,
        approve: (approve = true, remark = '') =>
          this.send('set_friend_add_request', { flag: data.flag, approve, remark })
      })
    } else if (data.post_type === 'request' && data.request_type === 'group') {
      this.session('on_request', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        groupId: String(data.group_id),
        operatorId: String(data.operator_id) || String(data.user_id),
        comment: String(data.comment),
        approve: (approve = true, reason = '') =>
          this.send('set_friend_add_request', { flag: data.flag, approve, reason, type: data.sub_type }),
        time: data.time
      })
    } else if (data.post_type === 'notice' && data.notice_type === 'group_increase') {
      this.session('on_group_increase', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        groupId: String(data.group_id),
        operatorId: String(data.operator_id) ?? String(data.user_id),
        time: data.time
      })
    } else if (data.post_type === 'notice' && data.notice_type === 'group_decrease') {
      this.session('on_group_decrease', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        groupId: String(data.group_id),
        operatorId: String(data.operator_id) ?? String(data.user_id),
        time: data.time
      })
    } else if (data.post_type === 'notice' && data.notice_type === 'group_admin') {
      this.session('on_group_admin', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        groupId: String(data.group_id),
        operation: data.sub_type === 'set' ? 'set' : 'unset',
        time: data.time
      })
    } else if (data.post_type === 'notice' && data.notice_type === 'group_ban') {
      this.session('on_group_ban', {
        type: MessageScope.GROUP,
        userId: String(data.user_id),
        groupId: String(data.group_id),
        operatorId: String(data.operator_id),
        duration: Number(data.duration),
        time: data.time
      })
    } else if (data.post_type === 'meta_event' && data.meta_event_type === 'heartbeat') {
      if (data.status.online) {
        this.online()
        if (this.onlineTimerId) clearTimeout(this.onlineTimerId)
      }
      if (this.selfId === '' && typeof data.self_id === 'number') {
        this.selfId = String(data.self_id)
        // this.avatar = `https://q.qlogo.cn/g?b=qq&s=640&nk=${this.selfId}`;
      }
    } else if (
      data.post_type === 'notice' &&
      data.notice_type === 'notify' &&
      data.sub_type === 'poke' &&
      data.target_id
    ) {
      this.session('onebot_poke', {
        type: data.message_type === 'private' ? MessageScope.PRIVATE : MessageScope.GROUP,
        userId: String(data.user_id),
        targetId: String(data.target_id),
        groupId: String(data.group_id),
        time: data.time
      })
    }
    if (!this.onlineTimerId) this.onlineTimerId = setTimeout(() => this.offline(), 50 * 1000)
  }

  public start() {
    if (this.isReverse) {
      this.setup()
      return
    }
    /* ws mode handle */
    this.ctx.emit('connect', {
      type: 'connect',
      mode: 'ws',
      adapter: this,
      normal: true,
      address: this.address
    })
    this.socket = new WebSocket(`${this.address}`)
    this.socket.on('close', () => {
      this.ctx.emit('connect', {
        type: 'disconnect',
        adapter: this,
        normal: false,
        mode: 'ws',
        address: this.address
      })
    })
    this.socket.on('message', (raw) => this.handle(JSON.parse(raw.toString())))
  }

  public stop() {
    if (this.isReverse) {
      super.stop()
      return
    }
    this.ctx.emit('connect', {
      type: 'disconnect',
      adapter: this,
      normal: true,
      address: this.address,
      mode: 'ws'
    })
    this.socket?.close()
  }

  public send(action: string, params?: object): void
  public send(content: EventDataType, operation: object): void
  public send(arg1: string | EventDataType, arg2?: object) {
    if (typeof arg1 === 'string') {
      this.socket?.send(JSON.stringify({ action: arg1, params: arg2 }))
      return
    }
    this.socket?.send(JSON.stringify({ content: arg1, operation: arg2 }))
  }

  private socket: WebSocket | null = null

  /* global NodeJS */
  private onlineTimerId: NodeJS.Timeout | null = null
}

export default OnebotAdapter
