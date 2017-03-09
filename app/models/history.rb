class History < ApplicationRecord
    belongs_to :link, polymorphic:true
    belongs_to :user
end
