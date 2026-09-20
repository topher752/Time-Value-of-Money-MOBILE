/**
 * Legacy calculation reference -- the pure math from the original Wix app,
 * with every Velo-specific line removed.
 *
 * This file exists for exactly one reason: it is the oracle that
 * lib/tvm.test.ts compares lib/tvm.ts against, so the TypeScript port stays
 * provably identical to the original calculator. It is never imported by
 * the app and is never bundled.
 *
 * Deliberately left as JavaScript and deliberately not modernized -- the
 * `var` declarations, loop shapes and arithmetic are byte-identical to the
 * original so the comparison means something. What was removed contained no
 * arithmetic the app relies on: the $w() report plumbing inside
 * calc_future_value, the prt_blank/put_str text helpers, the commented-out
 * debug traces, and the unused calc_payment_old. What that reporting path
 * produced is preserved as data in amortization.golden.ts.
 */

export const MAX_MONTHS =  1200;  // 100 yrs

// If any input value is greater than MAX_VALUE, it's probably a conversion error.
export const MAX_VALUE = 100000000;  // 100 Mil
export const MIN_VALUE = -MAX_VALUE;  //- 100 Mil

// truncate to 3 decimals

export function trim(x)
{
    var t1000x = x * 1000;
    t1000x = Math.floor(t1000x);
    return( t1000x / 1000);
}

export function calc_term(yearly_rate, init_val, payment, end_val, infadj) {

	var monthly_interest;
	var months = 0;
	var adjusting_principal;
    var this_months_principal;

    var monthly_int_rate = ((yearly_rate / 12) * .01);

    infadj *= .01;
    adjusting_principal = init_val;

	do
	{
		months++;
		monthly_interest = monthly_int_rate * adjusting_principal;
		this_months_principal = payment + monthly_interest;
		adjusting_principal += this_months_principal;
		if (months > MAX_MONTHS)  break;
		if ((months % 12) == 0) payment *= 1 + infadj;
	}
	  while(Math.abs(adjusting_principal+end_val) > Math.abs(this_months_principal))

    return(months);
	
}

//
//  Note that we could also caclulate the payment using an equation, but since I don't quite understand
//  how the equation was derived, I wanted to use my own method below.  Here is the equation & reference:
//
// M = P((r((1+r)**N))/((1+r)**N) -1)
// ref:  https://www.wikihow.com/Calculate-Mortgage-Payments#Calculating-Mortgage-Payments-with-an-Equation 
//
//  Using a binary search method to find the payment.  There are more direct ways to do this, however, with having the
//  "inflation" adjustment complicates things, so this method works as well as anything.

export function calc_payment( term, yearly_rate, present_value, future_value, inf_adj )
{
	var hi_payment = 10000000;  // Hopefully, it's safe to assume the max payment is 10 mil
	var lo_payment = -10000000;
	var max_tries = 0;
	var est_payment;
	var ttl_principal;
	var payment;
	var rate = (yearly_rate/12) *.01;
	var monthly_int;
	
    inf_adj *= .01;

	while (max_tries++ < 100)
	{
		est_payment = (hi_payment + lo_payment)/2;
		ttl_principal = present_value;
		payment = est_payment;
	
		for (var i=1; i<=term; i++)
		{
			monthly_int = ttl_principal * rate;
			ttl_principal += payment + monthly_int;
			if ((i % 12) == 0) payment *= 1 + inf_adj;
		}
		if (Math.abs(ttl_principal + future_value) < .005)
			break;

		if (ttl_principal < -future_value)
			lo_payment = est_payment;
		else
			hi_payment = est_payment;

	}
	return(est_payment);
	
}

export function calc_present_value(term, yearly_rate, payment, future_value, infadj)
{
	
	var present_value = future_value;
	var monthly_int_rate = 1+((yearly_rate/12) *.01);

	var years = Math.floor((term - 1)/12);

    infadj *= .01;
    payment = payment * Math.pow(1 + infadj, years);

	for (var i=1; i<=term; i++)
	{
		present_value = (present_value + payment) / monthly_int_rate;
		if ((i % 12) == 0) payment /= 1 + infadj;
	}
	
	//  Note that we are negating the initial value because we started at the end and worked our way backwards.
	return(-present_value);
	
}

//
//  As far as I know, there is no way to calculate the interest rate directly.  I'm open to someone correcting me on this
//  but I could not figure it out and I did find a reference to this on a google search that said that calculators use
//  a method similar to the one below.
//  What we do is guess at the answer, and then use a binary search method to close in on the actual value.
//

export function calc_ttl_payments( payment, term, infadj )  // Helper function for main function below
{
	var ttl = 0;

	for (var i=1; i <= term; i++)
	{
		ttl += payment;
	    if ((i % 12) == 0) payment *= 1 + infadj;
	}
	return(ttl);
}

export function calc_int_rate(term, present_value, payment, future_value, infadj)
{
	var adjusting_principal
	var estimated_rate;
	var ttl_int;
	var monthly_interest;
	var i;
	var exact_int;
	var hi_rate = .99;
	var lo_rate = -.99;
	var max_tries = 0;
	var new_payment;
    
	infadj *= .01;
	var ttl_payments = calc_ttl_payments( payment, term, infadj );
	exact_int = Math.abs(ttl_payments + (future_value + present_value));

	while (max_tries++ < 100)
	{
		ttl_int = 0;
		estimated_rate = (hi_rate + lo_rate) / 2;
		adjusting_principal = present_value;
		new_payment = payment;

		for (i = 1; i <= term; i++)
		{
			monthly_interest = adjusting_principal * estimated_rate;
			ttl_int += monthly_interest;
			adjusting_principal += (new_payment + monthly_interest);
			if ((i % 12) == 0) new_payment *= 1 + infadj;

		}
		
		ttl_int = Math.abs(ttl_int);

		if (Math.abs(ttl_int - exact_int) < .005)  // Are we done?
				break;
		if (ttl_int < exact_int)
			lo_rate = estimated_rate;
		else
			hi_rate = estimated_rate;
	}

	return( estimated_rate * 12.0 * 100.0 );

}

//	f_future_val = calc_future_value(12, 12, 0, -1000);

export function calc_future_value(term, yearly_rate, present_value, payment, infadj)
{
	var future_value
	var monthly_interest;
	var i;
	var monthly_principal;

	var monthly_int_rate = (yearly_rate/12) *.01;
    infadj = infadj*.01;
	future_value = present_value;
	
	var ttl_principal = present_value;
    var ttl_payments = 0;
	var ttl_int = 0;

	for (i = 1; i <= term; i++)
	{
		monthly_interest = future_value * monthly_int_rate;
		monthly_principal = payment + monthly_interest;
		ttl_principal += monthly_principal;
		ttl_int += monthly_interest;
		ttl_payments += payment;
		future_value += monthly_interest + payment;
		if ((i % 12) == 0) payment *= 1 + infadj;
	}

	return( -future_value );

}

