class Invitation < ApplicationRecord
    belongs_to :user
    belongs_to :invitee, :class_name => 'User'
    belongs_to :brand
end
