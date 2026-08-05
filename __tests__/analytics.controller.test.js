const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

jest.mock('../src/models', () => ({
  LearningHistory: { findAll: jest.fn() },
  Roadmap: { findAll: jest.fn() }
}));

const { LearningHistory, Roadmap } = require('../src/models');
const analytics = require('../src/controllers/analytics.controller');

describe('analytics controller aggregations', () => {
  const req = { user: { id: 1 } };
  let res;

  beforeEach(() => {
    res = makeRes();
    LearningHistory.findAll.mockReset();
    Roadmap.findAll.mockReset();
  });

  test('weekly and monthly progress count completed tasks', async () => {
    LearningHistory.findAll.mockResolvedValue([{ completed: true }, { completed: false }]);
    await analytics.weeklyProgress(req, res, jest.fn());
    expect(res.json.mock.calls[0][0].data).toEqual({ total: 2, completed: 1 });

    res = makeRes();
    await analytics.monthlyProgress(req, res, jest.fn());
    expect(res.json.mock.calls[0][0].data).toEqual({ total: 2, completed: 1 });
  });

  test('learning hours sums hours spent', async () => {
    LearningHistory.findAll.mockResolvedValue([{ hoursSpent: 2.5 }, { hoursSpent: 1.5 }]);
    await analytics.learningHours(req, res, jest.fn());
    expect(res.json.mock.calls[0][0].data).toEqual({ hours: 4 });
  });

  test('skills growth keeps max progress per skill', async () => {
    LearningHistory.findAll.mockResolvedValue([{ skill: 'Node', progress: 40 }, { skill: 'Node', progress: 80 }]);
    await analytics.skillsGrowth(req, res, jest.fn());
    expect(res.json.mock.calls[0][0].data).toEqual({ skills: { Node: 80 } });
  });

  test('roadmap completion uses roadmap and task data', async () => {
    Roadmap.findAll.mockResolvedValue([{ id: 1 }]);
    LearningHistory.findAll.mockResolvedValue([{ completed: true }, { completed: false }]);
    await analytics.roadmapCompletion(req, res, jest.fn());
    expect(res.json.mock.calls[0][0].data).toEqual({ roadmaps: 1, taskCompletionRate: 50 });
  });

  test('category distribution counts categories', async () => {
    LearningHistory.findAll.mockResolvedValue([{ category: 'Backend' }, { category: 'Backend' }, { category: 'AI' }]);
    await analytics.categoryDistribution(req, res, jest.fn());
    expect(res.json.mock.calls[0][0].data).toEqual({ categories: { Backend: 2, AI: 1 } });
  });
});
