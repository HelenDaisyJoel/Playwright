import { test } from '../fixtures/baseFixture';
import { verifyText, actionClick, verifyUrl } from '../utils/actions';

test.describe.skip('Voyage deep dive- occupancy tab @regression @NCL-admin @NCL-manager @NCL-analyst', () => {
    test('Verify the occupancy tab on cabin- Sailing inventory [RST-2426, RST-2427, RST-2428, RST-2429]', async ({ page }) => {
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
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        await page.waitForURL('**/deep-dive/**');

        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_occupancy_sub_tab');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        await verifyUrl(page, '/voyage-inventory/occupancy');

        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Sailing inventory | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Occupancy ');

        console.log('User verifies the table one headers');
        const expectedTableOne = [
            'SAILING T4\nCAPACITY',
            'SAILING T4 GROSS\nPAX (BERTHED)',
            'T4 GROSS\nLOAD FACTOR',
            'SAILING GROSS\nCABINS BOOKED',
            'SAILING GROSS\nCABIN LF',
            'BUDGET\nAVAILABLE',
            'BUDGET\nLF',
            'T4 BUDGET\nREQUIREMENT',
            'T4 BUDGET\nFULFILLMENT'
            ];
        for (const header of expectedTableOne) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 0 , partial : true });
        }
        console.log('User verifies the table two headers');
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'CATEGORY INFO', { index : 0 , partial : true });
        const expectedTableTwo = [
            'DO PRICE',
            'T4 PRICE',
            'T4 CAPACITY',
            'PERFORMANCE METRICS'
            ];
        for (const header of expectedTableTwo) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', header, { index : 1 , partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'ACTIONS', { index : 2 , partial : true });
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'META', { index : 1 , partial : true });
        const expectedTableTwoHeaders = [
            'CURRENT LEAD-IN',
            'RECO LEAD-IN',
            'PENDING LEAD-IN',
            'CURRENT T4\nPRICE SHOPPABLE',
            'CURRENT T4\nPRICE',
            'T4 RECO\nPRICE',
            'T4 RECO\nMULTIPLIER',
            'T4 RMS\nTOGGLE LADDER',
            'T4 MULTIPLIER\nOVERRIDE',
            'T4 PRICE\nOVERRIDE',
            'T4 CALCULATED\nPRICE',
            'T4 PENDING\nPRICE',
            'Last\nPrice Change',
            'META T4\nPAX LIMIT',
            'GROSS T4 GROSS\nPAX (BERTHED)',
            'META T4\nGROSS LF',
            'META GROSS\nCABIN LF',
            'AVERAGE BOOKED\nT4 PRICE'
            ];
        for (const header of expectedTableTwoHeaders) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 2 , partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'STATUS', { index : 3 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'NOTES', { index : 3 , partial : true });
        
        const pricingLegend = [
        {
            tooltip: 'No Action Yet: Awaiting action.',
            heading: 'No Action Yet',
            icon: 'remove'
        },
        {
            tooltip: 'This alert requires your attention. Review the rationale and decide on the appropriate action.',
            heading: 'To Review',
            icon: 'document_search'
        },
        {
            tooltip: 'An action has been taken and currently is being pushed to reservation system',
            heading: 'Syncing',
            icon: 'sync'
        },
        {
            tooltip: 'An action has been taken but it will be only pushed to reservation system once you commit the changes',
            heading: 'Planned',
            icon: 'timer_pause'
        },
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Accepted',
            icon: 'check_circle'
        },
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Complete',
            icon: 'verified_user'
        },
        {
            tooltip: 'Overridden: Previous action was replaced.',
            heading: 'Overridden',
            icon: 'cancel'
        }  
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Reset ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Save changes ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Commit ', { index : 2, partial : true });
    });

    test('Verify the occupancy tab on cabin- Meta [RST-2430, RST-2431, RST-2432, RST-2433, RST-2434]', async ({ page }) => {
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
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        await page.waitForURL('**/deep-dive/**');

        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
        await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
        await verifyUrl(page, '/balcony/cabin');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        
        await actionClick(page, 'voyage_deep_dive', 'vdd_occupancy_sub_tab');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        await verifyUrl(page, '/balcony/occupancy');

        await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', ' Balcony | ');
        await verifyText(page, 'voyage_deep_dive', 'vdd_page_subHeading', ' Occupancy ');

        console.log('User verifies the table one headers');
        const expectedTableOne = [
            'SAILING T4\nCAPACITY',
            'SAILING T4 GROSS\nPAX (BERTHED)',
            'T4 GROSS\nLOAD FACTOR',
            'SAILING GROSS\nCABINS BOOKED',
            'SAILING GROSS\nCABIN LF',
            'BUDGET\nAVAILABLE',
            'BUDGET\nLF',
            'T4 BUDGET\nREQUIREMENT',
            'T4 BUDGET\nFULFILLMENT'
            ];
        for (const header of expectedTableOne) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 0 , partial : true });
        }
        console.log('User verifies the table two headers');
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'CATEGORY INFO', { index : 0 , partial : true });
        const expectedTableTwo = [
            'DO PRICE',
            'T4 PRICE',
            'T4 CAPACITY',
            'PERFORMANCE METRICS'
            ];
        for (const header of expectedTableTwo) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', header, { index : 1 , partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'ACTIONS', { index : 2 , partial : true });
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'META', { index : 1 , partial : true });
        const expectedTableTwoHeaders = [
            'CURRENT LEAD-IN',
            'RECO LEAD-IN',
            'PENDING LEAD-IN',
            'CURRENT T4\nPRICE SHOPPABLE',
            'CURRENT T4\nPRICE',
            'T4 RECO\nPRICE',
            'T4 RECO\nMULTIPLIER',
            'T4 RMS\nTOGGLE LADDER',
            'T4 MULTIPLIER\nOVERRIDE',
            'T4 PRICE\nOVERRIDE',
            'T4 CALCULATED\nPRICE',
            'T4 PENDING\nPRICE',
            'Last\nPrice Change',
            'META T4\nPAX LIMIT',
            'GROSS T4 GROSS\nPAX (BERTHED)',
            'META T4\nGROSS LF',
            'META GROSS\nCABIN LF',
            'AVERAGE BOOKED\nT4 PRICE'
            ];
        for (const header of expectedTableTwoHeaders) {
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 2 , partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'STATUS', { index : 3 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'NOTES', { index : 3 , partial : true });
        
        console.log('User verifies the table three headers');
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'CATEGORY INFO', { index : 3 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'DO PRICE', { index : 4 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'T4 CAPACITY', { index : 4 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'META', { index : 4 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'CABIN CATEGORY', { index : 4 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'CURRENT LEAD-IN\nPRICE', { index : 5 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'RECO LEAD-IN\nPRICE', { index : 5 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'PENDING LEAD-IN\nPRICE', { index : 5 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'GROSS T4 GROSS\nPAX (BERTHED)', { index : 5 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'GROSS CABINS BERTHED\n/ SELLABLE CAPACITY', { index : 5 , partial : true });

        const pricingLegend = [
        {
            tooltip: 'No Action Yet: Awaiting action.',
            heading: 'No Action Yet',
            icon: 'remove'
        },
        {
            tooltip: 'This alert requires your attention. Review the rationale and decide on the appropriate action.',
            heading: 'To Review',
            icon: 'document_search'
        },
        {
            tooltip: 'An action has been taken and currently is being pushed to reservation system',
            heading: 'Syncing',
            icon: 'sync'
        },
        {
            tooltip: 'An action has been taken but it will be only pushed to reservation system once you commit the changes',
            heading: 'Planned',
            icon: 'timer_pause'
        },
        {
            tooltip: 'An action has been taken and is currently under managerial review.',
            heading: 'Pending Validation',
            icon: 'hourglass_empty'
        },
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Accepted',
            icon: 'check_circle'
        },
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Complete',
            icon: 'verified_user'
        },
        {
            tooltip: 'Overridden: Previous action was replaced.',
            heading: 'Overridden',
            icon: 'cancel'
        }  
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Reset ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Save changes ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Commit ', { index : 2, partial : true });
    });
})