import { IList } from "@Core/query/IList";
import { Paging } from "@Core/query/Paging";
import { SequelizeDbAdapterProps } from "server/base-service/sequelize/SequelizeDbAdapter";
import _ from "lodash"
export class PostgresHelper { 
    public static queryPagination<T>(
		adapter: SequelizeDbAdapterProps<any>,
		sql: string,
		prestatement: any,
		paramsList: IList
	): Promise<Paging<T>> {
    var querySearch = "where 1=1";
    if(paramsList.searchFields &&
			Array.isArray(paramsList.searchFields) &&
			paramsList.searchFields.length > 0){
      paramsList.searchFields = paramsList.searchFields.map(field=>{
        return _.snakeCase(field);
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
				if (i == 0) {
					querySearch += ` queryPaging."${paramsList.searchFields[i]}"::text ilike '%' || '${paramsList.search || ""}' || '%' `;
				} else {
					querySearch += `  or queryPaging."${paramsList.searchFields[i]}"::text ilike '%' || '${paramsList.search || ""}' ||'%'  `;
				}
			}
		}
		const queryPaging = ` limit ${paramsList.pageSize || 10} offset ${(paramsList.page - 1) * paramsList.pageSize || 0} `;
		const newSql = `select * from ( ${sql} ) as queryPaging  
      ${querySearch}  
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
				pageSize: paramsList.pageSize || 10,
				total: parseInt(res[1].count),
				rows: res[0],
				totalPages: Math.ceil(
					res[1].count / (paramsList.pageSize || 10)
				),
			} as Paging<T>;
		});
	}
}