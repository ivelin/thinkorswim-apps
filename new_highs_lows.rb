# Based on original work by Melvin and Mobius
# https://thinkscript101.com/new-highs-new-lows-indicator-thinkorswim/

#
# Copyright 2022 Scott J. Johnson (https://scottjjohnson.com)
# Copyright 2023 Ivelin Ivanov (ivelin117@gmail.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
 
#
# ExchangeListedNetHighLow
#
# Shows the number of new 52-week highs - new 52-week lows by day for the selected exchange. If the
# number of lows is greater than the number of highs, the value will be negative. If highs are
# greater, the number will be positive. Exchange = "ETF" shows net highs - lows for all ETFs listed
# on the 4 exchanges.
#
# The TOS symbols don't appear to work at expected when the aggregation period is WEEK so this
# study is only for daily charts.
#

declare lower;
input exchange = {default "NYSE", "NASDAQ", "AMEX", "ARCA", "ETF"};
 
def diff;
switch (exchange){
case "NYSE":
    diff = close("$NYHGH") - close("$NYLOW");
case "NASDAQ":
    diff = close("$NAHGH") - close("$NALOW");
case "AMEX":
    diff = close("$AMHGH") - close("$AMLOW");
case "ARCA":
    diff = close("$ARHGH") - close("$ARLOW");
case "ETF":
    diff = close("$ETFHIGH") - close("$ETFLOW");
}
 
# show net new highs/lows bars
plot hlp = diff;
hlp.EnableApproximation();
hlp.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
hlp.SetLineWeight(5);
hlp.AssignValueColor(if hlp < 0 then Color.RED
                        else if hlp > 0 then Color.GREEN
                        else Color.CYAN);
 
# show zero line
plot zero = 0.0;
zero.SetDefaultColor(Color.WHITE);
zero.SetLineWeight(1);
zero.HideBubble();
zero.HideTitle();

# Show trend cloud
def uptrend = diff > 0 and diff[1] > 0 and diff[2] > 0;
def downtrend = diff < 0 and diff[1] < 0 and diff[2] < 0;
def hiLevel = if uptrend then Double.POSITIVE_INFINITY else if downtrend then Double.NEGATIVE_INFINITY else 0;
AddCloud(hiLevel, -hiLevel, Color.LIGHT_GREEN, Color.LIGHT_RED);

