class Advertisement < ApplicationRecord
  belongs_to :company
  # before_create :publicationDateTrue?
  # before_create :expirationDateTrue?
  # def publicationDateTrue?
  #   if( publicationDate > Date.today)
  #     return true
  #   else
  #     errors.add(:publicationDate, "Debe ser Mayor a la fecha actual")
  #     return false
  #   end
  # end
  #  def expirationDateTrue?
  #   if( expirationDate > Date.today)
  #     return true
  #   else
  #     errors.add(:expirationDate, "Debe ser Mayor a la fecha actual")
  #     return false
  #   end
  # end
  #attr_accessible :description,:publicationDate,:expirationDate, :image
  ADVERTISEMENTS = File.join Rails.root, 'public', 'image_store'
  after_save :guardar_imagen

    def image=(file_data)
      unless file_data.blank?
        @file_data = file_data
      end
    end
    def image_filename
      File.join ADVERTISEMENTS, "#{id}.jpg"
    end

    def image_path
      "/image_store/#{id}.jpg"
    end

    def has_image?
      File.exists? image_filename
    end

    private
    def guardar_imagen
      if @file_data
        FileUtils.mkdir_p ADVERTISEMENTS
        File.open(image_filename,'wb') do |f|
          f.write(@file_data.read)
        end
        @file_data=nil
      end
    end
end
