require 'test_helper'

class StatisticsCompaniesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get statistics_companies_index_url
    assert_response :success
  end

  test "should get show" do
    get statistics_companies_show_url
    assert_response :success
  end

  test "should get new" do
    get statistics_companies_new_url
    assert_response :success
  end

  test "should get edit" do
    get statistics_companies_edit_url
    assert_response :success
  end

  test "should get create" do
    get statistics_companies_create_url
    assert_response :success
  end

  test "should get update" do
    get statistics_companies_update_url
    assert_response :success
  end

  test "should get destroy" do
    get statistics_companies_destroy_url
    assert_response :success
  end

  test "should get statistics_companies_params" do
    get statistics_companies_statistics_companies_params_url
    assert_response :success
  end

end
