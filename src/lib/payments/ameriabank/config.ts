import {
  AMERIABANK_LIVE_BASE_URL,
  AMERIABANK_TEST_BASE_URL,
} from './constants';
import type { AmeriabankConfig, AmeriabankCredentials } from './types';

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

/**
 * Resolves Ameriabank vPOS config from ENV (test vs live).
 */
export function getAmeriabankConfig(): AmeriabankConfig {
  const testMode = process.env.AMERIA_TEST_MODE === 'true';

  const credentials: AmeriabankCredentials = testMode
    ? {
        clientId: requireEnv('AMERIA_CLIENT_ID'),
        username: requireEnv('AMERIA_USERNAME'),
        password: requireEnv('AMERIA_PASSWORD'),
      }
    : {
        clientId: requireEnv('AMERIA_LIVE_CLIENT_ID'),
        username: requireEnv('AMERIA_LIVE_USERNAME'),
        password: requireEnv('AMERIA_LIVE_PASSWORD'),
      };

  return {
    testMode,
    baseUrl: testMode ? AMERIABANK_TEST_BASE_URL : AMERIABANK_LIVE_BASE_URL,
    credentials,
  };
}
