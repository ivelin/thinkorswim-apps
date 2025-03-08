# Thinkscript study that shows over time the invested capital cash flows and total returns of a position.
# ivelin.eth (c) 2025
# Apache Software License 2.0

declare lower;

# Inputs for user customization of plot line and label colors
# Note: ThinkScript doesn’t support a full color picker; using extended dropdown instead
input InvestedCapitalColor = {GREEN, RED, BLUE, YELLOW, MAGENTA, CYAN, WHITE, GRAY, BLACK, ORANGE, PINK, VIOLET, BROWN, default LIGHT_GRAY, DARK_RED, DARK_GREEN, DARK_BLUE};
input TotalProfitColor = {YELLOW, RED, BLUE, GREEN, MAGENTA, CYAN, WHITE, GRAY, BLACK, ORANGE, PINK, VIOLET, BROWN, default LIGHT_GRAY, DARK_RED, DARK_GREEN, DARK_BLUE};
input ROICColor = {BLUE, RED, GREEN, YELLOW, MAGENTA, CYAN, WHITE, GRAY, BLACK, ORANGE, PINK, VIOLET, BROWN, default LIGHT_GRAY, DARK_RED, DARK_GREEN};

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
def investedCapital = if quantity != 0 and !IsNaN(avgPrice) then quantity * avgPrice else Double.NaN;

# Get unrealized profit/loss
def openPL = GetOpenPL();

# Calculate total profit (realized + unrealized)
def totalProfit = totalRealizedGains + openPL;

# Plot Invested Capital on the left axis (in dollars) with user-selected color
plot InvestedCapitalPlot = investedCapital;
# InvestedCapitalPlot.SetDefaultColor(GetColor(InvestedCapitalColor));
InvestedCapitalPlot.SetPaintingStrategy(PaintingStrategy.LINE);
InvestedCapitalPlot.SetLineWeight(2);

# Plot Total Profit on the left axis (in dollars) with user-selected color
plot TotalProfitPlot = totalProfit;
#TotalProfitPlot.SetDefaultColor(GetColor(TotalProfitColor));
TotalProfitPlot.SetPaintingStrategy(PaintingStrategy.LINE);
TotalProfitPlot.SetLineWeight(2);

# Add a zero line for reference (aligned with the left axis)
plot ZeroLine = 0;
ZeroLine.SetDefaultColor(Color.GRAY);

# Add labels with default black color, allowing user to match plot colors
AddLabel(yes, "Invested Capital ($): " + Round(investedCapital, 2), GetColor(InvestedCapitalColor));
AddLabel(yes, "Total Profit ($): " + Round(totalProfit, 2), GetColor(TotalProfitColor));

