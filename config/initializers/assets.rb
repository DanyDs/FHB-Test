# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( services.js )
Rails.application.config.assets.precompile += %w( products.js )
Rails.application.config.assets.precompile += %w( categories.js )
Rails.application.config.assets.precompile += %w( companies.js )
Rails.application.config.assets.precompile += %w( news.js )
Rails.application.config.assets.precompile += %w( subsidiaries.js )
Rails.application.config.assets.precompile += %w( suscribers.js )
Rails.application.config.assets.precompile += %w( advertisements.js )
Rails.application.config.assets.precompile += %w( adsforallusers.js )
Rails.application.config.assets.precompile += %w( acceptDeclineAds.js )
Rails.application.config.assets.precompile += %w( users.js )
Rails.application.config.assets.precompile += %w( logins.js )
Rails.application.config.assets.precompile += %w( guides.js )
Rails.application.config.assets.precompile += %w( explorer.js )
Rails.application.config.assets.precompile += %w( mainpage.js )
