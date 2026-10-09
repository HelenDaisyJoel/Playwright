const filters = {
    filter_header: '.pb-4.border-b .text-title-md',
    filter_subHeading_text: '.pb-4.border-b .text-sm',
    filter_popup_field_heading: '[data-testid="global-filter-form"] label.text-sm',
    filter_popup_field_text: '[data-testid="global-filter-form"] span.truncate',
    filter_popup_field_dropdown: '[data-testid="global-filter-form"] span.material-symbols-outlined',
    filter_popup_dropdown_item: '.flex-col .cursor-pointer span.flex-1',

    filter_popup_cross_button: 'button[aria-label="Close"]',
    filter_popup_cancel_button: '[data-testid="cancel-filter-button"] [data-testid="button-component"]',
    filter_popup_reset_button: '[data-testid="reset-filter-button"] [data-testid="button-component"]',
    filter_popup_save_button: '[data-testid="apply-filter-button"] [data-testid="button-component"]',
} as const;

export default filters;
