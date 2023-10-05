# Consolidation Base and Breakout Indicator based on IBD CANSLIM rules
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
aggPeriod.hide();

plot aggAdjustment = AggregationPeriod.DAY / aggPeriod;
aggAdjustment.hide();

# CANSLIM requires at least 6 weeks of consolidation
# N weeks on a daily chart is N*5
# Experimentally, shorter periods appear to work a little better in recent years 
input weeksOfConsolidation = 1;
plot baseStartOffset = weeksOfConsolidation*5*aggAdjustment;
baseStartOffset.hide();

plot baseHigh = Highest(close[1], baseStartOffset);
baseHigh.Hide();

plot atr = ATR(length=baseStartOffset);
atr.hide();

plot maxBaseDepthPercent = 4*atr*100 / close; # 15;
maxBaseDepthPercent.hide();

input maxBreakoutPercentAboveBuyPoint = 4;

input volumeAverageLength = 50;

input minBreakoutVolumePercent = 10;

input minAverageVolume = 250000;

plot consolidationLow = Lowest(close[1], baseStartOffset);
consolidationLow.Hide();

plot consolidationDepth = 1 - consolidationLow / baseHigh;
consolidationDepth.Hide();

plot isConsolidationOK = consolidationDepth * 100 <= maxBaseDepthPercent;
isConsolidationOK.Hide();

plot buyUpperLimit = baseHigh * (1 + maxBreakoutPercentAboveBuyPoint / 100);
buyUpperLimit.Hide();

def volavg = VolumeAvg(length = volumeAverageLength).VolAvg;

# def mflow = MoneyFlow(close=close, high=high, low=low, volume=volume);
# plot startMoneyFlow = mflow[baseStartOffset];
# startMoneyFlow.hide();
# plot endMoneyFlow = mflow;
# endMoneyFlow.hide();
# plot goodMoneyFlow = (endMoneyFlow-startMoneyFlow) / AbsValue(startMoneyFlow) > minBreakoutVolumePercent / 100;
# goodMoneyFlow.hide();
plot buyVolSpike = if volume > volavg * (1 + minBreakoutVolumePercent / 100) and close > close[1] then yes else no;
buyVolSpike.Hide();

plot tooExtended = close > buyUpperLimit;
tooExtended.Hide();

plot aboveBase = high > baseHigh;
aboveBase.Hide();

# check if breakout is within 20% of 1 year high
plot nearATH = high >= Highest(high, 252*aggAdjustment) * 0.8;
nearATH.Hide();

plot goodAvgVolume = volavg > minAverageVolume;
goodAvgVolume.Hide();

# make sure we are at least 2 weeks away from an earnings report which may reset a trend
plot nextEarningsOffset = GetEventOffset(Events.EARNINGS, 0);
nextEarningsOffset.Hide();

plot nearEarningsReport = nextEarningsOffset > -10;
nearEarningsReport.Hide();

# check if this bar is a breakout bar
plot isBreakout = aboveBase and isConsolidationOK and (buyVolSpike or buyVolSpike[1]) and !tooExtended and goodAvgVolume and !nearEarningsReport and nearATH;
isBreakout.SetPaintingStrategy(PaintingStrategy.BOOLEAN_WEDGE_UP);
isBreakout.DefineColor("BuyRange", CreateColor( 50, 100 , 75));
isBreakout.Hide();

# AddChartBubble(isBreakout and !isBreakout[1], high, "Base\nBreakout", isBreakout.Color("BuyRange"), up = yes);

#######
# Next Layer Market Factors 
#######

plot sma50 = SimpleMovingAvg("length" = 50*aggAdjustment)."SMA";
sma50.hide();
plot closeAbove50Sma = close > sma50;
closeAbove50Sma.hide();
plot sma200 = SimpleMovingAvg("length" = 200*aggAdjustment)."SMA";
sma200.hide();
plot sma50OverSma200 = sma50 > sma200;
sma50OverSma200.hide();

# NASDAQ net new highs v lows
def hl = close("$NAHGH") - close("$NALOW");
# show moving average line
plot hlSma = MovingAverage(AverageType.SIMPLE, hl, 21*aggAdjustment);
hlSma.hide();
plot marketAboveAverage = hl >= hlSma;
marketAboveAverage.hide();
# Show trend cloud
plot marketUptrend =hl > 0 and hl[1] > 0 and hl[2] > 0;
marketUptrend.hide();
plot marketBullish = marketUptrend or marketAboveAverage;
marketBullish.hide();

plot alpha = AlphaJensen(length=21*aggAdjustment);
alpha.hide();
plot alphaBullish = alpha > 0; # and alpha[1] > 0 and alpha[2] > 0;
alphaBullish.hide();

# In a cooperating market and uptrend stock, we can try to buy on pullbacks
plot ema21 = MovAvgExponential(length=21*aggAdjustment);
ema21.hide();
plot ema21Oversma50 = ema21 > sma50;
ema21OverSma50.hide();
plot bounceOff21Ema = close > close[1] and AbsValue(close - ema21) / ema21 <= 0.02 and ema21 >= sma50; #   close crosses ema21;  close > ema21 and 
bounceOff21Ema.hide();

# plot bounceOff50Sma = no; # AbsValue(close - sma50) / sma50 <= 0.02;
# bounceOff50Sma.hide();

def buySignal;

def maxBuyOffset = 10*aggAdjustment;
def recentBuy = buySignal[1] within maxBuyOffset bars;
# add to position that had a recent breakout
plot addOnBounce = marketUptrend and alphaBullish and bounceOff21Ema; # (bounceOff21Ema or bounceOff50Sma); # recentBuy and 
addOnBounce.hide();

# Buy rule
buySignal = (isBreakout or addOnBounce) and closeAbove50SMA and ema21Oversma50 and marketBullish and alphaBullish; #  sma50OverSma200 and
plot buySignalPlot = buySignal;
buySignalPlot.hide();

def stockQty;

# Sell rule
def entryPrice = EntryPrice();
def stopLossThreshold = if marketUptrend then 1-3*atr/close else 1-2*atr/close; # 0.915; # 
plot stopLoss = if IsNaN(entryPrice) then no else close < stopLossThreshold * entryPrice ;
stopLoss.Hide();
def takeProfitThreshold = if marketUptrend then 1+18*atr/close else 1+6*atr/close; # 1.25; # 
plot takeProfit = if IsNaN(entryPrice) then no else close > takeProfitThreshold * entryPrice;
takeProfit.Hide();
plot sellSignal = (IsNaN(stockQty[1]) or stockQty[1] > 0) and !buySignal and (takeProfit or stopLoss or nextEarningsOffset > -3);
sellSignal.Hide();

# Track stockQty
stockQty = CompoundValue(1, if buySignal then stockQty[1]+1 else if sellSignal then stockQty[1]-1 else stockQty[1], 0);

plot stockQtyPlot = stockQty;
stockQtyPlot.hide();

AddOrder(OrderType.BUY_TO_OPEN, buySignal, open[-1], 1, Color.LIME, Color.LIME, "CS Buy @ " + open[-1]);
AddOrder(OrderType.SELL_TO_CLOSE, sellSignal, open[-1], 1, Color.ORANGE, Color.ORANGE, "CS Sell @ " + open[-1]);

