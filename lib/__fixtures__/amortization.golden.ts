/**
 * Golden amortization schedules, captured from the original Wix Velo
 * calc_future_value() run_sched reporting path before that code was
 * removed. Values are trim()'d to three decimals exactly as the original
 * rendered them.
 *
 * Generated once and committed deliberately: this is the surviving oracle
 * for buildAmortizationSchedule. Do not regenerate it from our own code --
 * that would make the test compare the implementation to itself.
 */
export default [
  {
    "input": {
      "term": 12,
      "rate": 5,
      "pv": -10000,
      "pmt": 0,
      "inf": 0
    },
    "rows": [
      {
        "month": 1,
        "payment": 0,
        "monthlyInterest": -41.667,
        "monthlyPrincipal": -41.667,
        "totalPrincipal": -10000
      },
      {
        "month": 2,
        "payment": 0,
        "monthlyInterest": -41.841,
        "monthlyPrincipal": -41.841,
        "totalPrincipal": -10041.667
      },
      {
        "month": 3,
        "payment": 0,
        "monthlyInterest": -42.015,
        "monthlyPrincipal": -42.015,
        "totalPrincipal": -10083.507
      },
      {
        "month": 4,
        "payment": 0,
        "monthlyInterest": -42.19,
        "monthlyPrincipal": -42.19,
        "totalPrincipal": -10125.522
      },
      {
        "month": 5,
        "payment": 0,
        "monthlyInterest": -42.366,
        "monthlyPrincipal": -42.366,
        "totalPrincipal": -10167.712
      },
      {
        "month": 6,
        "payment": 0,
        "monthlyInterest": -42.542,
        "monthlyPrincipal": -42.542,
        "totalPrincipal": -10210.077
      },
      {
        "month": 7,
        "payment": 0,
        "monthlyInterest": -42.72,
        "monthlyPrincipal": -42.72,
        "totalPrincipal": -10252.619
      },
      {
        "month": 8,
        "payment": 0,
        "monthlyInterest": -42.898,
        "monthlyPrincipal": -42.898,
        "totalPrincipal": -10295.338
      },
      {
        "month": 9,
        "payment": 0,
        "monthlyInterest": -43.076,
        "monthlyPrincipal": -43.076,
        "totalPrincipal": -10338.236
      },
      {
        "month": 10,
        "payment": 0,
        "monthlyInterest": -43.256,
        "monthlyPrincipal": -43.256,
        "totalPrincipal": -10381.312
      },
      {
        "month": 11,
        "payment": 0,
        "monthlyInterest": -43.436,
        "monthlyPrincipal": -43.436,
        "totalPrincipal": -10424.567
      },
      {
        "month": 12,
        "payment": 0,
        "monthlyInterest": -43.617,
        "monthlyPrincipal": -43.617,
        "totalPrincipal": -10468.003
      }
    ],
    "totals": {
      "totalPayments": 0,
      "totalInterest": -511.619,
      "finalValue": -10511.619
    }
  },
  {
    "input": {
      "term": 24,
      "rate": 6.5,
      "pv": -50000,
      "pmt": -250,
      "inf": 0
    },
    "rows": [
      {
        "month": 1,
        "payment": -250,
        "monthlyInterest": -270.834,
        "monthlyPrincipal": -520.834,
        "totalPrincipal": -50000
      },
      {
        "month": 2,
        "payment": -250,
        "monthlyInterest": -273.655,
        "monthlyPrincipal": -523.655,
        "totalPrincipal": -50520.834
      },
      {
        "month": 3,
        "payment": -250,
        "monthlyInterest": -276.491,
        "monthlyPrincipal": -526.491,
        "totalPrincipal": -51044.488
      },
      {
        "month": 4,
        "payment": -250,
        "monthlyInterest": -279.343,
        "monthlyPrincipal": -529.343,
        "totalPrincipal": -51570.979
      },
      {
        "month": 5,
        "payment": -250,
        "monthlyInterest": -282.211,
        "monthlyPrincipal": -532.211,
        "totalPrincipal": -52100.322
      },
      {
        "month": 6,
        "payment": -250,
        "monthlyInterest": -285.093,
        "monthlyPrincipal": -535.093,
        "totalPrincipal": -52632.532
      },
      {
        "month": 7,
        "payment": -250,
        "monthlyInterest": -287.992,
        "monthlyPrincipal": -537.992,
        "totalPrincipal": -53167.625
      },
      {
        "month": 8,
        "payment": -250,
        "monthlyInterest": -290.906,
        "monthlyPrincipal": -540.906,
        "totalPrincipal": -53705.616
      },
      {
        "month": 9,
        "payment": -250,
        "monthlyInterest": -293.836,
        "monthlyPrincipal": -543.836,
        "totalPrincipal": -54246.522
      },
      {
        "month": 10,
        "payment": -250,
        "monthlyInterest": -296.782,
        "monthlyPrincipal": -546.782,
        "totalPrincipal": -54790.357
      },
      {
        "month": 11,
        "payment": -250,
        "monthlyInterest": -299.743,
        "monthlyPrincipal": -549.743,
        "totalPrincipal": -55337.138
      },
      {
        "month": 12,
        "payment": -250,
        "monthlyInterest": -302.721,
        "monthlyPrincipal": -552.721,
        "totalPrincipal": -55886.881
      },
      {
        "month": 13,
        "payment": -250,
        "monthlyInterest": -305.715,
        "monthlyPrincipal": -555.715,
        "totalPrincipal": -56439.602
      },
      {
        "month": 14,
        "payment": -250,
        "monthlyInterest": -308.725,
        "monthlyPrincipal": -558.725,
        "totalPrincipal": -56995.316
      },
      {
        "month": 15,
        "payment": -250,
        "monthlyInterest": -311.752,
        "monthlyPrincipal": -561.752,
        "totalPrincipal": -57554.041
      },
      {
        "month": 16,
        "payment": -250,
        "monthlyInterest": -314.794,
        "monthlyPrincipal": -564.794,
        "totalPrincipal": -58115.792
      },
      {
        "month": 17,
        "payment": -250,
        "monthlyInterest": -317.854,
        "monthlyPrincipal": -567.854,
        "totalPrincipal": -58680.586
      },
      {
        "month": 18,
        "payment": -250,
        "monthlyInterest": -320.93,
        "monthlyPrincipal": -570.93,
        "totalPrincipal": -59248.439
      },
      {
        "month": 19,
        "payment": -250,
        "monthlyInterest": -324.022,
        "monthlyPrincipal": -574.022,
        "totalPrincipal": -59819.368
      },
      {
        "month": 20,
        "payment": -250,
        "monthlyInterest": -327.131,
        "monthlyPrincipal": -577.131,
        "totalPrincipal": -60393.389
      },
      {
        "month": 21,
        "payment": -250,
        "monthlyInterest": -330.257,
        "monthlyPrincipal": -580.257,
        "totalPrincipal": -60970.52
      },
      {
        "month": 22,
        "payment": -250,
        "monthlyInterest": -333.401,
        "monthlyPrincipal": -583.401,
        "totalPrincipal": -61550.777
      },
      {
        "month": 23,
        "payment": -250,
        "monthlyInterest": -336.561,
        "monthlyPrincipal": -586.561,
        "totalPrincipal": -62134.177
      },
      {
        "month": 24,
        "payment": -250,
        "monthlyInterest": -339.738,
        "monthlyPrincipal": -589.738,
        "totalPrincipal": -62720.737
      }
    ],
    "totals": {
      "totalPayments": -6000,
      "totalInterest": -7310.475,
      "finalValue": -63310.475
    }
  },
  {
    "input": {
      "term": 36,
      "rate": 5.5,
      "pv": -100000,
      "pmt": 0,
      "inf": 0
    },
    "rows": [
      {
        "month": 1,
        "payment": 0,
        "monthlyInterest": -458.334,
        "monthlyPrincipal": -458.334,
        "totalPrincipal": -100000
      },
      {
        "month": 2,
        "payment": 0,
        "monthlyInterest": -460.435,
        "monthlyPrincipal": -460.435,
        "totalPrincipal": -100458.334
      },
      {
        "month": 3,
        "payment": 0,
        "monthlyInterest": -462.545,
        "monthlyPrincipal": -462.545,
        "totalPrincipal": -100918.768
      },
      {
        "month": 4,
        "payment": 0,
        "monthlyInterest": -464.665,
        "monthlyPrincipal": -464.665,
        "totalPrincipal": -101381.312
      },
      {
        "month": 5,
        "payment": 0,
        "monthlyInterest": -466.795,
        "monthlyPrincipal": -466.795,
        "totalPrincipal": -101845.977
      },
      {
        "month": 6,
        "payment": 0,
        "monthlyInterest": -468.934,
        "monthlyPrincipal": -468.934,
        "totalPrincipal": -102312.771
      },
      {
        "month": 7,
        "payment": 0,
        "monthlyInterest": -471.083,
        "monthlyPrincipal": -471.083,
        "totalPrincipal": -102781.704
      },
      {
        "month": 8,
        "payment": 0,
        "monthlyInterest": -473.242,
        "monthlyPrincipal": -473.242,
        "totalPrincipal": -103252.787
      },
      {
        "month": 9,
        "payment": 0,
        "monthlyInterest": -475.411,
        "monthlyPrincipal": -475.411,
        "totalPrincipal": -103726.029
      },
      {
        "month": 10,
        "payment": 0,
        "monthlyInterest": -477.59,
        "monthlyPrincipal": -477.59,
        "totalPrincipal": -104201.44
      },
      {
        "month": 11,
        "payment": 0,
        "monthlyInterest": -479.779,
        "monthlyPrincipal": -479.779,
        "totalPrincipal": -104679.03
      },
      {
        "month": 12,
        "payment": 0,
        "monthlyInterest": -481.978,
        "monthlyPrincipal": -481.978,
        "totalPrincipal": -105158.809
      },
      {
        "month": 13,
        "payment": 0,
        "monthlyInterest": -484.187,
        "monthlyPrincipal": -484.187,
        "totalPrincipal": -105640.787
      },
      {
        "month": 14,
        "payment": 0,
        "monthlyInterest": -486.407,
        "monthlyPrincipal": -486.407,
        "totalPrincipal": -106124.973
      },
      {
        "month": 15,
        "payment": 0,
        "monthlyInterest": -488.636,
        "monthlyPrincipal": -488.636,
        "totalPrincipal": -106611.38
      },
      {
        "month": 16,
        "payment": 0,
        "monthlyInterest": -490.876,
        "monthlyPrincipal": -490.876,
        "totalPrincipal": -107100.015
      },
      {
        "month": 17,
        "payment": 0,
        "monthlyInterest": -493.125,
        "monthlyPrincipal": -493.125,
        "totalPrincipal": -107590.89
      },
      {
        "month": 18,
        "payment": 0,
        "monthlyInterest": -495.386,
        "monthlyPrincipal": -495.386,
        "totalPrincipal": -108084.015
      },
      {
        "month": 19,
        "payment": 0,
        "monthlyInterest": -497.656,
        "monthlyPrincipal": -497.656,
        "totalPrincipal": -108579.4
      },
      {
        "month": 20,
        "payment": 0,
        "monthlyInterest": -499.937,
        "monthlyPrincipal": -499.937,
        "totalPrincipal": -109077.056
      },
      {
        "month": 21,
        "payment": 0,
        "monthlyInterest": -502.228,
        "monthlyPrincipal": -502.228,
        "totalPrincipal": -109576.992
      },
      {
        "month": 22,
        "payment": 0,
        "monthlyInterest": -504.53,
        "monthlyPrincipal": -504.53,
        "totalPrincipal": -110079.22
      },
      {
        "month": 23,
        "payment": 0,
        "monthlyInterest": -506.843,
        "monthlyPrincipal": -506.843,
        "totalPrincipal": -110583.75
      },
      {
        "month": 24,
        "payment": 0,
        "monthlyInterest": -509.166,
        "monthlyPrincipal": -509.166,
        "totalPrincipal": -111090.592
      },
      {
        "month": 25,
        "payment": 0,
        "monthlyInterest": -511.499,
        "monthlyPrincipal": -511.499,
        "totalPrincipal": -111599.757
      },
      {
        "month": 26,
        "payment": 0,
        "monthlyInterest": -513.844,
        "monthlyPrincipal": -513.844,
        "totalPrincipal": -112111.256
      },
      {
        "month": 27,
        "payment": 0,
        "monthlyInterest": -516.199,
        "monthlyPrincipal": -516.199,
        "totalPrincipal": -112625.099
      },
      {
        "month": 28,
        "payment": 0,
        "monthlyInterest": -518.565,
        "monthlyPrincipal": -518.565,
        "totalPrincipal": -113141.298
      },
      {
        "month": 29,
        "payment": 0,
        "monthlyInterest": -520.942,
        "monthlyPrincipal": -520.942,
        "totalPrincipal": -113659.862
      },
      {
        "month": 30,
        "payment": 0,
        "monthlyInterest": -523.329,
        "monthlyPrincipal": -523.329,
        "totalPrincipal": -114180.803
      },
      {
        "month": 31,
        "payment": 0,
        "monthlyInterest": -525.728,
        "monthlyPrincipal": -525.728,
        "totalPrincipal": -114704.132
      },
      {
        "month": 32,
        "payment": 0,
        "monthlyInterest": -528.137,
        "monthlyPrincipal": -528.137,
        "totalPrincipal": -115229.859
      },
      {
        "month": 33,
        "payment": 0,
        "monthlyInterest": -530.558,
        "monthlyPrincipal": -530.558,
        "totalPrincipal": -115757.996
      },
      {
        "month": 34,
        "payment": 0,
        "monthlyInterest": -532.99,
        "monthlyPrincipal": -532.99,
        "totalPrincipal": -116288.553
      },
      {
        "month": 35,
        "payment": 0,
        "monthlyInterest": -535.433,
        "monthlyPrincipal": -535.433,
        "totalPrincipal": -116821.543
      },
      {
        "month": 36,
        "payment": 0,
        "monthlyInterest": -537.887,
        "monthlyPrincipal": -537.887,
        "totalPrincipal": -117356.975
      }
    ],
    "totals": {
      "totalPayments": 0,
      "totalInterest": -17894.861,
      "finalValue": -117894.861
    }
  },
  {
    "input": {
      "term": 18,
      "rate": 12,
      "pv": 200000,
      "pmt": -1500,
      "inf": 0
    },
    "rows": [
      {
        "month": 1,
        "payment": -1500,
        "monthlyInterest": 2000,
        "monthlyPrincipal": 500,
        "totalPrincipal": 200000
      },
      {
        "month": 2,
        "payment": -1500,
        "monthlyInterest": 2005,
        "monthlyPrincipal": 505,
        "totalPrincipal": 200500
      },
      {
        "month": 3,
        "payment": -1500,
        "monthlyInterest": 2010.05,
        "monthlyPrincipal": 510.049,
        "totalPrincipal": 201005
      },
      {
        "month": 4,
        "payment": -1500,
        "monthlyInterest": 2015.15,
        "monthlyPrincipal": 515.15,
        "totalPrincipal": 201515.05
      },
      {
        "month": 5,
        "payment": -1500,
        "monthlyInterest": 2020.302,
        "monthlyPrincipal": 520.302,
        "totalPrincipal": 202030.2
      },
      {
        "month": 6,
        "payment": -1500,
        "monthlyInterest": 2025.505,
        "monthlyPrincipal": 525.505,
        "totalPrincipal": 202550.502
      },
      {
        "month": 7,
        "payment": -1500,
        "monthlyInterest": 2030.76,
        "monthlyPrincipal": 530.76,
        "totalPrincipal": 203076.007
      },
      {
        "month": 8,
        "payment": -1500,
        "monthlyInterest": 2036.067,
        "monthlyPrincipal": 536.067,
        "totalPrincipal": 203606.767
      },
      {
        "month": 9,
        "payment": -1500,
        "monthlyInterest": 2041.428,
        "monthlyPrincipal": 541.428,
        "totalPrincipal": 204142.835
      },
      {
        "month": 10,
        "payment": -1500,
        "monthlyInterest": 2046.842,
        "monthlyPrincipal": 546.842,
        "totalPrincipal": 204684.263
      },
      {
        "month": 11,
        "payment": -1500,
        "monthlyInterest": 2052.311,
        "monthlyPrincipal": 552.311,
        "totalPrincipal": 205231.106
      },
      {
        "month": 12,
        "payment": -1500,
        "monthlyInterest": 2057.834,
        "monthlyPrincipal": 557.834,
        "totalPrincipal": 205783.417
      },
      {
        "month": 13,
        "payment": -1500,
        "monthlyInterest": 2063.412,
        "monthlyPrincipal": 563.412,
        "totalPrincipal": 206341.251
      },
      {
        "month": 14,
        "payment": -1500,
        "monthlyInterest": 2069.046,
        "monthlyPrincipal": 569.046,
        "totalPrincipal": 206904.664
      },
      {
        "month": 15,
        "payment": -1500,
        "monthlyInterest": 2074.737,
        "monthlyPrincipal": 574.737,
        "totalPrincipal": 207473.71
      },
      {
        "month": 16,
        "payment": -1500,
        "monthlyInterest": 2080.484,
        "monthlyPrincipal": 580.484,
        "totalPrincipal": 208048.447
      },
      {
        "month": 17,
        "payment": -1500,
        "monthlyInterest": 2086.289,
        "monthlyPrincipal": 586.289,
        "totalPrincipal": 208628.932
      },
      {
        "month": 18,
        "payment": -1500,
        "monthlyInterest": 2092.152,
        "monthlyPrincipal": 592.152,
        "totalPrincipal": 209215.221
      }
    ],
    "totals": {
      "totalPayments": -27000,
      "totalInterest": 36807.373,
      "finalValue": 209807.373
    }
  },
  {
    "input": {
      "term": 30,
      "rate": 3.25,
      "pv": -25000,
      "pmt": 400,
      "inf": 3
    },
    "rows": [
      {
        "month": 1,
        "payment": 400,
        "monthlyInterest": -67.709,
        "monthlyPrincipal": 332.291,
        "totalPrincipal": -25000
      },
      {
        "month": 2,
        "payment": 400,
        "monthlyInterest": -66.809,
        "monthlyPrincipal": 333.191,
        "totalPrincipal": -24667.709
      },
      {
        "month": 3,
        "payment": 400,
        "monthlyInterest": -65.906,
        "monthlyPrincipal": 334.094,
        "totalPrincipal": -24334.517
      },
      {
        "month": 4,
        "payment": 400,
        "monthlyInterest": -65.002,
        "monthlyPrincipal": 334.998,
        "totalPrincipal": -24000.423
      },
      {
        "month": 5,
        "payment": 400,
        "monthlyInterest": -64.094,
        "monthlyPrincipal": 335.906,
        "totalPrincipal": -23665.424
      },
      {
        "month": 6,
        "payment": 400,
        "monthlyInterest": -63.185,
        "monthlyPrincipal": 336.815,
        "totalPrincipal": -23329.518
      },
      {
        "month": 7,
        "payment": 400,
        "monthlyInterest": -62.272,
        "monthlyPrincipal": 337.728,
        "totalPrincipal": -22992.702
      },
      {
        "month": 8,
        "payment": 400,
        "monthlyInterest": -61.358,
        "monthlyPrincipal": 338.642,
        "totalPrincipal": -22654.974
      },
      {
        "month": 9,
        "payment": 400,
        "monthlyInterest": -60.441,
        "monthlyPrincipal": 339.559,
        "totalPrincipal": -22316.331
      },
      {
        "month": 10,
        "payment": 400,
        "monthlyInterest": -59.521,
        "monthlyPrincipal": 340.479,
        "totalPrincipal": -21976.771
      },
      {
        "month": 11,
        "payment": 400,
        "monthlyInterest": -58.599,
        "monthlyPrincipal": 341.401,
        "totalPrincipal": -21636.292
      },
      {
        "month": 12,
        "payment": 400,
        "monthlyInterest": -57.674,
        "monthlyPrincipal": 342.326,
        "totalPrincipal": -21294.89
      },
      {
        "month": 13,
        "payment": 412,
        "monthlyInterest": -56.747,
        "monthlyPrincipal": 355.253,
        "totalPrincipal": -20952.564
      },
      {
        "month": 14,
        "payment": 412,
        "monthlyInterest": -55.785,
        "monthlyPrincipal": 356.215,
        "totalPrincipal": -20597.31
      },
      {
        "month": 15,
        "payment": 412,
        "monthlyInterest": -54.82,
        "monthlyPrincipal": 357.18,
        "totalPrincipal": -20241.095
      },
      {
        "month": 16,
        "payment": 412,
        "monthlyInterest": -53.853,
        "monthlyPrincipal": 358.147,
        "totalPrincipal": -19883.914
      },
      {
        "month": 17,
        "payment": 412,
        "monthlyInterest": -52.883,
        "monthlyPrincipal": 359.117,
        "totalPrincipal": -19525.767
      },
      {
        "month": 18,
        "payment": 412,
        "monthlyInterest": -51.91,
        "monthlyPrincipal": 360.09,
        "totalPrincipal": -19166.649
      },
      {
        "month": 19,
        "payment": 412,
        "monthlyInterest": -50.935,
        "monthlyPrincipal": 361.065,
        "totalPrincipal": -18806.559
      },
      {
        "month": 20,
        "payment": 412,
        "monthlyInterest": -49.957,
        "monthlyPrincipal": 362.043,
        "totalPrincipal": -18445.493
      },
      {
        "month": 21,
        "payment": 412,
        "monthlyInterest": -48.977,
        "monthlyPrincipal": 363.023,
        "totalPrincipal": -18083.45
      },
      {
        "month": 22,
        "payment": 412,
        "monthlyInterest": -47.993,
        "monthlyPrincipal": 364.007,
        "totalPrincipal": -17720.426
      },
      {
        "month": 23,
        "payment": 412,
        "monthlyInterest": -47.007,
        "monthlyPrincipal": 364.993,
        "totalPrincipal": -17356.418
      },
      {
        "month": 24,
        "payment": 412,
        "monthlyInterest": -46.019,
        "monthlyPrincipal": 365.981,
        "totalPrincipal": -16991.425
      },
      {
        "month": 25,
        "payment": 424.36,
        "monthlyInterest": -45.028,
        "monthlyPrincipal": 379.332,
        "totalPrincipal": -16625.444
      },
      {
        "month": 26,
        "payment": 424.36,
        "monthlyInterest": -44,
        "monthlyPrincipal": 380.36,
        "totalPrincipal": -16246.111
      },
      {
        "month": 27,
        "payment": 424.36,
        "monthlyInterest": -42.97,
        "monthlyPrincipal": 381.39,
        "totalPrincipal": -15865.751
      },
      {
        "month": 28,
        "payment": 424.36,
        "monthlyInterest": -41.937,
        "monthlyPrincipal": 382.423,
        "totalPrincipal": -15484.361
      },
      {
        "month": 29,
        "payment": 424.36,
        "monthlyInterest": -40.902,
        "monthlyPrincipal": 383.458,
        "totalPrincipal": -15101.937
      },
      {
        "month": 30,
        "payment": 424.36,
        "monthlyInterest": -39.863,
        "monthlyPrincipal": 384.497,
        "totalPrincipal": -14718.479
      }
    ],
    "totals": {
      "totalPayments": 12290.16,
      "totalInterest": -1624.141,
      "finalValue": -14333.981
    }
  },
  {
    "input": {
      "term": 13,
      "rate": 0,
      "pv": -1000,
      "pmt": -100,
      "inf": 0
    },
    "rows": [
      {
        "month": 1,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1000
      },
      {
        "month": 2,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1100
      },
      {
        "month": 3,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1200
      },
      {
        "month": 4,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1300
      },
      {
        "month": 5,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1400
      },
      {
        "month": 6,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1500
      },
      {
        "month": 7,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1600
      },
      {
        "month": 8,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1700
      },
      {
        "month": 9,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1800
      },
      {
        "month": 10,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -1900
      },
      {
        "month": 11,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -2000
      },
      {
        "month": 12,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -2100
      },
      {
        "month": 13,
        "payment": -100,
        "monthlyInterest": 0,
        "monthlyPrincipal": -100,
        "totalPrincipal": -2200
      }
    ],
    "totals": {
      "totalPayments": -1300,
      "totalInterest": 0,
      "finalValue": -2300
    }
  },
  {
    "input": {
      "term": 25,
      "rate": 18,
      "pv": 75000,
      "pmt": -2000,
      "inf": -2
    },
    "rows": [
      {
        "month": 1,
        "payment": -2000,
        "monthlyInterest": 1125,
        "monthlyPrincipal": -875,
        "totalPrincipal": 75000
      },
      {
        "month": 2,
        "payment": -2000,
        "monthlyInterest": 1111.875,
        "monthlyPrincipal": -888.125,
        "totalPrincipal": 74125
      },
      {
        "month": 3,
        "payment": -2000,
        "monthlyInterest": 1098.553,
        "monthlyPrincipal": -901.447,
        "totalPrincipal": 73236.875
      },
      {
        "month": 4,
        "payment": -2000,
        "monthlyInterest": 1085.031,
        "monthlyPrincipal": -914.969,
        "totalPrincipal": 72335.428
      },
      {
        "month": 5,
        "payment": -2000,
        "monthlyInterest": 1071.306,
        "monthlyPrincipal": -928.694,
        "totalPrincipal": 71420.459
      },
      {
        "month": 6,
        "payment": -2000,
        "monthlyInterest": 1057.376,
        "monthlyPrincipal": -942.624,
        "totalPrincipal": 70491.766
      },
      {
        "month": 7,
        "payment": -2000,
        "monthlyInterest": 1043.237,
        "monthlyPrincipal": -956.763,
        "totalPrincipal": 69549.142
      },
      {
        "month": 8,
        "payment": -2000,
        "monthlyInterest": 1028.885,
        "monthlyPrincipal": -971.115,
        "totalPrincipal": 68592.38
      },
      {
        "month": 9,
        "payment": -2000,
        "monthlyInterest": 1014.318,
        "monthlyPrincipal": -985.682,
        "totalPrincipal": 67621.265
      },
      {
        "month": 10,
        "payment": -2000,
        "monthlyInterest": 999.533,
        "monthlyPrincipal": -1000.467,
        "totalPrincipal": 66635.584
      },
      {
        "month": 11,
        "payment": -2000,
        "monthlyInterest": 984.526,
        "monthlyPrincipal": -1015.474,
        "totalPrincipal": 65635.118
      },
      {
        "month": 12,
        "payment": -2000,
        "monthlyInterest": 969.294,
        "monthlyPrincipal": -1030.706,
        "totalPrincipal": 64619.645
      },
      {
        "month": 13,
        "payment": -1960,
        "monthlyInterest": 953.834,
        "monthlyPrincipal": -1006.166,
        "totalPrincipal": 63588.939
      },
      {
        "month": 14,
        "payment": -1960,
        "monthlyInterest": 938.741,
        "monthlyPrincipal": -1021.259,
        "totalPrincipal": 62582.774
      },
      {
        "month": 15,
        "payment": -1960,
        "monthlyInterest": 923.422,
        "monthlyPrincipal": -1036.578,
        "totalPrincipal": 61561.515
      },
      {
        "month": 16,
        "payment": -1960,
        "monthlyInterest": 907.874,
        "monthlyPrincipal": -1052.126,
        "totalPrincipal": 60524.938
      },
      {
        "month": 17,
        "payment": -1960,
        "monthlyInterest": 892.092,
        "monthlyPrincipal": -1067.908,
        "totalPrincipal": 59472.812
      },
      {
        "month": 18,
        "payment": -1960,
        "monthlyInterest": 876.073,
        "monthlyPrincipal": -1083.927,
        "totalPrincipal": 58404.904
      },
      {
        "month": 19,
        "payment": -1960,
        "monthlyInterest": 859.814,
        "monthlyPrincipal": -1100.186,
        "totalPrincipal": 57320.978
      },
      {
        "month": 20,
        "payment": -1960,
        "monthlyInterest": 843.311,
        "monthlyPrincipal": -1116.689,
        "totalPrincipal": 56220.792
      },
      {
        "month": 21,
        "payment": -1960,
        "monthlyInterest": 826.561,
        "monthlyPrincipal": -1133.439,
        "totalPrincipal": 55104.104
      },
      {
        "month": 22,
        "payment": -1960,
        "monthlyInterest": 809.559,
        "monthlyPrincipal": -1150.441,
        "totalPrincipal": 53970.666
      },
      {
        "month": 23,
        "payment": -1960,
        "monthlyInterest": 792.303,
        "monthlyPrincipal": -1167.697,
        "totalPrincipal": 52820.226
      },
      {
        "month": 24,
        "payment": -1960,
        "monthlyInterest": 774.787,
        "monthlyPrincipal": -1185.213,
        "totalPrincipal": 51652.529
      },
      {
        "month": 25,
        "payment": -1920.8,
        "monthlyInterest": 757.009,
        "monthlyPrincipal": -1163.791,
        "totalPrincipal": 50467.317
      }
    ],
    "totals": {
      "totalPayments": -49440.8,
      "totalInterest": 23744.327,
      "finalValue": 49303.527
    }
  },
  {
    "input": {
      "term": 1,
      "rate": 7,
      "pv": -5000,
      "pmt": -50,
      "inf": 0
    },
    "rows": [
      {
        "month": 1,
        "payment": -50,
        "monthlyInterest": -29.167,
        "monthlyPrincipal": -79.167,
        "totalPrincipal": -5000
      }
    ],
    "totals": {
      "totalPayments": -50,
      "totalInterest": -29.167,
      "finalValue": -5079.167
    }
  }
] as const;
