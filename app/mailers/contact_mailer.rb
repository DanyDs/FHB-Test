class ContactMailer < ApplicationMailer

  default from: "pruebahechoenbolivia123@gmail.com"

  def contact_send(params)
#  @company=company
   @parameters=params
    mail(to:@parameters[:companymail], subject:"Empresa")
  end

end
