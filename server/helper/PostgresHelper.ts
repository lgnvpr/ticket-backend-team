import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { SequelizeDbAdapterProps } from "server/base-service/sequelize/SequelizeDbAdapter";
import _ from "lodash"
export class PostgresHelper { 
    public static queryPagination<T>(
		adapter: SequelizeDbAdapterProps<any>,
		sql: string,
		prestatement: any,
		paramsList: IList,
		otherQuery ?: string
	): Promise<Paging<T>> {
		if(!otherQuery) otherQuery = "and (1=1)"  
		console.log(paramsList)
		var querySort : string = "order by "
		if(!paramsList.sort){
			paramsList.sort = "-createdAt"
		}
		if (paramsList.sort) {
			// add sort by created
			if (typeof paramsList.sort === "string") {
				paramsList.sort = paramsList.sort.replace(/,/g, " ").split(" ");
			}
			paramsList.sort.map((sortItem, index) => {
				const typeSort =
					sortItem.substring(0, 1) === "-" ? "DESC" : "ASC";
				const getName =
					sortItem.substring(0, 1) === "-"
						? sortItem.substring(1, sortItem.length)
						: sortItem;
				querySort += `queryPaging."${getName}" ${typeSort} ${(index ===paramsList.sort.length-1) ? "" :","}`
				return [getName, typeSort];
			}) as any; 
		} 


    var querySearch = "where 1=1";
    if(paramsList.searchFields &&
			Array.isArray(paramsList.searchFields) &&
			paramsList.searchFields.length > 0){
      paramsList.searchFields = paramsList.searchFields.map(field=>{
        return field
      })
    }
    console.log(paramsList.searchFields)
		if (
			paramsList.searchFields &&
			Array.isArray(paramsList.searchFields) &&
			paramsList.searchFields.length > 0
		) {
			querySearch = "where";
			for (let i = 0; i < paramsList.searchFields.length; i++) {
				if (i == paramsList.searchFields.length -1) {
					querySearch += `or queryPaging."${paramsList.searchFields[i]}"::text ilike '%' || '${paramsList.search || ""}' || '%' )`;
				}
				else if (i == 0) {
					querySearch += ` (queryPaging."${paramsList.searchFields[i]}"::text ilike '%' || '${paramsList.search || ""}' || '%' `;
				} else {
					querySearch += `  or queryPaging."${paramsList.searchFields[i]}"::text ilike '%' || '${paramsList.search || ""}' ||'%'  `;
				}
			}
		}
		const queryPaging = ` limit ${paramsList.pageSize || 10} offset ${(paramsList.page - 1) * paramsList.pageSize || 0} `;
		const newSql = `select * from ( ${sql} ) as queryPaging  
	  ${querySearch}  
	  ${otherQuery}
	  ${querySort}
	  ${queryPaging}  
    `;
		const queryCount = `select count(*) from (${sql}) as queryPaging  ${querySearch}`;
		const data: any = adapter.db
			.query(newSql, {
				replacements: {
					...prestatement,
				},
			})
			.then(([res]: any) => {
				return res;
			});
		const count: any = adapter.db
			.query(queryCount, {
				replacements: {
					...prestatement,
				},
			})
			.then(([[res]]: any) => res);

		return Promise.all([data, count]).then((res) => {
			return {
				page: paramsList.page || 1,
				pageSize: parseInt(paramsList.pageSize.toString()) || 10,
				total: parseInt(res[1].count),
				rows: res[0],
				totalPages: Math.ceil(
					res[1].count / (paramsList.pageSize || 10)
				),
			} as Paging<T>;
		});
	}
}