class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  # acts_as_token_authenticatable

  devise :database_authenticatable, :registerable,
       :recoverable, :rememberable, :trackable

  has_and_belongs_to_many :projects
  has_and_belongs_to_many :tasks
  belongs_to :brand, optional: true
  has_many :invitations
  has_many :invitees, :through => :invitations
  has_many :inverse_invitations, :class_name => "Invitation", :foreign_key => "invitee_id"
  has_many :inverse_invitees, :through => :inverse_invitations, :source => :user
  validates :username, :presence => true
  validates :fullname, :presence => true
end
