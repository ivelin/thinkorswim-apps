# Thinkscript Consolidation Base and Breakout Indicator based on IBD CANSLIM rules
# ivelin.eth (c) 2023
# Apache Software License 2.0

#hint: Detects areas on Daily charts that meet CANSLIM price and volume consolidation breakout rules.
#hint maxBaseDepthPercent: Maximum allowed depth of consolidation base.
#hint maxBreakoutPercentAboveBuyPoint: Max percent jump of breakout day close above base high price (buy point). Do not chase extended stocks.
#hint minBreakoutVolumePercent: Percent above average volume on the day of breakout.
#hint minAverageVolume: minimum average trading volume. Focus on stocks with sufficient institutional sponsorship.

# NOTE! 
# Built for daily aggregation
# Not tested with other aggregation periods

# Adjust for current chart aggregation period
plot aggPeriod = GetAggregationPeriod();
aggPeriod.Hide();

plot aggAdjustment = AggregationPeriod.DAY / aggPeriod;
aggAdjustment.Hide();

# CANSLIM requires at least 6 weeks of consolidation
# N weeks on a daily chart is N*5
# Experimentally, shorter periods appear to work a little better in recent years 

# CANSLIM requires at least 6 weeks of consolidation
# N weeks on a daily chart is N*5
# Experimentally, shorter periods appear to work a little better in recent years 
input minBaseLengthWeeks = 1;
plot minBaseLength = minBaseLengthWeeks * 5 * aggAdjustment;
minBaseLength.Hide();

input maxBaseLengthWeeks = 24; # about 6 months
plot maxBaseLength = maxBaseLengthWeeks * 5 * aggAdjustment;
maxBaseLength.Hide();

plot baseHighOffset = GetMaxValueOffset(close[1], maxBaseLength);
baseHighOffset.Hide();

plot isBreakout;

plot atr = ATR(length = 50 * aggAdjustment);
atr.Hide();

plot baseHigh;
baseHigh.Hide();

plot baseLow;
baseLow.Hide();

input volumeAverageLength = 50;

input minBreakoutVolumePercent = 10;

input minAverageVolume = 250000;
def volavg = VolumeAvg(length = volumeAverageLength).VolAvg;

plot buyVolSpike = if volume > volavg * (1 + minBreakoutVolumePercent / 100) and close > close[1] then yes else no;
buyVolSpike.Hide();

plot maxBaseDepth;
maxBaseDepth.Hide();

def maxBreakoutPercentAboveBuyPoint = atr;

plot consolidationDepth;
consolidationDepth.Hide();

plot isConsolidationOK;
isConsolidationOK.Hide();

plot buyUpperLimit;
buyUpperLimit.Hide();

plot tooExtended;
tooExtended.Hide();

plot aboveBase;
aboveBase.Hide();

if baseHighOffset > minBaseLength {
    baseHigh = GetValue(close[1], baseHighOffset);
    baseLow = fold i = 0 to baseHighOffset with price = baseHigh do if price > GetValue(close, i) then GetValue(close, i) else price;
    consolidationDepth = baseHigh - baseLow;
    maxBaseDepth = (baseHighOffset / ( 5 * aggAdjustment) + 2) * atr;
    isConsolidationOK = consolidationDepth <= maxBaseDepth;
    buyUpperLimit = baseHigh + atr;
    tooExtended = close > buyUpperLimit;
    aboveBase = close > baseHigh;
    # check if this bar is a breakout bar
    isBreakout = aboveBase and isConsolidationOK;
} else {
    isBreakout = no;
    baseLow = Double.NaN;
    aboveBase  = Double.NaN;
    tooExtended  = Double.NaN;
    buyUpperLimit = Double.NaN;
    isConsolidationOK  = Double.NaN;
    consolidationDepth = Double.NaN;
    baseHigh = Double.NaN;
    maxBaseDepth = Double.NaN;
}

isBreakout.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);
isBreakout.DefineColor("BuyRange", CreateColor( 50, 100 , 75));


plot breakoutBuyZone = (isBreakout and buyVolSpike) or (isBreakout[1] and buyVolSpike[1] and close < high[1] + atr);
breakoutBuyZone.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);


# AddChartBubble(isBreakout and !isBreakout[1], high, "Base\nBreakout", isBreakout.Color("BuyRange"), up = yes);

#######
# Next Layer Market Factors 
#######

plot sma50 = SimpleMovingAvg("length" = 50 * aggAdjustment)."SMA";
sma50.Hide();
plot closeAbove50Sma = close > sma50;
closeAbove50Sma.Hide();
plot sma200 = SimpleMovingAvg("length" = 200 * aggAdjustment)."SMA";
sma200.Hide();
plot sma50OverSma200 = sma50 > sma200;
sma50OverSma200.Hide();

# NASDAQ net new highs v lows
def hl = close("$NAHGH") - close("$NALOW");
# show moving average line
plot hlSma = MovingAverage(AverageType.SIMPLE, hl, 21 * aggAdjustment);
hlSma.Hide();
plot marketAboveAverage = hl >= hlSma;
marketAboveAverage.Hide();
# Definite bear market when SPX SMA50 below SMA200
def spx50sma = SimpleMovingAvg(close("SPX"), length = 50 * aggAdjustment);
def spx200sma = SimpleMovingAvg(close("SPX"), length = 200);
plot isBearMarket =  sma50 < sma200 and (spx50sma < spx50sma[minBaseLength] or spx200sma < spx200sma[minBaseLength]);
isBearMarket.Hide();
plot marketBullish = !isBearMarket and (hl > 0 or marketAboveAverage);
marketBullish.Hide();
plot marketUptrend = marketBullish and marketBullish[1] and marketBullish[2];
marketUptrend.Hide();

plot alpha = AlphaJensen(length = 21 * aggAdjustment);
alpha.Hide();
plot alphaUptrend = alpha > 0 and alpha[1] > 0 and alpha[2] > 0;
alphaUptrend.Hide();
plot alphaBullish = alpha > 0; # or alphaUptrend[1]; # 
alphaBullish.Hide();

# In a cooperating market and uptrend stock, we can try to buy on pullbacks
plot ema21 = MovAvgExponential(length = 21 * aggAdjustment);
ema21.Hide();
plot ema21Oversma50 = ema21 > sma50;
ema21Oversma50.Hide();
plot nearness = 2 * atr;
nearness.Hide();
plot nearEma21 = AbsValue(high - ema21) <= nearness or AbsValue(low - ema21) <= nearness or AbsValue(vwap - ema21) <= nearness;
nearEma21.Hide();
plot extendedAboveSma50 = high > 5 * atr + sma50;
extendedAboveSma50.Hide();
plot bounceOff21Ema = close > close[1] and volume > volume[1] and nearEma21 and !extendedAboveSma50; #   close crosses ema21;  close > ema21 and 
bounceOff21Ema.Hide();

# plot bounceOff50Sma = no; # AbsValue(close - sma50) / sma50 <= 0.02;
# bounceOff50Sma.hide();

def buyTrigger;

def entryPrice = EntryPrice();
def maxBuyOffset = 21 * aggAdjustment; # 2 weeks
plot recentBuy = (buyTrigger[1] or isBreakout) within maxBuyOffset bars;
recentBuy.Hide();
# add to position that had a recent breakout
plot addOnBounce = recentBuy and marketBullish and alphaUptrend and bounceOff21Ema and ema21 > ema21[minBaseLength] and sma50 > sma50[minBaseLength]; # (bounceOff21Ema or bounceOff50Sma); # recentBuy and 
addOnBounce.Hide();

#
# Janet's rule (IBD ATX) for overriding 1YH offset with market bottom
plot marketBottom = MovingAvgCrossover(price = close("SPX"), length1 = 50 * aggAdjustment, length2 = 200 * aggAdjustment, averageType1 = AverageType.SIMPLE, averageType2 = AverageType.SIMPLE,  crossingType = "above" );
marketBottom.Hide();
def marketBottomOff = if marketBottom then 0 else if IsNaN(marketBottomOff[1]) then Double.NaN else marketBottomOff[1] + 1;
plot marketBottomOffset = marketBottomOff;
marketBottomOffset.Hide();
# check if breakout is within 20% of 1 year high
def highestHighOffset = if IsNaN(marketBottomOffset) then 252 else if marketBottomOffset < 252 then marketBottomOffset else 252;
plot near1YH = close >= LookUpHighest(close, highestHighOffset * aggAdjustment) * 0.80;
near1YH.Hide();


plot goodAvgVolume = volavg > minAverageVolume;
goodAvgVolume.Hide();

# make sure we are at least 2 weeks away from an earnings report which may reset a trend
plot nextEarningsOffset = GetEventOffset(Events.EARNINGS, 0);
nextEarningsOffset.Hide();

# plot nearEarningsReport = nextEarningsOffset >= -7;
# nearEarningsReport.Hide();

plot bullishContext = marketBullish and alphaBullish and goodAvgVolume and near1YH; # and !nearEarningsReport;
bullishContext.Hide();

# Buy rule
buyTrigger = (breakoutBuyZone or addOnBounce) and closeAbove50Sma and ema21Oversma50 and bullishContext; #  sma50OverSma200 and
plot buySignal = buyTrigger;
buySignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);

def highestCloseSinceBuy = CompoundValue(1, if IsNaN(highestCloseSinceBuy[1]) then close else if buySignal then open[-1] else if close > highestCloseSinceBuy[1] then close else highestCloseSinceBuy[1], 0);

plot highestCloseSinceEntry = highestCloseSinceBuy;
highestCloseSinceEntry.Hide();

# Sell rule
plot stopLossTolerance = if marketUptrend and alphaUptrend then 3 else if marketBullish or alphaBullish then 2 else 1;
stopLossTolerance.Hide();
def stopLossThreshold = stopLossTolerance * atr;
plot stopLoss = if IsNaN(entryPrice) then no else close <  entryPrice - stopLossThreshold;
stopLoss.Hide();

def takeProfitThreshold = stopLossTolerance * 7 * atr;
plot takeProfit = if IsNaN(entryPrice) then no else highestCloseSinceEntry > entryPrice + takeProfitThreshold;
takeProfit.Hide();

# Looks like MMM is only available for the current date, not based on chart bar time
# plot mmv = GetMarketMakerMove();
# mmv.Hide();

# plot highEarningsGapRisk = nextEarningsOffset >= -2; # and if IsNaN(mmv) then yes else mmv > atr;
# highEarningsGapRisk.hide();
plot sellSignal = !buySignal and (takeProfit or stopLoss); # or highEarningsGapRisk);
sellSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);

AddOrder(OrderType.BUY_TO_OPEN, buySignal, open[-1], 1, Color.LIME, Color.LIME, "Buy @ " + open[-1]);
AddOrder(OrderType.SELL_TO_CLOSE, sellSignal, open[-1], 1, Color.ORANGE, Color.ORANGE, "Sell @ " + open[-1]);
