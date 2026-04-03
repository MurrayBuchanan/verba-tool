---
sidebar_position: 2
---

# Data Visualisation

## Control Charts
The control charts visualise the baseline of all the data, upper and lower control limits, and intervention periods. In addition, the charts alert the user when there is non-random variation in the data. The following conditions are checked:

![SPC Rules](/img/spc_rules.png)

## Groupings
To avoid data points clustering, data points are grouped into: 
- Day: up to 14 days
- Week: up to 90 days
- Month: beyond 90 days

This can be extended to allow additional groupings or switching between date ranges.

## Chart Component

A reusable Chart was created for this with the following props:
- data
- labels
- title
- interventions[]

This can be reused when visualising different chart data e.g. indicators and interventions. For example:

![SPC Rules](/img/spc_alerts.png)