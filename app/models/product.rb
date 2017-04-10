class Product < ApplicationRecord

  validates :commercial_name,
            :description,
            presence: true
  belongs_to :company
  #has_many :categories
  has_many :statistics_products
  has_many :comments


  SERVICES = File.join Rails.root, 'public', 'image_store'
  after_save :save_image

    def image=(file_data)
      unless file_data.blank?
        @file_data = file_data
      end
    end
    def image_filename
      File.join PRODUCTS, "product#{id+1}.gif"
    end

    def image_path
      "/image_store/product#{id}.gif"
    end

    def has_image?
      File.exists? image_filename
    end

    private
    def save_image
      if @file_data
        FileUtils.mkdir_p PRODUCTS
        File.open(image_filename,'wb') do |f|
          f.write(@file_data.read)
        end
        @file_data=nil
      end
    end

  def self.join_with_company
    joins(:company)
  end

  def self.search_department(department)
      where(companies: {department: department,status: true})
  end

  def self.letter_search(letter)
      where(companies: {status: true}).where("commercial_name LIKE '#{letter}%'")
  end
  #private_class_method :ransackable_attributes

  def self.search(search)
      where(companies: {status: true}).where("commercial_name LIKE ?", "%#{search}%")
  end

  def self.starting_with(letter)
      where(companies: {status: true}).where("commercial_name LIKE ?", "#{letter}%")
  end

  def self.search_with_letter_and_departament(letter,department)
    join_with_company.letter_search(letter).search_department(department)
  end

  def self.search_with_word_and_departament(word,department)
    join_with_company.search(word).search_department(department)
  end

  def self.search_by_letter(letter)
    join_with_company.letter_search(letter)
  end

  def self.search_by_department(department)
    join_with_company.search_department(department)
  end

  def self.search_by_word(word)
    join_with_company.search(word)
  end

end
