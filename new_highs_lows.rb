# This indicator uses the Index New highs and Index New lows to help gauge overall Market sentiment. It's a leading indicator.
# Index New High - New Low Indicator
# Original script by Mobius
# https://thinkscript101.com/new-highs-new-lows-indicator-thinkorswim/

declare lower;
input Symb = {default "NYSE", "NASDQ", "AMEX", "ARCA", "ETF"};
input length = 10;
input OverSold = 20;
input OverBought = 80;
Input AvgType = AverageType.Hull;
  
def agg = AggregationPeriod.Day;
def NYSEH  = close(Symbol = "$NYHGH", period = agg);
def NYSEL  = close(Symbol = "$NYLOW", period = agg);
def NASDQH = close(Symbol = "$NAHGH", period = agg);
def NASDQL = close(Symbol = "$NALOW", period = agg);
def AMEXH  = close(Symbol = "$AMHGH", period = agg);
def AMEXL  = close(Symbol = "$AMLOW", period = agg);
def ARCAH  = close(Symbol = "$ARHGH", period = agg);
def ARCAL  = close(Symbol = "$ARLOW", period = agg);
def ETFH   = close(Symbol = "$ETFHGH", period = agg);
def ETFL   = close(Symbol = "$ETFLOW", period = agg);
def P;
Switch (Symb){
case "NYSE":
P = NYSEH / (NYSEH + NYSEL) * 100;
case "NASDQ":
P = NASDQH / (NASDQH + NASDQL) * 100; 
case "AMEX":
P = AMEXH / (AMEXH + AMEXL) * 100;
case "ARCA":
P = ARCAH / (ARCAH + ARCAL) * 100;
case "ETF":
P = ETFH / (ETFH + ETFL) * 100;
}
def price = if isNaN(P) then price[1] else P;
plot data = if isNaN(close) then double.nan else price;
data.EnableApproximation();
data.SetDefaultColor(Color.Cyan);
plot avg = MovingAverage(AvgType, data, length);
avg.EnableApproximation();
avg.AssignValueColor(if between(avg, OverSold, OverBought)
                     then Color.yellow
                     else if avg >= OverBought
                          then Color.Green
                          else Color.Red);
avg.SetLineWeight(2);
plot OB = if isNaN(close) then double.nan else OverBought;
OB.SetDefaultColor(Color.Red);
plot OS = if isNaN(close) then double.nan else OverSold;
OS.SetDefaultColor(Color.Green);
plot neutral = if isNaN(close) then double.nan else 50;
neutral.SetdefaultColor(Color.Dark_Gray);
addCloud(0, OS, CreateColor(250,0,0), CreateColor(250,0,0));
addCloud(OS, neutral, createColor(50,0,0), createColor(50,0,0));
addCloud(neutral, OB, createColor(0,50,0), createColor(0,50,0));
addCloud(OB, 100, CreateColor(0,250,0), createColor(0,250,0));
# End High - Low Index
