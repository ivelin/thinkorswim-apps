#
# Based on ToS built-in Thinkscript code
#

# Copyright 2023 Ivelin Ivanov (ivelin117@gmail.com)
# Apache Software License 2.0

#hint: <b>RelativeStrength_BetaAdjusted</b> \n This study is inspired by Matt Carusso's CARS and is derived from AlphaJensen, Beta and RelativeStrength code. It adjusts the Relative Strength formula to account for volatility in order to minimize false strong signals when the underlying stock has much higher volatility than the secondary/index it is compared to. Matt Carusso introduced CARS, which has a similar concept.\n 
#hint length: <b>Number of lookback periods</b> to calculate beta and alpha average between security and index.
#hint index: <b>Index or Security</b> to compare with.

declare lower;

input length = 21;


#hint returnLength: <b>Offset period</b> to compare current bar price against for calculating rate change index alpha and beta formulas.
def returnLength = 1;

input index = "SPX";


def close2 = close(index);


assert(returnLength > 0, "'return length' must be positive: " + returnLength);

def primary = RateOfChange(price = close, length = returnLength);

def secondary = RateOfChange(price = close2, length = returnLength);

def Beta = covariance(primary, secondary, length) / Sqr(stdev(secondary, length));
# Beta.SetDefaultColor(GetColor(9));


# Calculate beta adjusted relative price change
plot BRS = if close2 == 0 then 0 else (close / (close2 *Beta));
BRS.setDefaultColor(GetColor(6));

def sr = CompoundValue("historical data" = BRS, "visible data" = if isNaN(sr[1]) then BRS else sr[1]);
plot SRatio =  sr;
SRatio.setDefaultColor(GetColor(5));
