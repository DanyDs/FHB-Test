class UserMailer < ApplicationMailer
  default from: 'hechoenbolivia73@gmail.com'
  layout 'mailer'

 def welcome_email(company)
   @company = company
   mail(to: @company.email, subject: 'Bienvenido al Catálogo de Productos Y Servicios "Hecho en Bolivia"')
 end

 def welcome_email_suscribers(suscriber)
   @suscriber = suscriber
   mail(to: @suscriber.email,subject: 'Suscripcion a novedades del Catálogo "Hecho en Bolivia"')
  end
  def accepted_company(company)
    @company=company
    mail(to: @company.email, subject: 'Bienvenido al Catálogo de Productos Y Servicios "Hecho en Bolivia"')
  end
  def rejected_company(company)
    @company=company
    mail(to: @company.email, subject: 'Malas noticias del Catálogo Hecho en Bolivia')
  end
  def accepted_down_company(company)
    @company = company
    mail(to: @company.email, subject: 'Solicitud de baja del Catálogo "Hecho en Bolivia" - Aceptada')
  end
  def rejected_down_company(company)
    @company = company
    mail(to: @company.email, subject: 'Solicitud de baja del Catálogo "Hecho en Bolivia" - Rechazada')
  end
end
