// Data Migration Script
// This script will migrate all your localStorage data to Supabase

const { DataMigration } = require('./src/lib/data-migration.ts');

async function runMigration() {
  console.log('🚀 Starting data migration from localStorage to Supabase...');

  try {
    // Check if migration is needed
    const needsMigration = await DataMigration.needsMigration();

    if (!needsMigration) {
      console.log('✅ No migration needed - data is already in Supabase or no localStorage data found');
      return;
    }

    console.log('📦 Migration needed - starting full migration...');

    // Run the full migration
    await DataMigration.migrateAll();

    console.log('✅ Migration completed successfully!');
    console.log('🎉 Your profile, projects, blog posts, and activities have been migrated to Supabase');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('Please check your environment variables and try again');
  }
}

// Run the migration
runMigration();