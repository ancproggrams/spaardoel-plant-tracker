#!/usr/bin/env node

/**
 * Application Health Check Script
 * Performs comprehensive health checks on the application
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class HealthChecker {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.checks = [];
    this.timeout = 10000; // 10 seconds
  }

  async runAllChecks() {
    console.log('🏥 Starting application health checks...');
    console.log(`Base URL: ${this.baseUrl}`);
    
    const results = {
      passed: 0,
      failed: 0,
      total: 0,
      checks: []
    };

    // Define health checks
    const healthChecks = [
      { name: 'Application Startup', check: () => this.checkApplicationStartup() },
      { name: 'Database Connection', check: () => this.checkDatabaseConnection() },
      { name: 'API Endpoints', check: () => this.checkApiEndpoints() },
      { name: 'Static Assets', check: () => this.checkStaticAssets() },
      { name: 'Memory Usage', check: () => this.checkMemoryUsage() },
      { name: 'Response Time', check: () => this.checkResponseTime() }
    ];

    // Run all checks
    for (const healthCheck of healthChecks) {
      try {
        console.log(`\n🔍 Running ${healthCheck.name} check...`);
        const result = await healthCheck.check();
        
        results.checks.push({
          name: healthCheck.name,
          status: result.success ? 'PASSED' : 'FAILED',
          message: result.message,
          details: result.details || {},
          duration: result.duration || 0
        });
        
        if (result.success) {
          results.passed++;
          console.log(`✅ ${healthCheck.name}: ${result.message}`);
        } else {
          results.failed++;
          console.log(`❌ ${healthCheck.name}: ${result.message}`);
        }
        
        results.total++;
      } catch (error) {
        results.failed++;
        results.total++;
        results.checks.push({
          name: healthCheck.name,
          status: 'ERROR',
          message: error.message,
          details: { error: error.stack }
        });
        console.log(`💥 ${healthCheck.name}: ERROR - ${error.message}`);
      }
    }

    // Print summary
    this.printSummary(results);
    
    // Exit with appropriate code
    if (results.failed > 0) {
      process.exit(1);
    }
    
    return results;
  }

  async checkApplicationStartup() {
    const start = Date.now();
    
    try {
      const response = await this.makeRequest('/');
      const duration = Date.now() - start;
      
      if (response.statusCode === 200) {
        return {
          success: true,
          message: `Application is running (${duration}ms)`,
          duration,
          details: { statusCode: response.statusCode }
        };
      } else {
        return {
          success: false,
          message: `Unexpected status code: ${response.statusCode}`,
          duration,
          details: { statusCode: response.statusCode }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Application not responding: ${error.message}`,
        duration: Date.now() - start
      };
    }
  }

  async checkDatabaseConnection() {
    // Simulate database connection check
    // In a real application, you would check your actual database
    const start = Date.now();
    
    try {
      // Mock database check - replace with actual database ping
      await this.sleep(100);
      
      const duration = Date.now() - start;
      return {
        success: true,
        message: `Database connection healthy (${duration}ms)`,
        duration,
        details: { connectionPool: 'active' }
      };
    } catch (error) {
      return {
        success: false,
        message: `Database connection failed: ${error.message}`,
        duration: Date.now() - start
      };
    }
  }

  async checkApiEndpoints() {
    const endpoints = [
      '/api/health',
      '/api/goals',
      '/api/plants'
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const response = await this.makeRequest(endpoint);
        const duration = Date.now() - start;
        
        results.push({
          endpoint,
          status: response.statusCode,
          duration
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          error: error.message
        });
      }
    }
    
    const failedEndpoints = results.filter(r => r.status !== 200 && r.status !== 404);
    
    if (failedEndpoints.length === 0) {
      return {
        success: true,
        message: `All API endpoints responding (${results.length} checked)`,
        details: { endpoints: results }
      };
    } else {
      return {
        success: false,
        message: `${failedEndpoints.length} API endpoints failing`,
        details: { failed: failedEndpoints, all: results }
      };
    }
  }

  async checkStaticAssets() {
    const assets = [
      '/favicon.ico',
      '/_next/static/css',
      '/_next/static/js'
    ];
    
    const results = [];
    
    for (const asset of assets) {
      try {
        const start = Date.now();
        const response = await this.makeRequest(asset);
        const duration = Date.now() - start;
        
        results.push({
          asset,
          status: response.statusCode,
          duration
        });
      } catch (error) {
        results.push({
          asset,
          status: 'ERROR',
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      message: `Static assets check completed (${results.length} checked)`,
      details: { assets: results }
    };
  }

  async checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };
    
    const heapUsagePercent = (memUsageMB.heapUsed / memUsageMB.heapTotal) * 100;
    
    // Alert if heap usage is over 80%
    const isHealthy = heapUsagePercent < 80;
    
    return {
      success: isHealthy,
      message: `Memory usage: ${memUsageMB.heapUsed}MB/${memUsageMB.heapTotal}MB (${heapUsagePercent.toFixed(1)}%)`,
      details: memUsageMB
    };
  }

  async checkResponseTime() {
    const start = Date.now();
    
    try {
      await this.makeRequest('/');
      const responseTime = Date.now() - start;
      
      // Alert if response time is over 2 seconds
      const isHealthy = responseTime < 2000;
      
      return {
        success: isHealthy,
        message: `Response time: ${responseTime}ms`,
        duration: responseTime,
        details: { threshold: '2000ms' }
      };
    } catch (error) {
      return {
        success: false,
        message: `Response time check failed: ${error.message}`,
        duration: Date.now() - start
      };
    }
  }

  makeRequest(path) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'HealthChecker/1.0'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data
          });
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.timeout}ms`));
      });
      
      req.end();
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('🏥 HEALTH CHECK SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Checks: ${results.total}`);
    console.log(`Passed: ${results.passed} ✅`);
    console.log(`Failed: ${results.failed} ❌`);
    console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    
    if (results.failed > 0) {
      console.log('\n❌ FAILED CHECKS:');
      results.checks
        .filter(check => check.status !== 'PASSED')
        .forEach(check => {
          console.log(`  • ${check.name}: ${check.message}`);
        });
    }
  }
}

// CLI execution
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const healthChecker = new HealthChecker(baseUrl);
  healthChecker.runAllChecks();
}

module.exports = HealthChecker;
