process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'a'.repeat(64);
process.env.JWT_REFRESH_SECRET = 'b'.repeat(64);
process.env.JWT_ACCESS_EXPIRE = '15m';
process.env.JWT_REFRESH_EXPIRE = '7d';

const refreshTokens = [];
const users = [];

jest.mock('../src/models', () => {
  const unscopedUserModel = {
    findOne: jest.fn(async ({ where }) => users.find((user) => Object.entries(where).every(([key, value]) => user[key] === value)) || null),
    findByPk: jest.fn(async (id) => users.find((item) => item.id === id) || null)
  };
  const UserModel = {
    unscoped: jest.fn(() => unscopedUserModel),
    findByPk: jest.fn(async (id) => {
      const user = users.find((item) => item.id === id);
      if (!user) return null;
      const { password, resetPasswordToken, resetPasswordExpires, ...safe } = user;
      return safe;
    }),
    create: jest.fn(async (data) => {
      const user = { id: users.length + 1, ...data, save: jest.fn(async function save() { return this; }) };
      users.push(user);
      return user;
    })
  };

  const RefreshToken = {
    create: jest.fn(async (data) => {
      const record = { id: refreshTokens.length + 1, ...data, save: jest.fn(async function save() { return this; }) };
      refreshTokens.push(record);
      return record;
    }),
    findOne: jest.fn(async ({ where }) => refreshTokens.find((token) => (
      token.tokenHash === where.tokenHash &&
      (token.revokedAt ?? null) === where.revokedAt
    )) || null),
    update: jest.fn(async (data, { where }) => {
      let count = 0;
      refreshTokens.forEach((token) => {
        const matches = Object.entries(where).every(([key, value]) => (token[key] ?? null) === value);
        if (matches) {
          Object.assign(token, data);
          count += 1;
        }
      });
      return [count];
    })
  };

  return { User: UserModel, RefreshToken };
});

jest.mock('../src/services/email.service', () => ({ sendPasswordResetEmail: jest.fn(async () => true) }));

const bcrypt = require('bcrypt');
const authService = require('../src/services/auth.service');
const { RefreshToken } = require('../src/models');
const emailService = require('../src/services/email.service');

describe('auth service', () => {
  beforeEach(() => {
    users.length = 0;
    refreshTokens.length = 0;
    jest.clearAllMocks();
  });

  test('register hashes password and issues tokens without returning password', async () => {
    const result = await authService.register({ name: 'Toshit', email: 't@example.com', password: 'Password123!' });
    expect(result.tokens.accessToken).toBeTruthy();
    expect(result.tokens.refreshToken).toBeTruthy();
    expect(refreshTokens).toHaveLength(1);
    expect(await bcrypt.compare('Password123!', users[0].password)).toBe(true);
    expect(result.user.password).toBeUndefined();
  });

  test('login, refresh, and logout rotate or revoke refresh tokens', async () => {
    await authService.register({ name: 'Toshit', email: 't@example.com', password: 'Password123!' });
    const login = await authService.login({ email: 't@example.com', password: 'Password123!' });
    const refreshed = await authService.refresh(login.tokens.refreshToken);
    expect(refreshed.tokens.refreshToken).toBeTruthy();
    expect(refreshTokens.some((token) => token.revokedAt)).toBe(true);
    await authService.logout(refreshed.tokens.refreshToken);
    expect(refreshTokens.filter((token) => token.revokedAt)).toHaveLength(2);
  });

  test('forgot/reset password stores reset token and revokes sessions', async () => {
    const registered = await authService.register({ name: 'Toshit', email: 't@example.com', password: 'Password123!' });
    await authService.forgotPassword('t@example.com');
    expect(users[0].resetPasswordToken).toBeTruthy();
    const resetToken = emailService.sendPasswordResetEmail.mock.calls[0][1];
    await authService.resetPassword({ token: resetToken, password: 'NewPassword123!' });
    expect(await bcrypt.compare('NewPassword123!', users[0].password)).toBe(true);
    expect(RefreshToken.update).toHaveBeenCalledWith(
      expect.objectContaining({ revokedAt: expect.any(Date) }),
      expect.objectContaining({ where: { userId: registered.user.id, revokedAt: null } })
    );
  });

  test('change password requires current password and revokes refresh tokens', async () => {
    const registered = await authService.register({ name: 'Toshit', email: 't@example.com', password: 'Password123!' });
    await authService.changePassword(registered.user.id, 'Password123!', 'NewPassword123!');
    expect(await bcrypt.compare('NewPassword123!', users[0].password)).toBe(true);
    expect(RefreshToken.update).toHaveBeenCalled();
  });
});
