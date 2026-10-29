
export interface Quote {
    type: string; 
    symbol: string; 
    bx: string; 
    bp: number | string; 
    bs: number; 
    ax: string; 
    ap: number | string; 
    as: number; 
    c: string[]; 
    z: string; 
    t: string;
}

// {'T': 'q', 
// 'S': 'AAPL', 
// 'bx': 'V', 

// 'bp': Decimal('400.00'), 
// 'bs': 40, 
// 'ax': 'V', 
// 'ap': Decimal('343.43'), 
// 'as': 120,
//  'c': ['R'], 
// 'z': 'C', 
// 't': '2026-10-15T19:42:26.749542645Z'}