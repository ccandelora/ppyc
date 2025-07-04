namespace :admin do
  desc "Create a superuser account"
  task create_superuser: :environment do
    email = ENV['EMAIL'] || 'admin@ppyc.com'
    password = ENV['PASSWORD'] || 'password123'

    user = User.find_or_initialize_by(email: email)
    user.password = password
    user.password_confirmation = password
    user.role = 'superuser'

    if user.save
      puts "✅ Superuser created successfully!"
      puts "📧 Email: #{user.email}"
      puts "🔑 Password: #{password}"
      puts "👑 Role: #{user.role}"
    else
      puts "❌ Failed to create superuser:"
      puts user.errors.full_messages.join(", ")
    end
  end

  desc "Create an admin account"
  task create_admin: :environment do
    email = ENV['EMAIL'] || 'admin2@ppyc.com'
    password = ENV['PASSWORD'] || 'password123'

    user = User.find_or_initialize_by(email: email)
    user.password = password
    user.password_confirmation = password
    user.role = 'admin'

    if user.save
      puts "✅ Admin created successfully!"
      puts "📧 Email: #{user.email}"
      puts "🔑 Password: #{password}"
      puts "👑 Role: #{user.role}"
    else
      puts "❌ Failed to create admin:"
      puts user.errors.full_messages.join(", ")
    end
  end

  desc "Create an editor account"
  task create_editor: :environment do
    email = ENV['EMAIL'] || 'editor@ppyc.com'
    password = ENV['PASSWORD'] || 'password123'

    user = User.find_or_initialize_by(email: email)
    user.password = password
    user.password_confirmation = password
    user.role = 'editor'

    if user.save
      puts "✅ Editor created successfully!"
      puts "📧 Email: #{user.email}"
      puts "🔑 Password: #{password}"
      puts "👑 Role: #{user.role}"
    else
      puts "❌ Failed to create editor:"
      puts user.errors.full_messages.join(", ")
    end
  end

  desc "Create demo users for all roles"
  task create_demo_users: :environment do
    demo_users = [
      { email: 'admin@ppyc.com', role: 'superuser' },
      { email: 'admin2@ppyc.com', role: 'admin' },
      { email: 'editor@ppyc.com', role: 'editor' },
      { email: 'member@ppyc.com', role: 'member' }
    ]

    demo_users.each do |user_data|
      user = User.find_or_initialize_by(email: user_data[:email])
      user.password = 'password123'
      user.password_confirmation = 'password123'
      user.role = user_data[:role]

      if user.save
        puts "✅ #{user_data[:role].capitalize} created: #{user.email}"
      else
        puts "❌ Failed to create #{user_data[:role]}: #{user.errors.full_messages.join(', ')}"
      end
    end

    puts "\n🎉 Demo users created! All use password: password123"
    puts "\n👤 User Roles:"
    puts "🦸 Superuser: Full system access"
    puts "👨‍💼 Admin: Content and user management"
    puts "✏️ Editor: Content management only"
    puts "👤 Member: Basic access"
  end

  desc "List all users"
  task list_users: :environment do
    users = User.all.order(:role, :email)

    if users.any?
      puts "👥 Current Users:"
      puts "=" * 50
      users.each do |user|
        role_icon = case user.role
                   when 'superuser' then '🦸'
                   when 'admin' then '👨‍💼'
                   when 'editor' then '✏️'
                   else '👤'
                   end
        puts "#{role_icon} #{user.email} (#{user.role.capitalize})"
      end
    else
      puts "No users found. Run 'rails admin:create_demo_users' to create demo accounts."
    end
  end
end
