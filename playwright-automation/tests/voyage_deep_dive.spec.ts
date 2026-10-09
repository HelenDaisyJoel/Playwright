import { test, expect } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, verifyUrl, verifyAttribute, writeTextInLocator } from '../utils/actions';

test.describe('Voyage deep dive tabs @regression @REGENT-admin @REGENT-manager @REGENT-analyst @NCL-admin @NCL-manager @NCL-analyst @OCEANIA-admin @OCEANIA-manager @OCEANIA-analyst', () => {
    let firstRowData;
    test('verify user is able to navigate to voyage deep dive page and navigate to different tabs @smoke [RST-2403, RST-2404, RST-2405, RST-2406]', async ({ page }) => {
        test.setTimeout(180000);

        const passThroughRoute = async (route, request) => {
            await route.continue();
        };

        const logAndPassThroughRoute = async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
            }
            await route.continue();
        };
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/key-metrics/**', async (route, request) => {
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
        await page.route('**/voyages/channel/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/group-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
       
        await page.goto('/analytics/sailings');
        await page.waitForURL('**/analytics/sailings');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        firstRowData = await page.evaluate(() => {
            const firstRow = document.querySelector('.ag-pinned-left-cols-container .ag-row');
            if (!firstRow) return null;

            const cells = firstRow.querySelectorAll('.ag-cell');

            return {
                voyage: (cells[0] as HTMLElement)?.innerText.trim(),
                departureDate: (cells[1] as HTMLElement)?.innerText.trim(),
                region: (cells[2] as HTMLElement)?.innerText.trim(),
                voyageLength: (cells[3] as HTMLElement)?.innerText.trim(),
                priorityLevel: (cells[5] as HTMLElement)?.innerText.trim(),
                blackout: (cells[6] as HTMLElement)?.innerText.trim(),
                boLiftDate: (cells[7] as HTMLElement)?.innerText.trim(),
                meta: (cells[8] as HTMLElement)?.innerText.trim(),
            };
        });
        if (!firstRowData) {
            throw new Error('Unable to read first row data from pricing table.');
        }
        const text = firstRowData.voyage;
        const result = text.replace('sailing', '').trim();
        
        console.log('User opens the voyage deep dive page')
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });

        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { index: 0, timeout: 30000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_header', result, {index : 0 , partial : true});

        await verifyText(page, 'voyage_deep_dive', 'vdd_back_button', ' Back ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_prev_voyage_btn', ' Previous sailing ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_next_voyage_btn', ' Next sailing ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_view_key_metrics', ' View Key Metrics  left_panel_close ');

        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_tab', ' Sailing inventory ');
        if(process.env.BRAND === 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true});
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_sub_tab', 'Cabin');
      
        await verifyText(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab', 'Promotion');
        await verifyText(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab', 'Source market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_group_sub_tab', 'Group');

        await verifyUrl(page, '/voyage-inventory/cabin');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', true, { index: 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Cabin ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Click Save Changes to apply any updates ');
    // Commenting out Occupancy sub-tab assertions for now since the tab is not available in the UI as of 2026-07-27
        // if (process.env.BRAND === 'NCL') {
        //       await actionClick(page, 'voyage_deep_dive', 'vdd_occupancy_sub_tab');
        //     await page.waitForLoadState('networkidle');
        //     await page.waitForTimeout(2000);

        //     await verifyUrl(page, '/voyage-inventory/occupancy');
        //     await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        //     await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Occupancy ');
        //     await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Track and manage occupancy metrics and prices ');
        // }

        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForURL(/\/deep-dive\/[^/]+\/(?:voyage-inventory|[^/]+)\/promotion\/?$/, { timeout: 30000 });
        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { index: 0, timeout: 30000 });
        await verifyUrl(page, '/voyage-inventory/promotion');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Promotion ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' View recent promotion usage and average discount ');

        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await page.waitForURL(/\/deep-dive\/[^/]+\/(?:voyage-inventory|[^/]+)\/source-market\/?$/, { timeout: 30000 });
        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { index: 0, timeout: 30000 });
        await verifyUrl(page, '/voyage-inventory/source-market');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        await actionClick(page, 'voyage_deep_dive', 'vdd_group_sub_tab');
        await page.waitForURL(/\/deep-dive\/[^/]+\/(?:voyage-inventory|[^/]+)\/group\/?$/, { timeout: 30000 });
        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { index: 0, timeout: 30000 });

        await verifyUrl(page, '/voyage-inventory/group');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Group ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' View group-level booking trends and pricing outcomes ');

        await page.unrouteAll({ behavior: 'ignoreErrors' });
    });

    test('verify user is able to navigate to voyage deep dive page and navigate to different tabs @smoke [RST-2405, RST-2406]', async ({ page }) => {
        test.setTimeout(180000);

        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/?promo_market=domestic&promo_audience=targeted', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/promo-market-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/key-metrics/**', async (route, request) => {
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
        await page.route('**/voyages/channel/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/group-bookings/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForURL('**/analytics/sailings');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        firstRowData = await page.evaluate(() => {
            const firstRow = document.querySelector('.ag-pinned-left-cols-container .ag-row');
            if (!firstRow) return null;

            const cells = firstRow.querySelectorAll('.ag-cell');

            return {
                voyage: (cells[0] as HTMLElement)?.innerText.trim(),
                departureDate: (cells[1] as HTMLElement)?.innerText.trim(),
                region: (cells[2] as HTMLElement)?.innerText.trim(),
                voyageLength: (cells[3] as HTMLElement)?.innerText.trim(),
                priorityLevel: (cells[5] as HTMLElement)?.innerText.trim(),
                blackout: (cells[6] as HTMLElement)?.innerText.trim(),
                boLiftDate: (cells[7] as HTMLElement)?.innerText.trim(),
                meta: (cells[8] as HTMLElement)?.innerText.trim(),
            };
        });
        if (!firstRowData) {
            throw new Error('Unable to read first row data from pricing table.');
        }
        const text = firstRowData.voyage;
        const result = text.replace('sailing', '').trim();

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index: 0 });

        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { index: 0, timeout: 30000 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_header', result, { index: 0, partial: true });

        await verifyText(page, 'voyage_deep_dive', 'vdd_back_button', ' Back ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_prev_voyage_btn', ' Previous sailing ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_next_voyage_btn', ' Next sailing ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_view_key_metrics', ' View Key Metrics  left_panel_close ');

        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_tab', ' Sailing inventory ');
        if (process.env.BRAND ==='REGENT') {
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true });
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
            await verifyUrl(page, '/penthouse/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        } else {
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true });
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
            await verifyUrl(page, '/balcony/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }

        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Cabin ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Manage recommendation ');
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', true, { index: 0 });

        await actionClick(page, 'voyage_deep_dive', 'vdd_promotion_sub_tab');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);

        if (process.env.BRAND === 'REGENT') {
            await verifyUrl(page, '/penthouse/promotion');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        } else {
            await verifyUrl(page, '/balcony/promotion');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }

        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Promotion ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' View recent promotion usage and average discount ');

        await actionClick(page, 'voyage_deep_dive', 'vdd_sourceMarket_sub_tab');
        await page.waitForURL('**/source-market', { timeout: 30000 });
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        if (process.env.BRAND == 'REGENT') {
            await verifyUrl(page, '/penthouse/source-market');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        } else {
            await verifyUrl(page, '/balcony/source-market');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Source market ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' Understand where customers are booking from and how they respond to promotions ');

        await actionClick(page, 'voyage_deep_dive', 'vdd_group_sub_tab');
        await page.waitForURL('**/group', { timeout: 30000 });
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(4000);

        if (process.env.BRAND === 'REGENT') {
            await verifyUrl(page, '/penthouse/group');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        } else {
            await verifyUrl(page, '/balcony/group');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Group ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_sub_text', ' View group-level booking trends and pricing outcomes ');
    });
})
