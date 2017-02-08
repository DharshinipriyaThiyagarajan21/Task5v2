class Brand < ApplicationRecord
    has_many :projects
    has_many :users
    has_many :histories, as: :link
end
