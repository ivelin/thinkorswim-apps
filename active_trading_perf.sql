
--SQL Queries for active trading performance analytics

-- Import from Schwab.com Realized Gain/Loss exported CSV

CREATE TABLE trading_hist AS SELECT * FROM read_csv('trading_hist.csv', skip=1);

select count(*) from trading_hist;

select * from trading_hist;

CREATE TABLE trading_clean AS
select 
  "Symbol" as symbol, 
  "Closed Date" as closed_date,
  "Opened Date" as opened_date,
  cast(REPLACE(REPLACE("Gain/Loss ($)", '$', ''), ',', '') as decimal) as gain_amount, 
  cast(replace(replace("Gain/Loss (%)", '%', ''), ',', '') as decimal) as gain_percent
 from trading_hist;
 
select 
    count(*), count(*), min(opened_date), min(closed_date), max(opened_date), max(closed_date) 
from trading_clean; --  where closed_date < '2024-12-31';

select * from trading_clean;

-- Define percentage ranges for gains and losses
WITH 
ranged_gains AS (
    SELECT *,
        CASE 
            WHEN ABS(gain_percent) > 0 AND ABS(gain_percent) < 10 THEN '00-10'
--            WHEN ABS(gain_percent) > 0 AND ABS(gain_percent) < 3 THEN '00-3'
--            WHEN ABS(gain_percent) >= 3 AND ABS(gain_percent) < 5 THEN '03-5'
--            WHEN ABS(gain_percent) >= 5 AND ABS(gain_percent) < 7 THEN '05-7'
--            WHEN ABS(gain_percent) >= 7 AND ABS(gain_percent) < 10 THEN '07-10'
--            WHEN ABS(gain_percent) >= 10 AND ABS(gain_percent) < 15 THEN '10-15'
--            WHEN ABS(gain_percent) >= 15 AND ABS(gain_percent) < 20 THEN '15-20'
--            WHEN ABS(gain_percent) >= 20 AND ABS(gain_percent) < 30 THEN '20-30'
--            WHEN ABS(gain_percent) >= 30 AND ABS(gain_percent) < 50 THEN '30-50'
--            WHEN ABS(gain_percent) >= 50 then '50+' 
            WHEN ABS(gain_percent) >= 10 then '10+' 
        END AS gain_percentage_range,
        case
            when gain_percent < 0 then 'loss'
            when gain_percent >= 0 then 'gain'
            -- else 'gain'
        end as gain_loss_split
    FROM trading_clean
)
-- trading losses stats
select 
    gain_loss_split, gain_percentage_range, sum(gain_amount) as aggregate_gain, count(gain_amount) as trade_count, (aggregate_gain/trade_count) as avg_gain 
from ranged_gains
WHERE opened_date > '2024-01-01' and closed_date < '2025-12-31'
group by gain_loss_split, gain_percentage_range
order by gain_loss_split, gain_percentage_range
;


-- win / loss ratio

SELECT 
    count(CASE WHEN gain_percent > 0 THEN 1 END) as wins,
    count(CASE WHEN gain_percent < 0 THEN 1 END) as losses,
    sum(case when gain_percent > 0 then gain_percent else 0 end)/wins as average_win_percent,
    sum(case when gain_percent < 0 then gain_percent else 0 end)/losses as average_loss_percent,
    wins*100/(wins+losses) as win_percent,
    win_percent*average_win_percent + (100-win_percent)*average_loss_percent as expectated_gain_percent,
    sum(case when gain_amount > 0 then gain_amount else 0 end) as total_gains,
    sum(case when gain_amount < 0 then gain_amount else 0 end) as total_losses,
    total_gains/wins as average_gain,
    total_losses/losses as average_loss,
    win_percent*average_gain + (100-win_percent)*average_loss as expected_gain_amount
 FROM trading_clean
 WHERE opened_date > '2024-01-01' and closed_date < '2025-12-31'
 ;

