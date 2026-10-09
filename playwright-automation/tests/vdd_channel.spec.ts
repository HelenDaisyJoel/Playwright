import { test } from '../fixtures/baseFixture';
import { verifyText, actionClick, verifyUrl } from '../utils/actions';

test.describe.skip('Voyage deep dive- channel tab @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
    test('Verify the channel tab with filters for VI tab [RST-2474, RST-2475, RST-2476, RST-2477]', async ({ page }) => {
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
        await page.route('**/voyages/channel/**', async (route, request) => {
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
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_channel_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/channel/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        await verifyUrl(page, '/voyage-inventory/channel');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Channel ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Track bookings distribution and NPD by sales channel ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sub_section_heading', 'bookings breakdown');

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_heading', 'Number of bookings');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_heading', 'Average NPD');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });

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
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 3 });
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 4 });
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });
        await page.waitForTimeout(2000);
    });

    test('Verify the channel tab with filters for meta tab [RST-2478, RST-2479, RST-2480, RST-2481]', async ({ page }) => {
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
        await page.route('**/voyages/channel/**', async (route, request) => {
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
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_channel_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/channel/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        await verifyUrl(page, '/channel');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Channel ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Track bookings distribution and NPD by sales channel ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sub_section_heading', 'bookings breakdown');

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_heading', 'Number of bookings');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_heading', 'Average NPD');
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });

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
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 3 });
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 4 });
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/channel/?voyage_code=') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_1_x_axis', 'Channels', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_channel_chart_2_x_axis', 'Channels', { partial : true });
        await page.waitForTimeout(2000);
    });
})