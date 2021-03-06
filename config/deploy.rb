
# config valid only for current version of Capistrano
lock '3.6.1'

# 部署的应用名
set :application, 'MXEDU'

# 源码地址
set :repo_url, 'https://github.com/SinnerAiZ/MXEDU.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
# 源码分支
set :branch, "master"

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'
#部署目录
set :deploy_to, "/home/ubuntu/#{fetch(:application)}"

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, 'config/database.yml', 'config/secrets.yml'
# 链接的文件
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')
set :linked_files, fetch(:linked_files, []).push()
# Default value for linked_dirs is []
# append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system'
# 链接的目录
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/assets', 'public/uploads')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Defaults to false
# Skip migration if files in db/migrate were not modified
set :conditionally_migrate, true

set :unicorn_config_path, -> { File.join(current_path, "config", "unicorn.rb") }

# in case you want to set ruby version from the file:
# set :rbenv_ruby, File.read('.ruby-version').strip

# RAILS_GROUPS env value for the assets:precompile task. Default to nil.
# set :rails_assets_groups, '/server/app/assets'

# 可以看到bundle install的输出
set :bundle_flags, ''

after 'deploy:publishing', 'deploy:restart'
namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  task :restart do
    invoke 'unicorn:legacy_restart'
  end

end
