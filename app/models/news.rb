class News <ApplicationRecord
  NEWS = File.join Rails.root, 'public', 'image_store'
  after_save :save_image

    def image=(file_data)
      unless file_data.blank?
        @file_data = file_data
      end
    end

    def image_filename
      File.join NEWS, "new#{id+1}.jpg"
    end

    def image_path
      "/image_store/new#{id}.jpg"
    end

    def has_image?
      File.exists? image_filename
    end

    private
    def save_image
      if @file_data
        FileUtils.mkdir_p NEWS
        File.open(image_filename,'wb') do |f|
          f.write(@file_data.read)
        end
        @file_data=nil
      end
    end
end
