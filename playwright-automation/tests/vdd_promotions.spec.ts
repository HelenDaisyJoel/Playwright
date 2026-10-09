import { test, expect } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, verifyUrl, verifyElementCount, writeTextInLocator } from '../utils/actions';
import { locatorRegistry } from '../locators';

test.describe('NCL Voyage deep dive- Voyage Inventory- Promotion @regression @NCL-admin @NCL-analyst @NCL-manager ', () => {
    test('Verify the different components on promotions sub-tab- VI tab [RST-2438, RST-2439, RST-2440, RST-2441, RST-2442, RST-2457]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route) => {
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route) => {
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/promotion');
        await page.waitForSelector('[data-testid="section-header"] .text-title-md-caps', { timeout: 15000 });

        console.log('User verifies the time filter dropdown');
          await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index : 0, partial : true });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 0 });
       await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 weeks ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 1 month ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 months ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 3 months ', { index : 4 });
        await page.click('body');

         const bookingTypeFilterCount = await page.locator('[ng-reflect-label="Booking Type"] .dropdown [type="button"]').count();
        expect(bookingTypeFilterCount).toBeLessThanOrEqual(1);

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_heading', 'Number of bookings');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true });

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_heading', 'Average NTR discount %');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
    });

    test('Verify the time filter on promotions sub-tab- VI tab [RST-2444]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('voyage-inventory/?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/promotion');

        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        // await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { partial : true });
                
        console.log('User applies time option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });
        await page.waitForResponse(response => 
            response.url().includes('voyage-inventory/?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });
        await page.waitForResponse(response => 
            response.url().includes('voyage-inventory/?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 3 });
        await page.waitForResponse(response => 
            response.url().includes('voyage-inventory/?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 4 });
        await page.waitForResponse(response => 
            response.url().includes('voyage-inventory/?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        await page.waitForTimeout(2000);
    });
})

test.describe('NCL Voyage deep dive- Meta tab- Promotion @regression @NCL-admin @NCL-analyst @NCL-manager ', () => {
    test('Verify the different components on promotions sub-tab- VI tab [RST-2449, RST-2450, RST-2451, RST-2452, RST-2453, RST-2458]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        console.log('User clicks on meta tab- Balcony');
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
        await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');

        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/cabin-charts') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/cabin');


        const promotionTabResponsePromise = page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await promotionTabResponsePromise;
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/promotion');

         const dropdownLabelCount = await page.locator('app-dropdown .text-sm').count();
        const timeFilterIndex = dropdownLabelCount > 1 ? 1 : 0;

        console.log('User verifies the time filter dropdown');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ', { index : timeFilterIndex });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index : timeFilterIndex, partial : true });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 weeks ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 1 month ', { index : 2 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 2 months ', { index : 3 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' Last 3 months ', { index : 4 });
        await page.click('body');
       
        const bookingTypeFilterCount = await page.locator('[ng-reflect-label="Booking Type"] .dropdown [type="button"]').count();
        expect(bookingTypeFilterCount).toBeLessThanOrEqual(1);

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_heading', 'Number of bookings');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true });

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_heading', 'Average NTR discount %');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        await page.waitForTimeout(2000);
    });

    test('Verify the time filter on promotions sub-tab- VI tab [RST-2455]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        console.log('User clicks on meta tab- Balcony');
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
        await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/cabin-charts') && response.request().method() === 'GET'
        );

        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/cabin');

        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, 'balcony/promotion');

        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        // await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { partial : true });
                
        console.log('User applies time option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });
        await page.waitForResponse(response => 
            response.url().includes('?promo_market=domestic&promo_audience=targeted') && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        const promoTimeFilter1ResponsePromise = page.waitForResponse(response => 
            (
                response.url().includes('?promo_market=domestic&promo_audience=targeted') ||
                response.url().includes('/promo-market-bookings/') ||
                response.url().includes('/promo-bookings/')
            ) && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 1 month' });
        await promoTimeFilter1ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        const promoTimeFilter2ResponsePromise = page.waitForResponse(response => 
            (
                response.url().includes('?promo_market=domestic&promo_audience=targeted') ||
                response.url().includes('/promo-market-bookings/') ||
                response.url().includes('/promo-bookings/')
            ) && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 2 months' });
        await promoTimeFilter2ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown');
        const promoTimeFilter3ResponsePromise = page.waitForResponse(response => 
            (
                response.url().includes('?promo_market=domestic&promo_audience=targeted') ||
                response.url().includes('/promo-market-bookings/') ||
                response.url().includes('/promo-bookings/')
            ) && response.request().method() === 'GET'
        );
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 3 months' });
        await promoTimeFilter3ResponsePromise;
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { partial : true });
        await page.waitForTimeout(2000);
    });
})

test.describe('O&R Voyage deep dive- Voyage Inventory- Promotion @regression @OCEANIA-admin @OCEANIA-analyst @OCEANIA-manager @REGENT-admin @REGENT-analyst @REGENT-manager ', () => {
    test('Verify the different components on promotions sub-tab- VI tab [RST-2435, RST-2436, RST-2437, RST-2438, RST-2439, RST-2440, RST-2441, RST-2442]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/promotion');
        await page.waitForSelector(locatorRegistry.voyage_deep_dive.vdd_promotion_section_heading, { timeout: 15000 });
        const kpiCards = page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_kpi_cards);
        const kpiCardCount = await kpiCards.count();
        if (kpiCardCount >= 4) {
        const kpiCards = page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_kpi_cards);
        const kpiCardCount = await kpiCards.count();
        if (kpiCardCount >= 4) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_1_title', 'Domestic\n promo usage');
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_2_title', 'International\n promo usage');
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_3_title', 'Avg. domestic booking discount');
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_4_title', 'Avg. international booking discount');
        } 
        }

        console.log('User verifies the filter dropdowns');
          const promotionFilterCount = await page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_filter_time_title).count();
        if (promotionFilterCount >= 2) {
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Booking type ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index : 0 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index : 1 , partial : true });

        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' All ', { index : 1 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 2 weeks ', { index : 1 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 1 month ', { index : 1 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 2 months ', { index : 1 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 3 months ', { index : 1 , partial : true });
        await page.click('body');
         }
        const expectedXAxisLabel = promotionFilterCount >= 2 ? 'Booking type' : 'Promo codes';
              
        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_heading', 'Number of bookings');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true });

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_heading', 'Average NTR discount %');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })
    });

    test('Verify the time filter on promotions sub-tab- VI tab [RST-2444]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/promotion');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        const promotionFilterCount = await page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_filter_time_title).count();
        const timeFilterIndex = promotionFilterCount >= 2 ? 1 : 0;
        const expectedXAxisLabel = promotionFilterCount >= 2 ? 'Booking type' : 'Promo codes';
        
        console.log('User applies time option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 2 weeks' });
        await page.waitForLoadState('networkidle');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 1 month' });
        await page.waitForLoadState('networkidle');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 2 months' });
        await page.waitForLoadState('networkidle');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { text : 'Last 3 months' });
        await page.waitForLoadState('networkidle');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })
        await page.waitForTimeout(2000);
    });

    test('Verify the booking type filter on promotions sub-tab- VI tab [RST-2443]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab', { force: true });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/promotion');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        // await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_booking_type_dropdown', ' All ', { partial : true });
        
        console.log('User applies Booking type option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 0 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });

        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        await page.waitForTimeout(2000);
    });

    test('Verify the booking type and time filter on promotions sub-tab- VI tab [RST-2445]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/promotion');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        const promotionFilterCount = await page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_filter_time_title).count();
        const bookingFilterIndex = promotionFilterCount >= 2 ? 0 : -1;
        const timeFilterIndex = promotionFilterCount >= 2 ? 1 : 0;

        if (bookingFilterIndex >= 0) {
            console.log('User applies Booking type option-1 filter');
            await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : bookingFilterIndex });
            await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });

            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Domestic Public ', { index: bookingFilterIndex , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index: timeFilterIndex , partial : true });
            await page.waitForResponse(response => 
                response.url().includes('/promo-bookings/') && response.request().method() === 'GET'
            );
        } 

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });

        if (bookingFilterIndex >= 0) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Domestic Public ', { index: bookingFilterIndex , partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        await page.waitForTimeout(2000);
    });    
})

test.describe('O&R Voyage deep dive- Meta tab- Promotion @regression @OCEANIA-admin @OCEANIA-analyst @OCEANIA-manager @REGENT-admin @REGENT-analyst @REGENT-manager ', () => {
    test('Verify the different components on promotions sub-tab- meta tab [RST-2446, RST-2447, RST-2448, RST-2449, RST-2450, RST-2451, RST-2452, RST-2453]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
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
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/promotion');

        const kpiCards = page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_kpi_cards);
        const kpiCardCount = await kpiCards.count();
        if (kpiCardCount >= 4) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_1_title', 'Domestic\n promo usage');
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_2_title', 'International\n promo usage');
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_3_title', 'Avg. domestic booking discount');
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_kpi_card_4_title', 'Avg. international booking discount');
        }

        console.log('User verifies the filter dropdowns');
        const promotionFilterCount = await page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_filter_time_title).count();
        if (promotionFilterCount >= 2) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Booking type ', { index : 0 });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index : 0 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_title', ' Time ', { index : 1 });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index : 1 , partial : true });

            await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 0 });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', ' All ', { index : 0 });

            await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 1 });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' All ', { index : 1 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 2 weeks ', { index : 1 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 1 month ', { index : 1 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 2 months ', { index : 1 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_popup', ' Last 3 months ', { index : 1 , partial : true });
            await page.click('body');
        }
        const expectedXAxisLabel = promotionFilterCount >= 2 ? 'Booking type' : 'Promo codes';

        console.log('User verifies the chart one heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_heading', 'Number of bookings');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true });

        console.log('User verifies the chart two heading and legend');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_heading', 'Average NTR discount %');
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })
    });

    test('Verify the time filter on promotions sub-tab- Meta tab [RST-2455]', async ({ page }) => {
        test.setTimeout(120000);
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
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

        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/promotion');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        const promotionFilterCount = await page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_filter_time_title).count();
        const timeFilterIndex = promotionFilterCount >= 2 ? 1 : 0;
        const expectedXAxisLabel = promotionFilterCount >= 2 ? 'Booking type' : 'Promo codes';
        
        console.log('User applies time option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });
        await page.waitForResponse(response => 
            (response.url().includes('/promo-market-bookings/') || response.url().includes('/promo-bookings/')) && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 weeks ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });
        await page.waitForResponse(response => 
            (response.url().includes('/promo-market-bookings/') || response.url().includes('/promo-bookings/')) && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })
        
        console.log('User applies time option-3 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 3 });
        await page.waitForResponse(response => 
            (response.url().includes('/promo-market-bookings/') || response.url().includes('/promo-bookings/')) && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 2 months ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })

        console.log('User applies time option-4 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 4 });
        await page.waitForResponse(response => 
            (response.url().includes('/promo-market-bookings/') || response.url().includes('/promo-bookings/')) && response.request().method() === 'GET'
        );
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 3 months ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', expectedXAxisLabel, { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', expectedXAxisLabel, { partial : true })
        await page.waitForTimeout(2000);
    });

    test('Verify the booking type filter on promotions sub-tab- Meta tab [RST-2454]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
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
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/promotion');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        // await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_booking_type_dropdown', ' All ', { partial : true });
        
        console.log('User applies Booking type option-1 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : 0 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });

        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        await page.waitForTimeout(2000);
    });

    test('Verify the booking type and time filter on promotions sub-tab- Meta tab [RST-2456]', async ({ page }) => {
        await page.route('**/voyages/filters/**', async (route, request) => {
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
        await page.route('**/api/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/promo-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/voyage-navigation/**', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');
        console.log('User verifies the VDD- cabin url');
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
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL('**/deep-dive/**');
        await page.waitForResponse(response => 
            (response.url().includes('promo-market-bookings') || response.url().includes('promo-bookings')) && response.request().method() === 'GET'
        );
        await page.waitForLoadState('networkidle');

        console.log('User verifies the VDD- promotion url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/promotion');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_section_heading', 'bookings breakdown');
        const promotionFilterCount = await page.locator(locatorRegistry.voyage_deep_dive.vdd_promotion_filter_time_title).count();
        const bookingFilterIndex = promotionFilterCount >= 2 ? 0 : -1;
        const timeFilterIndex = promotionFilterCount >= 2 ? 1 : 0;

        if (bookingFilterIndex >= 0) {
            console.log('User applies Booking type option-1 filter');
            await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : bookingFilterIndex });
            await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 1 });

            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Domestic Public ', { index: bookingFilterIndex , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' All ', { index: timeFilterIndex , partial : true });
            await page.waitForResponse(response => 
                response.url().includes('/promo-bookings/') && response.request().method() === 'GET'
            );
        } else {
            console.warn('⚠️ Booking type filter is not available for this O&R context; validating time filter and charts only.');
        }

        console.log('User applies time option-2 filter');
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', { index : timeFilterIndex });
        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown_item', { index : 2 });

        if (bookingFilterIndex >= 0) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Domestic Public ', { index: bookingFilterIndex , partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_filter_time_dropdown', ' Last 1 month ', { index: timeFilterIndex , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_1_x_axis', 'Promo codes', { partial : true })
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_chart_2_x_axis', 'Promo codes', { partial : true })
        await page.waitForTimeout(2000);
    });
})
