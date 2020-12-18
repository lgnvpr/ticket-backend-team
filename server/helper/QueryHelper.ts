export class QueryHelper {
	static combineSearchesToQuery(search: ISearch, query: any) {
    if(typeof query === "string"){
      query = JSON.parse(query)
    }
		!query ? (query = {}) : (query = query);

    let querySearches = this.convertSearchesToQuery(search);
     (querySearches);
    var a = { $and: [query, querySearches] }
    //  (a);
		return { $and: [query, querySearches] };
	}

	private static convertSearchesToQuery(searches: ISearch) {
		let childQueries: Array<any> = [];
		if (!searches || (searches && searches.search == ""))
			return { $and: [{}] };
		searches.searchFields?.map((field) => {
			let json = `{\"${field}\":{\"$regex\":\"${searches.search}\",\"$options\":\"i\"}}`;
			childQueries.push(JSON.parse(json));
		});
    if (childQueries.length == 0) childQueries = [{}];
		return {
			$or: childQueries,
		};
	}
}

export interface ISearch {
	search: string;
	searchFields: string[];
}
