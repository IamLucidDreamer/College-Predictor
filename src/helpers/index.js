const { loggerUtil } = require("../utils/logger")

const predictionHelper = (req, schema) => {
	return new Promise(async (accept, reject) => {
		const body = req.body
		const arr = []
		for (a in req.body) {
			if (body[a]?.length && a !== 'rank') {
				arr.push({
					[a]: {
						$exists: true,
						$in: body[a]
					}
				})
			}
		}
		await schema
			.aggregate([
				{
					$match: {
						$and: arr
					}
				}
			])
			.then(data => {
				const passedData = data.filter(val => val.closingRank + (val?.closingRank / 10) >= body.rank)
				const processedData = [...passedData.map(val => {
					if (val?.closingRank >= body.rank) {
						val.percentage = 100
						return val
					}
					else {
						val.percentage = 100 - Math.ceil(((parseInt(body.rank) - val?.closingRank) / (val?.closingRank / 10)) * 100)
						return val
					}
				})
				]
				if (body.rank) {
					accept({
						status: 'SUCCESS',
						data: processedData
					})
				} else {
					accept({
						status: 'SUCCESS',
						data: processedData
					})
				}
			})
			.catch(err => {
				reject(err)
			})
	})
}

const dropdownValuesHelper = (req, schema) => {
	return new Promise(async (accept, reject) => {
		let mapObj = {},
			groupObj = {}
		const body = req.body
		for (const key in body) {
			mapObj = {
				...mapObj,
				...(body[key].length
					? {
						...{
							[key]: {
								$in: body[key]
							}
						}
					}
					: {})
			}
			groupObj = {
				...groupObj,
				[key]: '$' + key
			}
		}
		await schema
			.aggregate([
				{
					$match: {
						...mapObj
					}
				},
				{
					$group: {
						_id: {
							...groupObj
						}
					}
				}
			])
			.then(data => {
				accept({
					status: 'SUCCESS',
					data: data.map(val => ({
						...val?._id
					}))
				})
			})
			.catch(err => {
				reject(err)
			})
	})
}

module.exports = {
	predictionHelper,
	dropdownValuesHelper
}
