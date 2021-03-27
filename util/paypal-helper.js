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
          "value": monthlyRate.toString(),
        },
      },
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1,
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": (reservationDetails.numMonths - 1).toString(),
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
      "total_cycles": (reservationDetails.numMonths - 1).toString(),
    },
  ];

  const monthlyPaymentPreferences = {
    "setup_fee": {
      "currency_code": "USD",
      "value": proratedCharge,
    },
  };

  function createPlan() {
    const plan = immediate
      ? { "billing_cycles": monthlyImmediate }
      : {
          "billing_cycles": monthly,
          "payment_preferences": monthlyPaymentPreferences,
        };
    return plan;
  }

  const monthlyPlan = {
    "plan_id": immediate
      ? "P-5CS126058S539973RMBN4XXY"
      : "P-3JA10090V22266101MBN4YGY",
    "custom_id": reservationDetails.site,
    "start_time": paymentStart.toISOString(),
    "plan": createPlan(),
  };

  console.log(immediate);
  console.log(`Payment Start: ${paymentStart}`);
  return monthlyPlan;
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
      "total_cycles": (reservationDetails.numWeeks - 1).toString(),
    },
  ];

  return {
    "plan_id": immediate
      ? "P-4FW141307E8642114MBN4XLY"
      : "P-8BH45018KY1678910MBN4XRY",
    "custom_id": reservationDetails.site,
    "start_time": paymentStart.toISOString(),
    "plan": {
      "product_id": "PROD-4G570126HX4011013",
      "name": "RV Reservation",
      "description": "RV Reservation",
      "billing_cycles": immediate ? weeklyImmediate : weekly,
    },
  };
};
