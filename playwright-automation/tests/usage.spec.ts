import { test } from '../fixtures/baseFixture';
import { verifyText, verifyElementCount, verifyVisibility, verifyUrl, writeTextInLocator, actionClick } from '../utils/actions';

test.describe('usage page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager ', () => {
    test('verify user is able to navigate to usage page and verifies elements [RST-2495, RST-2496, RST-2497, RST-2500]', async ({ page }) => {
        await page.route('**/api/voyages/filters/', async (route, request) => {
            await route.continue();
        });

        const usageSummaryResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/voyages/usage-summary/') && response.request().method() === 'GET'
        );

        await page.goto('/usage');
        await usageSummaryResponsePromise;
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/usage');
        await verifyText(page, 'usage', 'usage_section_heading', 'USAGE', { index : 0 });
        await verifyText(page, 'usage', 'usage_section_header_subtext', 'Monitor analyst decisions across alert types and system usage.', { index : 1 });

        await verifyText(page, 'usage', 'usage_section_heading', 'usage summary', { index : 1 });
        await verifyText(page, 'usage', 'usage_summarySection_chart_heading', 'Number of alerts', { timeout: 15000 });
        // Wait for ApexCharts to render before checking chart legends
        await verifyVisibility(page, 'usage', 'usage_summarySection_chart_legent_1', true, { timeout: 15000 });
        await verifyText(page, 'usage', 'usage_summarySection_chart_legent_1', 'Accepted', { timeout: 15000 });
        await verifyText(page, 'usage', 'usage_summarySection_chart_legent_2', 'Overridden', { timeout: 15000 });
        await verifyText(page, 'usage', 'usage_summarySection_chart_legent_3', 'Not reviewed', { timeout: 15000 });
        await verifyText(page, 'usage', 'usage_summarySection_chart_xaxis', ' Analyst average ', { partial : true, timeout: 15000 });

        await verifyText(page, 'usage', 'usage_section_heading', 'behaviour trends', { index : 2 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_heading', ' Review rate ', { index : 0, timeout: 15000 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_legend', 'Analyst average', { index : 0, timeout: 15000 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_heading', ' Approval rate ', { index : 1, timeout: 15000 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_legend', 'Analyst average', { index : 1, timeout: 15000 });

        await verifyText(page, 'usage', 'usage_filter_text', ' Analysts ', { index : 0 });
        await verifyText(page, 'usage', 'usage_filter_text', ' Time ', { index : 1 });
    });

    test('verify user is able to navigate to usage page and select an analyst from dropdown [RST-2498]', async ({ page }) => {
        await page.route('**/api/voyages/filters/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/usage/revenue-metrics/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/usage/revenue-trend/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-analysis/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/usage');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/usage');
        await verifyText(page, 'usage', 'usage_section_heading', 'USAGE', { index : 0 });
        await verifyText(page, 'usage', 'usage_section_header_subtext', 'Monitor analyst decisions across alert types and system usage.', { index : 1 });
        
        console.log('User clicks on any analyst from analyst dropdown')
        await actionClick(page, 'usage', 'usage_filter_dropdown', { index : 0 });
        await actionClick(page, 'usage', 'usage_filter_dropdown_item', { index : 1 });

        await verifyText(page, 'usage', 'usage_userDrillDown_chart_headings', 'Alerts drill-down for ', { index : 0, partial : true });
        await verifyText(page, 'usage', 'usage_userDrillDown_chart_legends', 'Price change <-5%Price change 0 to -5%Price change 0 to 5%Price change >5%Promotion suggestedOverbooking suggested', { index : 0 });
        await verifyText(page, 'usage', 'usage_userDrillDown_chart_headings', 'Analyst average', { index : 1 });
        await verifyText(page, 'usage', 'usage_userDrillDown_chart_legends', 'Price change <-5%Price change 0 to -5%Price change 0 to 5%Price change >5%Promotion suggestedOverbooking suggested', { index : 1 });
        
        await verifyText(page, 'usage', 'usage_section_heading', 'behaviour trends', { index : 2 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_heading', ' Review rate ', { index : 0 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_heading', ' Approval rate ', { index : 1 });
        await verifyElementCount(page, 'usage' ,'usage_behaviourTrend_graphs_legend' , 4);
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_legend', 'Average', { index : 1 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_legend', 'Average', { index : 3 });

        
    });

    test('verify user is able to navigate to usage page and select a time period from dropdown [RST-2499]', async ({ page }) => {
        await page.route('**/api/voyages/filters/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/usage/revenue-metrics/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/usage/revenue-trend/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-analysis/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/usage');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/usage');
        await verifyText(page, 'usage', 'usage_section_heading', 'USAGE', { index : 0 });
        await verifyText(page, 'usage', 'usage_section_header_subtext', 'Monitor analyst decisions across alert types and system usage.', { index : 1 });

        await verifyText(page, 'usage', 'usage_filter_text', ' Analysts ', { index : 0 });
        await verifyText(page, 'usage', 'usage_filter_text', ' Time ', { index : 1 });
        
        await actionClick(page, 'usage', 'usage_filter_dropdown', { index : 1 });
        await verifyText(page, 'usage', 'usage_filter_dropdown_item', ' Last 2 weeks ', { index : 0 });
        await verifyText(page, 'usage', 'usage_filter_dropdown_item', ' Last 1 month ', { index : 1 });
        await verifyText(page, 'usage', 'usage_filter_dropdown_item', ' Last 2 months ', { index : 2 });
        await verifyText(page, 'usage', 'usage_filter_dropdown_item', ' Last 3 months ', { index : 3 });
        await actionClick(page, 'usage', 'usage_filter_dropdown_item', { index : 1 });

        await verifyText(page, 'usage', 'usage_section_heading', 'usage summary', { index : 1 });
        await verifyText(page, 'usage', 'usage_summarySection_chart_heading', 'Number of alerts');
        await verifyText(page, 'usage', 'usage_summarySection_chart_legent_1', 'Accepted');
        await verifyText(page, 'usage', 'usage_summarySection_chart_legent_2', 'Overridden');
        await verifyText(page, 'usage', 'usage_summarySection_chart_legent_3', 'Not reviewed');
        await verifyText(page, 'usage', 'usage_summarySection_chart_xaxis', ' Analyst average ', { partial : true });

        await verifyText(page, 'usage', 'usage_section_heading', 'behaviour trends', { index : 2 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_heading', ' Review rate ', { index : 0 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_legend', 'Analyst average', { index : 0 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_heading', ' Approval rate ', { index : 1 });
        await verifyText(page, 'usage', 'usage_behaviourTrend_graphs_legend', 'Analyst average', { index : 1 });

        
    });

    test('verify user is able to navigate to usage page and verifies usage actions monitoring sections [RST-2501, RST-2502, RST-2503, RST-2504]', async ({ page }) => {
        await page.route('**/api/voyages/filters/', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/usage/revenue-metrics/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/usage/revenue-trend/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-analysis/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/usage');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/usage');
        await verifyText(page, 'usage', 'usage_section_heading', 'USAGE', { index : 0 });
        await verifyText(page, 'usage', 'usage_section_header_subtext', 'Monitor analyst decisions across alert types and system usage.', { index : 1 });

        await verifyText(page, 'usage', 'usage_section_heading', 'User actions monitoring', { index : 3 });

        await verifyText(page, 'usage', 'usage_userActionMonitoring_tabs', 'Pricing', { index : 0 });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_tabs', 'Inventory', { index : 1 });

        await verifyText(page, 'usage', 'usage_userActionMonitoring_table_heading', 'Sailing ID                      Ship                      Departure                      Timestamp                      User                      Office                      Currency                      Status                      Payload');

        await actionClick(page, 'usage', 'usage_userActionMonitoring_view_btns', { index : 0 });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_popup_headings', 'Override Log Details', { index : 0 });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_popup_headings', ' Request Payload ', { index : 1 , partial : true });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_popup_headings', ' Response ', { index : 2 , partial : true });

        await actionClick(page, 'usage', 'usage_userActionMonitoring_popup_btns', { index : 0 });

        await page.route('**/api/voyages/override-logs/**', async (route, request) => {
            await route.continue();
        });
        await actionClick(page, 'usage', 'usage_userActionMonitoring_tabs', { index : 1 });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_table_heading', 'Sailing ID                      Ship                      Departure                      Timestamp                      User                      Office                      Currency                      Status                      Payload');
        await actionClick(page, 'usage', 'usage_userActionMonitoring_view_btns', { index : 0 });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_popup_headings', 'Override Log Details', { index : 0 });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_popup_headings', ' Request Payload ', { index : 1 , partial : true });
        await verifyText(page, 'usage', 'usage_userActionMonitoring_popup_headings', ' Response ', { index : 2 , partial : true });
    });
})
