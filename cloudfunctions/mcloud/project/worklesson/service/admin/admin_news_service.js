/**
 * Notes: 资讯后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const AdminHomeService = require('../admin/admin_home_service.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const util = require('../../../../framework/utils/util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');

const NewsModel = require('../../model/news_model.js');

class AdminNewsService extends BaseProjectAdminService {

	/** 推荐首页SETUP */
	async vouchNewsSetup(id, vouch) {
		this.AppError('[课时]功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**添加资讯 */
	async insertNews({
		title,
		cateId, //分类
		cateName,
		order,
		desc = '',
		forms
	}) {
    const current = timeUtil.time();
    const timestamp = current + dataUtil.genRandomString(3);
    console.log("insertNews, time: " + current + ", timestamp: " + timestamp);
    console.log("title: " + title + ", cateId: " + cateId + ", cateName: " + cateName + ", desc: " + desc + ", forms: " + forms)
    const data = {
      NEWS_ID: timestamp,
      NEWS_TITLE : title,
      NEWS_DESC : desc,
      NEWS_CATE_ID : cateId,
      NEWS_CATE_NAME : cateName,
      NEWS_ORDER : order,
      NEWS_ADD_TIME : current,
      NEWS_EDIT_TIME : current
    }

    let result = NewsModel.insert(data);
    return result;

		// this.AppError('[insertNews]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除资讯数据 */
	async delNews(id) {
    const where = {
      NEWS_ID : id
    };
    let effect = NewsModel.del(where);
    return {
      effect
    };
		// this.AppError('[delNews]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**获取资讯信息 */
	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}

	// 更新forms信息
	async updateNewsForms({
		id,
		hasImageForms
	}) {
		this.AppError('[updateNewsForms]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**
	 * 更新富文本详细的内容及图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent({
		id,
		content // 富文本数组
	}) {

    const where = {
      _id : id
    };
    console.log("updateNewsContent, id: " + id + ", content: " + content);
    await NewsModel.edit(where, { NEWS_CONTENT: content});
	}

	/**
	 * 更新资讯图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic({
		id,
		imgList // 图片数组
	}) {
    const where = {
      _id : id
    };
    console.log("updateNewsPic, id: " + id + ", pic: " + imgList);
    await NewsModel.edit(where, { NEWS_PIC: imgList});

		// this.AppError('[updateNewsPic]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**更新资讯数据 */
	async editNews({
		id,
		title,
		cateId, //分类
		cateName,
		order,
		desc = '',
		forms
	}) {

    const where = {
      _id : id
    };
    console.log("editNews, id: " + id + ", title: " + title + "， forms: " + forms);
    let news = NewsModel.getOne(where);
    if (!news)
      this.AppError("当前bot不存在，id: " + id);

    let newNews = {
      NEWS_TITLE : title,
      NEWS_CATE_ID : cateId,
      NEWS_CATE_NAME : cateName,
      NEWS_ORDER : order,
      NEWS_DESC : desc
    }
    await NewsModel.edit(where, newNews);
		// this.AppError('[editNews]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**取得资讯分页列表 */
	async getAdminNewsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_TITLE,NEWS_DESC,NEWS_CATE_ID,NEWS_CATE_NAME,NEWS_EDIT_TIME,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE2_NAME,NEWS_VOUCH,NEWS_QR,NEWS_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ NEWS_TITLE: ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.NEWS_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.NEWS_STATUS = Number(sortVal);
					break;
				}
				case 'vouch': {
					where.and.NEWS_VOUCH = 1;
					break;
				}
				case 'top': {
					where.and.NEWS_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'NEWS_ADD_TIME');
					break;
				}

			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/**修改资讯状态 */
	async statusNews(id, status) {
    let where = {
      _id : id
    };
    await NewsModel.edit(where, { NEWS_STATUS : status });
	}

	/**置顶与排序设定 */
	async sortNews(id, sort) {
		this.AppError('[sortNews]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**首页设定 */
	async vouchNews(id, vouch) {
		this.AppError('[vouchNews]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}
}

module.exports = AdminNewsService;