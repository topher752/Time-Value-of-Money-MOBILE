import {
  calc_future_value,
  trim,
  calc_payment,
  calc_int_rate,
  calc_term,
  calc_present_value,
  init_debug,
} from "./calc_utils.js";
import { MAX_MONTHS, MAX_VALUE, MIN_VALUE } from "./calc_utils.js";

// Float values for the inputs
var f_payment = 0;
var f_loan_amt = 0;
var f_int_rate = 0;
var f_months = 0;
var f_years = 0;

// Help text functions.

export function completion_text() {
  return "Computation Complete";
}

export function helptext_default() {
  return "To compute a target value, enter all other cells and then select compute button for that target.";
}

export function helptext_interest() {
  return "Enter Interest as a percentage.  e.g., 3 for 3 percent, or 3.5 for 3 & 1/2 percent.";
}

export function helptext_term() {
  return (
    "Enter any legitimate combination of years & months as long as it's less than " +
    MAX_MONTHS +
    "  months in total."
  );
}

export function helptext_loan() {
  return "Enter Loan Amount greater than zero";
}

export function helptext_payment() {
  return "Enter Monthly Payment greater than zero:  ";
}

export function verify_result(val) {
  if (val < MIN_VALUE || val > MAX_VALUE || val.toString() == "NaN") {
    $w("#notes").text = "***Invalid Computation: " + val.toString();
  }
  return val.toString();
}

export function verify_months_calculation(val) {
  if (val < 0 || val > MAX_MONTHS || val.toString() == "NaN") {
    $w("#notes").text = "***Invalid Computation: " + val.toString();
  }
  return val.toString();
}

export function verify_loan_amt() {
  var a_loan_amt = $w("#iloan").value;
  f_loan_amt = parseFloat(a_loan_amt);

  if (a_loan_amt == "") {
    $w("#iloan").value = "0";
    f_loan_amt = 0;
  }
  if (f_loan_amt <= 0 || f_loan_amt > MAX_VALUE) {
    $w("#notes").text = helptext_loan();
    return true;
  }
  return false;
}
export function verify_payment() {
  var a_payment = $w("#ipayment").value;
  f_payment = parseFloat(a_payment);

  if (a_payment == "") {
    $w("#ipayment").value = "0";
    f_payment = 0;
  }
  if (f_payment <= 0 || f_payment > MAX_VALUE) {
    $w("#notes").text = helptext_payment();
    return true;
  }
  return false;
}
export function verify_rate() {
  var a_int_rate = $w("#iinterest").value;
  f_int_rate = parseFloat(a_int_rate);

  if (a_int_rate == "") {
    $w("#iinterest").value = "0";
    f_int_rate = 0;
  }
  if (f_int_rate < 0 || f_int_rate > 100) {
    $w("#notes").text = helptext_interest();
    $w("#iinterest").value = "0";
    return true;
  }
  return false;
}

export function verify_mo() {
  var a_months = $w("#imonths").value;
  if (a_months == "") f_months = 0;
  else f_months = parseFloat(a_months);

  var a_years = $w("#iyears").value;
  if (a_years == "") f_years = 0;
  else f_years = parseFloat(a_years);
  f_months = 12 * f_years + f_months;

  if (f_months <= 0 || f_months > 1200) {
    $w("#notes").text = helptext_term();
    $w("#imonths").value = "0";
    $w("#iyears").value = "0";
    return true;
  }
  return false;
}

export function compute_loan_amt(event) {
  if (verify_rate()) return 1;
  if (verify_mo()) return 1;
  if (verify_payment()) return 1;

  f_loan_amt = calc_present_value(f_months, f_int_rate, -f_payment, 0, 0);

  $w("#notes").text = completion_text();
  $w("#iloan").value = verify_result(trim(f_loan_amt));
}

//  The method above uses an equation we found from the web.  It works nicely, but because I didn't understand
//  how to derive the equation, I am doing it a more brute force way, which is captured in the public function "calc_payment()"
export function compute_payment(event) {
  if (verify_loan_amt()) return 1;
  if (verify_rate()) return 1;
  if (verify_mo()) return 1;

  f_payment = calc_payment(f_months, f_int_rate, -f_loan_amt, 0, 0);

  $w("#notes").text = completion_text();
  $w("#ipayment").value = verify_result(trim(f_payment));

  return 0;
}

export function compute_term(event) {
  var months;
  var yrs;

  if (verify_loan_amt()) return 1;
  if (verify_rate()) return 1;
  if (verify_payment()) return 1;

  months = calc_term(f_int_rate, f_loan_amt, -f_payment, 0, 0);

  yrs = months / 12;
  months = months % 12;

  //    $w("#notes").text = f_loan_amt.toString() + " " + monthly_int_rate.toString() + " " + f_int_rate.toString();
  $w("#notes").text = completion_text();
  $w("#iyears").value = Math.floor(yrs);
  $w("#imonths").value = verify_months_calculation(Math.floor(months));

  return 0;
}

export function compute_interest(event) {
  if (verify_loan_amt()) return 1;
  if (verify_mo()) return 1;
  if (verify_payment()) return 1;

  $w("#notes").text = completion_text();
  var t100_rate = calc_int_rate(f_months, f_loan_amt, -f_payment, 0, 0);
  $w("#iinterest").value = verify_result(trim(t100_rate));
}

export function print_amort(event) {
  if (verify_loan_amt()) return 1;
  if (verify_rate()) return 1;
  if (verify_mo()) return 1;
  if (verify_payment()) return 1;

  calc_future_value(
    f_months,
    f_int_rate,
    f_loan_amt,
    -f_payment,
    0,
    1,
    "#helpwindow"
  );

  $w("#notes").text = "See schedule below";
}

$w.onReady(function () {
  $w("#notes").text = helptext_default();
  $w("#helpwindow").text = "";
  $w("#debug1").text = " ";
  init_debug("#helpwindow");

  const query = wixLocation.query;
  if (query) {
    if (query["loan"]) $w("#iloan").value = query["loan"];
    if (query["rate"]) $w("#iinterest").value = query["rate"];
    if (query["years"]) $w("#iyears").value = query["years"];
    if (query["payment"]) $w("#ipayment").value = query["payment"];
  }
});

export function reset_vals(event) {
  // Float values for the inputs
  f_payment = 0;
  f_loan_amt = 0;
  f_int_rate = 0;
  f_months = 0;
  f_years = 0;

  $w("#ipayment").value = "0";
  $w("#iloan").value = "0";
  $w("#iinterest").value = "0";
  $w("#iyears").value = "0";
  $w("#imonths").value = "0";
}

export function help_display(event) {
  $w("#helpwindow").text = "There are 4 values that can be entered:";
  $w("#helpwindow").text += "\n_";
  $w("#helpwindow").text += "\n >> Loan Amount - " + helptext_loan();
  $w("#helpwindow").text += "\n >> Interest Rate - " + helptext_interest();
  $w("#helpwindow").text += "\n >> Loan Length - " + helptext_term();
  $w("#helpwindow").text += "\n >> Mortgate Payment - " + helptext_payment();
  $w("#helpwindow").text += "\n_";
  $w("#helpwindow").text += "\n_Notes:";
  $w("#helpwindow").text +=
    "\n - To compute any value, enter values for the other 3 values,";
  $w("#helpwindow").text +=
    "\n    then press the compute button for the target cell.";
  $w("#helpwindow").text +=
    "\n - Any value that is not entered will be filled in as a zero";
  $w("#helpwindow").text +=
    "\n - The Loan Length can be entered as any valid combination of years/months.";
  $w("#helpwindow").text +=
    "\n    For example, for 2 years, you could also enter 1 yr, 12, months, or 24 months";
  $w("#helpwindow").text +=
    "\n - The amort button will print an amortization schedule";
  $w("#helpwindow").text +=
    "\n - The reset button will clear all values to zero";
}
