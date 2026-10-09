import { test, expect } from '../fixtures/baseFixture';
import { verifyText, verifyVisibility, verifyUrl, actionClick } from '../utils/actions';

test.describe(' Performance page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager', () => {
    test('verify user is able to view different components on Performance page [RST-2488, RST-2489, RST-2490, RST-2491, RST-2492, RST-2493]', async ({ page }) => {
        await page.route('**/api/voyages/filters/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/performance/revenue-metrics/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/performance/revenue-trend/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/performance/revenue-opportunity/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-analysis/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/performance');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/performance');
        await verifyText(page, 'nav_bar', 'performance_page_heading', 'Performance');

        await verifyText(page, 'performance', 'perf_rev_metrics_heading', 'Revenue Metrics');
        await verifyText(page, 'performance', 'perf_rev_trends_heading', 'Revenue Trends');
        await verifyText(page, 'performance', 'perf_promo_usage_heading', 'Promo Usage');
        
        await verifyText(page, 'performance', 'perf_KPI_headers', ' Budget comparison ', { index : 0 });
        await verifyText(page, 'performance', 'perf_KPI_1_labels', ' Current revenue ', { index : 0 });
        await verifyText(page, 'performance', 'perf_KPI_1_labels', ' Budgeted revenue ', { index : 1 });
        await verifyText(page, 'performance', 'perf_KPI_1_labels', ' (current time) ', { index : 2 });
        await verifyText(page, 'performance', 'perf_KPI_1_labels', ' Budgeted revenue ', { index : 3 });
        await verifyText(page, 'performance', 'perf_KPI_1_labels', ' (sailing) ', { index : 4 });

        await verifyText(page, 'performance', 'perf_KPI_headers', ' NPD ', { index : 1 });
        await verifyText(page, 'performance', 'perf_KPI_2_labels', ' Current NPD ', { index : 0 });
        await verifyText(page, 'performance', 'perf_KPI_2_labels', ' Historical NPD ', { index : 1 });
        await verifyText(page, 'performance', 'perf_KPI_2_labels', ' (current time) ', { index : 2 });
        await verifyText(page, 'performance', 'perf_KPI_2_labels', ' Historical NPD ', { index : 3 });
        await verifyText(page, 'performance', 'perf_KPI_2_labels', ' (sailing) ', { index : 4 });


        await verifyText(page, 'performance', 'perf_KPI_headers', ' Cabin LF ', { index : 2 });
        await verifyText(page, 'performance', 'perf_KPI_3_labels', ' Current cabin LF ', { index : 0 });
        await verifyText(page, 'performance', 'perf_KPI_3_labels', ' Historical cabin LF ', { index : 1 });
        await verifyText(page, 'performance', 'perf_KPI_3_labels', ' (current time) ', { index : 2 });
        await verifyText(page, 'performance', 'perf_KPI_3_labels', ' Historical cabin LF ', { index : 3 });
        await verifyText(page, 'performance', 'perf_KPI_3_labels', ' (sailing) ', { index : 4 });

        await verifyText(page, 'performance', 'perf_KPI_headers', ' Pax LF ', { index : 3 });
        await verifyText(page, 'performance', 'perf_KPI_4_labels', ' Current pax LF ', { index : 0 });
        await verifyText(page, 'performance', 'perf_KPI_4_labels', ' Historical pax LF ', { index : 1 });
        await verifyText(page, 'performance', 'perf_KPI_4_labels', ' (current time) ', { index : 2 });
        await verifyText(page, 'performance', 'perf_KPI_4_labels', ' Historical pax LF ', { index : 3 });
        await verifyText(page, 'performance', 'perf_KPI_4_labels', ' (sailing) ', { index : 4 });

        await verifyText(page, 'performance', 'perf_rev_trend_chart_1', 'Bookings vs. STLY (%)', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_1', 'Months to sailing', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_2', 'NPD vs. STLY (%)', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_2', 'Months to sailing', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_3', 'Revenue Opportunity Trends', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_3', 'Months to sailing', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_3', 'Spill', { partial : true });
        await verifyText(page, 'performance', 'perf_rev_trend_chart_3', 'Spoil', { partial : true });

        await verifyText(page, 'performance', 'perf_promo_chart_1', 'Number of bookings by promo', { partial : true });
        await verifyText(page, 'performance', 'perf_promo_chart_1', 'Cumulative', { partial : true });
        await verifyText(page, 'performance', 'perf_promo_chart_1', 'Last 2 weeks', { partial : true });
        await verifyText(page, 'performance', 'perf_promo_chart_2', 'Average dilution', { partial : true });
        await verifyText(page, 'performance', 'perf_promo_chart_2', 'Average dilution', { partial : true });
    });

    test('verify user is able to apply filters in Performance page [RST-2494]', async ({ page }) => {
        test.setTimeout(120000);
        await page.route('**/api/voyages/filters/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/performance/revenue-metrics/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/performance/revenue-trend/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/performance/revenue-opportunity/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-analysis/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/performance');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/performance');
        await verifyText(page, 'nav_bar', 'performance_page_heading', 'Performance');
        await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });

        await verifyText(page, 'performance', 'perf_rev_metrics_heading', 'Revenue Metrics');
        await verifyText(page, 'performance', 'perf_rev_trends_heading', 'Revenue Trends');
        await verifyText(page, 'performance', 'perf_promo_usage_heading', 'Promo Usage');
        
        await actionClick(page, 'nav_bar', 'nav_bar_filter');
        await verifyText(page, 'filters', 'filter_header', ' Filters ')
        await verifyText(page, 'filters', 'filter_subHeading_text', 'Filters below will affect data views across all the pages');
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Analysts ', { index: 0 });    
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Ship class ', { index: 1 }); 
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Ship ', { index: 2 });    
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Departure date range ', { index: 3 });    
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Booking horizon (Months to sailing) ', { index: 4 });   
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Region ', { index: 5 });    
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Market ', { index: 6 });    
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Sailing length (Sailing nights) ', { index: 7 });    
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Priority ', { index: 8 }); 

        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select analyst ', { index: 0 });       
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select ship class ', { index: 1 });    
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select ship ', { index: 2 });    
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select booking horizon ', { index: 3 });    
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select region ', { index: 4 });    
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select market ', { index: 5 });    
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select length ', { index: 6 });    
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select priority ', { index: 7 });  

        console.log('User opens the booking horizon filter dropdown');
        await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 3 });
        await verifyVisibility(page, 'filters', 'filter_popup_dropdown_item', true, { index: 3, timeout: 30000 });
        await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
        await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 2 });
        await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 3 });
        // Close BH via Analysts (0) — this collapses BH panel (saves selections) and opens Analysts
        await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
        // Close Analysts dropdown
        await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
        // Wait for filter state to settle after BH selections before opening Priority
        await page.waitForTimeout(2000);
        await page.keyboard.press('Escape');

        console.log('User opens the priority filter dropdown');
        await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 7, force: true });
        // Wait for Priority items to fully load
        await page.waitForTimeout(2000);
        await verifyVisibility(page, 'filters', 'filter_popup_dropdown_item', true, { index: 1, timeout: 15000 });
        await page.waitForTimeout(500);
        await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1, force: true });
        // Save while Priority is open
        await actionClick(page, 'filters', 'filter_popup_save_button');
        await page.waitForLoadState('networkidle');

        await verifyText(page, 'nav_bar', 'performance_page_heading', 'Performance');

        await verifyText(page, 'performance', 'perf_rev_metrics_heading', 'Revenue Metrics');
        await verifyText(page, 'performance', 'perf_rev_trends_heading', 'Revenue Trends');
        await verifyText(page, 'performance', 'perf_promo_usage_heading', 'Promo Usage');

        await verifyText(page, 'nav_bar', 'nav_bar_filter', '2', { partial : true });

        await actionClick(page, 'nav_bar', 'nav_bar_filter');
        await actionClick(page, 'filters', 'filter_popup_reset_button');
        

        await page.waitForTimeout(3000);
        await verifyVisibility(page, 'filters', 'filter_header', false);
        await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);
        await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters');

    });
})
