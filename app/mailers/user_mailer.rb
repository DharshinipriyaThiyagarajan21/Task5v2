# class UserMailer < ActionMailer::Base
# 	default :from => "sriram@codingmart.com"

# 	def registration_confirmation(user)
# 		@user = usermail(:to => "#{user.name} <#{user.email}>", :subject => "Please confirm your registration")
# 	end
# end