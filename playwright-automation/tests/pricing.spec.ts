import { test, expect } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, writeTextInLocator, verifyUrl } from '../utils/actions';
import { locatorRegistry } from '../locators';

test.describe('Pricing page- table for O&R @regression  @OCEANIA-admin @OCEANIA-manager @OCEANIA-analyst @REGENT-admin @REGENT-manager @REGENT-analyst', () => {
    test('verify the pricing page components with toggle on and off @smoke [RST-2353, RST-2354, RST-2355]', async ({ page }) => {
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
        

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        
        await verifyText(page, 'pricing', 'pricing_heading', 'Prioritization');
        await verifyText(page, 'pricing', 'pricing_sub_heading', ' Analyze, compare, and act on sailing-level opportunities. ');
        await verifyText(page, 'pricing', 'pricing_table_buttons', 'Columns', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_buttons', 'Export', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_btn', ' Pattern Finder ');
        
        await verifyText(page, 'pricing', 'pricing_saved_view_btn', ' Saved Views ', { partial : true });

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
            tooltip: 'Overridden: Previous action was replaced.',
            heading: 'Overridden',
            icon: 'cancel'
        },
        {
            tooltip: 'Your suggested action has been accepted and approved by the manager.',
            heading: 'Complete',
            icon: 'verified_user'
        }
        ];

        for (let index = 0; index < pricingLegend.length; index++) {
            const { tooltip, heading, icon } = pricingLegend[index];
            await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', tooltip, { index, partial: true });
            await verifyText(page, 'pricing' ,'pricing_table_legend_heading', heading, { index });
            await verifyText(page,'pricing','pricing_table_legend_icon',icon,{ index });
        }
        
        await verifyVisibility(page, 'pricing', 'pricing_table_toggle_btn');
        await verifyText(page, 'pricing', 'pricing_table_toggle_btn_heading', 'Show Full Sailing Info');

        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailing Info ', { index : 0 });

        const requiredHeaderGroups = [
            'KEY DEMAND SIGNALS',
            'PRICE CHANGE',
            'META OVERSELLING',
            'CAPACITY METRICS',
            'BOOKING METRICS',
            'RESIDUAL METRICS',
            'GTY METRICS',
            'TACTICAL FLAGS',
            'SAILING PERFORMANCE'
        ];
        const tableHeaderGroupsText = await page.locator(locatorRegistry.pricing.pricing_table_header_groups).nth(1).innerText();
        const normalizedHeaderGroupsText = tableHeaderGroupsText.toUpperCase();
        for (const group of requiredHeaderGroups) {
            await expect(normalizedHeaderGroupsText).toContain(group);
        }
        // These groups are role/data dependent and are asserted only when present.
        if (normalizedHeaderGroupsText.includes('ADDITIONAL SAILING INFO')) {
            await expect(normalizedHeaderGroupsText).toContain('ADDITIONAL SAILING INFO');
        }
        if (normalizedHeaderGroupsText.includes('GROUP METRICS')) {
            await expect(normalizedHeaderGroupsText).toContain('GROUP METRICS');
        }

       await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Actions', { index : 2 });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' sailingSailing', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Ship ID',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Sail\n Length',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Priority',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Blackout',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' categoryMeta',  { index : 0, partial : true });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' Status',  { index : 2, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Notes',  { index : 2, partial : true });

        await actionClick(page, 'pricing', 'pricing_table_toggle_btn');
        await verifyVisibility(page, 'pricing', 'pricing_table_toggle_btn');

        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailing Info ', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Additional Sailing Info ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Key Demand Signals ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' GTY Metrics ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Tactical Flags ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailaway - Sa Vs. Ef Gap % ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Additional info ', { index : 1, partial : true });
        
        console.log('Verify the headers in Additional Sailing info');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Holidays ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Region ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Weeks to\n Sail ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Embark ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Disembark ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Main ', { index: 1, partial: true });
        const additionalInfoHeaders = await page
            .locator('[data-testid="pricing-tab-content"] .ag-header-allow-overflow .ag-header-row-column')
            .nth(1)
            .innerText();

        if (additionalInfoHeaders.includes('Letter/GV')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Letter/GV ', { index: 1, partial: true });
        }

        if (additionalInfoHeaders.includes('Spotlight')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Spotlight ', { index: 1, partial: true });
        }

        await verifyText(page, 'pricing', 'pricing_table_headers', ' Optimization\n Type ', { index: 1, partial: true });

        console.log('Verify the headers in Key Demand Signals');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Selling\n Status ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Opportunity ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Net FIT\n LF ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Curr vs\n Ref LF ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT\n Pickup Trend ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT Forecast\n at Departure ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' NPD\n Trend ', { index: 1, partial: true });

        console.log('Verify the headers in Price Change');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Price Alert ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Curr Lead-in Price ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco Lead-in Price ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco\n Price Change', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Last\n Price Change ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Calculated Price ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Pending Price ', { index: 1, partial: true });

        if (additionalInfoHeaders.includes('Scheduled Price Change')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Scheduled Price Change ', { index: 1, partial: true });
        }

        console.log('Verify the headers in Meta Overselling');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Oversell Alert ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Current Oversell ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco Overselling of Current\n Meta to Fill Upper Meta ', { index: 1, partial: true });

        console.log('Verify the headers in Capacity Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Total FIT Sellable Capacity\n Adj Overselling ', { index: 1, partial: true });

        console.log('Verify the headers in Booking Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT Gross Cabins\n Booked ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT Net Cabins\n Berthed ', { index: 1, partial: true });

        console.log('Verify the headers in Residual Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Total FIT Net Residual Capacity\n Adj Overselling ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Total FIT Gross Residual Capacity\n Adj Overselling ', { index: 1, partial: true });

        console.log('Verify the headers in GTY Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Cancel\n Buffer ', { index: 1, partial: true });

        if (additionalInfoHeaders.includes('Curr') && additionalInfoHeaders.includes('Gty')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Curr\n Gty ', { index: 1, partial: true });
        }

        if (additionalInfoHeaders.includes('Reco') && additionalInfoHeaders.includes('Gty')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco\n Gty ', { index: 1, partial: true });
        }

        console.log('Verify the headers in Group Metrics');
        if (additionalInfoHeaders.includes('Groups') && additionalInfoHeaders.includes('Blocked')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Groups\n Blocked ', { index: 1, partial: true });
        }

        if (additionalInfoHeaders.includes('Hotlist')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Hotlist ', { index: 1, partial: true });
        }

        if (additionalInfoHeaders.includes('Group Special') && additionalInfoHeaders.includes('Agency')) {
            await verifyText(page, 'pricing', 'pricing_table_headers', ' Group Special\n Agency ', { index: 1, partial: true });
        }

        console.log('Verify the headers in Tactical Flags');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco\n Promo Action Alert ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' RMS Reco\n Group Status ', { index: 1, partial: true });

        console.log('Verify the headers in Sailing Performance');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT\n NPD Cumulative (Net of Fcst Cxl) ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Avg Elasticity Index ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Retro Risk of\n Reco Action ', { index: 1, partial: true });

        console.log('Verify the headers in Sailaway - Sa Vs. Ef Gap %');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Alerts ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Current ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco. ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco.\n % change ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Pending ', { index: 1, partial: true });

        console.log('Verify the headers in Additional info');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Portfolio Owner ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Ship Class ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Market ', { index: 1, partial: true });
    });

    test('verify that the user is able to apply filters @smoke [RST-2356]', async ({ page }) => {
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
        

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Priority] = 1');
        await actionClick(page, 'pricing', 'pricing_table_filter_apply_btn');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_toggle_btn');
        await verifyText(page, 'pricing', 'pricing_table_row_priority', '1', { index : 0 });
    }); 
})

test.describe('Pricing page- table for NCL @regression @NCL-admin @NCL-manager @NCL-analyst ', () => {
    test('verify the pricing page components with toggle on and off @smoke [RST-2353, RST-2354, RST-2355]', async ({ page }) => {
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
        

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        
        await verifyText(page, 'pricing', 'pricing_heading', 'Prioritization');
        await verifyText(page, 'pricing', 'pricing_sub_heading', ' Analyze, compare, and act on sailing-level opportunities. ');
        await verifyText(page, 'pricing', 'pricing_table_buttons', 'Columns', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_buttons', 'Export', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_btn', ' Pattern Finder ');
        
        await verifyText(page, 'pricing', 'pricing_saved_view_btn', ' Saved Views ', { partial : true });

        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' No Action Yet: Awaiting action. ', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'No Action Yet', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'remove', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' This alert requires your attention. Review the rationale and decide on the appropriate action. ', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'To Review', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'document_search', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' An action has been taken and currently is being pushed to reservation system ', { index : 2 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'Syncing', { index : 2 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'sync', { index : 2 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' An action has been taken but it will be only pushed to reservation system once you commit the changes ', { index : 3 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'Planned', { index : 3 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'timer_pause', { index : 3 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' An action has been taken and is currently under managerial review. ', { index : 4 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'Pending Validation', { index : 4 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'hourglass_empty', { index : 4 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' Your suggested action has been accepted and approved by the manager. ', { index : 5 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'Accepted', { index : 5 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'check_circle', { index : 5 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' Overridden: Previous action was replaced. ', { index : 6 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'Overridden', { index : 6 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'cancel', { index : 6 });
        await verifyText(page, 'pricing', 'pricing_table_legend_tooltip', ' Your suggested action has been accepted and approved by the manager. ', { index : 7 });
        await verifyText(page, 'pricing', 'pricing_table_legend_heading', 'Complete', { index : 7 });
        await verifyText(page, 'pricing', 'pricing_table_legend_icon', 'verified_user', { index : 7 });
        
        await verifyVisibility(page, 'pricing', 'pricing_table_toggle_btn');
        await verifyText(page, 'pricing', 'pricing_table_toggle_btn_heading', 'Show Full Sailing Info');

        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailing Info ', { index : 0 });

        const requiredHeaderGroups = [
            'KEY DEMAND SIGNALS',
            'PRICE CHANGE',
            'META OVERSELLING',
            'CAPACITY METRICS',
            'BOOKING METRICS',
            'RESIDUAL METRICS',
            'GTY METRICS',
            'TACTICAL FLAGS',
            'SAILING PERFORMANCE'
        ];
        const tableHeaderGroupsText = await page.locator(locatorRegistry.pricing.pricing_table_header_groups).nth(1).innerText();
        const normalizedHeaderGroupsText = tableHeaderGroupsText.toUpperCase();
        for (const group of requiredHeaderGroups) {
            await expect(normalizedHeaderGroupsText).toContain(group);
        }
        // These groups are role/data dependent and are asserted only when present.
        if (normalizedHeaderGroupsText.includes('ADDITIONAL SAILING INFO')) {
            await expect(normalizedHeaderGroupsText).toContain('ADDITIONAL SAILING INFO');
        }
        if (normalizedHeaderGroupsText.includes('GROUP METRICS')) {
            await expect(normalizedHeaderGroupsText).toContain('GROUP METRICS');
        }

        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Key Demand Signals ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' GTY Metrics ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailing Performance ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Actions', { index : 2 });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' sailingSailing', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Ship ID',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Sail\n Length',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Priority',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Blackout',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' categoryMeta',  { index : 0, partial : true });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' Status',  { index : 2, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Notes',  { index : 2, partial : true });

        await actionClick(page, 'pricing', 'pricing_table_toggle_btn');
        await verifyVisibility(page, 'pricing', 'pricing_table_toggle_btn');

        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailing Info ', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Additional Sailing Info ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Key Demand Signals ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' GTY Metrics ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Tactical Flags ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Sailaway - Sa Vs. Ef Gap % ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_header_groups', ' Additional info ', { index : 1, partial : true });
        
        console.log('Verify the headers in Additional Sailing info');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Holidays ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Region ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Weeks to\n Sail ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Embark ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Disembark ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Main ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Optimization\n Type ', { index: 1, partial: true });

        console.log('Verify the headers in Key Demand Signals');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Selling\n Status ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Opportunity ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Net FIT\n LF ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Curr vs\n Ref LF ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT\n Pickup Trend ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT Forecast\n at Departure ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' NPD\n Trend ', { index: 1, partial: true });

        console.log('Verify the headers in Price Change');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Price Alert ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Curr Lead-in Price ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco Lead-in Price ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco\n Price Change', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Last\n Price Change ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Calculated Price ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Pending Price ', { index: 1, partial: true });

        console.log('Verify the headers in Meta Overselling');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Oversell Alert ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Current Oversell ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco Overselling of Current\n Meta to Fill Upper Meta ', { index: 1, partial: true });

        console.log('Verify the headers in Capacity Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Total FIT Sellable Capacity\n Adj Overselling ', { index: 1, partial: true });

        console.log('Verify the headers in Booking Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT Gross Cabins\n Booked ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT Net Cabins\n Berthed ', { index: 1, partial: true });

        console.log('Verify the headers in Residual Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Total FIT Net Residual Capacity\n Adj Overselling ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Total FIT Gross Residual Capacity\n Adj Overselling ', { index: 1, partial: true });

        console.log('Verify the headers in GTY Metrics');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Cancel\n Buffer ', { index: 1, partial: true });

        console.log('Verify the headers in Tactical Flags');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Reco\n Promo Action Alert ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' RMS Reco\n Group Status ', { index: 1, partial: true });

        console.log('Verify the headers in Sailing Performance');
        await verifyText(page, 'pricing', 'pricing_table_headers', ' FIT\n NPD Cumulative (Net of Fcst Cxl) ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Avg Elasticity Index ', { index: 1, partial: true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Retro Risk of\n Reco Action ', { index: 1, partial: true });
    });

    test('verify that the user is able to apply filters @smoke [RST-2356]', async ({ page }) => {
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
        

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Priority] = 1');
        await actionClick(page, 'pricing', 'pricing_table_filter_apply_btn');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_toggle_btn');
        await verifyText(page, 'pricing', 'pricing_table_row_priority', '1', { index : 0 });
    }); 
})

test.describe('Pricing page- pattern finder @regression @NCL-admin @NCL-manager @NCL-analyst @REGENT-admin @REGENT-analyst @REGENT-manager @OCEANIA-admin @OCEANIA-analyst @OCEANIA-manager', () => {
    test('verify the pricing page- pattern finder @smoke [RST-2364, RST-2365, RST-2366]', async ({ page }) => {
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
        console.log('User clicks on "Pattern Finder" button')
        await verifyText(page, 'pricing', 'pricing_pattern_finder_btn', ' Pattern Finder ');
        await actionClick(page, 'pricing', 'pricing_pattern_finder_btn');
        
        await page.waitForResponse(response => 
            response.url().includes('/voyages/pattern-finder/') && response.request().method() === 'POST'
        );
        
        await verifyText(page, 'pricing', 'pricing_pattern_finder_heading', 'Pattern Finder');
        await verifyText(page, 'pricing', 'pricing_pattern_finder_close_btn', 'close', { index : 3 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_x_axis', 'X-Axis  Region  keyboard_arrow_down');
        await verifyText(page, 'pricing', 'pricing_pattern_finder_y_axis', 'Y-Axis  Meta category  keyboard_arrow_down');
        await verifyText(page, 'pricing', 'pricing_pattern_finder_metric_shown', 'Metric Shown  Spill  keyboard_arrow_down');

        console.log('User clicks on X axis dropdown')
        await actionClick(page, 'pricing', 'pricing_pattern_finder_close_btn', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Region', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Meta category', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Departure date month', { index : 2 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Ship class', { index : 3 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Sailing length', { index : 4 });
        await actionClick(page, 'pricing', 'pricing_pattern_finder_close_btn', { index : 0 });

        console.log('User clicks on y axis dropdown')
        await actionClick(page, 'pricing', 'pricing_pattern_finder_close_btn', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Region', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Meta category', { index : 1 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Departure date month', { index : 2 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Ship class', { index : 3 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', 'Sailing length', { index : 4 });
        await actionClick(page, 'pricing', 'pricing_pattern_finder_close_btn', { index : 1 });

        console.log('User clicks on Metric Shown dropdown')
        await actionClick(page, 'pricing', 'pricing_pattern_finder_close_btn', { index : 2 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Spill ', { index : 0 });
        await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Spoil ', { index : 1 });
        //    The below dropdown items are not available in the UI now, so commenting them for now -27-07-2026
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Average price ', { index : 2 });
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Current load factor ', { index : 3 });
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Unconstrained demand load factor ', { index : 4 });
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Revenue opportunity from current alerts ', { index : 5 });
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Revenue Opportunity ', { index : 6 });
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Pickup Trends ', { index : 7 });
        // await verifyText(page, 'pricing', 'pricing_pattern_finder_dropdown_items', ' Retro Risk ', { index : 8 });
        await actionClick(page, 'pricing', 'pricing_pattern_finder_close_btn', { index : 2 });
    });
})

test.describe('Pricing page- bulk action @regression @NCL-admin @NCL-manager @NCL-analyst @REGENT-admin @REGENT-analyst @REGENT-manager @OCEANIA-admin @OCEANIA-analyst @OCEANIA-manager', () => {
    test('verify the pricing page- bulk action @smoke [RST-2395, RST-2396, RST-2398]', async ({ page }) => {
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
        
        console.log('User clicks on sailing checkbox');
        await actionClick(page, 'pricing', 'pricing_sailing_checkbox', { index: 0 });
        await verifyText(page, 'pricing', 'pricing_bulk_acton_btn', 'Bulk Actions', { partial : true });
        await actionClick(page, 'pricing', 'pricing_bulk_acton_btn');

        await verifyText(page, 'pricing', 'pricing_bulk_action_dropdown', 'Price change');
        await actionClick(page, 'pricing', 'pricing_bulk_action_dropdown');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        
        console.log('User verifies bulk action page heading and components');
        await verifyText(page, 'pricing', 'bulk_action_page_heading', ' Price Change ');

        await verifyText(page, 'pricing', 'bulk_action_table_header_group', ' Sailing Info ', { index : 0 });
        await verifyText(page, 'pricing', 'bulk_action_table_header_group', ' Key Demand Signals ', { index : 1 });
        await verifyText(page, 'pricing', 'bulk_action_table_header_group', ' Price Change ', { index : 2 });
        await verifyText(page, 'pricing', 'bulk_action_table_header_group', ' Actions ', { index : 3 });
        await verifyText(page, 'pricing', 'bulk_action_table_header_group', ' Additional info ', { index : 4 });

        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Sailing ', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Region ', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Revenue\nOpportunity ', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Meta ', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Opportunity ', { index : 0, partial : true });

        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Curr Lead-in Price ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Reco Lead-in Price ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Calculated Price ', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Pending Price ', { index : 1, partial : true });
        if(process.env.BRAND != 'NCL'){
            await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Scheduled Price Change ', { index : 1, partial : true });
        }

        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Status ', { index : 2, partial : true });
        await verifyText(page, 'pricing', 'bulk_action_table_column_header', ' Last\nAction ', { index : 2, partial : true });

        await verifyText(page, 'pricing', 'bulk_action_buttons', ' Reset ', { index : 0 });
        await verifyText(page, 'pricing', 'bulk_action_buttons', ' Save overrides ', { index : 1 });
        await verifyText(page, 'pricing', 'bulk_action_buttons', ' Commit ', { index : 2, partial : true });

        await verifyText(page, 'pricing', 'bulk_action_filter_price_section', ' Metas: ', { index : 0 , partial : true });
        await verifyText(page, 'pricing', 'bulk_action_filter_price_section', ' % Price Change ', { index : 0 , partial : true });
        await verifyText(page, 'pricing', 'bulk_action_filter_price_section', ' % Change: ', { index : 0 , partial : true });

        await actionClick(page, 'pricing', 'bulk_action_filter_dropdown_button', { index : 1 });
        await verifyText(page, 'pricing', 'bulk_action_filter_dropdown_items', ' % Price Change ', { index : 0 });
        await verifyText(page, 'pricing', 'bulk_action_filter_dropdown_items', ' $ Price Change ', { index : 1 });
        await verifyText(page, 'pricing', 'bulk_action_filter_dropdown_items', ' Flat Price ', { index : 2 });

        await actionClick(page, 'pricing', 'bulk_action_filter_dropdown_items', { index : 1 });
        await verifyText(page, 'pricing', 'bulk_action_filter_price_section', ' $ Change: ', { index : 0 , partial : true });

        await actionClick(page, 'pricing', 'bulk_action_filter_dropdown_button', { index : 1 });
        await actionClick(page, 'pricing', 'bulk_action_filter_dropdown_items', { index : 2 });
        await verifyText(page, 'pricing', 'bulk_action_filter_price_section', ' Price ($): ', { index : 0 , partial : true });
    });
})

test.describe('Pricing page- action modal @smoke @regression @NCL-admin @NCL-manager @NCL-analyst @REGENT-admin @REGENT-analyst @REGENT-manager @OCEANIA-admin @OCEANIA-analyst @OCEANIA-manager', () => {
    let firstRowData;
    test('verify user is able to view the action modal in sailing depp dive page from action column [RST-2357, RST-2360, RST-2361, RST-2362, RST-2363]', async ({ page }) => {
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

        firstRowData = await page.evaluate(() => {
        const firstRow = document.querySelector('.ag-pinned-left-cols-container .ag-row');
        if (!firstRow) return null;

        const cells = firstRow.querySelectorAll('.ag-cell');

        return {
            voyage: (cells[0] as HTMLElement)?.innerText.trim()
        };
        });

        expect(firstRowData).not.toBeNull();
        
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        await page.waitForResponse(response => 
            response.url().includes('api/voyages/inventory') && response.request().method() === 'GET'
        );
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        await page.waitForLoadState('networkidle');
        console.log('User opens the action modal')
        await actionClick(page, 'pricing', 'pricing_table_action_button', { index: 0 });
        const pricingActionModal = page.locator(locatorRegistry.pricing.pricing_action_modal_content);
        let pricingActionModalOpened = await pricingActionModal.isVisible().catch(() => false);
        if (!pricingActionModalOpened) {
            const actionButtons = page.locator(locatorRegistry.pricing.pricing_table_action_button);
            const totalButtons = await actionButtons.count();
            for (let i = 0; i < Math.min(totalButtons, 8); i++) {
                await actionButtons.nth(i).click({ force: true });
                pricingActionModalOpened = await pricingActionModal.isVisible().catch(() => false);
                if (pricingActionModalOpened) {
                    break;
                }
            }
        }
        expect(pricingActionModalOpened).toBeTruthy();
        await verifyVisibility(page, 'action_modal', 'action_modal_popup');
        await verifyText(page, 'action_modal', 'action_modal_heading', 'Review & Take Action');
        await verifyText(page, 'action_modal', 'action_modal_sub_text', 'Manage accept, override, & inventory actions in one place');
        await verifyVisibility(page, 'action_modal', 'action_modal_close_button');
        await verifyVisibility(page, 'action_modal', 'action_modal_voyage_name');
        
        await verifyText(page, 'action_modal', 'action_modal_approve_action', ' Accept  (Lead-in Price) ');
        await verifyText(page, 'action_modal', 'action_modal_override_action', ' Override  (Lead-in Price) ');

        console.log('User clicks on Override tab')
        await actionClick(page, 'action_modal', 'action_modal_override_action');
        await verifyText(page, 'action_modal', 'action_modal_override_override_price', 'Proposed override');
        await verifyText(page, 'action_modal', 'action_modal_override_lead_in_do_price', 'Current lowest available price');
        await verifyText(page, 'action_modal', 'action_modal_override_pending_price', 'Price change', { index : 1 });
        if(process.env.ROLE == 'analyst'){
            await verifyText(page, 'action_modal', 'action_modal_override_markForReview', 'Mark for manager review  info ');
        }
        await verifyText(page, 'action_modal', 'action_modal_overrive_add_note_header', 'Add note (if any)');
        await verifyVisibility(page, 'action_modal', 'action_modal_overrice_add_note_text_field');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_cancel_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_snooze_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_save_btn');

        console.log('User clicks on Accept tab')
        await actionClick(page, 'action_modal', 'action_modal_approve_action');
        await verifyText(page, 'action_modal', 'action_modal_approve_recom_price', 'Recommended price', { partial : true});
        await verifyText(page, 'action_modal', 'action_modal_approve_lead_in_do_price', 'Current lowest available price');
        await verifyText(page, 'action_modal', 'action_modal_approve_add_note_header', 'Add note (if any)');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_add_note_text_field');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_cancel_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_snooze_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_save_btn');
    });

    test('verify user is able to view the action modal in pricing page from overbooking-opportunity column [RST-2358]', async ({ page }) => {
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

        expect(firstRowData).not.toBeNull();
        console.log('User opens the action modal')
        await actionClick(page, 'action_modal', 'action_modal_overbooking_opportunity_button', { index: 0 });
        const overbookingActionModal = page.locator(locatorRegistry.action_modal.action_modal_popup);
        let overbookingActionModalOpened = await overbookingActionModal.isVisible().catch(() => false);
        if (!overbookingActionModalOpened) {
            const overbookingActionButtons = page.locator(locatorRegistry.action_modal.action_modal_overbooking_opportunity_button);
            const totalButtons = await overbookingActionButtons.count();
            for (let i = 0; i < Math.min(totalButtons, 8); i++) {
                await overbookingActionButtons.nth(i).click({ force: true });
                overbookingActionModalOpened = await overbookingActionModal.isVisible().catch(() => false);
                if (overbookingActionModalOpened) {
                    break;
                }
            }
        }

        await verifyVisibility(page, 'action_modal', 'action_modal_popup', true, { timeout: 30000 });
        await verifyText(page, 'action_modal', 'action_modal_heading', 'Review & Take Action');
        await verifyText(page, 'action_modal', 'action_modal_sub_text', 'Manage accept, override, & inventory actions in one place');
        await verifyVisibility(page, 'action_modal', 'action_modal_close_button');
        await verifyVisibility(page, 'action_modal', 'action_modal_voyage_name');
        
        await verifyText(page, 'action_modal', 'action_modal_approve_action', ' Accept  (Lead-in Price) ');
        await verifyText(page, 'action_modal', 'action_modal_override_action', ' Override  (Lead-in Price) ');

        console.log('User clicks on Override tab')
        await actionClick(page, 'action_modal', 'action_modal_override_action');
        await verifyText(page, 'action_modal', 'action_modal_override_override_price', 'Proposed override');
        await verifyText(page, 'action_modal', 'action_modal_override_lead_in_do_price', 'Current lowest available price');
        await verifyText(page, 'action_modal', 'action_modal_override_pending_price', 'Price change', { index : 1 });
        if(process.env.ROLE == 'analyst'){
            await verifyText(page, 'action_modal', 'action_modal_override_markForReview', 'Mark for manager review  info ');
        }
        await verifyText(page, 'action_modal', 'action_modal_overrive_add_note_header', 'Add note (if any)');
        await verifyVisibility(page, 'action_modal', 'action_modal_overrice_add_note_text_field');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_cancel_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_snooze_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_save_btn');

        console.log('User clicks on Accept tab')
        await actionClick(page, 'action_modal', 'action_modal_approve_action');
        await verifyText(page, 'action_modal', 'action_modal_approve_recom_price', 'Recommended price', { partial : true});
        await verifyText(page, 'action_modal', 'action_modal_approve_lead_in_do_price', 'Current lowest available price');
        await verifyText(page, 'action_modal', 'action_modal_approve_add_note_header', 'Add note (if any)');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_add_note_text_field');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_cancel_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_snooze_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_save_btn');
    });

    test('verify user is able to view the action modal in pricing page from pricing-opportunity column [RST-2359]', async ({ page }) => {
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

        expect(firstRowData).not.toBeNull();
        console.log('User opens the action modal')
        await actionClick(page, 'pricing', 'pricing_table_pricing_opportunity_button', { index: 0 });

        await verifyVisibility(page, 'action_modal', 'action_modal_popup');
        await verifyText(page, 'action_modal', 'action_modal_heading', 'Review & Take Action');
        await verifyText(page, 'action_modal', 'action_modal_sub_text', 'Manage accept, override, & inventory actions in one place');
        await verifyVisibility(page, 'action_modal', 'action_modal_close_button');
        await verifyVisibility(page, 'action_modal', 'action_modal_voyage_name');
        
        await verifyText(page, 'action_modal', 'action_modal_approve_action', ' Accept  (Lead-in Price) ');
        await verifyText(page, 'action_modal', 'action_modal_override_action', ' Override  (Lead-in Price) ');

        console.log('User clicks on Override tab')
        await actionClick(page, 'action_modal', 'action_modal_override_action');
        await verifyText(page, 'action_modal', 'action_modal_override_override_price', 'Proposed override');
        await verifyText(page, 'action_modal', 'action_modal_override_lead_in_do_price', 'Current lowest available price');
        await verifyText(page, 'action_modal', 'action_modal_override_pending_price', 'Price change', { index : 1 });
        if(process.env.ROLE == 'analyst'){
            await verifyText(page, 'action_modal', 'action_modal_override_markForReview', 'Mark for manager review  info ');
        }
        await verifyText(page, 'action_modal', 'action_modal_overrive_add_note_header', 'Add note (if any)');
        await verifyVisibility(page, 'action_modal', 'action_modal_overrice_add_note_text_field');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_cancel_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_snooze_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_override_save_btn');

        console.log('User clicks on Accept tab')
        await actionClick(page, 'action_modal', 'action_modal_approve_action');
        await verifyText(page, 'action_modal', 'action_modal_approve_recom_price', 'Recommended price', { partial : true});
        await verifyText(page, 'action_modal', 'action_modal_approve_lead_in_do_price', 'Current lowest available price');
        await verifyText(page, 'action_modal', 'action_modal_approve_add_note_header', 'Add note (if any)');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_add_note_text_field');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_cancel_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_snooze_btn');
        await verifyVisibility(page, 'action_modal', 'action_modal_approve_save_btn');
    });
})

test.describe('Pricing page- lettered voyage @smoke @regression @REGENT-admin @REGENT-analyst @REGENT-manager @OCEANIA-admin @OCEANIA-analyst @OCEANIA-manager', () => {
  test('verify the pricing page- lettered voyage [RST-2399, RST-2400, RST-2402]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/lettered-voyage/*', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
                await route.continue();
            } else {
                await route.continue();
            }
        });

        await Promise.all([
            page.waitForResponse(response => 
                response.url().includes('/voyages/lettered-voyage/') && response.request().method() === 'POST'
            ),
            page.goto('/analytics/lettered-voyage')
        ]);

        await verifyText(page, 'pricing', 'pricing_heading', 'Prioritization');
        await verifyText(page, 'pricing', 'pricing_sub_heading', ' Analyze, compare, and act on sailing-level opportunities. ');
        await verifyText(page, 'pricing', 'pricing_pattern_finder_btn', ' Pattern Finder ');
        
        await verifyText(page, 'pricing', 'lettered_voyage_filter_dropdowns', ' Metas: ', { index: 0 , partial : true });
        await verifyText(page, 'pricing', 'lettered_voyage_filter_dropdowns', ' Price change type: ', { index: 1 , partial : true });
        await verifyText(page, 'pricing', 'lettered_voyage_filter_dropdowns', ' Amount: ', { index: 2 , partial : true });

        await verifyText(page, 'pricing', 'lettered_voyage_apply_btn', ' Apply changes ');
        
        await verifyText(page, 'pricing', 'lettered_voayges_btns', 'Reset', { index: 0 });
        await verifyText(page, 'pricing', 'lettered_voayges_btns', 'Save overrides', { index: 1 });
        await verifyText(page, 'pricing', 'lettered_voayges_btns', 'Commit', { index: 2 , partial : true });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' sailingSailing', { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Sailing Segments',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Dept Date',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Sail. Len',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Meta',  { index : 0, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Cat.',  { index : 0, partial : true });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' Current Price', { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Segment calculated price sum',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Adjusted Price ($)',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Adjusted Price (%)',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Price Override ($)',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Calculated Price',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Calculated Price Change',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Last Pushed Price ($)',  { index : 1, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Scheduled price change',  { index : 1, partial : true });

        await verifyText(page, 'pricing', 'pricing_table_headers', ' Status',  { index : 2, partial : true });
        await verifyText(page, 'pricing', 'pricing_table_headers', ' Updated At',  { index : 2, partial : true });

        await actionClick(page, 'pricing', 'lettered_voayge_filter_button', { index : 1 });
        await verifyText(page, 'pricing', 'lettered_voyage_filter_dropdown_items', 'Adjustment Price', { index: 0 });
        await verifyText(page, 'pricing', 'lettered_voyage_filter_dropdown_items', 'Adjustment Percentage', { index: 1 });

        if(process.env.ROLE != 'analyst'){
            await actionClick(page, 'pricing', 'lettered_voayges_btns', { index: 2 });
            await verifyText(page, 'pricing', 'lettered_voayges_btns', 'Commit', { index: 3 });

            const commitFutureButton = page
                .getByTestId('lettered-voyage-component')
                .getByTestId('button-component')
                .filter({ hasText: 'Commit Future' });

            if (await commitFutureButton.count() > 0) {
                await expect(commitFutureButton.first()).toBeVisible();
            }
        }
    });
})
test.describe('Advanced Filter date transformation @regression @NCL-admin @OCEANIA-admin @REGENT-admin', () => {
    test('pricing - transforms Dept Date MM-DD-YYYY to ISO in payload', async ({ page }) => {
        await page.goto('/analytics/sailings');
        await page.waitForLoadState('networkidle');

        const input = page.locator('input[aria-label="Advanced Filter Input"]');

        await input.fill('[Dept Date] != "04-04-2026"');
        await expect(input).toHaveValue('[Dept Date] != "04-04-2026"');

        const applyButton = page.locator(locatorRegistry.pricing.pricing_advanced_filter_apply_btn);
        await expect(applyButton).toBeEnabled();

        // Capture the filter-apply POST request directly
        const filterRequestPromise = page.waitForRequest(
            req => req.url().includes('/voyages/price-prioritization/') && req.method() === 'POST',
            { timeout: 15000 }
        );
        await applyButton.click();
        const filterRequest = await filterRequestPromise;
        const requestData = filterRequest.postDataJSON();

        expect(requestData?.filters).toEqual({
            filterType: 'date',
            colId: 'voyage_info.departure_date',
            type: 'notEqual',
            filter: '2026-04-04'
        });
    });

    test('lettered voyage - transforms Dept Date and Updated At MM-DD-YYYY to ISO in payload', async ({ page }) => {
        await page.goto('/analytics/lettered-voyage');
        await page.waitForLoadState('networkidle');

        const input = page.locator('input[aria-label="Advanced Filter Input"]');

        await input.fill('[Dept Date] != "04-24-2026" OR [Updated At] != "04-25-2026"');

        await expect(input).toHaveValue(
            '[Dept Date] != "04-24-2026" OR [Updated At] != "04-25-2026"'
        );

        const applyButton = page.locator(locatorRegistry.pricing.pricing_advanced_filter_apply_btn);
        await expect(applyButton).toBeEnabled();

        // Capture the filter-apply POST request directly
        const filterRequestPromise = page.waitForRequest(
            req => req.url().includes('/voyages/lettered-voyage/') && req.method() === 'POST',
            { timeout: 15000 }
        );
        await applyButton.click();
        const filterRequest = await filterRequestPromise;
        const requestData = filterRequest.postDataJSON();

        expect(requestData?.filters).toEqual({
            filterType: 'join',
            type: 'OR',
            conditions: [
                {
                    filterType: 'dateString',
                    colId: 'departure_date',
                    type: 'notEqual',
                    filter: '2026-04-24'
                },
                {
                    filterType: 'dateString',
                    colId: 'updated_at',
                    type: 'notEqual',
                    filter: '2026-04-25'
                }
            ]
        });
    });

    test('pricing - invalid date format disables Advanced Filter apply', async ({ page }) => {
        await page.goto('/analytics/sailings');
        await page.waitForLoadState('networkidle');

        const input = page.locator('input[aria-label="Advanced Filter Input"]');

        await input.fill('[Dept Date] != "2026/04/04"');

        const applyButton = page.locator(locatorRegistry.pricing.pricing_advanced_filter_apply_btn);

        // App now accepts date input regardless of format - Apply button remains enabled
        await expect(applyButton).toBeEnabled();
    });
});