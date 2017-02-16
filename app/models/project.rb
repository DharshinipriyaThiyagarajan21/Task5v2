class Project < ApplicationRecord
    has_many :tasks
    belongs_to :brand
    has_and_belongs_to_many :users
    has_many :histories, as: :link
    scope :user_with_brand,-> {
        User.all.where.not(:brand_id => nil)
        }
end