export class EntityList<E> {
    public entities: E[];
    public count: number;
    
    constructor(entities: E[], count: number) {
        this.entities = entities;
        this.count = count;
    }
}

export class QueryParameters {
    private _limit: number = 10;
    private _offset: number = 0;
    
    
    public get limit(): number {
        return this._limit;
    }
    
    public set limit(value: number) {
        this._limit = value;
    }
    
    public get offset(): number {
        return this._offset;
    }
    
    public set offset(value: number) {
        this._offset = value;
    }
}

export type RequestQuery = { [key: string]: string };

export class QueryBuilder {
    
    private readonly params: QueryParameters;
    
    private constructor() {
        this.params = new QueryParameters();
    }
    
    public static newBuilder(): QueryBuilder {
        return new QueryBuilder();
    }
    
    public buildQuery(query: RequestQuery): QueryBuilder {
        if (query.limit) {
            this.params.limit = parseInt(query.limit, 10);
        }
        if (query.offset) {
            this.params.offset = parseInt(query.offset, 10);
        }
        return this;
    }
    
    public limit(limit: number): QueryBuilder {
        this.params.limit = limit;
        return this;
    }
    
    public offset(offset: number): QueryBuilder {
        this.params.offset = offset;
        return this;
    }
    
    public build(): QueryParameters {
        return this.params;
    }
    
}
