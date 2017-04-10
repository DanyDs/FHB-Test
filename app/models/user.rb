class User < ApplicationRecord
  rolify
  #EMAIL_REGEX = /\A([a-z0-9][\._\-]?)+@(\w)+(\.([a-z])+)+\z/i
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  validates :email, :uniqueness=>{message:"Ya esta registrado"}

   #validates :email,format: {with:  EMAIL_REGEX,message:"Formato invalido"}
end
