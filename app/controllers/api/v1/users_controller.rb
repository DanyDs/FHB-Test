class Api::V1::UsersController < ApplicationController
  
  def index
    @user = User.all.order('name ASC')    
    render json:  @user
  end

  def show
    if (!(isUserAuthenticated and isUserRole('general')))
      throwUnauthorized
      return
    end

    @user = User.find(params[:id])
    respond_to do |format|
      format.json { render :json => @user }
    end
  end

  def update
    if (params[:lock]==nil)

      currentUserID = params[:id]
      @user = User.find_by(id: currentUserID)
      if  (params[:new_password] =="" and params[:new_password_confirmation]=="")
          if params[:new_name] == nil or params[:new_name] == ""
             params[:new_name] = @user.name
          end      
          if params[:new_last_name] == nil or params[:new_last_name] == ""
             params[:new_last_name] = @user.last_name
          end
          
          if @user.update( name: params[:new_name], last_name: params[:new_last_name], updated_at: Time.now)
            render json: @user
          else
            render json: {errors: ['Error al modificar datos']}, status: :unauthorized
          end
    
      else
        if @user.valid_password?(params[:password]) and params[:password] != "" 
          if @user.update(password: params[:new_password], password_confirmation: params[:new_password_confirmation], updated_at: Time.now)
            render json: @user
          else
            render json: {errors: ['Error al cambiar de contraseña']}, status: :unauthorized
          end

        else
          if(params[:password]=="")
            if @user.update(password: params[:new_password], password_confirmation: params[:new_password_confirmation], updated_at: Time.now)
              render json: @user
            else
              render json: {errors: ['Nuevas contraseñas no coinciden']}, status: :unauthorized
            end
          else
            render json: {errors: ['Error al cambiar de contraseña']}, status: :unauthorized
          end
        end
      end
      
    else  

      @user=User.find_by(id: params[:id])
      if @user.update(lock: params[:lock], attempts: 0)
        render json: {department: @user.department, name: @user.name, last_name: @user.last_name, email: @user.email}
      else
        redirect_to '/'
      end
    end
  end


  def create
    
    #crypt = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    #encrypted_password = crypt.encrypt_and_sign(user_params[:password])
    if User.create(email: user_params[:email], password: user_params[:password], password_confirmation: user_params[:password], name: user_params[:name], last_name: user_params[:last_name], department: user_params[:department], role: user_params[:rol] , created_at: Time.now, updated_at: Time.now, company_id: user_params[:company_id])
    @user = User.find_by(email:  user_params[:email])
     if user_params[:rol] == "Supervisor"
      @user.add_role :regional
    else
      @user.add_role :general
    end 
    render json: @user
    else
      render json: {errors: ['Error al crear usuario']}, status: :unauthorized
    end
  end

  def authenticate
    @attempts = 0
    begin
      user = User.find_by(email: params[:email])
      if user.lock
           render json: {lock: true}
      else
          if user.valid_password?(params[:password])  
            @attempts = 0
            user.attempts = 0
            user.save
            if (user.has_role? :regional)
              role = 'regional'
            else
              if (user.has_role? :general)
                role = 'general'
              else
                role = 'empresa'
              end
            end

            jwt = Auth.issue({user: user.id, role: role, company_id: user.company_id, date_validate: Time.now+1.days, address: request.remote_ip})
            company = Company.find_by(id: user.company_id)

            company_name = ''
            if company != nil
              company_name = company.name
            end

            render json: {token: jwt,id: user.id, role: role, company_id: user.company_id, department: user.department,user_name: user.name + ' ' + user.last_name, company_name: company_name, name: user.name, last_name: user.last_name, email: user.email}
          else
            user.attempts = user.attempts + 1
            @attempts = @attempts +1
            user.save
            if(user.attempts >= 3 || @attempts >=3)
              @attempts = 0
              user.lock = true
              user.attempts = 0
              user.save
            end
            render json: {errors: ['Invalid Username/Password']}, status: :unauthorized
          end
      end
    rescue ArgumentError
      render json: {errors: ['Invalid Username/Password']}, status: :unauthorized
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :last_name, :email, :department, :password, :password_confirmation,:new_password, :new_password_confirmation, :id, :company_id, :rol,:role, :option, :new_name, :new_last_name, :new_email, :new_address, :new_department,:attempts,:lock)
  end
end
