# ThinkScript study to display Invested Capital, Total Profit, and Time-Adjusted Return as a label, adjusted for active investment periods.
# ivelin.eth (c) 2025
# Apache Software License 2.0

declare lower;

# Inputs for user customization of plot line and label colors
input AverageInvestedCapitalColor = {GREEN, RED, BLUE, YELLOW, MAGENTA, CYAN, WHITE, GRAY, BLACK, ORANGE, PINK, VIOLET, BROWN, default LIGHT_GRAY, DARK_RED, DARK_GREEN, DARK_BLUE};
input TotalProfitColor = {YELLOW, RED, BLUE, GREEN, MAGENTA, CYAN, WHITE, GRAY, BLACK, ORANGE, PINK, VIOLET, BROWN, default LIGHT_GRAY, DARK_RED, DARK_GREEN, DARK_BLUE};
input TimeAdjustedReturnColor = {BLUE, RED, GREEN, YELLOW, MAGENTA, CYAN, WHITE, GRAY, BLACK, ORANGE, PINK, VIOLET, BROWN, default LIGHT_GRAY, DARK_RED, DARK_GREEN, DARK_BLUE};

# Get current and previous position sizes
def quantity = GetQuantity();
def prevQuantity = if IsNaN(quantity[1]) then 0 else quantity[1];

# Detect shares sold (position decreases)
def sharesSold = if quantity < prevQuantity then prevQuantity - quantity else 0;

# Get the entry price before the sale
def entryPrice = GetAveragePrice()[1];

# Calculate realized profit/loss for each sell event
def realizedPL = if sharesSold > 0 then sharesSold * (close - entryPrice) else 0;

# Accumulate total realized gains recursively
def totalRealizedGains = if IsNaN(totalRealizedGains[1]) then realizedPL else totalRealizedGains[1] + realizedPL;

# Get current invested capital
def avgPrice = GetAveragePrice();
def investedCapital = if quantity != 0 and !IsNaN(avgPrice) then quantity * avgPrice else 0;

# Get unrealized profit/loss
def openPL = GetOpenPL();

# Calculate total profit (realized + unrealized)
def totalProfit = totalRealizedGains + openPL;

# Accumulate invested capital and count bars only when quantity > 0
def activeInvestedCapital = if quantity > 0 then investedCapital else 0;
def cumulativeActiveCapital = if BarNumber() == 1 then activeInvestedCapital else cumulativeActiveCapital[1] + activeInvestedCapital;
def activeBars = if BarNumber() == 1 then (if quantity > 0 then 1 else 0) else activeBars[1] + (if quantity > 0 then 1 else 0);

# Calculate average invested capital over active bars
def averageInvestedCapital = if activeBars > 0 then cumulativeActiveCapital / activeBars else Double.NaN;

# Calculate Time-Adjusted Return using average invested capital over active bars
def TimeAdjustedReturn = if averageInvestedCapital != 0 then (totalProfit / averageInvestedCapital) * 100 else Double.NaN;

# Plot Invested Capital on the left axis (in dollars)
plot InvestedCapitalPlot = investedCapital;
InvestedCapitalPlot.SetDefaultColor(Color.DARK_GREEN);
InvestedCapitalPlot.SetPaintingStrategy(PaintingStrategy.LINE);
InvestedCapitalPlot.SetLineWeight(2);

# Plot Total Profit (Returns) on the left axis (in dollars)
plot TotalProfitPlot = totalProfit;
TotalProfitPlot.SetDefaultColor(Color.ORANGE);
TotalProfitPlot.SetPaintingStrategy(PaintingStrategy.LINE);
TotalProfitPlot.SetLineWeight(2);

# Add a zero line for reference
plot ZeroLine = 0;
ZeroLine.SetDefaultColor(Color.RED);

# Add labels with user-selected colors
AddLabel(yes, "Average Invested Capital ($): " + Round(averageInvestedCapital, 2), GetColor(AverageInvestedCapitalColor));
AddLabel(yes, "Total Profit ($): " + Round(totalProfit, 2), GetColor(TotalProfitColor));
AddLabel(yes, "Time-Adjusted Return: " + Round(TimeAdjustedReturn, 2) + "%", GetColor(TimeAdjustedReturnColor));
