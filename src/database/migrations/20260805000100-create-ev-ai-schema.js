'use strict';

const professions = require('../../constants/professions');

const timestamps = (Sequelize) => ({
  created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
});

const userFk = (Sequelize) => ({
  type: Sequelize.INTEGER,
  allowNull: false,
  references: { model: 'users', key: 'id' },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { allowNull: false, type: Sequelize.STRING },
      email: { allowNull: false, unique: true, type: Sequelize.STRING },
      password: { allowNull: false, type: Sequelize.STRING },
      avatar: Sequelize.STRING,
      college: Sequelize.STRING,
      degree: Sequelize.STRING,
      branch: Sequelize.STRING,
      year: Sequelize.STRING,
      profession: Sequelize.ENUM(...professions),
      experience_level: Sequelize.STRING,
      skills: Sequelize.JSON,
      interests: Sequelize.JSON,
      learning_style: Sequelize.STRING,
      weekly_hours: Sequelize.INTEGER,
      target_company: Sequelize.STRING,
      career_goal: Sequelize.TEXT,
      dream_role: Sequelize.STRING,
      github: Sequelize.STRING,
      linkedin: Sequelize.STRING,
      portfolio: Sequelize.STRING,
      resume_url: Sequelize.STRING,
      bio: Sequelize.TEXT,
      onboarding_complete: { type: Sequelize.BOOLEAN, defaultValue: false },
      reset_password_token: Sequelize.STRING,
      reset_password_expires: Sequelize.DATE,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('refresh_tokens', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      token_hash: { allowNull: false, type: Sequelize.STRING },
      expires_at: { allowNull: false, type: Sequelize.DATE },
      revoked_at: Sequelize.DATE,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('roadmaps', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      title: { allowNull: false, type: Sequelize.STRING },
      profession: Sequelize.STRING,
      status: { type: Sequelize.ENUM('active', 'completed', 'archived'), defaultValue: 'active' },
      milestones: Sequelize.JSON,
      ai_provider: Sequelize.STRING,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('recommendations', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      type: { allowNull: false, type: Sequelize.STRING },
      title: { allowNull: false, type: Sequelize.STRING },
      description: Sequelize.TEXT,
      url: Sequelize.STRING,
      metadata: Sequelize.JSON,
      source: { type: Sequelize.STRING, defaultValue: 'ai' },
      score: Sequelize.INTEGER,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('chats', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      role: { allowNull: false, type: Sequelize.ENUM('user', 'assistant', 'system') },
      content: { allowNull: false, type: Sequelize.TEXT('long') },
      ai_provider: Sequelize.STRING,
      metadata: Sequelize.JSON,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('learning_history', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      roadmap_id: { type: Sequelize.INTEGER, references: { model: 'roadmaps', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      title: { allowNull: false, type: Sequelize.STRING },
      description: Sequelize.TEXT,
      category: Sequelize.STRING,
      skill: Sequelize.STRING,
      estimated_hours: { type: Sequelize.FLOAT, defaultValue: 0 },
      hours_spent: { type: Sequelize.FLOAT, defaultValue: 0 },
      progress: { type: Sequelize.INTEGER, defaultValue: 0 },
      completed: { type: Sequelize.BOOLEAN, defaultValue: false },
      completed_at: Sequelize.DATE,
      due_date: Sequelize.DATE,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('projects', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      title: { allowNull: false, type: Sequelize.STRING },
      description: Sequelize.TEXT,
      repo_url: Sequelize.STRING,
      live_url: Sequelize.STRING,
      tech_stack: Sequelize.JSON,
      status: { type: Sequelize.STRING, defaultValue: 'planned' },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('achievements', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      title: { allowNull: false, type: Sequelize.STRING },
      description: Sequelize.TEXT,
      badge: Sequelize.STRING,
      earned_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('notifications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      title: { allowNull: false, type: Sequelize.STRING },
      message: { allowNull: false, type: Sequelize.TEXT },
      type: { type: Sequelize.STRING, defaultValue: 'info' },
      read: { type: Sequelize.BOOLEAN, defaultValue: false },
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('resume_analysis', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      file_url: { allowNull: false, type: Sequelize.STRING },
      score: Sequelize.INTEGER,
      strengths: Sequelize.JSON,
      weaknesses: Sequelize.JSON,
      ats_suggestions: Sequelize.JSON,
      missing_skills: Sequelize.JSON,
      projects_to_add: Sequelize.JSON,
      certifications: Sequelize.JSON,
      ai_provider: Sequelize.STRING,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('github_analysis', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      username: { allowNull: false, type: Sequelize.STRING },
      score: Sequelize.INTEGER,
      repo_summary: Sequelize.JSON,
      suggestions: Sequelize.JSON,
      recommended_projects: Sequelize.JSON,
      ai_provider: Sequelize.STRING,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('feedback', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      recommendation_id: { type: Sequelize.INTEGER, references: { model: 'recommendations', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      ai_response_id: Sequelize.INTEGER,
      type: { allowNull: false, type: Sequelize.STRING },
      rating: Sequelize.INTEGER,
      comment: Sequelize.TEXT,
      metadata: Sequelize.JSON,
      ...timestamps(Sequelize)
    });

    await queryInterface.createTable('analytics', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: userFk(Sequelize),
      type: { allowNull: false, type: Sequelize.STRING },
      period_start: Sequelize.DATEONLY,
      period_end: Sequelize.DATEONLY,
      data: Sequelize.JSON,
      ...timestamps(Sequelize)
    });

    const indexedTables = [
      'refresh_tokens',
      'roadmaps',
      'recommendations',
      'chats',
      'learning_history',
      'projects',
      'achievements',
      'notifications',
      'resume_analysis',
      'github_analysis',
      'feedback',
      'analytics'
    ];
    await Promise.all(indexedTables.map((table) => queryInterface.addIndex(table, ['user_id'])));
    await queryInterface.addIndex('refresh_tokens', ['token_hash']);
    await queryInterface.addIndex('recommendations', ['user_id', 'type']);
    await queryInterface.addIndex('learning_history', ['user_id', 'completed']);
  },

  async down(queryInterface) {
    const tables = [
      'analytics',
      'feedback',
      'github_analysis',
      'resume_analysis',
      'notifications',
      'achievements',
      'projects',
      'learning_history',
      'chats',
      'recommendations',
      'roadmaps',
      'refresh_tokens',
      'users'
    ];
    for (const table of tables) await queryInterface.dropTable(table);
  }
};
