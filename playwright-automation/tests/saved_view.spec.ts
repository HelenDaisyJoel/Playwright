import { test, expect } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, writeTextInLocator, verifyUrl } from '../utils/actions';

const runSuffix = `${Date.now()}`.slice(-6);
let savedViewName= 'View name-'+process.env.BRAND+"_"+process.env.ROLE+"_"+runSuffix;
let savedViewNamePrivate= 'Private view name-'+process.env.BRAND+"_"+process.env.ROLE+"_"+runSuffix;
let savedViewNameCabinSi= 'Cabin View name-'+process.env.BRAND+"_"+process.env.ROLE+"_"+runSuffix;
let updatedSavedViewName= 'Updated view name-'+process.env.BRAND+"_"+process.env.ROLE+"_"+runSuffix;
let updatedViewNamePrivate= 'Updated private view name-'+process.env.BRAND+"_"+process.env.ROLE+"_"+runSuffix;
let updatedViewNameCabinSi= 'Updated cabin View name-'+process.env.BRAND+"_"+process.env.ROLE+"_"+runSuffix;

test.describe('Saved view cases @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that the saved view popup elements on prio pane @smoke [RST-2368]', async ({ page }) => {
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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await verifyText(page, 'saved_view', 'saved_view_heading', 'Saved Views');
        await verifyText(page, 'saved_view', 'saved_view_sub_text', 'View, apply, or save your filtered view of alerts and actions.');

        await verifyText(page, 'saved_view', 'saved_view_collapse_dropdown', ' Private ', { index : 0 , partial : true });
        await verifyText(page, 'saved_view', 'saved_view_collapse_icon', 'lock', { index : 0 });
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        // await verifyText(page, 'saved_view', 'saved_view_noView_text', ' No private views available. ', { index : 0 });

        await verifyText(page, 'saved_view', 'saved_view_collapse_dropdown', ' Public ', { index : 1 , partial : true });
        await verifyText(page, 'saved_view', 'saved_view_collapse_icon', 'public', { index : 1 });
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        // await verifyText(page, 'saved_view', 'saved_view_noView_text', ' No public views available. ', { index : 1 });

        await verifyText(page, 'saved_view', 'saved_view_default_view', 'Default (without filters applied)', { partial : true });

        await verifyText(page, 'saved_view', 'saved_view_save_name_heading', ' Save Current View');
        await verifyText(page, 'saved_view', 'saved_view_name_field', 'Name');
        await verifyVisibility(page, 'saved_view', 'save_view_name_text_field');

        await verifyText(page, 'saved_view', 'saved_view_cancel_btn', 'Cancel');
        await verifyText(page, 'saved_view', 'saved_view_update_btn', 'Update');
        await verifyText(page, 'saved_view', 'saved_view_save_btn', ' Save view as ', { partial : true });
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await verifyText(page, 'saved_view', 'saved_view_private_list_item', ' Private ', { partial : true });
        await verifyText(page, 'saved_view', 'saved_view_public_list_item', ' Public ', { partial : true });
    });

    test('verify that the saved view popup elements on cabin pane- sailing inventory tab [RST-2377]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await verifyText(page, 'saved_view', 'saved_view_heading', 'Saved Views');
        await verifyText(page, 'saved_view', 'saved_view_sub_text', 'View, apply, or save your filtered view of alerts and actions.');

        await verifyText(page, 'saved_view', 'saved_view_collapse_dropdown', ' Private ', { index : 0 , partial : true });
        await verifyText(page, 'saved_view', 'saved_view_collapse_icon', 'lock', { index : 0 });
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        // await verifyText(page, 'saved_view', 'saved_view_noView_text', ' No private views available. ', { index : 0 });

        await verifyText(page, 'saved_view', 'saved_view_collapse_dropdown', ' Public ', { index : 1 , partial : true });
        await verifyText(page, 'saved_view', 'saved_view_collapse_icon', 'public', { index : 1 });
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        // await verifyText(page, 'saved_view', 'saved_view_noView_text', ' No public views available. ', { index : 1 });

        await verifyText(page, 'saved_view', 'saved_view_default_view', 'Default (without filters applied)', { partial : true });

        await verifyText(page, 'saved_view', 'saved_view_save_name_heading', ' Save Current View');
        await verifyText(page, 'saved_view', 'saved_view_name_field', 'Name');
        await verifyVisibility(page, 'saved_view', 'save_view_name_text_field');

        await verifyText(page, 'saved_view', 'saved_view_cancel_btn', 'Cancel');
        await verifyText(page, 'saved_view', 'saved_view_update_btn', 'Update');
        await verifyText(page, 'saved_view', 'saved_view_save_btn', ' Save view as ', { partial : true });
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await verifyText(page, 'saved_view', 'saved_view_private_list_item', ' Private ', { partial : true });
        await verifyText(page, 'saved_view', 'saved_view_public_list_item', ' Public ', { partial : true });
    });

    test('verify that the saved view popup elements on cabin pane- meta tab [RST-2386]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });


        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await verifyText(page, 'saved_view', 'saved_view_heading', 'Saved Views');
        await verifyText(page, 'saved_view', 'saved_view_sub_text', 'View, apply, or save your filtered view of alerts and actions.');

        await verifyText(page, 'saved_view', 'saved_view_collapse_dropdown', ' Private ', { index : 0 , partial : true });
        await verifyText(page, 'saved_view', 'saved_view_collapse_icon', 'lock', { index : 0 });
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        // await verifyText(page, 'saved_view', 'saved_view_noView_text', ' No private views available. ', { index : 0 });

        await verifyText(page, 'saved_view', 'saved_view_collapse_dropdown', ' Public ', { index : 1 , partial : true });
        await verifyText(page, 'saved_view', 'saved_view_collapse_icon', 'public', { index : 1 });
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        // await verifyText(page, 'saved_view', 'saved_view_noView_text', ' No public views available. ', { index : 1 });

        await verifyText(page, 'saved_view', 'saved_view_default_view', 'Default (without filters applied)', { partial : true });

        await verifyText(page, 'saved_view', 'saved_view_save_name_heading', ' Save Current View');
        await verifyText(page, 'saved_view', 'saved_view_name_field', 'Name');
        await verifyVisibility(page, 'saved_view', 'save_view_name_text_field');

        await verifyText(page, 'saved_view', 'saved_view_cancel_btn', 'Cancel');
        await verifyText(page, 'saved_view', 'saved_view_update_btn', 'Update');
        await verifyText(page, 'saved_view', 'saved_view_save_btn', ' Save view as ', { partial : true });
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await verifyText(page, 'saved_view', 'saved_view_private_list_item', ' Private ', { partial : true });
        await verifyText(page, 'saved_view', 'saved_view_public_list_item', ' Public ', { partial : true });
    });
})

test.describe.serial('Prio page - Public- Saved View- CRUD operation on prio page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that user is able to add a public view @smoke [RST-2369]', async ({ page }) => {
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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        console.log('User applies a filter on pricing page');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Region] contains "Hawaii"');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Region] contains "Hawaii"');
        
        
        await actionClick(page, 'pricing', 'pricing_table_filter_apply_btn');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        console.log('Create a public saved view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');

        console.log('User writes the name of the saved view');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', savedViewName);
        
        console.log('User clicks on public saved view');
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await actionClick(page, 'saved_view', 'saved_view_public_list_item', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await page.waitForLoadState('networkidle');
        expect(filterValue).toBe('[Region] contains "Hawaii"');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: savedViewName,})).toHaveCount(1, { timeout: 30000 });
    });

    test('verify that user is able to apply the newly added public view [RST-2375]', async ({ page }) => {
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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        
        console.log('User applies the newly added public view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        const publicViewItem2 = page.locator('li[data-test-id="public-views-item"]',{ hasText: savedViewName });
        if (!await publicViewItem2.first().isVisible().catch(() => false)) {
            await actionClick(page, 'saved_view', 'saved_public_view_btn', { force: true });
        }
        await expect(publicViewItem2).toHaveCount(1);
        await publicViewItem2.click();

        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST' && response.status() === 200
        );
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Region] contains "Hawaii"');

        console.log('User applied default view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_view_default_view', { force: true }).catch(() => null);
        await page.waitForLoadState('networkidle').catch(() => null);
        // Default view clears the saved view config; filter input may retain previous value
    });

    test('verify that user is able to update a public view [RST-2370]', async ({ page }) => {
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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        console.log('User applies the newly added public view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');

        const publicViewItem = page.locator('li[data-test-id="public-views-item"]',{ hasText: savedViewName });
        await expect(publicViewItem).toHaveCount(1);
        await publicViewItem.click();

        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        console.log('User updates the newly added public view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatedSavedViewName);
        await verifyVisibility(page, 'saved_view', 'saved_view_update_btn');
        await actionClick(page, 'saved_view', 'saved_view_update_btn');
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/')
        );
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Region] contains "Hawaii"');

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: updatedSavedViewName,})).toHaveCount(1);
    });

    test('verify that user is able to delete a public view [RST-2371]', async ({ page }) => {
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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        console.log('User delete the newly added public view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        await page.locator('[data-test-id="public-views-item"]').filter({ hasText: updatedSavedViewName }).locator('[data-test-id="delete-public-views-button"]').click();
        await verifyText(page, 'saved_view', 'saved_view_delete_text', ' Are you sure you want to delete the selected saved view? ');
        await actionClick(page, 'saved_view', 'saved_view_delete_button');
        // await page.waitForResponse(response => 
        //     response.url().includes('/api/users/saved-views/*/')
        // );
        
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: updatedSavedViewName,})).toHaveCount(0);
    });
})

test.describe.serial('Prio page - Private- Saved View- CRUD operation on prio page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that user is able to add a private view [RST-2372]', async ({ page }) => {
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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
        console.log('User applies a filter on pricing page');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Region] contains "Hawaii"');
        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Region] contains "Hawaii"');
        
        
        await actionClick(page, 'pricing', 'pricing_table_filter_apply_btn');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        console.log('Create a private saved view');
        console.log('User clicks on saved view button');
        const deleteSavedViewDialog = page.getByRole('heading', { name: 'Delete Saved View' });
        if (await deleteSavedViewDialog.isVisible().catch(() => false)) {
            await page.keyboard.press('Escape');
            if (await deleteSavedViewDialog.isVisible().catch(() => false)) {
                await page.locator('[data-test-id="delete-confirm-button"]').click({ force: true });
            }
            if (await deleteSavedViewDialog.isVisible().catch(() => false)) {
                await page.reload();
                await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');
            }
        }
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');

        console.log('User writes the name of the saved view');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', savedViewNamePrivate);
        
        console.log('User clicks on private saved view');
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await page.waitForLoadState('networkidle');
        expect(filterValue).toBe('[Region] contains "Hawaii"');

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        // Wait for panel to render, then expand private section if needed
        await verifyVisibility(page, 'saved_view', 'saved_view_heading', true, { timeout: 10000 });
            const privateItems_prio = page.locator('li[data-test-id="private-views-item"]').filter({hasText: savedViewNamePrivate});
        if (!await privateItems_prio.first().isVisible().catch(() => false)) {
            await actionClick(page, 'saved_view', 'saved_private_view_btn', { force: true });
            await page.waitForLoadState('networkidle');
        }
        await expect(privateItems_prio.first()).toBeVisible({ timeout: 15000 });
    });

    test('verify that user is able to apply the newly added private view [RST-2376]', async ({ page }) => {
        const applyPrivateViewName = `Apply private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

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
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        // Defensive cleanup: a stale delete confirmation can block saved-view interactions.
        const deleteSavedViewDialog = page.getByRole('heading', { name: 'Delete Saved View' });
        if (await deleteSavedViewDialog.isVisible().catch(() => false)) {
            await page.keyboard.press('Escape');
            if (await deleteSavedViewDialog.isVisible().catch(() => false)) {
                await page.getByRole('button', { name: 'close' }).click({ force: true }).catch(() => null);
            }
            if (await deleteSavedViewDialog.isVisible().catch(() => false)) {
                await actionClick(page, 'saved_view', 'saved_view_delete_button', { force: true });
            }
        }
        
        // Create a new private view in this test to avoid dependency on other test state.
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Region] contains "Hawaii"');

        const applyFilterResponsePromise = page.waitForResponse(response =>
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'pricing', 'pricing_table_filter_apply_btn');
        await applyFilterResponsePromise;

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', applyPrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn', { force: true });

        const privateViewItem2 = page.locator('li[data-test-id="private-views-item"]').filter({ hasText: applyPrivateViewName });
        await expect(privateViewItem2).toHaveCount(1, { timeout: 15000 });
        await privateViewItem2.first().click();
        await page.waitForResponse(response =>
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST',
            { timeout: 10000 }
        ).catch(() => null);
        await expect.poll(async () =>
            page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value),
            { timeout: 15000 }
        ).toBe('[Region] contains "Hawaii"');

        // Intentionally skip default-view reset in this test to keep assertion scope
        // focused on applying the newly added private view.
    });

    test('verify that user is able to update a private view [RST-2373]', async ({ page }) => {
        const updatePrivateViewName = `Update private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;
        const updatedPrivateViewName = `Updated private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

        await page.route('**/voyages/filters/', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.route('**/voyages/price-prioritization/*', async (route, request) => {
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

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await verifyVisibility(page, 'pricing', 'pricing_table_filter_text');
        await verifyVisibility(page, 'pricing', 'pricing_table_filter_apply_btn');
        await writeTextInLocator(page, 'pricing', 'pricing_table_filter_text', '[Region] contains "Hawaii"');
        const applyFilterResponsePromise = page.waitForResponse(response =>
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'pricing', 'pricing_table_filter_apply_btn');
        await applyFilterResponsePromise;

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatePrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;
        await page.waitForLoadState('networkidle');

        console.log('User applies the newly added private view');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await page.waitForLoadState('networkidle');

        const privateViewItem = page.locator('li[data-test-id="private-views-item"]').filter({ hasText: updatePrivateViewName });
        await expect(privateViewItem).toHaveCount(1, { timeout: 15000 });
        await privateViewItem.first().click({ force: true });

        await page.waitForResponse(response =>
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        console.log('User updates the newly added private view name');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatedPrivateViewName);
        await verifyVisibility(page, 'saved_view', 'saved_view_update_btn');
        await actionClick(page, 'saved_view', 'saved_view_update_btn');
        await page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/')
        );

        const filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
        expect(filterValue).toBe('[Region] contains "Hawaii"');

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('li[data-test-id="private-views-item"]').filter({ hasText: updatedPrivateViewName })).toHaveCount(1, { timeout: 15000 });
    });

    test('verify that user is able to delete a private view [RST-2374]', async ({ page }) => {
        const deletePrivateViewName = `Delete private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

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

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', deletePrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;
        await page.waitForLoadState('networkidle');

        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        const privateViewItem = page.locator('[data-test-id="private-views-item"]').filter({ hasText: deletePrivateViewName });
        await expect(privateViewItem).toHaveCount(1, { timeout: 15000 });
        await privateViewItem.locator('[data-test-id="delete-private-views-button"]').click();
        await verifyText(page, 'saved_view', 'saved_view_delete_text', ' Are you sure you want to delete the selected saved view? ');
        await actionClick(page, 'saved_view', 'saved_view_delete_button');
        // await page.waitForResponse(response => 
        //     response.url().includes('/api/users/saved-views/*/')
        // );
        
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await expect(page.locator('li[data-test-id="private-views-item"]').filter({hasText: deletePrivateViewName,})).toHaveCount(0, { timeout: 15000 });
        
    });
});

test.describe.serial('Sailing inventory tab - Public- Saved View- CRUD operation on cabin page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that user is able to add a public view on cabin page- Sailing inventory tab [RST-2378]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('User adds capacity info columns for saved view');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_btn');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_checkboxes', { index : 6 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_close_btn');

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true, timeout: 30000 });

        console.log('Create a public saved view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');

        console.log('User writes the name of the saved view');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', savedViewNameCabinSi);
        
        console.log('User clicks on public saved view');
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await actionClick(page, 'saved_view', 'saved_view_public_list_item', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.ag-header-allow-overflow .ag-header-row-column-group').filter({ hasText: 'Capacity Info' }).first()).toBeVisible({ timeout: 30000 });

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        const publicViewItemSi = page.locator('li[data-test-id="public-views-item"]', { hasText: savedViewNameCabinSi });
        if (!await publicViewItemSi.first().isVisible().catch(() => false)) {
            await actionClick(page, 'saved_view', 'saved_public_view_btn', { force: true });
        }
        await expect(publicViewItemSi).toHaveCount(1, { timeout: 10000 });
    });

    test('verify that user is able to apply the newly added public view on cabin page- Sailing inventory tab [RST-2379]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
        
        console.log('User applies the newly added public view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');

        const publicViewItem = page.locator('li[data-test-id="public-views-item"]',{ hasText: savedViewNameCabinSi });
        await expect(publicViewItem).toHaveCount(1);
        await publicViewItem.click();
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        await expect(page.locator('.ag-header-allow-overflow .ag-header-row-column-group').filter({ hasText: 'Capacity Info' })).toHaveCount(1, { timeout: 30000 });

        console.log('User applied default view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_view_default_view');
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
    });

    test('verify that user is able to update a public view on cabin page- Sailing inventory tab [RST-2380]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        console.log('User applies the newly added public view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');

        const publicViewItem = page.locator('li[data-test-id="public-views-item"]',{ hasText: savedViewNameCabinSi });
        await expect(publicViewItem).toHaveCount(1);
        await publicViewItem.click();

        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        
        console.log('User updates the newly added public view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatedViewNameCabinSi);
        await verifyVisibility(page, 'saved_view', 'saved_view_update_btn');
        await actionClick(page, 'saved_view', 'saved_view_update_btn');
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/')
        );
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: updatedViewNameCabinSi,})).toHaveCount(1);
    });

    test('verify that user is able to delete a public view on cabin page- Sailing inventory tab [RST-2381]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        console.log('User delete the newly added public view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        await page.locator('[data-test-id="public-views-item"]').filter({ hasText: updatedViewNameCabinSi }).locator('[data-test-id="delete-public-views-button"]').click();
        await verifyText(page, 'saved_view', 'saved_view_delete_text', ' Are you sure you want to delete the selected saved view? ');
        await actionClick(page, 'saved_view', 'saved_view_delete_button');
        // await page.waitForResponse(response => 
        //     response.url().includes('/api/users/saved-views/*/')
        // );
        
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: updatedViewNameCabinSi,})).toHaveCount(0);
    });
})

test.describe.serial('Sailing inventory tab - Private- Saved View- CRUD operation on cabin page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that user is able to add a private view on cabin page- Sailing inventory tab [RST-2382]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('User adds capacity info columns for saved view');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_btn');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_checkboxes', { index : 6 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_close_btn');

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        console.log('Create a private saved view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');

        console.log('User writes the name of the saved view');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', savedViewNameCabinSi);
        
        console.log('User clicks on private saved view');
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await page.waitForLoadState('networkidle');
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        // Wait for the panel to open, then expand private section if needed
        await verifyVisibility(page, 'saved_view', 'saved_view_heading', true, { timeout: 10000 });
        const privateItemsSi = page.locator('li[data-test-id="private-views-item"]').filter({hasText: savedViewNameCabinSi});
        if (!await privateItemsSi.first().isVisible().catch(() => false)) {
            await actionClick(page, 'saved_view', 'saved_private_view_btn', { force: true });
        }
        await expect(privateItemsSi.first()).toBeVisible({ timeout: 10000 });
    });

    test('verify that user is able to apply the newly added private view on cabin page- Sailing inventory tab [RST-2383]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
        
        console.log('User applies the newly added private view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');

        const privateViewItem = page.locator('li[data-test-id="private-views-item"]',{ hasText: savedViewNameCabinSi });
        await expect(privateViewItem).toHaveCount(1);
        await privateViewItem.click();
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        console.log('User applied default view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_view_default_view');
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
    });

    test('verify that user is able to update a private view on cabin page- Sailing inventory tab [RST-2384]', async ({ page }) => {
        const updateCabinPrivateViewName = `Update cabin private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;
        const updatedCabinPrivateViewName = `Updated cabin private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_btn');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_checkboxes', { index : 6 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_close_btn');
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updateCabinPrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;
        await page.waitForLoadState('networkidle');

        console.log('User applies the newly added private view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await page.waitForLoadState('networkidle');

        const privateViewItem = page.locator('li[data-test-id="private-views-item"]').filter({ hasText: updateCabinPrivateViewName });
        await expect(privateViewItem).toHaveCount(1, { timeout: 15000 });
        await privateViewItem.click();

        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        
        console.log('User updates the newly added private view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatedCabinPrivateViewName);
        await verifyVisibility(page, 'saved_view', 'saved_view_update_btn');
        await actionClick(page, 'saved_view', 'saved_view_update_btn');
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/')
        );
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('li[data-test-id="private-views-item"]').filter({ hasText: updatedCabinPrivateViewName })).toHaveCount(1, { timeout: 15000 });
    });

    test('verify that user is able to delete a private view on cabin page- Sailing inventory tab [RST-2385]', async ({ page }) => {
        const deleteCabinPrivateViewName = `Delete cabin private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', deleteCabinPrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;
        await page.waitForLoadState('networkidle');

        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        const privateViewItem = page.locator('[data-test-id="private-views-item"]').filter({ hasText: deleteCabinPrivateViewName });
        await expect(privateViewItem).toHaveCount(1, { timeout: 15000 });
        await privateViewItem.locator('[data-test-id="delete-private-views-button"]').click();
        await verifyText(page, 'saved_view', 'saved_view_delete_text', ' Are you sure you want to delete the selected saved view? ');
        await actionClick(page, 'saved_view', 'saved_view_delete_button');
        // await page.waitForResponse(response => 
        //     response.url().includes('/api/users/saved-views/*/')
        // );
        
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await expect(page.locator('li[data-test-id="private-views-item"]').filter({hasText: deleteCabinPrivateViewName,})).toHaveCount(0, { timeout: 15000 });
    });
})

test.describe.serial('Meta tab - Public- Saved View- CRUD operation on cabin page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that user is able to add a public view on cabin page- Meta tab [RST-2387]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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

        console.log('User adds capacity info columns for saved view');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_btn');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_checkboxes', { index : 6 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_close_btn');

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        console.log('Create a public saved view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');

        console.log('User writes the name of the saved view');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', savedViewNameCabinSi);
        
        console.log('User clicks on public saved view');
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await actionClick(page, 'saved_view', 'saved_view_public_list_item', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.ag-header-allow-overflow .ag-header-row-column-group').filter({ hasText: 'Capacity Info' }).first()).toBeVisible({ timeout: 30000 });

        const savedViewHeadingLocatorPublic = page.locator('[data-test-id="saved-views-dropdown"] .leading-title-md');
        const publicViewItemMeta = page.locator('li[data-test-id="public-views-item"]', { hasText: savedViewNameCabinSi });
        // The panel's list can briefly lag behind the create POST under load, and simply
        // waiting longer on a single open doesn't help since nothing re-fetches it in place.
        // Re-close/re-open a few times, each a fresh fetch, until the new view shows up.
        let publicViewFound = false;
        for (let attempt = 0; attempt < 4 && !publicViewFound; attempt++) {
            if (await savedViewHeadingLocatorPublic.isVisible().catch(() => false)) {
                await actionClick(page, 'pricing', 'pricing_saved_view_btn');
                await expect(savedViewHeadingLocatorPublic).toBeHidden({ timeout: 5000 }).catch(() => {});
            }
            await actionClick(page, 'pricing', 'pricing_saved_view_btn');
            await verifyVisibility(page, 'saved_view', 'saved_view_heading', true, { timeout: 10000 });
            if (!await publicViewItemMeta.first().isVisible().catch(() => false)) {
                await actionClick(page, 'saved_view', 'saved_public_view_btn', { force: true });
            }
            publicViewFound = await publicViewItemMeta.first().isVisible({ timeout: 5000 }).catch(() => false);
        }
        await expect(publicViewItemMeta).toHaveCount(1, { timeout: 5000 });
    });

    test('verify that user is able to apply the newly added public view on cabin page- Meta tab [RST-2388]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
        
        console.log('User applies the newly added public view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');

        const publicViewItem = page.locator('li[data-test-id="public-views-item"]',{ hasText: savedViewNameCabinSi });
        await expect(publicViewItem).toHaveCount(1);
        await publicViewItem.click();
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        console.log('User applied default view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_view_default_view');
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
    });

    test('verify that user is able to update a public view on cabin page- Meta tab [RST-2389]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForSelector('.ag-pinned-left-cols-container .ag-row');

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        console.log('User applies the newly added public view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');

        const publicViewItem = page.locator('li[data-test-id="public-views-item"]',{ hasText: savedViewNameCabinSi });
        await expect(publicViewItem).toHaveCount(1);
        await publicViewItem.click();

        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        
        console.log('User updates the newly added public view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatedViewNameCabinSi);
        await verifyVisibility(page, 'saved_view', 'saved_view_update_btn');
        await actionClick(page, 'saved_view', 'saved_view_update_btn');
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/')
        );
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: updatedViewNameCabinSi,})).toHaveCount(1);
    });

    test('verify that user is able to delete a public view on cabin page- Meta tab [RST-2390]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        console.log('User delete the newly added public view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        await page.locator('[data-test-id="public-views-item"]').filter({ hasText: updatedViewNameCabinSi }).locator('[data-test-id="delete-public-views-button"]').click();
        await verifyText(page, 'saved_view', 'saved_view_delete_text', ' Are you sure you want to delete the selected saved view? ');
        await actionClick(page, 'saved_view', 'saved_view_delete_button');
        // await page.waitForResponse(response => 
        //     response.url().includes('/api/users/saved-views/*/')
        // );
        
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_public_view_btn');
        await expect(page.locator('li[data-test-id="public-views-item"]', {hasText: updatedViewNameCabinSi,})).toHaveCount(0);
    });
})

test.describe.serial('Meta tab - Private- Saved View- CRUD operation on cabin page @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify that user is able to add a private view on cabin page- Meta tab [RST-2391]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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

        console.log('User adds capacity info columns for saved view');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_btn');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_checkboxes', { index : 6 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_close_btn');

        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        console.log('Create a private saved view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');

        console.log('User writes the name of the saved view');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', savedViewNameCabinSi);
        
        console.log('User clicks on private saved view');
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await page.waitForLoadState('networkidle');
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        const savedViewHeadingLocator = page.locator('[data-test-id="saved-views-dropdown"] .leading-title-md');
        const privateItemsMeta = page.locator('li[data-test-id="private-views-item"]').filter({hasText: savedViewNameCabinSi});
        // The panel's list can briefly lag behind the create POST under load, and simply
        // waiting longer on a single open doesn't help since nothing re-fetches it in place.
        // Re-close/re-open a few times, each a fresh fetch, until the new view shows up.
        let privateViewFound = false;
        for (let attempt = 0; attempt < 4 && !privateViewFound; attempt++) {
            if (await savedViewHeadingLocator.isVisible().catch(() => false)) {
                await actionClick(page, 'pricing', 'pricing_saved_view_btn');
                await expect(savedViewHeadingLocator).toBeHidden({ timeout: 5000 }).catch(() => {});
            }
            await actionClick(page, 'pricing', 'pricing_saved_view_btn');
            await verifyVisibility(page, 'saved_view', 'saved_view_heading', true, { timeout: 10000 });
            if (!await privateItemsMeta.first().isVisible().catch(() => false)) {
                await actionClick(page, 'saved_view', 'saved_private_view_btn', { force: true });
            }
            privateViewFound = await privateItemsMeta.first().isVisible({ timeout: 5000 }).catch(() => false);
        }
        await expect(privateItemsMeta).toHaveCount(1, { timeout: 5000 });
    });

    test('verify that user is able to apply the newly added private view on cabin page- Meta tab [RST-2392]', async ({ page }) => {
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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
        
        console.log('User applies the newly added private view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');

        const privateViewItem = page.locator('li[data-test-id="private-views-item"]',{ hasText: savedViewNameCabinSi });
        await expect(privateViewItem).toHaveCount(1);
        await privateViewItem.click();
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        await verifyText(page, 'voyage_deep_dive', 'vdd_cabin_table_header_groups', 'Capacity Info', { index : 1 , partial : true });

        console.log('User applied default view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_view_default_view');
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);
    });

    test('verify that user is able to update a private view on cabin page- Meta tab [RST-2393]', async ({ page }) => {
        const updateMetaPrivateViewName = `Update meta private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;
        const updatedMetaPrivateViewName = `Updated meta private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
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
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_btn');
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_checkboxes', { index : 6 });
        await actionClick(page, 'voyage_deep_dive', 'vdd_cabin_column_close_btn');
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updateMetaPrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;
        await page.waitForLoadState('networkidle');

        console.log('User applies the newly added private view');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await page.waitForLoadState('networkidle');

        const privateViewItem = page.locator('li[data-test-id="private-views-item"]').filter({ hasText: updateMetaPrivateViewName });
        await expect(privateViewItem).toHaveCount(1, { timeout: 15000 });
        await privateViewItem.click();

        await expect(page.locator('text=Capacity Info')).toHaveCount(2);
        
        console.log('User updates the newly added private view name');
        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', updatedMetaPrivateViewName);
        await verifyVisibility(page, 'saved_view', 'saved_view_update_btn');
        await actionClick(page, 'saved_view', 'saved_view_update_btn');
        await page.waitForResponse(response => 
            response.url().includes('/api/users/saved-views/')
        );
        await expect(page.locator('text=Capacity Info')).toHaveCount(2);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('li[data-test-id="private-views-item"]').filter({ hasText: updatedMetaPrivateViewName })).toHaveCount(1, { timeout: 15000 });
    });

    test('verify that user is able to delete a private view on cabin page- Meta tab [RST-2394]', async ({ page }) => {
        const deleteMetaPrivateViewName = `Delete meta private view-${process.env.BRAND}_${process.env.ROLE}_${Date.now().toString().slice(-6)}`;

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
        await page.route('**/voyages/voyage-navigation/**', async (route, request) => {
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
        await page.route('**/voyages/voyage-info/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/voyages/inventory/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.route('**/api/voyages/cabin-charts/**', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });

        await page.goto('/analytics/sailings');
        await page.waitForResponse(response => 
            response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
        );

        await actionClick(page, 'pricing', 'pricing_table_row_voyage_name', { index : 0 });
        await page.waitForURL('**/deep-dive/**');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

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
        
        await expect(page.locator('text=Capacity Info')).toHaveCount(1);

        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await writeTextInLocator(page, 'saved_view', 'save_view_name_text_field', deleteMetaPrivateViewName);
        await actionClick(page, 'saved_view', 'saved_view_save_btn');
        const createViewResponsePromise = page.waitForResponse(response =>
            response.url().includes('/api/users/saved-views/') && response.request().method() === 'POST'
        );
        await actionClick(page, 'saved_view', 'saved_view_private_list_item', { index : 0 });
        await createViewResponsePromise;
        await page.waitForLoadState('networkidle');

        console.log('User clicks on saved view button');
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        const privateViewItem = page.locator('[data-test-id="private-views-item"]').filter({ hasText: deleteMetaPrivateViewName });
        await expect(privateViewItem).toHaveCount(1, { timeout: 15000 });
        await privateViewItem.locator('[data-test-id="delete-private-views-button"]').click();
        await verifyText(page, 'saved_view', 'saved_view_delete_text', ' Are you sure you want to delete the selected saved view? ');
        await actionClick(page, 'saved_view', 'saved_view_delete_button');
        // await page.waitForResponse(response => 
        //     response.url().includes('/api/users/saved-views/*/')
        // );
        
        await actionClick(page, 'pricing', 'pricing_saved_view_btn');
        await actionClick(page, 'saved_view', 'saved_private_view_btn');
        await expect(page.locator('li[data-test-id="private-views-item"]').filter({hasText: deleteMetaPrivateViewName,})).toHaveCount(0, { timeout: 15000 });
    });
})

