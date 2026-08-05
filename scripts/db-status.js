const { validateEnv } = require('../src/config/env.validation');
const { connectDatabase } = require('../src/services/database.service');
require('../src/models');

(async () => {
  const result = validateEnv({ strict: false });
  result.warnings.forEach((warning) => console.warn(`Warning: ${warning}`));
  if (!result.valid) {
    result.errors.forEach((error) => console.error(`Error: ${error}`));
    process.exit(1);
  }

  try {
    const health = await connectDatabase({ retries: 1 });
    console.log(JSON.stringify(health, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error.friendlyMessage || error.message);
    process.exit(1);
  }
})();
