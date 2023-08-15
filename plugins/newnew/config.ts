export default {
    max: 30,
    min: -30,
    joke: 10,
    todayLength: {
        cmd: '今日长度',
        descr: '获取今日的牛~牛长度',
        info: [
            '%at% 今日的牛~牛长度是%length%cm',
            '%at% 今日的牛~牛长度是%length%cm...还不如没有🤣👆',
            '%at% 今日的牛~牛长度是....今天你是女孩子(%length%cm)😀',
        ]
    },
    myLength: {
        cmd: '我的长度',
        descr: '获取自己的牛牛信息',
        info: (
            `%at%\n最大长度: %max_length%cm 最深长度: %min_length%cm` +
            `\n使用次数: %nums%次 累计长度: %total_length%cm\n平均长度: %avg_length%cm`
        ),
        fail: '%at% 你的牛牛丢了...找不到你的牛牛数据😭果咩呐塞',
    },
    avgRanking: {
        cmd: '平均排行',
        descr: '获取平均牛牛排行',
        info: '平均长度排行:%list%',
        list: '\n%num%.%name% %avg_length%cm (%nums%次 总长%total_length%cm)',
        fail: 'b数据没有排行牛魔😅'
    },
    todayRanking: {
        cmd: '今日排行',
        descr: '获取今日牛牛排行',
        info: '今日长度排行:%list%',
        list: '\n%num%.%name% %length%cm',
        fail: 'b数据没有排行牛魔😅'
    }
}