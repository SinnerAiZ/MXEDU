class Index::MaterialsController < IndexController
  before_action :check_login
  before_action :set_material, only: [:show, :edit, :update, :destroy]

  # GET /index/materials
  # GET /index/materials.json
  def index
    count = params[:count] || 20
    page = params[:page] || 1
    cons = set_rec_cons params.slice(:name, :school, :cate, :tag, :grade)
    nonpaged_materials = Index::Material.sort(cons)
    @materials = nonpaged_materials.page(page).per(count).includes(:cate, :school)
    set_cdts
  end

  # GET /index/materials/1
  # GET /index/materials/1.json
  def show
    if !@user && @material.need_login
      Cache.new[request.remote_ip + '_history'] = request.url
    end
    @likes = Index::Material.sort({cate: @material.cate_id, school: @material.school_id}).where.not(id: @material.id).limit(5)
  end

  def download
      @file = Manage::MaterialFile.find params[:file_id]
      redirect_to login_path and return if (!@user && @file.material.need_login)

      filepath = "#{Rails.root}/public#{@file.file.url}"
      filename = @file.name;
      send_file(filepath, filename: filename, content_type: @file.f_type, content_length: @file.size)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_material
      @material = Index::Material.find(params[:id])
    end

    def set_cdts
        cons = Rails.cache.fetch("#{cache_key}_cd", expires_in: 10.minutes) do
          {
            schools: Manage::School.limit(8),
            cates: Manage::MaterialCate.limit(10)
          }
        end
        @schools = cons[:schools]
        @cates = cons[:cates]
    end

    def set_rec_cons cons
        cons[:school] = @user.school_id if @user && cons[:school].nil? # 院校资料推荐
        # if @user.grade
        #
        # end
        cons
    end
end
