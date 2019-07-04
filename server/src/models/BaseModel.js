import { Model, QueryBuilder } from 'objection'

class CustomQueryBuilder extends QueryBuilder {
  constructor(modelClass) {
    super(modelClass)

    this.runBefore(async (result, qb) => {
      const context = qb.context();
      // if (!context.isApiQuery) return;
      await modelClass.modifyApiQuery(qb, context);
    });
    
    this.runAfter(async (result, qb) => {
      const context = qb.context();
      // if (!context.isApiQuery) return result;
      return modelClass.modifyApiResults(result, context, qb);
    });
  }
}

export default class BaseModel extends Model {
  
  static async modifyApiQuery(qb, context) {
  }

  static async modifyApiResults(result, context, qb) {
    return result
  }

  static get QueryBuilder() {
    return CustomQueryBuilder
  }
}