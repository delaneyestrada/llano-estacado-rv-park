export const paypalMonthly = ({
  reservationDetails,
  paymentStart,
  proratedCharge,
  numDaysUntilNextMonth,
  monthlyRate,
  immediate,
}) => {
  const monthly = [
    {
      "pricing_scheme": {
        "version": 1,
        "fixed_price": {
          "currency_code": "USD",
          "value": proratedCharge,
        },
      },
      "frequency": {
        "interval_unit": "DAY",
        "interval_count": numDaysUntilNextMonth,
      },
      "tenure_type": "TRIAL",
      "sequence": 1,
      "total_cycles": 1,
    },
    {
      "pricing_scheme": {
        "version": 1,
        "fixed_price": {
          "currency_code": "USD",
          "value": monthlyRate.toString(),
        },
      },
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1,
      },
      "tenure_type": "REGULAR",
      "sequence": 2,
      "total_cycles": reservationDetails.numMonths.toString(),
    },
  ];

  const monthlyImmediate = [
    {
      "pricing_scheme": {
        "version": 1,
        "fixed_price": {
          "currency_code": "USD",
          "value": monthlyRate.toString(),
        },
      },
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1,
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": reservationDetails.numMonths.toString(),
    },
  ];
  console.log(immediate);
  return {
    "plan_id": immediate
      ? "P-0BV22609TB9824117MAMAOEY"
      : "P-3TR10617BG0735243MALVIAI",
    "custom_id": reservationDetails.site,
    "start_time": paymentStart.toISOString(),
    "plan": {
      "product_id": "rv-spot",
      "name": "RV Reservation",
      "description": "RV Reservation",
      "billing_cycles": immediate ? monthlyImmediate : monthly,
    },
  };
};

export const paypalWeekly = ({
  reservationDetails,
  startDate,
  paymentStart,
  weeklyRate,
  immediate,
}) => {
  // const weekly = [
  //   {
  //     "pricing_scheme": {
  //       "version": 1,
  //       "fixed_price": {
  //         "currency_code": "USD",
  //         "value": proratedCharge,
  //       },
  //     },
  //     "frequency": {
  //       "interval_unit": "DAY",
  //       "interval_count": numDaysUntilNextWeek,
  //     },
  //     "tenure_type": "TRIAL",
  //     "sequence": 1,
  //     "total_cycles": 1,
  //   },
  //   {
  //     "pricing_scheme": {
  //       "version": 1,
  //       "fixed_price": {
  //         "currency_code": "USD",
  //         "value": weeklyRate.toString(),
  //       },
  //     },
  //     "frequency": {
  //       "interval_unit": "DAY",
  //       "interval_count": 7,
  //     },
  //     "tenure_type": "REGULAR",
  //     "sequence": 2,
  //     "total_cycles": reservationDetails.numWeeks.toString(),
  //   },
  // ];
  const weeklyImmediate = [
    {
      "pricing_scheme": {
        "version": 1,
        "fixed_price": {
          "currency_code": "USD",
          "value": weeklyRate.toString(),
        },
      },
      "frequency": {
        "interval_unit": "DAY",
        "interval_count": 7,
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": reservationDetails.numWeeks.toString(),
    },
  ];

  return {
    "plan_id": immediate
      ? "P-49R5844779054105MMAMAOMI"
      : "P-2JM28874YM248781NMALVHUQ",
    "custom_id": reservationDetails.site,
    "start_time": paymentStart.toISOString(),
    "plan": {
      "product_id": "rv-spot",
      "name": "RV Reservation",
      "description": "RV Reservation",
      "billing_cycles": immediate ? weeklyImmediate : weekly,
    },
  };
};
