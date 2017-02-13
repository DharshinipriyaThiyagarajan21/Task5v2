class Invite < ApplicationRecord
    belongs_to :user
    belongs_to :brand
    has_many :histories, as: :link
end
