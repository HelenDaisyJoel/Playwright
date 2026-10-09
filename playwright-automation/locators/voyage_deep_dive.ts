const voyageDeepDive = {
    vdd_header: '#voyage-inventory-header',
    vdd_back_button: '#voyage-inventory-page-wrapper [data-testid="back-button"]',
    vdd_next_voyage_btn: '[data-testid="voyage-header"] [data-testid="voyage-navigation"] [data-testid="next-voyage-button"]',
    vdd_prev_voyage_btn: '[data-testid="voyage-header"] [data-testid="voyage-navigation"] [data-testid="previous-voyage-button"]',
    vdd_view_key_metrics: '[data-testid="key-metrics-button-container"] [data-testid="key-metrics-button"]',
    vdd_loader_overlay: '[data-testid="loader-overlay"]',
    vdd_voyage_inventory_tab: '[data-testid="tabs-section"] [data-testid="meta-tab-Voyage Inventory"]',
    vdd_meta_alert_tab_balcony: '[data-testid="tabs-section"] [data-testid="meta-tab-Balcony"]',
    vdd_meta_alert_tab_penthouse: '[data-testid="tabs-section"] [data-testid="meta-tab-Penthouse"]',
    vdd_meta_alert_tab_inside: '[data-testid="tabs-section"] [data-testid="meta-tab-Inside"]',
    vdd_cabin_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-cabin"]',
    vdd_occupancy_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-occupancy"]',
    vdd_promotion_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-promotion"]',
    vdd_sourceMarket_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-source-market"]',
    vdd_channel_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-channel"]',
    vdd_product_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-product"]',
    vdd_group_sub_tab: '[data-testid="tabs-section"] [data-testid="sub-tab-group"]',
    vdd_page_heading: '[data-testid="tab-details-header-component"] [data-testid="meta-title"]',
    vdd_page_subHeading: '[data-testid="tab-details-header-component"] [data-testid="sub-tab-title"]',
    vdd_page_sub_text: '[data-testid="tab-details-header-component"] [data-testid="tab-description"]',

    vdd_sub_section_heading: '.text-title-md-caps',

    vdd_voyage_inventory_cabin_table_header_fixed_column: '.ag-root-wrapper-body .ag-pinned-left-header .ag-header-cell-text',
    vdd_voyage_inventory_cabin_table_header_scrollable_column: '.ag-root-wrapper-body .ag-header-viewport .ag-header-cell-text',
    vdd_voyage_inventory_cabin_table_header_fixed_right_column: '.ag-root-wrapper-body .ag-pinned-right-header .ag-header-cell-label',

    vdd_cabin_table_header_groups: '.ag-header-allow-overflow .ag-header-row-column-group',
    vdd_cabin_table_headers: '.ag-header-allow-overflow .ag-header-row-column',

    vdd_voyage_inventory_cabin_PENT_multiplierOverride: '[row-id="PEN_THO"] [col-id="multiplier_override"] input',
    vdd_voyage_inventory_cabin_PENT_exactPriceOverride: '[row-id="PEN_THO"] [col-id="exact_price_override"] input',
    vdd_voyage_inventory_cabin_PENT_review: '[row-id="PEN_THO"] [col-id="actions"] [data-testid="button-component"], [row-id="PEN_THO"] [col-id="actions"] [role="button"]',

    vdd_voyage_inventory_cabin_BAL_multiplierOverride: '[row-id="BAL_CON"] [col-id="multiplier_override"] input',
    vdd_voyage_inventory_cabin_BAL_exactPriceOverride: '[row-id="BAL_CON"] [col-id="exact_price_override"] input',
    vdd_voyage_inventory_cabin_BAL_review: '[row-id="BAL_CON"] [col-id="actions"] [data-testid="button-component"], [row-id="BAL_CON"] [col-id="actions"] [role="button"]',
    
    vdd_voyage_inventory_btns: '.ag-status-bar-right [data-testid="button-component"]',

    vdd_meta_cabin_line_chart_title: '.apexcharts-canvas .apexcharts-title-text',
    vdd_meta_cabin_chart_legend: '.apexcharts-canvas .apexcharts-legend',

    vdd_promotion_kpi_cards:       '[data-testid="kpi-section"] [data-testid^="kpi-card-"]',
    vdd_promotion_kpi_card_1_title: '[data-testid="kpi-section"] [data-testid="kpi-card-0"] .text-text-primary.text-sm',
    vdd_promotion_kpi_card_2_title: '[data-testid="kpi-section"] [data-testid="kpi-card-1"] .text-text-primary.text-sm',
    vdd_promotion_kpi_card_3_title: '[data-testid="kpi-section"] [data-testid="kpi-card-2"] .text-text-primary.text-sm',
    vdd_promotion_kpi_card_4_title: '[data-testid="kpi-section"] [data-testid="kpi-card-3"] .text-text-primary.text-sm',
    vdd_promotion_section_heading: '[data-testid="section-header"] .text-title-md-caps',
    vdd_promotion_filter_booking_type_title: '[ng-reflect-label="Booking Type"] .text-sm',
    vdd_promotion_filter_time_title: 'app-dropdown .text-sm ',
    vdd_promotion_filter_booking_type_dropdown: '[ng-reflect-label="Booking Type"] .dropdown [type="button"]',
    vdd_promotion_filter_time_dropdown: 'app-dropdown .dropdown [type="button"]',
    vdd_promotion_filter_booking_type_dropdown_item: '[ng-reflect-label="Booking Type"] .dropdown-content li',
    vdd_promotion_filter_time_dropdown_item: 'app-dropdown .dropdown-content li',
    vdd_promotion_filter_popup: '.dropdown',

    vdd_promotion_chart_1_heading: 'app-promotion-bookings-graph .text-title-sm',
    vdd_promotion_chart_1_x_axis: 'app-promotion-bookings-graph .apexcharts-xaxis',
    vdd_promotion_chart_2_heading: 'app-promotion-avg-discount-graph .text-title-sm',
    vdd_promotion_chart_2_x_axis: 'app-promotion-avg-discount-graph .apexcharts-xaxis',
    vdd_promotion_bookings_chart_bars: 'app-promotion-bookings-graph .apexcharts-series path',
    vdd_promotion_avg_dicount_chart_bars: 'app-promotion-avg-discount-graph .apexcharts-series path',

    vdd_channel_chart_1_heading: 'app-channel-bookings-graph .text-title-sm',
    vdd_channel_chart_1_x_axis: 'app-channel-bookings-graph .apexcharts-xaxis',
    vdd_channel_chart_2_heading: 'app-channel-avg-npd-graph .text-title-sm',
    vdd_channel_chart_2_x_axis: 'app-channel-avg-npd-graph .apexcharts-xaxis',

    vdd_group_chart_heading: 'app-group-tab .text-label-sm-sb',
    vdd_group_chart_legend: '[data-testid="group-performance-chart"] .apexcharts-legend-text',
    vdd_group_table_headers: '.ag-header-container [role="columnheader"]',

    vdd_sourceMarket_chart_1_heading: 'app-booking-trends-chart .text-title-sm',
    vdd_sourceMarket_chart_1_legend: 'app-booking-trends-chart .apexcharts-legend',
    vdd_sourceMarket_chart_2_heading: 'app-room-type-chart .text-title-sm',
    vdd_sourceMarket_chart_2_legend: 'app-room-type-chart .apexcharts-legend',
    vdd_sourceMarket_table_headers: '.ag-header-container [role="columnheader"]',
    vdd_sourceMarket_metric_column: '[col-id="metric"]',
    vdd_sourceMarket_buttons: '[data-testid="button-component"]',

    vdd_sourceMarket_rmLog: '[col-id="us"] textarea',

    vdd_cabin_column_btn: '.w-full .gap-1 .leading-label-md.text-brand-primary',
    vdd_cabin_column_checkboxes: '.ag-panel [data-ref="eWrapper"] [type="checkbox"]',
    vdd_cabin_column_close_btn: '.ag-panel .ag-icon-cross'
} as const;

export default voyageDeepDive;
