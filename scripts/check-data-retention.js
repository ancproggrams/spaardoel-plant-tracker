
#!/usr/bin/env node

/**
 * GDPR Data Retention Compliance Checker
 * Checks for data that should be deleted according to retention policies
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Data retention policies (in days)
const RETENTION_POLICIES = {
  user_sessions: 30,
  audit_logs: 2555, // 7 years
  child_profiles: 2555, // 7 years or until child turns 18
  financial_data: 2555, // 7 years
  plant_data: 365, // 1 year after goal completion
  consent_records: 2555, // 7 years
  deleted_user_data: 30 // Grace period for account recovery
};

async function checkDataRetention() {
  console.log('🔍 Checking data retention compliance...');
  
  const issues = [];
  const now = new Date();

  try {
    // Check user sessions
    const oldSessions = await prisma.session.count({
      where: {
        expires: {
          lt: new Date(now.getTime() - RETENTION_POLICIES.user_sessions * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (oldSessions > 0) {
      issues.push({
        type: 'user_sessions',
        count: oldSessions,
        severity: 'medium',
        message: `${oldSessions} expired sessions should be deleted`
      });
    }

    // Check deleted user data
    const deletedUsers = await prisma.deletedUser.count({
      where: {
        deletedAt: {
          lt: new Date(now.getTime() - RETENTION_POLICIES.deleted_user_data * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (deletedUsers > 0) {
      issues.push({
        type: 'deleted_user_data',
        count: deletedUsers,
        severity: 'high',
        message: `${deletedUsers} deleted user records should be permanently removed`
      });
    }

    // Check completed plant goals
    const completedGoals = await prisma.savingGoal.count({
      where: {
        status: 'COMPLETED',
        completedAt: {
          lt: new Date(now.getTime() - RETENTION_POLICIES.plant_data * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (completedGoals > 0) {
      issues.push({
        type: 'plant_data',
        count: completedGoals,
        severity: 'medium',
        message: `${completedGoals} completed goals data should be archived or deleted`
      });
    }

    // Check child profiles that should be migrated to adult accounts
    const childProfiles = await prisma.childProfile.findMany({
      where: {
        birthDate: {
          lt: new Date(now.getFullYear() - 18, now.getMonth(), now.getDate())
        }
      },
      include: {
        user: true
      }
    });

    if (childProfiles.length > 0) {
      issues.push({
        type: 'child_profiles',
        count: childProfiles.length,
        severity: 'high',
        message: `${childProfiles.length} child profiles belong to adults and need account migration`
      });
    }

    // Generate report
    if (issues.length === 0) {
      console.log('✅ All data retention policies are compliant');
      process.exit(0);
    } else {
      console.log('⚠️ Data retention compliance issues found:');
      issues.forEach(issue => {
        const emoji = issue.severity === 'high' ? '🚨' : '⚠️';
        console.log(`${emoji} ${issue.message}`);
      });

      // Create cleanup tasks
      console.log('\n📋 Recommended actions:');
      issues.forEach(issue => {
        switch (issue.type) {
          case 'user_sessions':
            console.log('- Run: npm run cleanup:sessions');
            break;
          case 'deleted_user_data':
            console.log('- Run: npm run cleanup:deleted-users');
            break;
          case 'plant_data':
            console.log('- Run: npm run archive:completed-goals');
            break;
          case 'child_profiles':
            console.log('- Review and migrate adult accounts manually');
            break;
        }
      });

      // Exit with error if high severity issues
      const hasHighSeverity = issues.some(issue => issue.severity === 'high');
      process.exit(hasHighSeverity ? 1 : 0);
    }

  } catch (error) {
    console.error('❌ Error checking data retention:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  checkDataRetention();
}

module.exports = { checkDataRetention, RETENTION_POLICIES };
