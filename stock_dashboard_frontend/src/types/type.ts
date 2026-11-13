
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

export interface Trade {
    c: Array<string>; 
    i: number; 
    p: number; 
    s: number; 
    t: string; 
    x: string 
    z: string 
}

//      "c": [
//        "@",
//        "T",
//        "I"
//      ],
//      "i": 1,
//      "p": 347.76,
//      "s": 1,
//      "t": "2026-11-11T09:00:00.056786179Z",
//      "x": "K",
//      "z": "C"