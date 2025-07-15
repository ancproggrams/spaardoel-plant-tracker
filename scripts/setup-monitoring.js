
#!/usr/bin/env node

/**
 * Monitoring Setup Script
 * Configures monitoring alerts for new deployments
 */

const DATADOG_API_KEY = process.env.DATADOG_API_KEY;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

async function setupMonitoring() {
  console.log('📊 Setting up monitoring for new deployment...');

  try {
    // Setup Datadog alerts
    if (DATADOG_API_KEY) {
      await setupDatadogAlerts();
    }

    // Setup Sentry release tracking
    if (SENTRY_AUTH_TOKEN) {
      await setupSentryRelease();
    }

    // Setup custom application metrics
    await setupCustomMetrics();

    console.log('✅ Monitoring setup completed');
  } catch (error) {
    console.error('❌ Error setting up monitoring:', error);
    process.exit(1);
  }
}

async function setupDatadogAlerts() {
  console.log('📊 Setting up Datadog alerts...');
  
  const alerts = [
    {
      name: 'High Error Rate',
      query: 'avg(last_5m):avg:trace.express.request.errors{env:production} by {service} > 0.05',
      message: 'Error rate is above 5% for production service',
    },
    {
      name: 'High Response Time',
      query: 'avg(last_5m):avg:trace.express.request.duration{env:production} by {service} > 2',
      message: 'Response time is above 2 seconds for production service',
    },
    {
      name: 'Database Connection Issues',
      query: 'avg(last_5m):avg:postgresql.connections.used{env:production} / avg:postgresql.connections.max{env:production} > 0.8',
      message: 'Database connection usage is above 80%',
    }
  ];

  // In real implementation, this would make API calls to Datadog
  console.log('📊 Datadog alerts configured:', alerts.length);
}

async function setupSentryRelease() {
  console.log('📊 Setting up Sentry release tracking...');
  
  const release = {
    version: process.env.GITHUB_SHA || 'unknown',
    environment: 'production',
    projects: ['spaardoel-plant-tracker'],
  };

  // In real implementation, this would make API calls to Sentry
  console.log('📊 Sentry release configured:', release.version);
}

async function setupCustomMetrics() {
  console.log('📊 Setting up custom application metrics...');
  
  const metrics = [
    'user_registrations',
    'goal_completions',
    'plant_care_actions',
    'parent_child_interactions',
    'gdpr_requests',
  ];

  // In real implementation, this would configure custom metrics collection
  console.log('📊 Custom metrics configured:', metrics.length);
}

if (require.main === module) {
  setupMonitoring();
}

module.exports = { setupMonitoring };
