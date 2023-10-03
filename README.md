# Thinkorswim Apps

Various experimental studies and strategies written in Thinkscript for users of the Thinkorswim investment platform. 


**USE AT YOUR OWN RISK!**
> Disclaimer: In order to demonstrate the functionality of these apps, actual ticker symbols may be used. However, we do not make recommendations or determine the suitability of any security or strategy for individual traders. Any investment decision you make in your self-directed account is solely your responsibility. Be sure to backtest any strategy to determine if you understand the risks involved with each strategy.

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

This Thinkscript strategy is a simplified interpretation of the 52 week high breakout strategy. It is **NOT** intended as a replacement for applying the full CANSLIM system. 
This strategy is simply a tool to help spot entry opportunities for further analysis. NOT A RECOMMENDATION! NOT FINANCIAL ADVICE! USE AT YOUR OWN RISK!

### Example Chart

Example ToS Chart applying this breakout strategy to AAPLE:
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
