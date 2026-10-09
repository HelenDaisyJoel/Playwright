const usage = {
    usage_section_heading: 'app-usage .text-title-md-caps',
    usage_section_header_subtext: 'app-usage .text-label-lg',
    usage_summarySection_chart_heading: 'app-usage-alerts-chart .leading-title-sm',
    usage_summarySection_chart_legent_1: 'app-usage-alerts-chart .apx-legend-position-bottom [seriesname="Accepted"]',
    usage_summarySection_chart_legent_2: 'app-usage-alerts-chart .apx-legend-position-bottom [seriesname="Overridden"]',
    usage_summarySection_chart_legent_3: 'app-usage-alerts-chart .apx-legend-position-bottom [seriesname="Notxreviewed"]',
    usage_summarySection_chart_xaxis: 'app-usage-alerts-chart .apexcharts-xaxis',

    usage_userDrillDown_chart_headings: 'app-usage-alerts-drill-down-chart .leading-title-sm',
    usage_userDrillDown_chart_legends: 'app-usage-alerts-drill-down-chart .apexcharts-legend',

    usage_behaviourTrend_graphs_heading: 'app-usage-behaviour-chart .leading-title-sm',
    usage_behaviourTrend_graphs_legend: 'app-usage-behaviour-chart .text-label-sm',

    usage_filter_text: 'app-dropdown .text-sm',
    usage_filter_dropdown: 'app-dropdown .dropdown',
    usage_filter_dropdown_item: 'app-dropdown .dropdown li .rounded',

    usage_userActionMonitoring_tabs: '[role="tab"]',
    usage_userActionMonitoring_table_heading: 'app-grid .ag-header-row',
    usage_userActionMonitoring_view_btns: '[col-id="payload"] .view-payload-btn',
    usage_userActionMonitoring_popup_headings: 'app-payload-modal .text-text-primary',
    usage_userActionMonitoring_popup_btns: 'app-payload-modal .material-symbols-outlined',
  } as const;

export default usage;
