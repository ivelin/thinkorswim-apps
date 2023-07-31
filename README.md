# Thinkorswim Apps

Various experimental studies and strategies written in Thinkscript for users of the Thinkorswim investment platform. 


**USE AT YOUR OWN RISK!**
> Disclaimer: In order to demonstrate the functionality of these apps, actual ticker symbols may be used. However, we do not make recommendations or determine the suitability of any security or strategy for individual traders. Any investment decision you make in your self-directed account is solely your responsibility. Be sure to backtest any strategy to determine if you understand the risks involved with each strategy.

## Net New Highs - Lows

Leading market trend indicator that shows whether stocks in a given period have net new 52 week highs or net new lows. Generally if periods of net new highs are more frequent than periods with net new lows, it may indicate that a bullish market trend is forming. Respectively if periods of net new lows are more frequent, that may indicate that a bear market trend is forming.

Celebrity investor Matt Caruso explains in the video below when this indicator can be helpful:
[![Watch the video](http://i3.ytimg.com/vi/wrNSOfE4AO8/hqdefault.jpg)](https://youtu.be/wrNSOfE4AO8)

## Thinkorswim Study

ToS Study can be imported from this link: [http://tos.mx/dBcU2fF](https://tos.mx/T9NuyZc)

## Example Chart

Example ToS Chart for TSLA and Net New Highs / Lows studies from NYSE and NASDAQ:

![Screen Shot 2023-07-31 at 1 17 11 AM](https://github.com/ivelin/thinkorswim-apps/assets/2234901/1632137b-2cb3-4932-816c-89f2f64eaa45)

## Source Code

Thinkscript source code is available in this repo: [new_highs_lows.rb](new_highs_lows.rb)

## Credit
Thinkscript code is based on [Melvin's work](https://thinkscript101.com/new-highs-new-lows-indicator-thinkorswim/).

## Notes
The study uses ToS built-in Net Highs and Net Lows symbols such as : `$NYHGH`, `$NYLOW` and others. A more complete list is available in the [ToS Learning Center](https://tlc.thinkorswim.com/center/release/rel-07-20-2013).

# Contributing

Bug fixes and improvements are welcome! Please read the [CONTRIBUTING GUIDE](CONTRIBUTING.md) and [CODE OF CONDUCT](CODE_OF_CONDUCT.md) before your first contribution.
