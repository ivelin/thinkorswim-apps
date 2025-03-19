# Thinkorswim Apps

Various experimental studies and strategies written in Thinkscript for users of the Thinkorswim investment platform. 


**USE AT YOUR OWN RISK!**
> Disclaimer: In order to demonstrate the functionality of these apps, actual ticker symbols may be used. However, we do not make recommendations or determine the suitability of any security or strategy for individual traders. Any investment decision you make in your self-directed account is solely your responsibility. Be sure to backtest any strategy to determine if you understand the risks involved with each strategy.


## ThinkOrSwim Position Capital Efficiency and Time Weighted Returns Study

### Overview

This ThinkOrSwim chart study visualizes the performance of a trading position over time. It plots the **current Invested Capital** and **Total Profit** as lines on a lower chart panel and displays the **Time-Adjusted Return** (a simplified Modified Dietz Return) as a label. The study leverages real-time position data to track capital deployment and profitability, with a special emphasis on the **time-averaged invested capital** for assessing capital efficiency.

### Features
- **Invested Capital Plot**: Tracks the current cost basis of your position (in dollars) as a **dark green** line.
- **Total Profit Plot**: Displays the combined realized and unrealized gains/losses (in dollars) as an **orange** line.
- **Time-Adjusted Return**: A label showing the return percentage, calculated as Total Profit divided by the time-averaged invested capital, adjusted for the duration capital was deployed.
- **Labels**:
  - **Average Invested Capital**: Shows the time-averaged invested capital (in dollars). Only bars when some capital was working count. Bars without any invested capitals are not counted for the average.
  - **Total Profit**: Displays the current total profit (in dollars).
  - **Time-Adjusted Return**: Presents the return percentage.
- **Customizable Colors**: Users can adjust label colors via dropdown inputs (default: **light gray**).

### Thinkorswim Shared Study Link

Position Capital Efficiency and Time Weighted Returns Study can be imported directly into ToS Desktop from [this link](http://tos.mx/!4UQxYgd7)

### Notes on Approximations
- **Execution Price**: The study approximates the sale price for realized gains using the bar’s closing price (`close`) because ThinkOrSwim chart studies don’t provide access to exact execution prices. This is annotated in the code where `realizedPL` is calculated.
- **Time-Adjusted Return**: This metric simplifies the traditional Modified Dietz method by using average invested capital instead of precise cash flow timing, making it practical within ThinkScript’s limitations but less granular.

### Example Chart

Example ToS Charts with Capital Efficiency Study and trades along the price chart of example stocks.

![Screenshot from 2025-03-08 16-13-16](https://github.com/user-attachments/assets/d6363c19-3cbc-4076-8898-165fe13bf004)

![image](https://github.com/user-attachments/assets/fa0c46cf-b7f6-4c70-ae00-ef6849ce0172)


### Source Code

Thinkscript source code is available in this repo: [position-capital-efficiency.ts](position-capital-efficiency.ts)

### Credit

This study was built in collaboration with [Grok 3](https://grok.com/).

## Net New Highs - Lows

Leading market trend indicator that shows whether stocks in a given period have net new 52 week highs or net new lows. Generally if periods of net new highs are more frequent than periods with net new lows, it may indicate that a bullish market trend is forming. Respectively if periods of net new lows are more frequent, that may indicate that a bear market trend is forming.

Celebrity investor Matt Caruso explains in the video below when this indicator can be helpful:
[![Watch the video](http://i3.ytimg.com/vi/wrNSOfE4AO8/hqdefault.jpg)](https://youtu.be/wrNSOfE4AO8)

### Thinkorswim Shared Study Link

New Highs and Lows ToS Study can be imported from [this link](https://tos.mx/T9NuyZc)

### Example Chart

Example ToS Chart for TSLA and Net New Highs / Lows studies from NYSE and NASDAQ:

![Screen Shot 2023-07-31 at 1 17 11 AM](https://github.com/ivelin/thinkorswim-apps/assets/2234901/1632137b-2cb3-4932-816c-89f2f64eaa45)

### Source Code

Thinkscript source code is available in this repo: [new_highs_lows_STUDY.ts](new_highs_lows_STUDY.ts)

### Credit
Thinkscript code is based on [Melvin's work](https://thinkscript101.com/new-highs-new-lows-indicator-thinkorswim/).

### Notes
The study uses ToS built-in Net Highs and Net Lows symbols such as : `$NYHGH`, `$NYLOW` and others. A more complete list is available in the [ToS Learning Center](https://tlc.thinkorswim.com/center/release/rel-07-20-2013).

## Beta Adjusted Relative Strength

This indicator is inspired by [Matt Caruso](https://twitter.com/Trader_mcaruso) 's [CARS](https://www.carusoinsights.com/cars/) (Carusso Adaptive Relative Strength) indicator.

[Relative Strength indicator](https://tlc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/R-S/RelativeStrength) is a popular tool for measuring whether a stock price is growing faster or slower relative to a base index. However when the stock is highly volatile, RS becomes a proxy for the stock price which is not very useful. This Beta Adjusted Relative Strength indicator removes the noise from RS by adjusting for the typical stock volatility relative to the index. See screenshot example below.

### Example Chart: TSLA vs SPX

RS in solid gray line, and Beta Adjusted RS in dashed gray line. Notice how due to TSLA's high volatility relative to SPX (purple line), RS does not provide meaningful information at first glance. Whereas Beta Adjusted RS shows more pronounced spikes and slopes as a stock trend develops relative to the index.
 
![Screen Shot 2023-08-15 at 8 11 39 PM](https://github.com/ivelin/thinkorswim-apps/assets/2234901/cc03d571-c01f-48d2-9624-92750f5aafcd)


### Thinkorswim Shared Study Link

Beta Adjusted Relative Strength ToS Study can be imported from [this link](https://tos.mx/ScdmpVq) .

### Source Code

Thinkscript source code is available in this repo: [relative_strength_beta_adjusted_STUDY.ts](relative_strength_beta_adjusted_STUDY.ts)


## IBD CANSLIM inspired Breakout Strategy

[IBD CANSLIM](https://www.investors.com/ibd-university/can-slim/) is a popular system with a number of rules for recognizing and acting on leading stocks in cooperating market conditions. 
CANSLIM has extreme focus on True Market Leader (TML) stocks with exceptional fundamentals (IBD Composite Rating 96+).

This Thinkscript strategy is a simplified interpretation of the CANSLIM 52 week high breakout setup. It is intended to be used with pre-screened TML watchlist stocks.
This strategy is **NOT** intended as a replacement for applying the full CANSLIM system. 
It is simply a tool to help spot entry opportunities within TML watchlists for further analysis. 

NOT A RECOMMENDATION! NOT FINANCIAL ADVICE! USE AT YOUR OWN RISK!

**NOTE**: This strategy is designed and tested only for DAILY aggregation charts. Not tested for other aggregation periods.

### Example Chart

Example ToS Chart applying this breakout strategy to AAPL:
![Screen Shot 2023-10-03 at 8 22 52 AM](https://github.com/ivelin/thinkorswim-apps/assets/2234901/5120cde3-8e63-4650-883e-8520221bbbdf)

### Notes

This strategy seems to provide one possible answer to celebrity investor Mark Minervini's question [posed on his Twitter/X account](https://twitter.com/markminervini/status/1486031846957883393?lang=en):
![Screen Shot 2023-10-02 at 11 10 46 PM](https://github.com/ivelin/thinkorswim-apps/assets/2234901/b988466e-a78b-4f92-92eb-343115b391fe)

### Thinkorswim Shared Strategy Link

Direct Thinkorswim import via [this link](https://tos.mx/dz9WBvo)

### Source Code

Thinkscript source code is available in this repo: [CANSLIM_Breakout_Strategy.ts](CANSLIM_Breakout_Strategy.ts)

# Contributing

Bug fixes and improvements are welcome! Please read the [CONTRIBUTING GUIDE](CONTRIBUTING.md) and [CODE OF CONDUCT](CODE_OF_CONDUCT.md) before your first contribution.
