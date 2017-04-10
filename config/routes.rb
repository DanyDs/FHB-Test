Rails.application.routes.draw do

  # Supervisor Pages
  get '/supervisor/companies' => 'companies#index'
  get '/supervisor/requests' => 'companies#requests'
  get '/supervisor/getDowned', to: 'companies#getDowned', as: 'getDowned'
  get '/supervisor/acceptDecline', to: 'advertisements#acceptDecline'

  get '/supervisor/statistics_products' => 'statistics_products#indexS'
  get '/supervisor/statistics_companies' => 'statistics_companies#indexS'
  get '/supervisor/statistics_services' => 'statistics_services#indexS'
  get '/supervisor/companies_profile/:id' => 'companies#showSupervisor'
  get '/companies/departments/:user_id' =>'companies#departments'

  # Administrator Pages
  get '/admin/news' =>'news#newsGestion'
  get '/admin/news/new' =>'news#new'
  get '/admin/guides' =>'guides#guidesGestion'
  get '/admin/categories' => 'categories#admin'
  get '/admin/statistics_products' => 'statistics_products#indexA'
  get '/admin/statistics_companies' => 'statistics_companies#indexA'
  get '/admin/statistics_services' => 'statistics_services#indexA'

  # Company administrator Pages
  get '/company/terminosYcondiciones' =>'mainpage#terminosYcondiciones'
  get '/company/noticias' => 'news#index'
  get '/company/emprender' => 'guides#index'

  # Visitant Pages


  # Common Routes
  get '/empresa/:id'=>'companies#showVisitor'

  get 'administrator/users/editUser' => 'users#editUser'
  get 'administrator/users/editPassword' => 'users#editPassword'
  get 'users/editPassword' =>'users#editUser'
  get 'company/editPassword' => 'users#editPassword'
  get 'supervisor/editUser'=> 'users#editUser'
  get 'supervisor/editPassword'=> 'users#editPassword'
  get 'company/editUser'=> 'users#editUser'

  root 'mainpage#index'
    resources :menus
    resources :footers
  get 'mainpage/index'
  get 'mainpage/indexEmpresa'
  get 'mainpage/indexGeneral'
  get 'mainpage/indexRegional'
    resources :companies
    resources :advertisements
    resources :company_requests

    resources :logins

    #devise_for :users




  get '/explorar' => 'explorer#index'
  get 'registrar_empresa' => 'companies#new'
  get 'products/show/:product_id'=>'products#show'
  get 'companies/show/:company_id'=>'companies#show'
  get 'companies/:company_id/products' => 'products#index'
  get 'companies/:company_id' => 'companies#inici'
  post 'companies/:company_id' => 'companies#send'


  get 'companies/:company_id/products' => 'products#index'
  get 'quienes_somos' => 'mainpage#QuienesSomos'
  get 'emprender' => 'guides#index'

  get 'terminosYcondiciones' =>'mainpage#terminosYcondiciones'

  get 'noticias' => 'news#index'

  get 'visualize_ads', to: :visualize_ads, controller: 'advertisements'

  resources :users
  resources :news
  resources :guides
  resources :suscribers



  get 'myCompany/Downing/:id'=> 'companies#requestDown'

  get '/company/profile', to: 'companies#profile'
  get '/company/products', to: 'products#index'
  get '/company/advertisements', to: 'advertisements#index'
  get '/company/services', to: 'services#index'

  # API Routes

  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      resources :categories do
        collection do
          get 'tree', to: 'categories#tree'
          get ':categoryId/companies', to: 'companies#listByCategory'
		      get ':categoryId/products', to: 'products#listByCategory'
		      get ':categoryId/services', to: 'services#listByCategory'
        end
      end

      resources :companies do
        collection do
          get ':companyId/products', to: 'companies#listAllProducts'
          get ':companyId/services', to: 'companies#listAllServices'
        end
      end
      resources :products do
        collection do
          get 'jsonProducts/lastfifty', to: 'products#lastfifty'
        end
      end
      resources :services do
        collection do
          get 'jsonServices/lastfifty', to: 'services#lastfifty'
        end
      end

      resources :users do
        collection do
          put 'password', to: 'users#changePassword'
          put ':id/password', to: 'users#updatePassword'
        end
      end

      post '/logins', to: 'users#authenticate'
      resources :phones
      put '/advertisements/:id/accept' => 'advertisements#accept'
      put '/advertisements/:id/decline' => 'advertisements#decline'

      resources :advertisements do
        collection do

        end
      end
      resources :mainpage
      resources :companies do
        collection do
          get '/requests', to: 'companies#requests', as: 'requests'
          get '/supervisor/getDowned', to: 'companies#getDowned', as: 'getDowned'
          get 'myCompany/Downing/:id', to: 'companies#requestDown', as: 'requestDown'
          get '/supervisor/companies/:department' =>'companies#departments'
          get '/departments/:user_id' =>'companies#departments'
          #get 'companies/:id', to: 'companies#showVisitor', as: 'showVisitor'
          get ':companyId/advertisements', to: 'advertisements#listByCompany'
        end
      end

      resources :company_requests
      resources :news do
        collection do
            get '/supervisor/news' =>'news#indexA'

      end
      end
      resources :guides
      resources :suscribers
	  resources :services
	  resources :products
    end
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :services


  #resources :products do
  #  collection do
  #    match 'search' => 'products#search', via: [:get, :post], as: :search
  #  end
  #end

  resources :mainpage do
    collection do
      match 'search' => 'products#search', via: [:get, :post], as: :search
    end
  end

  resources :products



  resources :statistics_products
  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      resources :statistics_products
    end
  end

  resources :statistics_companies
  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      get '/statistics_companies' => 'statistics_companies#index'
      get '/statistics_companies/:fecha', to: 'statistics_companies#index'
    end
  end

  resources :search
   namespace :api, :defaults => {:format => :json} do
    namespace :v1 do
      get '/search' => 'search#index'
      get '/search/:letter', to: 'search#index'
      get '/search/:departments', to: 'search#index'
      get '/search/:search', to: 'search#index'
    end
  end
end
