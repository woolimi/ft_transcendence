# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w( admin.js admin.css )


# Rails.application.config.assets.precompile += %w( bootstrap.min.js )
# Rails.application.config.assets.precompile += %w( bootstrap.min.css )
# Rails.application.config.assets.precompile += %w( component-custom-switch.min.css )
Rails.application.config.assets.precompile += %w( simpleNotification.min.css )
Rails.application.config.assets.precompile += %w( simpleNotification.min.js )
Rails.application.config.assets.precompile += %w( spa.css )
Rails.application.config.assets.precompile += %w( tournament.css )

# -----------------------

# Rails.application.config.assets.precompile = ['*.js', '*.css']
# Rails.application.config.assets.precompile = ['*.js', '*.css', '**/*.js', '**/*.css']



# Rails.application.config.assets.precompile << Proc.new do |path|
# 	if path =~ /\.(css|js)\z/
# 	  full_path = Rails.application.assets.resolve(path).to_s
# 	  app_assets_path = Rails.root.join('app', 'assets').to_s
# 	  if full_path.starts_with? app_assets_path
# 		true
# 	  else
# 		false
# 	  end
# 	else
# 	  false
# 	end
#   end


#   Rails.application.config.assets.precompile << Proc.new do |path|
# 	if path =~ /\.(css|js)\z/
# 	  full_path = Rails.application.assets.resolve(path).to_s
# 	  app_assets_path = Rails.root.join('vendor', 'assets').to_s
# 	  if full_path.starts_with? app_assets_path
# 		true
# 	  else
# 		false
# 	  end
# 	else
# 	  false
# 	end
#   end
  