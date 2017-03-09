class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  # acts_as_token_authenticatable


  devise :database_authenticatable, :registerable, :confirmable,
       :recoverable, :rememberable, :trackable
  mount_uploader :avatar, AvatarUploader

  has_and_belongs_to_many :projects
  has_and_belongs_to_many :tasks
  belongs_to :brand, optional: true
  has_many :invitations
  has_many :assigned, :through => :tasks
  has_many :invitees,->{where(invitations: {status: 'pending'})}, :through => :invitations
  has_many :inverse_invitations, :class_name => "Invitation", :foreign_key => "invitee_id"
  has_many :inverse_invitees,->{where(invitations: {status: 'pending'})}, :through => :inverse_invitations, :source => :user
  has_many :invites
  has_and_belongs_to_many :proadmins
  has_many :histories, as: :link
  validates :username, :presence => true
  validates :avatar, :presence => false
end
