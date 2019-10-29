import axios from 'axios';
import _ from 'lodash';

const documentBrands = {
	'elavon': 'f4693f61-dc64-4c7e-94d3-e6029e63adcd',
	'firstData': 'bbb8ae2b-8f07-4b41-ba45-ba8294fca679',
};

function calculateMonthlyFee(transactionFee, transactionTotal, transactionRate, transactionCount, serviceChargeRate){
	return Number.parseFloat(Number.parseFloat(transactionFee * transactionTotal + transactionRate * transactionCount + serviceChargeRate).toFixed(2));
}

const brandMappings = {
	elavon: res => {
		const totalSalesIndex = res.pages[0].tables[0].columns[0].entries.indexOf(_.find(res.pages[0].tables[0].columns[0].entries, (entry) => {
			return entry[0].text === 'Total Sales';
		}));

		const transactionCount = Number.parseFloat(res.pages[0].tables[0].columns[1].entries[totalSalesIndex][0].text.replace(/\D/g, ''));
		const transactionTotal = Number.parseFloat(res.pages[0].tables[0].columns[2].entries[totalSalesIndex][0].text.replace(/[^0-9.]/g, ''));

		const totalFeesIndex = res.pages[0].tables[0].columns[3].entries.indexOf(_.find(res.pages[0].tables[0].columns[3].entries, (entry) => {
			return entry[0].text === 'Total Charges and Fees';
		}));

		const feeTotal = Number.parseFloat(res.pages[0].tables[0].columns[4].entries[totalFeesIndex][0].text.replace(/[^0-9.]/g, ''));

		const heartlandFee = calculateMonthlyFee(0.0198, transactionTotal, 0.08, transactionCount, 33.50);

		return {
			transactionCount,
			transactionTotal,
			feeTotal,
			heartlandFee,
		}
	},
	firstData: res => {
		const totalFeesColumn = _.find(res.pages[1].tables[0].columns, (entry) => {
			return entry.header[0].text === 'Fees';
		});
		const feeTotal = Number.parseFloat(totalFeesColumn.entries[totalFeesColumn.entries.length - 1][0].text.replace(/[^0-9.]/g, ''));

		const transactionTotalColumn = _.find(res.pages[1].tables[0].columns, (entry) => {
			return entry.header[0].text === 'Amount' && entry.header[1].text === 'Processed';
		});
		const transactionTotal = Number.parseFloat(transactionTotalColumn.entries[transactionTotalColumn.entries.length - 1][0].text.replace(/[^0-9.]/g, ''));

		const transactionCountColumn = _.find(res.pages[4].tables[0].columns, (entry) => {
			return entry.header[0].text === 'Sub Total';
		});
		const transactionCount = Number.parseFloat(transactionCountColumn.entries[transactionCountColumn.entries.length - 1][0].text.replace(/[^0-9.]/g, ''));

		const heartlandFee = calculateMonthlyFee(0.0548, transactionTotal, 0.08, transactionCount, 33.50);

		return {
			transactionCount,
			transactionTotal,
			feeTotal,
			heartlandFee,
		}

	}
}

const contentType = 'application/json';
const subscriptionKey = 'e37f00d87d3d48d7a2207d6bbd80041b';

export default class DocumentSearch{
	static async analyzeDocuments(brand, documents){
		if(!documentBrands[brand]){
			throw new Error('Invalid brand');
		}

		try{
			const formData = new FormData();
			documents.forEach((doc) => {
				formData.append('file', doc, doc.name);
			});
			const res = await axios(
				{
					url:`https://westus2.api.cognitive.microsoft.com/formrecognizer/v1.0-preview/custom/models/${documentBrands[brand]}/analyze`,
					headers: {
						'content-type': contentType,
						'Ocp-Apim-Subscription-Key': subscriptionKey
					},
					data: formData,
					method: 'POST',
				}
			);
			return brandMappings[brand](res.data);
		}catch(err){
			console.log(err);
			throw new Error('Unable to analyze');
		}
	}
}
