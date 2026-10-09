import { test } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, verifyUrl, verifyAttribute, writeTextInLocator } from '../utils/actions';

test.describe('View Key Metrics tabs @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-analyst @OCEANIA-analyst @REGENT-analyst @NCL-manager @OCEANIA-manager @REGENT-manager', () => {

    test('verify user is able to open view key metrics popup on VI tab  @smoke [RST-2407, RST-2409, RST-2410, RST-2411]', async ({ page }) => {
        test.setTimeout(240000);

        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/*', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
                const postData = request.postData();
                const response = await route.fetch();
                const responseBody = await response.text();
                await route.fulfill({
                    status: response.status(),
                    headers: response.headers(),
                    body: responseBody,
                });
            } else {
                await route.continue();
            }
        });
        await page.route('**/voyages/pattern-finder/*', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/key-metrics/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');


        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        
        console.log('User opens the voyage deep dive page');
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });

        await page.waitForResponse(response =>
            response.url().includes('/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response =>
            response.url().includes('/voyages/inventory/') && response.request().method() === 'GET'
        );

        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false);

        await verifyText(page, 'voyage_deep_dive', 'vdd_back_button', ' Back ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_view_key_metrics', ' View Key Metrics ', { partial: true });

        await actionClick(page, 'voyage_deep_dive', 'vdd_view_key_metrics');
        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false);

        await verifyVisibility(page, 'view_key_metrics', 'view_key_metrics_overlay', true);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_close_butn', true);
        
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_section_title', ' FIT KEY DEMAND SIGNALS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', 'Gross FIT Booked Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', 'Net FIT Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', 'NPD Trend', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_FKDS_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', false);
        

        await actionClick(page, 'view_key_metrics', 'vkm_CAPINFO_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_section_title', ' CAPACITY INFO ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', 'Total Physical Cabins', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', 'Sail Reserve', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', 'Sellable Capacity', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', 'Gross Booked Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', 'Gross Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', 'Net Berthed Load Factor', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_CAPINFO_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', false);
        
        await actionClick(page, 'view_key_metrics', 'vkm_INV_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_section_title', ' INVENTORY ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_1', 'FIT Sellable Capacity', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_2', 'FIT Gross Bkngs in Pickup', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_3', 'Total FIT Net Residual Capacity Adj Overselling', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_INV_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_3', false);
        

        await actionClick(page, 'view_key_metrics', 'vkm_group_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_section_title', ' GROUP BOOKINGS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_1', 'Forecasted Group Contribution', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_2', 'Unrealized Group Blocks', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_3', 'Gross Group Bookings', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_4', 'Net Group Bookings', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_group_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_4', false);

        await actionClick(page, 'view_key_metrics', 'vkm_priceMetrics_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_section_title', '  PRICE METRICS  ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', 'Lowest Available Rate for Purchase', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', 'FIT NPD Cumulative (Net of Fcst Cxl)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', 'FIT NPD in Pickup Period (Net of Fcst Cxl)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', 'Avg Bkd Price Cumulative (Overall)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', 'Retroactivity Risk ($)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', 'Retroactivity Risk (% of revenue opportunity)', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_priceMetrics_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', false);


        await verifyText(page, 'view_key_metrics', 'vkm_title', 'Key metrics');
        await verifyText(page, 'view_key_metrics', 'vkm_dropdown_title', 'Category');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_dropdown', true);
        await verifyText(page, 'view_key_metrics', 'vkm_dropdown_text', 'Sailing');
        await actionClick(page, 'view_key_metrics', 'vkm_dropdown');
        await actionClick(page, 'view_key_metrics', 'vkm_dropdown_list_items', { index: 1 });

        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false);
    
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_section_title', ' FIT KEY DEMAND SIGNALS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', 'Gross FIT Booked Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', 'Net FIT Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_5', 'FIT Reference Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_4', 'FIT Pickup Trend', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', 'NPD Trend', { index: 0 , partial: true });    
        await actionClick(page, 'view_key_metrics', 'vkm_FKDS_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', false);
        
        await actionClick(page, 'view_key_metrics', 'vkm_CAPINFO_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_section_title', ' CAPACITY INFO ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', 'Total Physical Cabins', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', 'Sail Reserve', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', 'Sellable Capacity', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', 'Gross Booked Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', 'Gross Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', 'Net Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_7', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_7', 'Capacity fill target (%), after current oversell', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_8', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_8', 'Capacity fill target (%), after recommended oversell', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_CAPINFO_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_7', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_8', false);
        
        await actionClick(page, 'view_key_metrics', 'vkm_INV_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_section_title', ' INVENTORY ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_1', 'FIT Sellable Capacity', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_2', 'FIT Gross Bkngs in Pickup', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_3', 'Total FIT Net Residual Capacity Adj Overselling', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_4', 'Reco Overselling of Current Meta to Fill Upper Meta', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_5', 'Reco Overselling of Lower Meta to fill Current Meta', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_6', 'Total FIT Sellable Capacity Adj Overselling', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_7', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_7', 'Gross current oversell capacity correction', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_8', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_8', 'Net current oversell capacity correction', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_INV_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_6', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_7', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_8', false);
        
        await actionClick(page, 'view_key_metrics', 'vkm_group_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_section_title', ' GROUP BOOKINGS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_1', 'Forecasted Group Contribution', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_2', 'Unrealized Group Blocks', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_3', 'Gross Group Bookings', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_4', 'Net Group Bookings', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_group_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_4', false);

        await actionClick(page, 'view_key_metrics', 'vkm_priceMetrics_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_section_title', ' PRICE METRICS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', 'Lowest Available Rate for Purchase', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', 'FIT NPD Cumulative (Net of Fcst Cxl)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', 'FIT NPD in Pickup Period (Net of Fcst Cxl)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', 'Avg Bkd Price Cumulative (Overall)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', 'Retroactivity Risk ($)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', 'Retroactivity Risk (% of revenue opportunity)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_7', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_7', 'Avg Elasticity Index', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_8', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_8', 'NCF', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_priceMetrics_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_7', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_8', false);

        await actionClick(page, 'view_key_metrics', 'vkm_promotions_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_promotions_section_title', ' PROMOTIONS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_promotions_list_item_1', 'Avg Promo Disc (in Pickup)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_promotions_list_item_2', 'Promo Bk % (in Pickup)', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_promotions_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_2', false);

        await actionClick(page, 'view_key_metrics', 'vkm_BRC_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_section_title', ' BUSINESS RULE CONSTRAINT ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_1', 'Ceiling Constrained', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_2', 'Floor Constrained', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_3', 'Meta Ceiling Constrained', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_4', 'Meta Floor Constrained', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_BRC_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_4', false);
    });

    test('verify user is able to open view key metrics popup on Meta tab [RST-2408, RST-2409, RST-2410, RST-2411]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/*', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
                const postData = request.postData();
                const response = await route.fetch();
                const responseBody = await response.text();
                await route.fulfill({
                    status: response.status(),
                    headers: response.headers(),
                    body: responseBody,
                });
            } else {
                await route.continue();
            }
        });
        await page.route('**/voyages/pattern-finder/*', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        
        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });

        await page.waitForResponse(response =>
            response.url().includes('/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response =>
            response.url().includes('/voyages/inventory/') && response.request().method() === 'GET'
        );

        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        console.log('User clicks on meta tab');
        if(process.env.BRAND == 'REGENT'){
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
        }else{
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
        }

        await page.waitForLoadState('networkidle');

        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { timeout: 30000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_view_key_metrics', ' View Key Metrics ', { partial: true });
        

        await actionClick(page, 'voyage_deep_dive', 'vdd_view_key_metrics');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/key-metrics/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'view_key_metrics', 'view_key_metrics_overlay', true);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_close_butn', true);
        
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_section_title', ' FIT KEY DEMAND SIGNALS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', 'Gross FIT Booked Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', 'Net FIT Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_5', 'FIT Reference Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_4', 'FIT Pickup Trend', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', 'NPD Trend', { index: 0 , partial: true });    
        await actionClick(page, 'view_key_metrics', 'vkm_FKDS_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_FKDS_list_item_3', false);
        
        await actionClick(page, 'view_key_metrics', 'vkm_CAPINFO_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_section_title', ' CAPACITY INFO ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', 'Total Physical Cabins', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', 'Sail Reserve', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', 'Sellable Capacity', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', 'Gross Booked Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', 'Gross Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', 'Net Berthed Load Factor', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_7', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_7', 'Capacity fill target (%), after current oversell', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_8', true);
        await verifyText(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_8', 'Capacity fill target (%), after recommended oversell', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_CAPINFO_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_6', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_7', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_CAPINFO_list_item_8', false);
        
        await actionClick(page, 'view_key_metrics', 'vkm_INV_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_section_title', ' INVENTORY ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_1', 'FIT Sellable Capacity', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_2', 'FIT Gross Bkngs in Pickup', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_3', 'Total FIT Net Residual Capacity Adj Overselling', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_4', 'Reco Overselling of Current Meta to Fill Upper Meta', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_5', 'Reco Overselling of Lower Meta to fill Current Meta', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_6', 'Total FIT Sellable Capacity Adj Overselling', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_7', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_7', 'Gross current oversell capacity correction', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_8', true);
        await verifyText(page, 'view_key_metrics', 'vkm_INV_list_item_8', 'Net current oversell capacity correction', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_INV_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_6', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_7', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_INV_list_item_8', false);
        

        await actionClick(page, 'view_key_metrics', 'vkm_group_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_section_title', ' GROUP BOOKINGS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_1', 'Forecasted Group Contribution', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_2', 'Unrealized Group Blocks', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_3', 'Gross Group Bookings', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_group_list_item_4', 'Net Group Bookings', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_group_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_group_list_item_4', false);

        await actionClick(page, 'view_key_metrics', 'vkm_priceMetrics_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_section_title', ' PRICE METRICS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', 'Lowest Available Rate for Purchase', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', 'FIT NPD Cumulative (Net of Fcst Cxl)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', 'FIT NPD in Pickup Period (Net of Fcst Cxl)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', 'Avg Bkd Price Cumulative (Overall)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', 'Retroactivity Risk ($)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', 'Retroactivity Risk (% of revenue opportunity)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_7', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_7', 'Avg Elasticity Index', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_8', true);
        await verifyText(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_8', 'NCF', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_priceMetrics_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_4', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_5', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_6', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_7', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_priceMetrics_list_item_8', false);

        await actionClick(page, 'view_key_metrics', 'vkm_promotions_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_promotions_section_title', ' PROMOTIONS ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_promotions_list_item_1', 'Avg Promo Disc (in Pickup)', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_promotions_list_item_2', 'Promo Bk % (in Pickup)', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_promotions_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_promotions_list_item_2', false);

        await actionClick(page, 'view_key_metrics', 'vkm_BRC_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_section', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_section_title', ' BUSINESS RULE CONSTRAINT ');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_1', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_1', 'Ceiling Constrained', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_2', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_2', 'Floor Constrained', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_3', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_3', 'Meta Ceiling Constrained', { index: 0 , partial: true });
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_4', true);
        await verifyText(page, 'view_key_metrics', 'vkm_BRC_list_item_4', 'Meta Floor Constrained', { index: 0 , partial: true });
        await actionClick(page, 'view_key_metrics', 'vkm_BRC_toggle_btn');
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_1', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_2', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_3', false);
        await verifyVisibility(page, 'view_key_metrics', 'vkm_BRC_list_item_4', false);
    });
})
