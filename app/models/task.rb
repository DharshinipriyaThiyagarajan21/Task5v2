class Task < ApplicationRecord
    has_and_belongs_to_many :users
    belongs_to :assigned, :class_name => 'User'
    belongs_to :project
    has_many :histories, as: :link
end
