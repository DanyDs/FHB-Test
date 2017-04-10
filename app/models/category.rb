class Category < ApplicationRecord
	has_many :categories

	def self.starting_with(letter)
		where("name LIKE ?", "#{letter}%")
	end
end
