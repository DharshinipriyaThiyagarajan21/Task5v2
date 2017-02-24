class Project < ApplicationRecord
    has_many :tasks
    belongs_to :brand
    belongs_to :admin, :class_name => 'User'
    has_and_belongs_to_many :users
    has_many :histories, as: :link
    # scope :user_with_brand,-> (current_user){
    #     User.all.where.not(:brand_id => nil) - [current_user]
    #     }
end