class Api::V1::CompaniesController < ApplicationController
  require 'auth'
  def index
    @companies = Company.all
    @companies.each do |company|
      company.created_at=company.created_at.to_date.strftime("%B %d, %Y")
    end
    respond_to do |format|
      format.json { render :json => @companies }
      # format.html # index.html.erb
    end
  end

  def listByCategory

    @companies = Company.select("DISTINCT Companies.*").joins(:products).where("products.category_id = ?", params[:categoryId])

    respond_to do |format|
      format.json { render :json => @companies }
    end
  end

  def message
   @params= params
   ContactMailer.contact_send(params).deliver
   flash[:notice]= "mensaje enviado"
   redirect_to companies_path
  end


  def show
    @company = Company.find(params[:id])
    respond_to do |format|
        format.json { render :json => @company }
    end

  end
  def profile
    @company=Company.find(getUserCompany)
    respond_to do |format|
        format.json { render :json => @company }
      end
  end
  def departments
    @user= User.find(params[:user_id])
    @departments= @user.department.split(',')
    @companies=Company.where(department: "Chile")
    @departments.each do |depar|
      @empresas= Company.where(department: depar.strip)
      @companies=@companies.or(@empresas)
    end
    @companies.each do |company|
      company.created_at=company.created_at.to_date.strftime("%B %d, %Y")
    end
    respond_to do |format|
      format.json { render :json => @companies }
      format.html # index.html.erb
    end
  end


  def new
    @company = Company.new
    @case=1
  end

  def listAllProducts
    # @company = Company.find(idCom)
    @products = Company.find(params[:companyId]).products
    respond_to do |format|
        format.json { render :json => @products }
        format.html
    end
  end

  def listAllServices
    # @company = Company.find(idCom)
    @services = Company.find(params[:companyId]).services
    respond_to do |format|
        format.json { render :json => @services }
        format.html
    end
  end

# POST /companies.json
  def create
    crypt = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    encrypted_password = crypt.encrypt_and_sign(params[:password])
    Company.transaction do
      @company = Company.new(company_params)
      @company.status=false
      respond_to do |format|
        if @company.save
          createUserFor(@company)
          encryptPass(@company)
          @company.update(password: encrypted_password)
          save_image params[:logoData], "public/image_store/logo_#{ @company.id }.gif"
          save_image params[:nitData], "public/image_store/nit_#{ @company.id }.gif"
          @company.update(logo_file_name: '/image_store/logo_' + @company.id.to_s + '.gif')
          UserMailer.welcome_email(@company).deliver_now
          format.json { render json: @company, status: :ok }
          #format.json { render status: :ok, json: @company }
        else
          format.json { render json: @company.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  def requests
    if not(isUserAuthenticated and isUserRole('regional'))
      throwUnauthorized
      return
    end
    @companies = Company.all
    @companies.each do |company|
      company.created_at=company.created_at.to_date.strftime("%B %d, %Y")
    end
    respond_to do |format|
      format.json { render :json => @companies }

    end

  end

  def update
    if not(isUserAuthenticated and isUserRole('empresa') or isUserRole('regional'))
      throwUnauthorized
      return
    end
    if ( isUserRole('regional'))
    @company=Company.find_by(id: params[:id])
    @company.update(name: params[:name],
                    contactName: params[:contactName],
                    email: params[:email],
                    detail:params[:detail],
                    address:params[:address],
                    telephone: params[:telephone],
                    webpage:params[:webpage],
                    department: params[:department],
                    reason: params[:reason],
                    status: params[:status],
                    requested: params[:requested],
                    downed: params[:downed],
                    downed_reason: params[:downed_reason])
      if (@company.requested === false && @company.status === true && @company.downed_reason === nil)
        UserMailer.accepted_company(@company).deliver_now
      elsif (@company.requested === false && @company.status === false && (@company.downed === nil || @company.downed === false))
        UserMailer.rejected_company(@company).deliver_now
      elsif (@company.downed === true && @company.requested === false && @company.status === false)
        UserMailer.accepted_down_company(@company).deliver_now
      elsif (@company.downed === false && @company.requested === false && @company.status === true)
        UserMailer.rejected_down_company(@company).deliver_now
      end
    end
    if ( isUserRole('empresa'))
      @company=Company.find_by(id: params[:id])
      if (params[:logoData]!=nil)
        save_image params[:logoData], "public/image_store/logo_#{ @company.id }.gif"
      end
      @company.update(name: params[:name],
                    contactName: params[:contactName],
                    email: params[:email],
                    detail:params[:detail],
                    address:params[:address],
                    telephone: params[:telephone],
                    webpage:params[:webpage],
                    department: params[:department],
                    reason: params[:reason],
                    status: params[:status],
                    requested: params[:requested],
                    downed: params[:downed],
                    downed_reason: params[:downed_reason],
                    subsidiaries: params[:subsidiaries])
        end
  end


  def getDowned
    @companies = Company.all
    @companies.each do |company|
      company.created_at=company.created_at.to_date.strftime("%B %d, %Y")
    end
    respond_to do |format|
      format.json { render :json => @companies, :only => [:id, :name, :downed, :downed_reason] }
      format.html # index.html.erb
    end
  end
  def requestDown
    @company = Company.find_by(id: params[:id])
    respond_to do |format|
      format.json { render :json => @company, :only => [:id, :name, :downed, :downed_reason] }
      format.html # index.html.erb
    end
  end

  def showVisitor
    @company = Company.find(params[:id])
    respond_to do |format|
        format.json { render :json => @company }
        format.html # index.html.erb
    end
  end


    # Use callbacks to share common setup or constraints between actions.
    def set_company
      @company = Company.find(params[:id])
    end

  private
    def createUserFor(company)
      user=User.new(email: company.email,
                         password: company.password,
                         password_confirmation: company.password,
                        #  username: company.contactName.gsub(/[^0-9A-Za-z]/, ''),
                         name: company.contactName.partition(' ').first,
                         last_name: company.contactName.partition(' ').last,
                         department: company.department,
                         company_id: company.id,
                         role: "Empresa",
                         created_at: Time.now,
                         updated_at: Time.now)

      (user.add_role :empresa) # sets a global role
      if user.save
      else
        render json: {errors: ['Error al crear empresa']}, status: :unauthorized
      end
    end
    def encryptPass(company)

    end
    def save_image(base64content, path)
      content = base64content
      content = content.partition(',').last

      decode_base64_content = Base64.decode64(content)
      File.open(path, "wb") do |f|
        f.write(decode_base64_content)
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def company_params
      params.require(:company).permit(:name,:email,:nit,:nitimage,:logo,:address,:telephone,:status,:department,:detail,:rubro,:webpage,:contactName,:downed,:requested,:subsidiaries,:downed_reason,:downd_date,:reason,:logoData,:password)
    end
    def company_params_for_edit
      params.require(:company).permit(:name,:email,:address,:logo,:telephone,:department,:status,:downed,:requested,:contactName,:detail,:webpage,:subsidiaries,:downed_reason)
    end
end
