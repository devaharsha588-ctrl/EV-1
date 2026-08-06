const bcrypt = require('bcrypt');
const {
  User,
  Roadmap,
  Recommendation,
  LearningHistory,
  Feedback,
  Project,
  Achievement,
  Analytics
} = require('../src/models');
const { connectDatabase } = require('../src/services/database.service');
const logger = require('../src/utils/logger');

const seedDemoData = async () => {
  try {
    logger.info('Connecting database for demo seeding...');
    await connectDatabase({ retries: 2 });

    logger.info('Seeding demo user accounts...');
    const hashedPassword = await bcrypt.hash('DemoUser123!', 12);

    const [user] = await User.findOrCreate({
      where: { email: 'demo@ev-ai.com' },
      defaults: {
        name: 'Alex Rivera',
        email: 'demo@ev-ai.com',
        password: hashedPassword,
        profession: 'Full Stack Engineer',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        goals: ['Master Cloud Architecture', 'Build AI Applications', 'Land Senior Engineer Role'],
        experienceLevel: 'intermediate',
        preferredRole: 'AI Full-Stack Developer',
        isActive: true,
        isEmailVerified: true
      }
    });

    logger.info('Seeding demo roadmaps...');
    await Roadmap.findOrCreate({
      where: { userId: user.id, title: 'AI Full-Stack Engineer Roadmap 2026' },
      defaults: {
        userId: user.id,
        title: 'AI Full-Stack Engineer Roadmap 2026',
        profession: 'AI Full-Stack Developer',
        status: 'active',
        aiProvider: 'gemini',
        milestones: [
          { step: 1, title: 'Master Node.js & Express Architecture', completed: true, topics: ['Express', 'Security', 'REST APIs'] },
          { step: 2, title: 'Integrate Vector DBs & LLMs (Gemini / OpenAI)', completed: true, topics: ['LangChain', 'Embeddings', 'Prompting'] },
          { step: 3, title: 'Build Full-Stack RAG System with React', completed: false, topics: ['React', 'Chakra UI', 'WebSockets'] },
          { step: 4, title: 'Cloud Deployment & DevOps Pipeline', completed: false, topics: ['Docker', 'Render', 'CI/CD'] }
        ]
      }
    });

    logger.info('Seeding demo recommendations...');
    const demoRecs = [
      { type: 'course', title: 'Advanced LLM Application Development', description: 'Deep dive into building enterprise AI agents with LangChain & Gemini API.', url: 'https://coursera.org' },
      { type: 'project', title: 'Real-Time Career AI Navigator', description: 'Build an interactive AI mentor dashboard with live streaming responses.', url: 'https://github.com/ToshitSai/EV' },
      { type: 'internship', title: 'AI Software Engineer Intern', description: 'Remote 6-month internship focused on full-stack AI platform development.', url: 'https://linkedin.com' }
    ];

    for (const rec of demoRecs) {
      await Recommendation.findOrCreate({
        where: { userId: user.id, title: rec.title },
        defaults: { userId: user.id, source: 'gemini', metadata: rec, ...rec }
      });
    }

    logger.info('Seeding demo tasks and history...');
    await LearningHistory.findOrCreate({
      where: { userId: user.id, topic: 'Node.js Security Hardening' },
      defaults: {
        userId: user.id,
        topic: 'Node.js Security Hardening',
        category: 'Backend Engineering',
        status: 'completed',
        hoursSpent: 14,
        score: 95
      }
    });

    logger.info('Seeding demo analytics...');
    await Analytics.findOrCreate({
      where: { userId: user.id, metricName: 'weekly_learning_hours' },
      defaults: {
        userId: user.id,
        metricName: 'weekly_learning_hours',
        metricValue: 18.5,
        details: { streakDays: 12, completedModules: 4, aiPromptsSent: 42 }
      }
    });

    logger.info('✅ Demo data successfully seeded!');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to seed demo data', { error: error.message });
    process.exit(1);
  }
};

seedDemoData();
