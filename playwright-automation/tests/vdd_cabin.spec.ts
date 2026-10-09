import { test, expect } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, verifyUrl, verifyAttribute, writeTextInLocator, verifyAllTexts } from '../utils/actions';
import { locatorRegistry } from '../locators';

test.describe('Voyage deep dive- Voyage Inventory- Cabin @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
    test('Verify the grid headers for the VI- cabin @smoke [RST-2412, RST-2413]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /category info/i, { index : 0, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /booking info/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /gty info/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /price change/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /performance metrics/i, { index : 1, partial : true });
        if(process.env.BRAND != 'NCL'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /group metrics/i, { index : 1, partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /actions/i, { index : 2, partial : true });

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'categoryMeta', { index : 0 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'Cabin Category', { index : 0 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', ' Curr\nSelling Status', { index : 0 , partial : true });

        if(process.env.BRAND != 'NCL'){
            const expectedHeaders = [
                'Gross Cabins Bkd / SellableCapacity',
                'Net Cabins Berthed No Gty/ Sellable Capacity',
                'WLCabins',
                'Gross Bookings last7 days',
                'Gross Bookings last14 days',
                'Curr GtyLimit',
                'RecoGty Limit',
                'Limit \nOverride',
                'CalculatedLimit',
                'PendingGuarantee Limit',
                'ResidualGross Capacity',
                'ResidualNet Capacity',
                'CancelBuffer',
                'OversellingBuffer',
                'Pickup\nFIT',
                'Curr\nPrice',
                'Reco\nprice',
                'Reco\nprice chan',
                'RMS\ntoggle ladd',
                'Reco\nMultiplier',
                'Multiplier\nOverride',
                'Price\noverride',
                'Calculated\nPrice',
                'Calculated\nPrice Ladder',
                'Calculated\nPrice Change',
                'Last\nPrice Change',
                'Pending\nPrice',
                'Avg FIT Bkd\nPrice Cumulative (Tariff)',
                'GroupsBlocked',
                'Hotlist',
                'GroupsSpecial Agency'
                ];
            for (const header of expectedHeaders) {
                await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 1 , partial : true });
            }
        }else{
            const expectedHeaders = [
                'Gross Cabins Bkd / SellableCapacity',
                'Net Cabins Berthed No Gty/ Sellable Capacity',
                'Gross Bookings last7 days',
                'Gross Bookings last14 days',
                'Curr GtyLimit',
                'RecoSelling Limit',
                'Limit \nOverride',
                'CalculatedLimit',
                'PendingGuarantee Limit',
                'CancelBuffer',
                'OversellingBuffer',
                'Pickup\nFIT',
                'Curr\nPrice',
                'Reco\nprice',
                'Reco\nprice chan',
                'RMS\ntoggle ladd',
                'Reco\nMultiplier',
                'Multiplier\nOverride',
                'Price\noverride',
                'Calculated\nPrice',
                'Calculated\nPrice Ladder',
                'Calculated\nPrice Change',
                'Last\nPrice Change',
                'Pending\nPrice',
                'Avg FIT Bkd\nPrice Cumulative (Tariff)',
                ];
            for (const header of expectedHeaders) {
                await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 1 , partial : true });
            }
        }

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

        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Reset ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Save changes ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Commit ', { index : 2, partial : true });
    });

    test('Verify user is able to input and reset the data in VI- cabin [RST-2414, RST-2415]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;

        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');
        
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /category info/i, { index : 0, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /booking info/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /gty info/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /price change/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /performance metrics/i, { index : 1, partial : true });
        if(process.env.BRAND != 'NCL'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /group metrics/i, { index : 1, partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /actions/i, { index : 2, partial : true });
        
        if(process.env.BRAND == 'REGENT'){
            const pent_multiplier = await page.locator('[row-id="PEN_THO"] [col-id="multiplier_override"] input').first().inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_PENT_multiplierOverride', ' 1.2 ', { index : 0 });
            await page.keyboard.press('Enter');
            const pent_exactPrice = await page.locator('[row-id="PEN_THO"] [col-id="exact_price_override"] input').nth(1).inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_PENT_exactPriceOverride', ' 10000 ', { index : 1 });
            await page.keyboard.press('Enter');
            
            const pent_multiplier_after_enter = await page.locator('[row-id="PEN_THO"] [col-id="multiplier_override"] input').first().inputValue();
            expect(pent_multiplier_after_enter).toContain(pent_multiplier);
            const pent_exactPrice_after_enter = await page.locator('[row-id="PEN_THO"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(pent_exactPrice_after_enter).toContain(pent_exactPrice);

            console.log('User clicks on reset button');
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', { index : 0 });

            const pent_multiplier_after_reset = await page.locator('[row-id="PEN_THO"] [col-id="multiplier_override"] input').first().inputValue();
            expect(pent_multiplier_after_reset).toContain(pent_multiplier);
            const pent_exactPrice_after_reset = await page.locator('[row-id="PEN_THO"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(pent_exactPrice_after_reset).toContain(pent_exactPrice);
        }else{
            console.log('User edits Balcony meta- multipler override');
            const bal_multiplier = await page.locator('[row-id="BAL_CON"] [col-id="multiplier_override"] input').first().inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_BAL_multiplierOverride', ' 1.2 ', { index : 0 });
            await page.keyboard.press('Enter');
            const bal_exactPrice = await page.locator('[row-id="BAL_CON"] [col-id="exact_price_override"] input').nth(1).inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_BAL_exactPriceOverride', ' 10000 ', { index : 1 });
            await page.keyboard.press('Enter');
            
            const bal_multiplier_after_enter = await page.locator('[row-id="BAL_CON"] [col-id="multiplier_override"] input').first().inputValue();
            expect(bal_multiplier_after_enter.trim()).toContain('1.2');
            const bal_exactPrice_after_enter = await page.locator('[row-id="BAL_CON"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(bal_exactPrice_after_enter.trim()).toContain('10000');

            console.log('User clicks on reset button');
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', { index : 0 });

            const bal_multiplier_after_reset = await page.locator('[row-id="BAL_CON"] [col-id="multiplier_override"] input').first().inputValue();
            expect(bal_multiplier_after_reset).toContain(bal_multiplier);
            const bal_exactPrice_after_reset = await page.locator('[row-id="BAL_CON"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(bal_exactPrice_after_reset).toContain(bal_exactPrice);
        }  
    });

    test('Verify user is able to open action modal in VI- cabin @smoke [RST-2416]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            await route.continue();
        });

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        if(process.env.BRAND == 'REGENT'){
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_PENT_review', { index : 0 });
        }else{
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_BAL_review', { index : 0 });
        }

        console.log('User opens the action modal')
        const viCabinActionModal = page.locator(locatorRegistry.action_modal.action_modal_popup);
        let viCabinActionModalOpened = await viCabinActionModal.isVisible().catch(() => false);
        if (!viCabinActionModalOpened) {
            const actionButtons = page.locator(locatorRegistry.action_modal.action_modal_actions_column_button);
            const totalButtons = await actionButtons.count();
            for (let i = 0; i < Math.min(totalButtons, 8); i++) {
                await actionButtons.nth(i).click({ force: true });
                viCabinActionModalOpened = await viCabinActionModal.isVisible().catch(() => false);
                if (viCabinActionModalOpened) {
                    break;
                }
            }
        }
        await verifyVisibility(page, 'action_modal', 'action_modal_popup');
        await verifyText(page, 'action_modal', 'action_modal_heading', 'Review & Take Action');
        await verifyText(page, 'action_modal', 'action_modal_sub_text', 'Manage accept, override, & inventory actions in one place');
        await verifyVisibility(page, 'action_modal', 'action_modal_close_button');
        
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

test.describe('Voyage deep dive- Meta- Cabin @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
    test('Verify the grid headers for the Meta- cabin @smoke [RST-2417, RST-2418]', async ({ page }) => {
        test.setTimeout(180000);

        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            await route.continue();
        });

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
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

        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { timeout: 30000 });

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /category info/i, { index : 0, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /booking info/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /gty info/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /price change/i, { index : 1, partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /performance metrics/i, { index : 1, partial : true });
        if(process.env.BRAND != 'NCL'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /group metrics/i, { index : 1, partial : true });
        }
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', /actions/i, { index : 2, partial : true });

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'categoryMeta', { index : 0 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', 'Cabin Category', { index : 0 , partial : true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', ' Curr\nSelling Status', { index : 0 , partial : true });

        if(process.env.BRAND != 'NCL'){
            const expectedHeaders = [
                'Gross Cabins Bkd / SellableCapacity',
                'Net Cabins Berthed No Gty/ Sellable Capacity',
                'WLCabins',
                'Gross Bookings last7 days',
                'Gross Bookings last14 days',
                'Curr GtyLimit',
                'RecoGty Limit',
                'Limit \nOverride',
                'CalculatedLimit',
                'PendingGuarantee Limit',
                'ResidualGross Capacity',
                'ResidualNet Capacity',
                'CancelBuffer',
                'OversellingBuffer',
                'Pickup\nFIT',
                'Curr\nPrice',
                'Reco\nprice',
                'Reco\nprice chan',
                'RMS\ntoggle ladd',
                'Reco\nMultiplier',
                'Multiplier\nOverride',
                'Price\noverride',
                'Calculated\nPrice',
                'Calculated\nPrice Ladder',
                'Calculated\nPrice Change',
                'Last\nPrice Change',
                'Pending\nPrice',
                'Avg FIT Bkd\nPrice Cumulative (Tariff)',
                'GroupsBlocked',
                'Hotlist',
                'GroupsSpecial Agency'
                ];
            for (const header of expectedHeaders) {
                await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 1 , partial : true });
            }
        }else{
            const expectedHeaders = [
                'Gross Cabins Bkd / SellableCapacity',
                'Net Cabins Berthed No Gty/ Sellable Capacity',
                'Gross Bookings last7 days',
                'Gross Bookings last14 days',
                'Curr GtyLimit',
                'RecoSelling Limit',
                'Limit \nOverride',
                'CalculatedLimit',
                'PendingGuarantee Limit',
                'CancelBuffer',
                'OversellingBuffer',
                'Pickup\nFIT',
                'Curr\nPrice',
                'Reco\nprice',
                'Reco\nprice chan',
                'RMS\ntoggle ladd',
                'Reco\nMultiplier',
                'Multiplier\nOverride',
                'Price\noverride',
                'Calculated\nPrice',
                'Calculated\nPrice Ladder',
                'Calculated\nPrice Change',
                'Last\nPrice Change',
                'Pending\nPrice',
                'Avg FIT Bkd\nPrice Cumulative (Tariff)',
                ];
            for (const header of expectedHeaders) {
                await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_headers', header, { index : 1 , partial : true });
            }
        }

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

        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Reset ', { index : 0 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Save changes ', { index : 1 });
        await verifyText(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', ' Commit ', { index : 2, partial : true });
    });

    test('Verify user is able to input and reset the data in meta- cabin [RST-2419, RST-2420]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
            await verifyUrl(page, '/penthouse/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Category Info', { index : 0 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Booking Info', { index : 1 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', ' Actions', { index : 2 , partial : true });
            
            console.log('User edits Penthouse meta- multipler override');
            
            const pent_multiplier = await page.locator('[row-id="PEN_THO"] [col-id="multiplier_override"] input').first().inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_PENT_multiplierOverride', ' 1.2 ', { index : 0 });
            await page.keyboard.press('Enter');
            const pent_exactPrice = await page.locator('[row-id="PEN_THO"] [col-id="exact_price_override"] input').nth(1).inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_PENT_exactPriceOverride', ' 10000 ', { index : 1 });
            await page.keyboard.press('Enter');
            
            const pent_multiplier_after_enter = await page.locator('[row-id="PEN_THO"] [col-id="multiplier_override"] input').first().inputValue();
            expect(pent_multiplier_after_enter).toContain(pent_multiplier);
            const pent_exactPrice_after_enter = await page.locator('[row-id="PEN_THO"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(pent_exactPrice_after_enter).toContain(pent_exactPrice);

            console.log('User clicks on reset button');
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', { index : 0 });

            const pent_multiplier_after_reset = await page.locator('[row-id="PEN_THO"] [col-id="multiplier_override"] input').first().inputValue();
            expect(pent_multiplier_after_reset).toContain(pent_multiplier);
            const pent_exactPrice_after_reset = await page.locator('[row-id="PEN_THO"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(pent_exactPrice_after_reset).toContain(pent_exactPrice);
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
            await verifyUrl(page, '/balcony/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
            await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { timeout: 30000 });
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Category Info', { index : 0 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Booking Info', { index : 1 , partial : true });
            await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', ' Actions', { index : 2 , partial : true });
            
            console.log('User edits Balcony meta- multipler override');
            const bal_multiplier = await page.locator('[row-id="BAL_CON"] [col-id="multiplier_override"] input').first().inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_BAL_multiplierOverride', ' 1.2 ', { index : 0 });
            await page.keyboard.press('Enter');
            const bal_exactPrice = await page.locator('[row-id="BAL_CON"] [col-id="exact_price_override"] input').nth(1).inputValue();
            await writeTextInLocator(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_BAL_exactPriceOverride', ' 10000 ', { index : 1 });
            await page.keyboard.press('Enter');
            
            const bal_multiplier_after_enter = await page.locator('[row-id="BAL_CON"] [col-id="multiplier_override"] input').first().inputValue();
            expect(bal_multiplier_after_enter.trim()).toContain('1.2');
            const bal_exactPrice_after_enter = await page.locator('[row-id="BAL_CON"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(bal_exactPrice_after_enter.trim()).toContain('10000');

            console.log('User clicks on reset button');
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_btns', { index : 0 });

            const bal_multiplier_after_reset = await page.locator('[row-id="BAL_CON"] [col-id="multiplier_override"] input').first().inputValue();
            expect(bal_multiplier_after_reset).toContain(bal_multiplier);
            const bal_exactPrice_after_reset = await page.locator('[row-id="BAL_CON"] [col-id="exact_price_override"] input').nth(1).inputValue();
            expect(bal_exactPrice_after_reset).toContain(bal_exactPrice);
        }    
    });

    test('Verify user is able to open action modal in meta- cabin @smoke [RST-2421]', async ({ page }) => {
        test.setTimeout(180000);

        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
            await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { timeout: 30000 });
            await verifyUrl(page, '/penthouse/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_PENT_review', { index : 0 });
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
            await verifyVisibility(page, 'voyage_deep_dive', 'vdd_loader_overlay', false, { timeout: 30000 });
            await verifyUrl(page, '/balcony/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
            await actionClick(page, 'voyage_deep_dive', 'vdd_voyage_inventory_cabin_BAL_review', { index : 0 });
        }
        
        console.log('User opens the action modal')
        const metaCabinActionModal = page.locator(locatorRegistry.action_modal.action_modal_popup);
        let metaCabinActionModalOpened = await metaCabinActionModal.isVisible().catch(() => false);
        if (!metaCabinActionModalOpened) {
            const actionButtons = page.locator(locatorRegistry.action_modal.action_modal_actions_column_button);
            const totalButtons = await actionButtons.count();
            for (let i = 0; i < Math.min(totalButtons, 8); i++) {
                await actionButtons.nth(i).click({ force: true });
                metaCabinActionModalOpened = await metaCabinActionModal.isVisible().catch(() => false);
                if (metaCabinActionModalOpened) {
                    break;
                }
            }
        }
        await verifyVisibility(page, 'action_modal', 'action_modal_popup', true);
        await verifyText(page, 'action_modal', 'action_modal_heading', 'Review & Take Action');
        await verifyText(page, 'action_modal', 'action_modal_sub_text', 'Manage accept, override, & inventory actions in one place');
        await verifyVisibility(page, 'action_modal', 'action_modal_close_button');
        
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

    test('Verify user is able to see the graphs in meta- cabin [RST-2422, RST-2423, RST-2424, RST-2425]', async ({ page }) => {
        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/price-prioritization/**', async (route, request) => {
            if (request.method() === 'POST') {
                console.log('➡️ POST Request:', request.method(), request.url());
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
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        const pricingResponsePromise = page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await page.goto('/analytics/sailings');
        await pricingResponsePromise;
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User opens the voyage deep dive page')
        const voyageInfoPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/voyage-info/') && response.request().method() === 'GET'
        );
        const inventoryPromise = page.waitForResponse(response => 
            response.url().includes('/api/voyages/inventory/') && response.request().method() === 'GET'
        );
        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await voyageInfoPromise;
        await inventoryPromise;
        await page.waitForURL('**/deep-dive/**');
        console.log('User verifies the pricing page url');
        await verifyUrl(page, '/deep-dive/');
        await verifyUrl(page, '/voyage-inventory/cabin');

        if(process.env.BRAND == 'REGENT'){
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse', ' Penthouse ', { partial: true});
            const cabinChartsPromise = page.waitForResponse(response => 
                response.url().includes('/api/voyages/cabin-charts/') && response.request().method() === 'GET'
            );
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_penthouse');
            await cabinChartsPromise;
            await verifyUrl(page, '/penthouse/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Penthouse | ');
        }else{
            await verifyText(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony', ' Balcony ', { partial: true});
            const cabinChartsPromise = page.waitForResponse(response => 
                response.url().includes('/api/voyages/cabin-charts/') && response.request().method() === 'GET'
            );
            await actionClick(page, 'voyage_deep_dive', 'vdd_meta_alert_tab_balcony');
            await cabinChartsPromise;
            await verifyUrl(page, '/balcony/cabin');
            await verifyText(page, 'voyage_deep_dive', 'vdd_page_heading', '  Balcony | ');
        }
        await page.waitForLoadState('networkidle');

        console.log('User verifies the graph header and legends');
        // The occupancy and price charts were merged into a single canvas, so there
        // is now one title and one legend carrying both sets of series.
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_line_chart_title', '% Fill of FIT inventory * / Lead-in DO price history', { index : 0 });

        // Wait for chart legends to render
        await verifyVisibility(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', true, { index: 0, timeout: 20000 });

        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Actual occupancy', { index : 0, partial: true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Reference occupancy', { index : 0, partial: true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Unconstrained demand forecast', { index : 0, partial: true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Target demand curve', { index : 0, partial: true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Capacity fill target (%) after current oversell ', { index : 0, partial: true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Capacity fill target (%) after recommended oversell ', { index : 0, partial: true });

        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Actual price', { index : 0, partial: true });
        await verifyText(page, 'voyage_deep_dive', 'vdd_meta_cabin_chart_legend', 'Optimized price', { index : 0, partial: true });
    });
})
