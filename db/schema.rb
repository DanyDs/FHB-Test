# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170301025933) do

  create_table "advertisements", force: :cascade do |t|
    t.text     "description"
    t.integer  "id_Company"
    t.boolean  "isAccepted"
    t.boolean  "isPublicized"
    t.date     "publicationDate"
    t.date     "expirationDate"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "state"
    t.text     "reason"
    t.boolean  "expired"
    t.string   "companyName"
  end

  create_table "appusers", force: :cascade do |t|
    t.string   "name"
    t.string   "lastname"
    t.string   "email"
    t.string   "password"
    t.string   "confirm_password"
    t.string   "reset_password"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "category_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text     "detail"
    t.integer  "likes_count"
    t.integer  "dislikes_count"
    t.integer  "products_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["products_id"], name: "index_comments_on_products_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "nit"
    t.string   "address"
    t.string   "telephone"
    t.boolean  "status"
    t.string   "department"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "nitimage"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.string   "detail"
    t.string   "rubro"
    t.boolean  "requested"
    t.boolean  "downed"
    t.string   "subsidiaries"
    t.string   "contactName"
    t.string   "downed_reason"
    t.string   "webpage"
    t.date     "downed_date"
    t.text     "reason"
    t.string   "logo"
    t.string   "password"
  end

  create_table "guides", force: :cascade do |t|
    t.string   "name"
    t.string   "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "title"
  end

  create_table "news", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.string   "imageAddress"
    t.integer  "tagId"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.text     "full"
    t.string   "location"
    t.date     "date"
    t.string   "image"
    t.string   "link"
    t.boolean  "hasImage"
  end

  create_table "products", force: :cascade do |t|
    t.string   "commercial_name"
    t.string   "feature"
    t.text     "description"
    t.string   "image_path"
    t.string   "tariff_position"
    t.boolean  "visibility_state"
    t.integer  "company_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "certification"
    t.integer  "category_id"
    t.index ["company_id"], name: "index_products_on_company_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["name"], name: "index_roles_on_name"
  end

  create_table "services", force: :cascade do |t|
    t.string   "commercial_name"
    t.string   "feature"
    t.text     "description"
    t.string   "image_path"
    t.string   "tariff_position"
    t.string   "certification"
    t.boolean  "visibility_state"
    t.integer  "company_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "category_id"
    t.index ["company_id"], name: "index_services_on_company_id"
  end

  create_table "statistics_companies", force: :cascade do |t|
    t.date     "visit_date"
    t.integer  "visit_count"
    t.integer  "company_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["company_id"], name: "index_statistics_companies_on_company_id"
  end

  create_table "statistics_products", force: :cascade do |t|
    t.date     "visit_date"
    t.integer  "visit_count"
    t.integer  "product_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["product_id"], name: "index_statistics_products_on_product_id"
  end

  create_table "statistics_services", force: :cascade do |t|
    t.date     "visit_date"
    t.integer  "visit_count"
    t.integer  "service_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["service_id"], name: "index_statistics_services_on_service_id"
  end

  create_table "subsidiaries", force: :cascade do |t|
    t.string   "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "auxId"
    t.integer  "company_id"
    t.index ["company_id"], name: "index_subsidiaries_on_company_id"
  end

  create_table "suscribers", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "code"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "name"
    t.string   "last_name"
    t.string   "department"
    t.integer  "company_id"
    t.string   "role"
    t.boolean  "lock",                   default: false
    t.integer  "attempts",               default: 0
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
  end

end
