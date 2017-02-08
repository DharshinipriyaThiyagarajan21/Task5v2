class Task < ApplicationRecord
    has_and_belongs_to_many :users
    belongs_to :project
    has_many :histories, as: :link
end
