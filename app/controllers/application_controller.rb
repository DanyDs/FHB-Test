class ApplicationController < ActionController::Base
  require 'auth'
  protect_from_forgery unless: -> { request.format.json? }
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up).push(:name, :last_name, :email, :username, :address, :department)
  	devise_parameter_sanitizer.for(:account_update).push(:name, :last_name, :email, :username, :address, :department)
  end

  def throwUnauthorized
    render json: {errors: ['No autorizado para esta operacion']}, status: :unauthorized
  end

  def isUserAuthenticated
    @token = getDecodedToken
    return @token != nil
  end

  def isUserRole(expectedRole)
    @role = getUserRole
    return @role == expectedRole
  end

  def isUserAuthorizedForCompany(company_id)
    @company = getUserCompany
    return @company == company_id
  end

  def getUserCompany
    @token = getDecodedToken
    if(@token == nil or @token["role"]!="empresa")
      return nil
    else
      return @token["company_id"]
    end
  end

  def getUserId
    @token = getDecodedToken
    if(@token == nil)
      return nil
    else
      return @token["user"]
    end
  end

  def getUserRole
    @token = getDecodedToken

    if @token == nil
      return "visitor"
    else
      return @token["role"]
    end
  end

  def save_image(base64content, path)
    if (base64content == nil or base64content == "")
      return
    end

    if (path == nil or path == "")
      return
    end

    content = base64content
    content = content.partition(',').last

    decode_base64_content = Base64.decode64(content)
    File.open(path, "wb") do |f|
      f.write(decode_base64_content)
    end
  end

  private
    def getDecodedToken
      @token = request.headers["Authorization"]
      if @token == nil
        return nil
      else
        return Auth.decode(@token)
      end
    end
end
