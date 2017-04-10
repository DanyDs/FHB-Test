class Company < ApplicationRecord

  EMAIL_REGEX = /\A([a-z0-9(ñÑ)][\._\-]?)+(@)(\w)+(\.[a-z]+)+\z/i
  CONTACT_NAME_REGEX = /(\w)+\s+(\w)/i

  validates :name,
            :email,
            :contactName,
            :nit,
            :address,
            :telephone,
            :department,
            presence: true
  validates :password, :presence =>{message:"No puede estar en blanco"}
  validates :email, format: {with: EMAIL_REGEX, message: "Dirección de correo electrónico invalida"}
  validates :contactName, format: {with: CONTACT_NAME_REGEX, message:"Nombre de contacto invalido. Nombre y Apellidos requeridos."}
  validates :email, :uniqueness=>{message:"Ya esta registrado"}
  has_many :advertisement
  has_many :products
  has_many :services
  has_many :statistics_companies


  def self.ransackable_attributes(auth_object = nil)
    super & ['department']
  end


  def self.search_by_department(department)
      where(department: department, status: true)
  end

  def self.search_by_letter(letter)
      where(status: true).where("name LIKE '#{letter}%'")
  end
  #private_class_method :ransackable_attributes

  def self.search_by_word(search)
      where(status: true).where("name LIKE ?", "%#{search}%")
  end

  def self.search_with_letter_and_departament(letter,department)
    search_by_letter(letter).search_by_department(department)
  end

  def self.search_with_word_and_departament(word,department)
    search_by_word(word).search_by_department(department)
  end
end
