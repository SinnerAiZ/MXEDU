class Index::Product < ApplicationRecord
	mount_uploader :cover, ProductsCoverUploader # 封面上传

	# 用于上传头像时保存图片参数
	attr_accessor :x, :y, :width, :height, :rotate

	store_accessor :info, :recommend, :need_login

	belongs_to :school,
				# counter_cache: true,
				class_name: 'Manage::School',
				foreign_key: :school_id,
				optional: true

	belongs_to :cate,
				# counter_cache: true,
				class_name: 'Manage::ProductCate',
				foreign_key: :cate_id

	belongs_to :company,
				# counter_cache: true,
				class_name: 'Manage::ProductCompany',
				foreign_key: :company_id

	has_many :appoints,
			 class_name: 'Index::Appoint',
			 foreign_key: :product_id

	belongs_to :admin, -> { with_del },
				class_name: 'Manage::Admin',
				foreign_key: :admin_id

	validates :name, length: { minimum: 1, too_short: '产品名不能为空', maximum: 32, too_long: '产品名最大长度为%{count}' }
    validates :cate, length: { minimum: 1, too_short: '类型不能为空' }
	validates :company, length: { minimum: 1, too_short: '公司/机构不能为空' }
	validates :price, numericality: { greater_than_or_equal_to: 0 }, length: { minimum: 0, too_short: '原价不能为空' }
	validates :dis_price, numericality: { greater_than_or_equal_to: 0 }, length: { minimum: 0, too_short: '优惠价不能为空' }
	validates :recommend, numericality: { less_than_or_equal_to: 5, greater_than_or_equal_to: 0 }
	validates :tag, length: { maximum: 15, too_long: '标签最大长度为%{count}' }

	validates :intro, length: { maximum: 128, too_long: '简介最长为%{count}个字符' }
	validates :details, length: { minimum: 1, too_short: '详情不能为空', aximum: 10000, too_long: '详情最长为%{count}个字符' }

	default_scope { where(is_deleted: false).order(readtimes: :DESC) }
	scope :deleted, -> { unscope(where: :is_deleted).where(is_deleted: true) }
	scope :with_del, -> { unscope(where: :is_deleted) }

	# 复杂条件筛选
	def self.sort(cons = {})
		_self = self
		_self = _self.where(cate_id: cons[:cate]) if cons[:cate]
		_self = _self.where(school_id: cons[:school]) if cons[:school] && cons[:school] != 'NONE'
		_self = _self.where(company_id: cons[:company]) if cons[:company]
		if cons[:name] && cons[:tag]
			_self = _self.where("index_products.name LIKE ? OR index_products.tag LIKE ?", "%#{cons[:name]}%", "%#{cons[:tag]}%")
		else
			_self = _self.where("index_products.name LIKE ?", "%#{cons[:name]}%" ) if cons[:name]
			_self = _self.where("index_products.tag LIKE ?", "%#{cons[:tag]}%" ) if cons[:tag]
		end

		_self ||= self.all
	end

	def _update prms
		origin_cate = self.cate
		origin_company = self.company
		origin_school = self.school
		ApplicationRecord.transaction do # 出错将回滚
			self.update prms
			if (origin_cate && (cate != origin_cate))
				cate.update products_count: (cate.products_count + 1)
				p_count = origin_cate.products_count - 1
				p_count = 0 if p_count < 0
				origin_cate.update products_count: p_count
			end
			if (origin_company && (company != origin_company))
				company.update products_count: (company.products_count + 1)
				p_count = origin_company.products_count - 1
				p_count = 0 if p_count < 0
				origin_company.update products_count: p_count
			end
			if (origin_school && (school != origin_school))
				school.update products_count: (school.products_count + 1)
				p_count = origin_school.products_count - 1
				p_count = 0 if p_count < 0
				origin_school.update products_count: p_count
			end
		end
	end

	def fake_readtimes
		(self.readtimes || 0)+ (self.id % 11 + 3) * 21
	end
end
