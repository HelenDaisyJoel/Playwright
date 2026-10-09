const config = {
    config_page_heading: '.leading-6',
    config_page_heading_subtext: '.mb-5 .leading-5',
    config_heading: '[data-testid="meta-title"]',
    config_sub_tab_heading: '[data-testid="sub-tab-title"]',
    
    config_currency_tab: '[data-testid="currency-panes-tab"]',
    config_fareExecution_tab: '[data-testid="fare-execution-tab"]',
    config_schedulePriceChanges_tab: '[data-testid="scheduled-price-changes-tab"]',

    config_side_list_items: '#side-tabs li',
    config_buttons: '[data-testid="button-component"]',
    config_header_text: '.ag-header-cell-text',
} as const;

export default config;
