try {
  console.log('Checking environment variables...');
  const { serverEnv } = await import('../src/utils/serverEnv');
  const { clientEnv } = await import('../src/utils/clientEnv');

  // Check if no var starts with { and ends with }
  const unreplacedEnvVars = [Object.values(serverEnv), Object.values(clientEnv)]
    .flat()
    .filter((key) => typeof key === 'string' && key.startsWith('{') && key.endsWith('}'));

  if (unreplacedEnvVars.length > 0) {
    console.error('The following environment variables were not replaced:', unreplacedEnvVars);
    process.exit(1);
  }

  console.log('Environment variables imported successfully.');
} catch (error) {
  console.error('Failed to import environment variables:', error);
  process.exit(1);
}
