namespace :db do
  desc "Check database connection health and configuration"
  task :health_check => :environment do
    puts "🔍 Database Health Check"
    puts "=" * 50

    # Check environment variables
    puts "\n📋 Environment Variables:"
    required_vars = %w[PPYC_BACKEND_DATABASE_PASSWORD SECRET_KEY_BASE RAILS_ENV]
    required_vars.each do |var|
      value = ENV[var]
      if value.nil? || value.empty?
        puts "  ❌ #{var}: NOT SET"
      else
        # Show first 4 and last 4 characters for security
        masked = value.length > 8 ? "#{value[0..3]}...#{value[-4..-1]}" : "[SET]"
        puts "  ✅ #{var}: #{masked}"
      end
    end

    # Check database configuration
    puts "\n🔧 Database Configuration:"
    begin
      config = ActiveRecord::Base.connection_db_config.configuration_hash
      puts "  Database: #{config[:database]}"
      puts "  Host: #{config[:host] || 'localhost'}"
      puts "  Port: #{config[:port] || '5432'}"
      puts "  Username: #{config[:username]}"
      puts "  Password: #{config[:password] ? '[SET]' : '[NOT SET]'}"
      puts "  Pool Size: #{config[:pool] || 5}"
      puts "  Timeout: #{config[:timeout] || 5000}"
    rescue => e
      puts "  ❌ Error reading database config: #{e.message}"
    end

    # Test database connection
    puts "\n🔌 Database Connection Test:"
    begin
      ActiveRecord::Base.connection.execute("SELECT 1")
      puts "  ✅ Connection successful"

      # Get database info
      db_version = ActiveRecord::Base.connection.execute("SELECT version()").first["version"]
      puts "  📊 PostgreSQL Version: #{db_version.split(' ')[0..1].join(' ')}"

      current_user = ActiveRecord::Base.connection.execute("SELECT current_user").first["current_user"]
      puts "  👤 Connected as: #{current_user}"

      current_db = ActiveRecord::Base.connection.execute("SELECT current_database()").first["current_database"]
      puts "  🗄️  Current database: #{current_db}"

    rescue => e
      puts "  ❌ Connection failed: #{e.message}"
      puts "  💡 Check your database credentials and ensure PostgreSQL is running"
    end

    # Check schema_migrations table
    puts "\n📋 Schema Migrations:"
    begin
      if ActiveRecord::Base.connection.table_exists?('schema_migrations')
        count = ActiveRecord::Base.connection.execute("SELECT COUNT(*) FROM schema_migrations").first["count"]
        puts "  ✅ schema_migrations table exists with #{count} migrations"

        # Check table owner
        owner = ActiveRecord::Base.connection.execute(
          "SELECT tableowner FROM pg_tables WHERE tablename = 'schema_migrations'"
        ).first["tableowner"]
        puts "  👤 Table owner: #{owner}"

        # Check permissions
        permissions = ActiveRecord::Base.connection.execute(
          "SELECT privilege_type FROM information_schema.role_table_grants WHERE table_name='schema_migrations' AND grantee='#{ActiveRecord::Base.connection_db_config.configuration_hash[:username]}'"
        ).map { |row| row["privilege_type"] }
        puts "  🔐 Permissions: #{permissions.join(', ')}"

      else
        puts "  ⚠️  schema_migrations table does not exist"
      end
    rescue => e
      puts "  ❌ Error checking schema_migrations: #{e.message}"
    end

    # Check pending migrations
    puts "\n🚀 Migration Status:"
    begin
      pending = ActiveRecord::Base.connection.migration_context.needs_migration?
      if pending
        pending_migrations = ActiveRecord::Base.connection.migration_context.migrations_status.select { |status, _, _| status == "down" }
        puts "  ⚠️  #{pending_migrations.count} pending migrations"
        pending_migrations.each do |status, version, name|
          puts "    - #{version} #{name}"
        end
      else
        puts "  ✅ No pending migrations"
      end
    rescue => e
      puts "  ❌ Error checking migrations: #{e.message}"
    end

    # Performance check
    puts "\n⚡ Performance Check:"
    begin
      start_time = Time.now
      ActiveRecord::Base.connection.execute("SELECT pg_database_size(current_database())")
      end_time = Time.now
      puts "  ⏱️  Query response time: #{((end_time - start_time) * 1000).round(2)}ms"

      # Check active connections
      active_connections = ActiveRecord::Base.connection.execute(
        "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()"
      ).first["count"]
      puts "  🔗 Active connections: #{active_connections}"

    rescue => e
      puts "  ❌ Error in performance check: #{e.message}"
    end

    puts "\n" + "=" * 50
    puts "Health check complete! 🏁"
  end

  desc "Test database connection with specific credentials"
  task :test_connection, [:username, :password] => :environment do |t, args|
    username = args[:username] || ENV['PPYC_BACKEND_DATABASE_USERNAME'] || 'ppyc_user'
    password = args[:password] || ENV['PPYC_BACKEND_DATABASE_PASSWORD']

    unless password
      puts "❌ Password required. Usage: rake db:test_connection[username,password]"
      exit 1
    end

    puts "🔍 Testing database connection..."
    puts "Username: #{username}"
    puts "Password: [#{password.length} characters]"

    begin
      # Test with pg gem directly
      require 'pg'
      config = ActiveRecord::Base.connection_db_config.configuration_hash

      conn = PG.connect(
        host: config[:host] || 'localhost',
        port: config[:port] || 5432,
        dbname: config[:database],
        user: username,
        password: password
      )

      result = conn.exec("SELECT current_user, current_database(), version()")
      puts "✅ Direct PG connection successful!"
      puts "Connected as: #{result[0]['current_user']}"
      puts "Database: #{result[0]['current_database']}"
      puts "Version: #{result[0]['version'].split(' ')[0..1].join(' ')}"

      conn.close

    rescue => e
      puts "❌ Direct PG connection failed: #{e.message}"
    end
  end
end
