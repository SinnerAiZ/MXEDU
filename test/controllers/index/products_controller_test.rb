require 'test_helper'

class Index::ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @product = index_products(:one)
  end

  test "should get index" do
    get index_products_url
    assert_response :success
  end

  test "should get new" do
    get new_index_product_url
    assert_response :success
  end

  test "should create index_product" do
    assert_difference('Index::Product.count') do
      post index_products_url, params: { index_product: { info: @product.info, intro: @product.intro, name: @product.name, price: @product.price } }
    end

    assert_redirected_to index_product_url(Index::Product.last)
  end

  test "should show index_product" do
    get index_product_url(@product)
    assert_response :success
  end

  test "should get edit" do
    get edit_index_product_url(@product)
    assert_response :success
  end

  test "should update index_product" do
    patch index_product_url(@product), params: { index_product: { info: @product.info, intro: @product.intro, name: @product.name, price: @product.price } }
    assert_redirected_to index_product_url(@product)
  end

  test "should destroy index_product" do
    assert_difference('Index::Product.count', -1) do
      delete index_product_url(@product)
    end

    assert_redirected_to index_products_url
  end
end
