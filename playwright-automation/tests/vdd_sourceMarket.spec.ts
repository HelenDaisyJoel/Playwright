import { test, expect } from '../fixtures/baseFixture';
import { verifyUrl, verifyText, verifyVisibility, actionClick, writeTextInLocator } from '../utils/actions';
import { locatorRegistry } from '../locators';

test.describe('Voyage deep dive- source market tab @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
    let legend_count = 0;
    test('Verify the source market tab elements for VI tab @smoke [RST-2459, RST-2460, RST-2461, RST-2462, RST-2466]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route) => {
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
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
        await page.route('**/voyages/pattern-finder/**', async (route) => {
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route) => {
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/bookings/**', async (route) => {
            await route.continue();
        });
        await page.route('**/source-market/room-types/**', async (route) => {
            await route.continue();
        });
        await page.route('**/source-market/**', async (route) => {
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Reco Promo Action Alert] is true');
        await page.keyboard.press('Enter');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Reco Promo Action Alert] is true');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        const sourceMarketTabResponsePromise = page.waitForResponse(response => 
            response.url().includes('/source-market/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await sourceMarketTabResponsePromise;
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        await verifyUrl(page, '/voyage-inventory/source-market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        
        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_1_heading', 'Booking trends');
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_heading', 'Room type bookings mix by region');
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Penthouse', { partial : true });
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Balcony', { partial : true });
        }
        
        console.log('User verifies the source market table- column and row headers');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Metric ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Meta ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Us ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Uk ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Europe ', { index : 4 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Other ', { index : 5 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Metric ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Promo action recommended ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Average discount ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Avg % of bookings on a discount ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' RM analyst log ', { index : 4 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Log updated effective date ', { index : 5 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_buttons', ' Reset ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_buttons', ' Save Changes ', { index : 1 });
    });

    test('Verify the source market tab with time filters for VI tab  [RST-2466, RST-2467]', async ({ page }) => {
        test.setTimeout(120000);
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
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
        await page.route('**/voyages/pattern-finder/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/room-types/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Reco Promo Action Alert] is true');
        await page.keyboard.press('Enter');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Reco Promo Action Alert] is true');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/source-market/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        await verifyUrl(page, '/voyage-inventory/source-market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        
        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_1_heading', 'Booking trends');
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_heading', 'Room type bookings mix by region');
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Penthouse', { partial : true });
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Balcony', { partial : true });
        }
        
        console.log('User verifies the time filter dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { partial : true });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 weeks ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 1 month ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 months ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 3 months ', { index : 4 });
       
        console.log('User applies time option-1 filter');
        const sourceMarketTimeFilter1ResponsePromise = page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });
        await sourceMarketTimeFilter1ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        const sourceMarketTimeFilter2ResponsePromise = page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });
        await sourceMarketTimeFilter2ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        const sourceMarketTimeFilter3ResponsePromise = page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 3 });
        await sourceMarketTimeFilter3ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        const sourceMarketTimeFilter4ResponsePromise = page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 4 });
        await sourceMarketTimeFilter4ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        await page.waitForTimeout(2000);
    });

    test('Verify user can edit and reset RM analyst logs  [RST-2463, RST-2464, RST-2465]', async ({ page }) => {
        test.setTimeout(120000);
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/pattern-finder/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/room-types/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Reco Promo Action Alert] is true');
        await page.keyboard.press('Enter');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Reco Promo Action Alert] is true');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/source-market/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        await verifyUrl(page, '/voyage-inventory/source-market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_1_heading', 'Booking trends');
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_heading', 'Room type bookings mix by region');
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        const rmLogInput = page.locator(locatorRegistry.voyage_deep_dive.vdd_sourceMarket_rmLog).first();
        const log_initial_value = await rmLogInput.inputValue();
        await rmLogInput.clear();
        await rmLogInput.fill('this is a log');
        await rmLogInput.press('Enter');

        const log_initial_value_after_enter = await rmLogInput.inputValue();
        expect(log_initial_value_after_enter).toContain('this is a log');

        console.log('User clicks on reset button');
        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_buttons', { text : 'Reset' });

        const log_initial_value_after_reset = await rmLogInput.inputValue();
        expect(log_initial_value_after_reset).toContain(log_initial_value);

        await page.waitForTimeout(2000);
    });

    test('Verify the source market tab elements for meta tab [RST-2468, RST-2469, RST-2470, RST-2471]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
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
        await page.route('**/voyages/pattern-finder/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/room-types/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Reco Promo Action Alert] is true');
        await page.keyboard.press('Enter');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Reco Promo Action Alert] is true');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
            await verifyUrl(page, '/penthouse/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
            await verifyUrl(page, '/balcony/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/source-market/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        await verifyUrl(page, '/source-market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        
        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_1_heading', 'Booking trends');
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_heading', 'Room type bookings mix by region');
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Penthouse', { partial : true });
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Balcony', { partial : true });
        }
        
        console.log('User verifies the source market table- column and row headers');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Metric ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Us ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Uk ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Europe ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_table_headers', ' Other ', { index : 4 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Metric ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Promo action recommended ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Details ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Average discount ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Avg % of bookings on a discount ', { index : 4 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Average booking NPD ', { index : 5 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_metric_column', ' Promo action needed ', { index : 6 });

        console.log('User verifies the time filter dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { partial : true });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 weeks ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 1 month ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 months ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 3 months ', { index : 4 });
    });

    test('Verify the source market tab with time filters for meta tab  [RST-2472, RST-2473]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
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
        await page.route('**/voyages/pattern-finder/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/room-types/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/source-market/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Reco Promo Action Alert] is true');
        await page.keyboard.press('Enter');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Reco Promo Action Alert] is true');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
            await verifyUrl(page, '/penthouse/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
            await verifyUrl(page, '/balcony/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/source-market/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        await verifyUrl(page, '/source-market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        
        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_1_heading', 'Booking trends');
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_heading', 'Room type bookings mix by region');
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Penthouse', { partial : true });
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_chart_2_legend', 'Balcony', { partial : true });
        }
        
        console.log('User verifies the time filter dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { partial : true });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 weeks ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 1 month ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 months ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 3 months ', { index : 4 });
       
        console.log('User applies time option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });
        await page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });
        await page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 3 });
        await page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 4 });
        await page.waitForResponse(response => 
            response.url().includes('source-market/bookings') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { partial : true });
        legend_count = await page.locator('app-booking-trends-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);
        legend_count = await page.locator('app-room-type-chart .apexcharts-legend').count();
        expect(legend_count).not.toBe(0);

        await page.waitForTimeout(2000);
    });
})
