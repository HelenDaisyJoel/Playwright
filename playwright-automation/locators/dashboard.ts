const dashboard = {
    summary_flex_headers: '[data-testid="kpi-section"] .text-sm',
    summary_flex_success: '.bg-success',
    summary_flex_error: '.bg-error',
    summary_flex_blue: '.bg-viz-blue-2',
    summary_flex_value: '.text-heading-3',
    summary_alert_heading: '[data-testid="alert-overview-title"] .block',
    summary_alert_subheading: '.flex-row .text-body-sm-m .block',
    summary_alert_count: '.flex-col .items-center .relative.w-full',
    summary_action_heading: '.flex-col .text-body-sm',
    summary_action_number: '.flex-col .gap-2 .text-title-lg',

    summary_rr_heading: '[data-testid="progress-rate-container"] .font-semibold',
    summary_legend_rr_accepted: '[data-testid="progress-rate-container"] div[seriesname="ActionedxSnoozed"]',
    summary_legend_rr_notReviewed: '[data-testid="progress-rate-container"] div[seriesname="Notxreviewed"]',  
    summary_legend_rr_pending: '[data-testid="progress-rate-container"] div[seriesname="Pendingxmanagerxreview"]',  
    summary_legend_rr_blackout: '[data-testid="progress-rate-container"] div[seriesname="Onxblackout"]',  
    summary_rr_chart_notReview_bar: '[data-testid="progress-rate-container"] .apexcharts-series[seriesName="Notxreviewed"]',
    summary_donut_chart_component: 'path.apexcharts-donut-slice-0',
    
    summary_rrb_chart_heading: '[data-testid="rrb-chart-container"] .leading-title-sm',
    summary_legend_rrb_accepted: '[data-testid="rrb-chart-container"] div[seriesname="ActionedxSnoozed"]',
    summary_legend_rrb_notReviewed: '[data-testid="rrb-chart-container"] div[seriesname="Notxreviewed"]',  
    summary_legend_rrb_pending: '[data-testid="rrb-chart-container"] div[seriesname="Pendingxmanagerxreview"]',  
    summary_legend_rrb_blackout: '[data-testid="rrb-chart-container"] div[seriesname="Onxblackout"]',  
    summary_rrb_chart_default_option: '[data-testid="rrb-chart-container"] div.dropdown .leading-5',
    summary_rrb_chart_dropdown_btn: '[data-testid="rrb-chart-container"] .dropdown .material-symbols-outlined',
    summary_rrb_chart_dropdown_list_item: '[data-testid="rrb-chart-container"] .dropdown-content li',
    summary_rrb_chart_notReview_bar: '[data-testid="rrb-chart-container"] [seriesName="Notxreviewed"] .apexcharts-bar-area',

    summary_ro_chart_heading: '[data-testid="ro-chart-container"] .leading-title-sm',
    summary_legend_ro_spill: '[data-testid="ro-chart-container"] div[seriesname="Spillxrevenue"]',
    summary_legend_ro_spoil: '[data-testid="ro-chart-container"] div[seriesname="Spoilxrevenue"]',  
    summary_ro_chart_default_option: '[data-testid="ro-chart-container"] div.dropdown .leading-5',
    summary_ro_chart_dropdown_btn: '[data-testid="ro-chart-container"] .dropdown .material-symbols-outlined',
    summary_ro_chart_dropdown_list_item: '[data-testid="ro-chart-container"] .dropdown-content li',
    summary_ro_chart_spill_bar: '[data-testid="ro-chart-container"] [seriesName="Spillxrevenue"] .apexcharts-bar-area',

    summary_chart_xaxis: '.apexcharts-xaxis',
    summary_my_priority_btn: 'app-button[icon="arrow_forward"]',

    summary_opportunity_breakdown_heading: '[data-testid="opportunity-breakdown-section"] .text-title-md-caps',
    summary_ob_sub_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-legend"] .text-title-sm',
    summary_ob_legend_price_change: '[data-testid="opportunity-breakdown-section"] [aria-label="Legend items"] [data-testid="legend-price-change"]',
    summary_ob_legend_tactical_change: '[data-testid="opportunity-breakdown-section"] [aria-label="Legend items"] [data-testid="legend-tactical-lever"]',
    summary_ob_legend_blackout: '[data-testid="opportunity-breakdown-section"] [aria-label="Legend items"] [data-testid="legend-blackout"]',
    
    summary_ob_spill_price_change_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-0"]',
    summary_ob_spill_pc_icon: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-0"] [data-testid="opportunity-pill-icon"]',
    
    summary_ob_spill_tactical_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-1"] [data-testid="opportunity-pill-text"]',
    summary_ob_spill_tactical_icon: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-1"] [data-testid="opportunity-pill-icon"]',
    
    summary_ob_noChange_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-2"] [data-testid="opportunity-pill-text"]',
    
    summary_ob_optimisation_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-3"] [data-testid="opportunity-pill-text"]',
    
    summary_ob_blackout_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-4"] [data-testid="opportunity-pill-text"]',
    
    summary_ob_spoil_price_change_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-5"]',
    summary_ob_spoil_pc_icon: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-5"] [data-testid="opportunity-pill-icon"]',
    
    summary_ob_spoil_tactical_tile_heading: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-6"] [data-testid="opportunity-pill-text"]',
    summary_ob_spoil_tactical_icon: '[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-6"] [data-testid="opportunity-pill-icon"]',

    selected_list_item: '.bg-gray-100',
} as const;

export default dashboard;
