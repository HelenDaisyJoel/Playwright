import { test } from '../fixtures/baseFixture';
import { verifyText, actionClick, verifyUrl } from '../utils/actions';

test.describe('Voyage deep dive- group tab @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
    test('Verify the group tab with filters for VI tab [RST-2482, RST-2483, RST-2484]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
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
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/voyages/group-bookings/**', async (route, request) => {
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
        
        const groupBookingsResponsePromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/group-bookings/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_group_sub_tab');
        await groupBookingsResponsePromise;
        await page.waitForLoadState('networkidle');

        await verifyUrl(page, '/voyage-inventory/group');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ', { timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Group ', { timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' View group-level booking trends and pricing outcomes ', { timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_sub_section_heading', 'group capacity breakdown', { timeout: 15000 });

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_chart_heading', ' Group performance overview ', { timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_chart_legend', '% of capacity taken by groups', { timeout: 15000 });

        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'GROUP', { index : 0, timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', '% OF TOTAL CAPACITY', { index : 1, partial : true, timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'ORIGINAL GROUP REQUESTS (# OF CABINS)', { index : 2, timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'CABINS CONFIRMED (# OF CABINS)', { index : 3, timeout: 15000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'EXPECTED CABINS MATERIALIZED', { index : 4, timeout: 15000 });
        
        await page.waitForTimeout(2000);
    });

    test('Verify the group tab with filters for Meta tab @smoke [RST-2485, RST-2486, RST-2487]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
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
            await route.continue();
        });
        await page.route('**/api/voyages/key-metrics/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/inventory/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-info/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
            await route.continue();
        });
        await page.route('**/voyages/group-bookings/**', async (route, request) => {
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
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_group_sub_tab');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/group-bookings/') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        await verifyUrl(page, '/group');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Group ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' View group-level booking trends and pricing outcomes ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sub_section_heading', 'group capacity breakdown');

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_chart_heading', ' Group performance overview ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_chart_legend', '% of capacity taken by groups');

        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'GROUP', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', '% OF TOTAL CAPACITY', { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'ORIGINAL GROUP REQUESTS (# OF CABINS)', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'CABINS CONFIRMED (# OF CABINS)', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_table_headers', 'EXPECTED CABINS MATERIALIZED', { index : 4 });
        
        await page.waitForTimeout(2000);
    });
})