require 'test_helper'

class StatisticsProductsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get statistics_products_index_url
    assert_response :success
  end

  test "should get show" do
    get statistics_products_show_url
    assert_response :success
  end

  test "should get new" do
    get statistics_products_new_url
    assert_response :success
  end

  test "should get create" do
    get statistics_products_create_url
    assert_response :success
  end

  test "should get edit" do
    get statistics_products_edit_url
    assert_response :success
  end

  test "should get update" do
    get statistics_products_update_url
    assert_response :success
  end

  test "should get destroy" do
    get statistics_products_destroy_url
    assert_response :success
  end

  test "should get statistics_products_params" do
    get statistics_products_statistics_products_params_url
    assert_response :success
  end

end
