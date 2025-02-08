import mockjs from 'mockjs';

export default {
  'GET /api/work': (req: any, res: any) => {
    res.json(
      mockjs.mock({
        success: true,
        code: 0,
        'data|5': [
          {
            taskName: '@cparagraph',
            done: 0 | 1,
            overDay: '@integer(0, 100)',
            creator: '@cname',
            createTime: '@date(yyyy-MM-dd hh:mm:ss)',
            deadLineTime: '@date(yyyy-MM-dd hh:mm:ss)',
          },
        ],
        total: '@integer(10, 100)',
      }),
    );
  },
};
