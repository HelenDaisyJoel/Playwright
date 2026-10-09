const pricing = {
    pricing_heading: '[data-testid="pricing-title-main"]',
    pricing_sub_heading: '[data-testid="pricing-title-sub"]',
    pricing_table_buttons: '[data-testid="pricing-tab-content"] .cursor-pointer .leading-label-md',
    pricing_table_legend_tooltip: '[data-testid="legend-status-bar"] [data-testid="legend-status-bar-tooltip"]',
    pricing_table_legend_icon: '[data-testid="legend-status-bar"] [data-testid="legend-status-bar-icon"]',
    pricing_table_legend_heading: '[data-testid="legend-status-bar"] [data-testid="legend-status-bar-label"]',
    pricing_pattern_finder_btn: '[data-testid="pattern-finder-button"]',
    pricing_pattern_finder_heading: '[data-testid="pattern-finder-container"] .font-bold',
    pricing_pattern_finder_close_btn: '[data-testid="pattern-finder-container"] .material-symbols-outlined',
    pricing_pattern_finder_x_axis: '[data-testid="pattern-finder-x-axis-dropdown"]',
    pricing_pattern_finder_y_axis: '[data-testid="pattern-finder-y-axis-dropdown"]',
    pricing_pattern_finder_metric_shown: '[data-testid="pattern-finder-metric-dropdown"]',
    pricing_pattern_finder_dropdown_items: '[data-testid="pattern-finder-container"] .dropdown-content li',

    pricing_saved_view_btn: '[data-test-id="saved-views-button"]',
    
    pricing_table_toggle_btn: '[data-testid="pricing-tab-content"] .gap-2 .toggle',
    pricing_table_toggle_btn_heading: '[data-testid="pricing-tab-content"] .gap-2 .text-body-sm-m',

    pricing_table_header_groups: '[data-testid="pricing-tab-content"] .ag-header-allow-overflow .ag-header-row-column-group',
    pricing_table_headers: '[data-testid="pricing-tab-content"] .ag-header-allow-overflow .ag-header-row-column',
    pricing_table_filter_text: 'input[aria-label="Advanced Filter Input"]',
    pricing_table_filter_apply_btn: '[data-ref="eApplyFilterButton"]',
    pricing_advanced_filter_apply_btn: 'button.ag-advanced-filter-apply-button',
    pricing_table_row_region: '.ag-body [col-id="voyage_info.region_name"]',
    pricing_table_row_priority: '.ag-body [col-id="priority"]',

    pricing_table_action_button: '[col-id="actions"] [data-testid="button-component"], [col-id="actions"] [role="button"]',
    pricing_action_modal_content: '[data-testid="review-action-modal-content"]',
    pricing_table_overbooking_opportunity_button: '.ag-body [col-id="related_priority_info.ovb_opportunity"] [role="button"]',
    pricing_table_pricing_opportunity_button: '[col-id="related_priority_info.price_change_opportunity"] [data-testid="button-component"], [col-id="related_priority_info.price_change_opportunity"] [role="button"]',
    pricing_table_sailaway_opportunity_button: '.ag-body [col-id="related_priority_info.sailaway_opportunity"] [role="button"]',

    pricing_table_row_voyage_name: '.ag-pinned-left-cols-container .ag-row [col-id="voyage_info.voyage_code"]',

    lettered_voyage_filter_dropdowns: '[data-testid="lettered-voyage-component"] .gap-3',
    lettered_voayge_filter_button: '[data-testid="lettered-voyage-component"] [type="button"]',
    lettered_voyage_filter_dropdown_items: '[data-testid="lettered-voyage-component"] .text-sm.flex-1',
    lettered_voyage_apply_btn: '[data-testid="lettered-voyage-component"] [data-testid="apply-changes-button"]',
    lettered_voayges_btns: '[data-testid="lettered-voyage-component"] [data-testid="button-component"]',

    pricing_sailing_checkbox: '[role="gridcell"] [type="checkbox"]',
    pricing_bulk_acton_btn:'[placeholder="Bulk Actions"]',
    pricing_bulk_action_dropdown: '.max-h-40',

    bulk_action_page_heading: '[data-testid="meta-title"]',
    bulk_action_table_header_group: '.ag-header-group-text',
    bulk_action_table_column_header: '.ag-header-allow-overflow .ag-header-row-column',
    bulk_action_buttons: '[data-testid="button-component"]',

    bulk_action_filter_price_section: '.gap-6',
    bulk_action_filter_dropdown_button: '.gap-3 [type="button"]',
    bulk_action_filter_dropdown_items: '.max-h-40 .text-sm',
} as const;

export default pricing;
