require 'test_helper'

class SpaControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get spa_index_url
    assert_response :success
  end

end
