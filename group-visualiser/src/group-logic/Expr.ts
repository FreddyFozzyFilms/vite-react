// a closed form expression about groups consists of a variable or products of expressions
export default class Expr{
    mk?: String | [Expr, Expr];

    // make empty expr
    constructor() {
    }
    static val<T>(x : String): Expr{
        let out = new Expr();
        out.mk = x;

        return out;
    }
    static add(expr1: Expr, expr2: Expr): Expr {
        let out = new Expr();
        out.mk = [expr1, expr2];
        return out;
    }
    private static isWrapped(e : Expr):boolean {
        if (typeof e.mk === 'string')
            return false;
        if (Array.isArray(e.mk)) {
            return true
        }
        return false
    }
    toArr() : String[] {
        if (typeof this.mk === 'undefined')
            return []
        if (Array.isArray(this.mk)){      
            let l1 = Expr.isWrapped(this.mk[0]) ? ['(', ...this.mk[0].toArr(), ')'] : this.mk[0].toArr();
            let l2 = Expr.isWrapped(this.mk[1]) ? ['(', ...this.mk[1].toArr(), ')'] : this.mk[1].toArr();
            return [...l1, '+',  ...l2];
        }
        return [this.mk.toString()];

    }
}