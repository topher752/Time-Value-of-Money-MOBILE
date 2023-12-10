import {
  calc_future_value,
  trim,
  calc_payment,
  calc_int_rate,
  calc_term,
  calc_present_value,
} from "./calc_utils.js";

// Float values for the inputs
var f_payment = 0;
var f_present_val = 0;
var f_future_val = 0;
var f_int_rate = 0;
var f_months = 0;
var f_years = 0;
var f_infadj = 0;

// Help Text functions.

/* export function helptext_default() {
  return "To compute a value, enter values for all other cells and  select compute button for the target";
}

export function helptext_interest() {
  return "Enter Interest as a percentage.  e.g., 3.5 for 3 & 1/2 percent.";
}

export function helptext_term() {
  return "Enter any legitimate combination of years & months";
}

export function helptext_infadj() {
  return "Enter Payment/Withdrawal Yearly Adjustment (e.g. enter 3 for 3%)";
}

export function completion_text() {
  return "Computation Complete";
}

export function helptext_present_val() {
  return "Enter Present Value (i.e. initial investment)";
}

export function helptext_future_val() {
  return "Enter Future Value (i.e. ending value).  This can be positive or negative";
}

export function helptext_payment() {
  return "Enter positive value for monthly payment or negative value for withdrawal";
}
*/

//  The following 2 functions are a little different than the above.  The above "verification" functions have to do with verifying
//  user input.  The ones below verify the computed result.

export function compute_present_value() {
  // Determine if values are not undefined;

  f_present_val = calc_present_value(
    f_months,
    f_int_rate,
    -f_payment,
    f_future_val,
    f_infadj
  );

  $w("#notes").text = completion_text();

  $w("#iPresentValue").value = verify_computed_result(trim(-f_present_val));
}

export function compute_future_value() {
  // Vertify Values

  f_future_val = calc_future_value(
    f_months,
    f_int_rate,
    -f_present_val,
    -f_payment,
    f_infadj
  );

  $w("#notes").text = completion_text();

  $w("#iFutureValue").value = verify_computed_result(trim(f_future_val));
}

export function compute_payment() {
  // Vertify Values

  f_payment = calc_payment(
    f_months,
    f_int_rate,
    -f_present_val,
    f_future_val,
    f_infadj
  );

  $w("#notes").text = completion_text();
  $w("#ipayment").value = verify_computed_result(trim(-f_payment));

  return 0;
}

export function compute_term() {
  var months;
  var yrs;

  // Vertify Values

  months = calc_term(
    f_int_rate,
    -f_present_val,
    -f_payment,
    f_future_val,
    f_infadj
  );

  yrs = months / 12;
  months = months % 12;

  //    $w("#notes").text = f_present_val.toString() + " " + monthly_int_rate.toString() + " " + f_int_rate.toString();
  $w("#notes").text = completion_text();
  $w("#iyears").value = Math.floor(yrs);
  $w("#imonths").value = verify_computed_months(Math.floor(months));

  return 0;
}

export function compute_interest() {
  // Vertify Values

  $w("#notes").text = completion_text();
  var t100_rate = calc_int_rate(
    f_months,
    -f_present_val,
    -f_payment,
    f_future_val,
    f_infadj
  );
  $w("#iinterest").value = verify_computed_result(trim(t100_rate));
}

export function print_amort() {
  // Vertify Values

  calc_future_value(
    f_months,
    f_int_rate,
    -f_present_val,
    -f_payment,
    f_infadj,
    1,
    "#helpwindow"
  );

  $w("#notes").text = "See schedule below";

  //    var str1 = "#amort";
  //    $w("#amort").text = "str1";
  //    $w(str1).text = "str2";
}

export function reset_vals() {
  // Float values for the inputs
  f_payment = 0;
  f_present_val = 0;
  f_int_rate = 0;
  f_months = 0;
  f_years = 0;
  f_future_val = 0;
  f_infadj = 0;
}

// export function help_display(event) {
//   $w("#helpwindow").text = "There are 6 values that can be entered:";
//   $w("#helpwindow").text += "\n_";
//   $w("#helpwindow").text += "\n >> Present Value - " + helptext_present_val();
//   $w("#helpwindow").text += "\n >> Interest Rate - " + helptext_interest();
//   $w("#helpwindow").text += "\n >> Loan Length - " + helptext_term();
//   $w("#helpwindow").text += "\n >> Payment/Withdrawal - " + helptext_payment();
//   $w("#helpwindow").text += "\n >> Inflation Adjustment - " + helptext_infadj();
//   $w("#helpwindow").text += "\n >> Present Value - " + helptext_future_val();
//   $w("#helpwindow").text += "\n_";
//   $w("#helpwindow").text += "\n_Notes:";
//   $w("#helpwindow").text +=
//     "\n - To compute any value, enter values for all other values,";
//   $w("#helpwindow").text +=
//     "\n    then press the compute button for the target value.";
//   $w("#helpwindow").text +=
//     "\n - Any value that is not entered will be filled in as a zero";
//   $w("#helpwindow").text +=
//     "\n - 'inf adj' is a percentage value.  It can be used to auto adjust the payment or";
//   $w("#helpwindow").text +=
//     "\n    withdrawal each year.  It is an input value only and will not be computed.";
//   $w("#helpwindow").text +=
//     "\n - The Loan Length can be entered as any valid combination of years/months.";
//   $w("#helpwindow").text +=
//     "\n    For example, for 2 years, you could also enter 1 yr, 12, months, or 24 months";
//   $w("#helpwindow").text +=
//     "\n - The amort button will print an amortization schedule";
//   $w("#helpwindow").text +=
//     "\n - The reset button will clear all values to zero";
// }
