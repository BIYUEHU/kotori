/*
 * @Author: Hotaru biyuehuya@gmail.com
 * @Blog: http://imlolicon.tk
 * @Date: 2023-07-30 11:33:15
 * @LastEditors: Hotaru biyuehuya@gmail.com
 * @LastEditTime: 2023-08-18 19:06:05
 */
import path from 'path';
import { Cmd, temp } from 'plugins/kotori-core';
import { ACCESS, SCOPE } from 'plugins/kotori-core/interface';
import { Api, Const, loadConfig, saveConfig } from '@/tools';
import SDK from '@/utils/class.sdk';
import config from './config';
import { arrData } from './interface';

export default (_Event: Event, _Api: Api, Consts: Const) => {
	CONST = Consts;
};

let CONST: Const;

const getNewLength = () => {
	const { max, min } = config;
	const range = max - min + 1;
	const index = Math.floor(Math.random() * range);
	const result = min + index;
	return result;
};

const getTodayPath = () => {
	const TIME = new Date();
	const time = `${TIME.getFullYear()}-${TIME.getMonth() + 1}-${TIME.getDate()}`;
	return path.join(CONST.DATA_PLUGIN_PATH, `${time}.json`);
};

const loadTodayData = (): number[] => (loadConfig(getTodayPath()) as number[]) || [];

const saveTodayData = (data: number[]) => saveConfig(getTodayPath(), data);

const loadStatData = (): arrData => {
	const PATH = path.join(CONST.DATA_PLUGIN_PATH, `stat.json`);
	return (loadConfig(PATH) as arrData) || [];
};

const saveStatData = (data: arrData) => {
	const PATH = path.join(CONST.DATA_PLUGIN_PATH, `stat.json`);
	saveConfig(PATH, data);
};

Cmd.register(config.todayLength.cmd, config.todayLength.descr, 'funSys', SCOPE.GROUP, ACCESS.NORMAL, (send, data) => {
	/* 加载数据 */
	const today = loadTodayData();
	const todayLength = typeof today[data.user_id] === 'number' ? today[data.user_id] : getNewLength();

	/* 发送消息 */
	let message = '';
	const params = {
		at: SDK.cq_at(data.user_id),
		length: todayLength,
	};
	if (todayLength <= 0) message = temp(config.todayLength.info[2], params);
	else if (todayLength > 0 && todayLength <= config.joke) message = temp(config.todayLength.info[1], params);
	else message = temp(config.todayLength.info[0], params);
	send(message);

	/* 如果数据中不存在则更新数据 */
	if (typeof today[data.user_id] === 'number') return;
	today[data.user_id] = todayLength;
	saveTodayData(today);
	/* 更新stat */
	const stat = loadStatData();
	const person = stat[data.user_id];
	if (Array.isArray(person) /* && person.length === 4 */) {
		if (todayLength <= person[0]) person[0] = todayLength;
		if (todayLength >= person[1]) person[1] = todayLength;
		person[2] += 1;
		person[3] += todayLength;
		person[4] = data.sender.nickname;
	} else {
		stat[data.user_id] = [todayLength, todayLength, 1, todayLength, data.sender.nickname];
	}
	saveStatData(stat);
});

Cmd.register(
	/* config.myLength.cmd */ '我的长度',
	config.myLength.descr,
	'funSys',
	SCOPE.GROUP,
	ACCESS.NORMAL,
	(send, data) => {
		const stat = loadStatData();
		const person = stat[data.user_id];
		if (!person || person.length <= 0) {
			send(config.myLength.fail, {
				at: SDK.cq_at(data.user_id),
			});
			return;
		}
		send(config.myLength.info, {
			at: SDK.cq_at(data.user_id),
			max_length: person[1],
			min_length: person[0],
			total_length: person[3],
			avg_length: (person[3] / person[2]).toFixed(1),
			nums: person[2],
		});
	},
);

Cmd.register(config.avgRanking.cmd, config.avgRanking.descr, 'funSys', SCOPE.GROUP, ACCESS.NORMAL, send => {
	const stat = loadStatData();
	const statOrigin = loadStatData();
	if (stat.length <= 0) {
		send(config.avgRanking.fail);
		return;
	}
	Object.keys(stat).forEach(key => {
		const item = stat[key as unknown as number];
		item[3] /= item[2];
	});
	const entries = Object.entries(stat);
	entries.sort((a, b) => b[1][3] - a[1][3]);

	let list = '';
	let num = 1;
	entries.forEach(entry => {
		list += temp(config.avgRanking.list, {
			num,
			name: entry[1][4],
			nums: entry[1][2],
			avg_length: entry[1][3].toFixed(1),
			total_length: statOrigin[entry[0] as unknown as number][3],
		});
		num += 1;
	});
	send(config.avgRanking.info, {
		list,
	});
});

Cmd.register(config.todayRanking.cmd, config.todayRanking.descr, 'funSys', SCOPE.GROUP, ACCESS.NORMAL, send => {
	const stat = loadStatData();
	const today = loadTodayData();
	if (today.length <= 0) {
		send(config.todayRanking.fail);
		return;
	}

	const newEntries = Object.entries(today);
	newEntries.sort((a, b) => b[1] - a[1]);

	let list = '';
	let num = 1;
	newEntries.forEach(entry => {
		const data = stat[entry[0] as unknown as number];
		list += temp(config.todayRanking.list, {
			num,
			name: data[4],
			length: entry[1],
		});
		num += 1;
	});
	send(config.todayRanking.info, {
		list,
	});
});
