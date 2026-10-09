const performance = {
    perf_rev_metrics_heading: 'app-revenue-metrics .uppercase',
    perf_rev_trends_heading: 'app-revenue-trends .uppercase',
    perf_promo_usage_heading: 'app-promo-usage .uppercase',

    perf_KPI_headers: 'app-revenue-metrics .flex-col .text-sm',

    perf_KPI_1_labels: 'app-revenue-metrics [data-testid="kpi-card-0"] .text-text-secondary',
    perf_KPI_2_labels: 'app-revenue-metrics [data-testid="kpi-card-1"] .text-text-secondary',
    perf_KPI_3_labels: 'app-revenue-metrics [data-testid="kpi-card-2"] .text-text-secondary',
    perf_KPI_4_labels: 'app-revenue-metrics [data-testid="kpi-card-3"] .text-text-secondary',

    perf_rev_trend_chart_1: '[data-testid="forward-bookings-trends-chart"]',
    perf_rev_trend_chart_2: '[data-testid="forward-npd-trends-chart"]',
    perf_rev_trend_chart_3: '[data-testid="revenue-opportunity-trends-chart"]',

    perf_promo_chart_1: '[data-testid="bookings-chart"]',
    perf_promo_chart_2: '[data-testid="average-percentage-chart"]',
  } as const;

export default performance;
