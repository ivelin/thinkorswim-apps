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

# CANSLIM requires at least 6 weeks of consolidation
# N weeks on a daily chart is N*5
input weeksOfConsolidation = 6;
plot baseStartOffset = weeksOfConsolidation*5;
baseStartOffset.hide();

plot baseHigh = Highest(close[1], baseStartOffset);
baseHigh.Hide();

def maxBaseDepthPercent = 20;

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

# check if breakout is within 20% of 2 year high
plot nearATH = high >= Highest(high, 252) * 0.8;
nearATH.Hide();

plot goodAvgVolume = volavg > minAverageVolume;
goodAvgVolume.Hide();

# make sure we are at least 2 weeks away from an earnings report which may reset a trend
plot nextEarningsOffset = GetEventOffset(Events.EARNINGS, 0);
nextEarningsOffset.Hide();

plot nearEarningsReport = nextEarningsOffset > -14;
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

plot sma50 = SimpleMovingAvg("length" = 50)."SMA";
sma50.hide();
plot closeAbove50Sma = close > sma50;
closeAbove50Sma.hide();
plot sma200 = SimpleMovingAvg("length" = 200)."SMA";
sma200.hide();
plot sma50OverSma200 = sma50 > sma200;
sma50OverSma200.hide();

# NASDAQ net new highs v lows
def hl = close("$NAHGH") - close("$NALOW");
# show moving average line
plot hlSma = MovingAverage(AverageType.SIMPLE, hl, 21);
hlSma.hide();
plot marketAboveAverage = hl >= hlSma;
marketAboveAverage.hide();
# Show trend cloud
plot marketUptrend =hl > 0 and hl[1] > 0 and hl[2] > 0;
marketUptrend.hide();
plot marketBullish = marketUptrend or marketAboveAverage;
marketBullish.hide();

plot alpha = AlphaJensen();
alpha.hide();
plot alphaBullish = alpha > 0; # and alpha[1] > 0 and alpha[2] > 0;
alphaBullish.hide();

# Buy rule
plot buySignal = isBreakout and closeAbove50SMA and sma50OverSma200 and marketBullish and alphaBullish;
buySignal.hide();

def stockQty;

# Sell rule
def entryPrice = EntryPrice();
plot stopLoss = if IsNaN(entryPrice) then no else low < 0.915 * entryPrice;
stopLoss.Hide();
plot takeProfit = if IsNaN(entryPrice) then no else high > 1.2 * entryPrice;
takeProfit.Hide();
plot sellSignal = (IsNaN(stockQty[1]) or stockQty[1] > 0) and !buySignal and (takeProfit or stopLoss or nextEarningsOffset > -3);
sellSignal.Hide();

# Track stockQty
stockQty = CompoundValue(1, if buySignal then stockQty[1]+1 else if sellSignal then stockQty[1]-1 else stockQty[1], 0);

plot stockQtyPlot = stockQty;
stockQtyPlot.hide();

AddOrder(OrderType.BUY_TO_OPEN, buySignal, open[-1], 1, Color.LIME, Color.LIME, "CS Buy @ " + open[-1]);
AddOrder(OrderType.SELL_TO_CLOSE, sellSignal, open[-1], 1, Color.ORANGE, Color.ORANGE, "CS Sell @ " + open[-1]);

