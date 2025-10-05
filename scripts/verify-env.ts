/**
 * Script to verify environment configuration
 * Run with: npx tsx scripts/verify-env.ts
 */

import { envSchema } from '../lib/schemas';

console.log('🔍 Verifying environment configuration...\n');

const env = {
    PPLX_API_KEY: process.env.PPLX_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
};

const result = envSchema.safeParse(env);

if (!result.success) {
    console.error('❌ Environment validation failed:\n');
    const errors = result.error.flatten().fieldErrors;
    Object.entries(errors).forEach(([key, messages]) => {
        console.error(`  ${key}:`);
        messages?.forEach(msg => console.error(`    - ${msg}`));
    });
    console.error('\n💡 Check your .env.local file and ensure all required variables are set.');
    process.exit(1);
}

console.log('✅ Environment configuration is valid!\n');
console.log('Configuration:');
console.log(`  PPLX_API_KEY: ${result.data.PPLX_API_KEY.substring(0, 10)}...`);
console.log(`  NEXT_PUBLIC_APP_URL: ${result.data.NEXT_PUBLIC_APP_URL || 'http://localhost:3000 (default)'}`);
console.log(`  RATE_LIMIT_MAX_REQUESTS: ${result.data.RATE_LIMIT_MAX_REQUESTS || '100 (default)'}`);
console.log(`  RATE_LIMIT_WINDOW_MS: ${result.data.RATE_LIMIT_WINDOW_MS || '60000 (default)'}`);
console.log('\n🎉 Ready to start the application!');
