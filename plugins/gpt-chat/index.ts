import path from 'path';
import { Core } from 'plugins/kotori-core';
import { fetchJ } from 'plugins/kotori-core/method';
import { BOT_RESULT } from 'plugins/kotori-core/type';
import { Locale } from '@/tools';
import config from './config';

Locale.register(path.resolve(__dirname));

Core.menu('gpts', 'gptChat').descr('gpt_chat.menu.gpt_chat.descr');

Core.cmd('gpt', async () => {
	const res = await fetchJ('http://chatgpt.imlolicon.tk/v1/chat/completions', undefined, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.chatgpt}`,
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: Core.args[1],
				},
			],
		}),
	});

	const result =
		!res || !res.choices || !res.choices[0] || !res.choices[0].message || !res.choices[0].message.content;
	return [
		result ? BOT_RESULT.SERVER_ERROR : 'gpt_chat.cmd.gpt.info',
		result ? { res } : { content: res.choices[0].message.content },
	];
})
	.descr('gpt_chat.cmd.gpt.descr')
	.menuId('gptChat')
	.params([
		{
			must: true,
			rest: true,
		},
	]);

Core.cmd('cl', () => BOT_RESULT.REPAIRING)
	.descr('gpt_chat.cmd.cl.descr')
	.menuId('gptChat')
	.params([
		{
			must: true,
			rest: true,
		},
	]);
