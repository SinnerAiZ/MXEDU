class Manage::MaterialsController < ManageController
  before_action :require_login
  before_action :set_material, only: [:show, :edit, :update, :destroy, :upload, :uploader]

  # GET /index/materials
  # GET /index/materials.json
  def index
    count = params[:count] || 20
    page = params[:page] || 1

    nonpaged_materials = Index::Material.sort(params[:type])
    @materials = nonpaged_materials.page(page).per(count)
  end

  # GET /index/materials/1
  # GET /index/materials/1.json
  def show
  end

  # GET /index/materials/new
  def new
    @material = Index::Material.new
    set_select_cache
  end

  # GET /index/materials/1/edit
  def edit
  end

  # POST /index/materials
  # POST /index/materials.json
  def create
	prms = material_params
    @material = Index::Material.new(prms)
	@material.admin = @admin
	@material.need_login = prms[:need_login] ? true : false

    respond_to do |format|
      if @material.save
        format.html { redirect_to manage_material_path(@material), notice: 'Material was successfully created.' }
        format.json { render :show, status: :created, location: @material }
      else
        set_select_cache
        format.html { render :new }
        format.json { render json: @material.errors, status: :unprocessable_entity }
      end
    end
  end

  def upload

  end

  def uploader
      respond_to do |format|
        if @material.update(attach: params[:file])
          format.html { render html: manage_material_path(@material) }
          format.json { render json: { code: :Success } }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @material.errors, status: :unprocessable_entity }
        end
      end
  end

  # PATCH/PUT /index/materials/1
  # PATCH/PUT /index/materials/1.json
  def update
	  prms = material_params
	  @material.need_login = prms[:need_login] ? true : false
	  respond_to do |format|
		if @material.update(prms)
		  format.html { render html: manage_material_path(@material) }
		  format.json { render :show, status: :ok, location: @material }
		else
		  format.html { render :edit, status: :unprocessable_entity }
		  format.json { render json: @material.errors, status: :unprocessable_entity }
		end
	  end
  end

  # DELETE /index/materials/1
  # DELETE /index/materials/1.json
  def destroy
    @material.destroy
    respond_to do |format|
      format.html { redirect_to materials_url, notice: 'Material was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_material
      @material = Index::Material.find(params[:id] || params[:material_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def material_params
      params.require(:material).permit(:name, :cate_id, :tag, :school_id, :intro, :details, :cover, :attach, :recommend, :grade)
    end

    def set_select_cache
        info = Rails.cache.fetch("#{cache_key}", expires_in: 1.minutes) do
            {
                schools: Manage::School.all,
                cates: Manage::MaterialCate.all
            }
        end
        @schools = info[:schools]
        @cates = info[:cates]
    end
end
