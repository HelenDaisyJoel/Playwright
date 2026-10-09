import { test } from '../fixtures/baseFixture';
import { verifyText, verifyElementCount, verifyUrl, writeTextInLocator, actionClick } from '../utils/actions';

test.describe('Admin Page- User tab for admin @regression @NCL-admin @OCEANIA-admin @REGENT-admin', () => {
    test('verify admin is able to navigate to user tab in Admin page and search a user [RST-2505, RST-2506, RST-2507]', async ({ page }) => {
        await page.route('**/api/users/current/', async (route, request) => {
            console.log('📦 Intercepted api/users/current/');
            await route.continue();
        });
        await page.route('**/api/users/list/', async (route, request) => {
            console.log('📦 Intercepted api/users/list/');
            await route.continue();
        });
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/admin');
        
        await verifyText(page, 'nav_bar', 'admin_page_heading', 'Admin', { index: 0 });
        await verifyText(page, 'admin', 'admin_heading_subtext', ' Manage users, roles, and portfolios. ');
        await verifyText(page, 'admin', 'admin_user_tab', ' Users ');
        await verifyText(page, 'admin', 'admin_portfolio_tab', ' Portfolio ');
        await verifyText(page, 'admin', 'admin_user_header', ' Users | ');
        await verifyText(page, 'admin', 'admin_user_subheader', 'All');
        await verifyText(page, 'admin', 'admin_user_subtext', ' View user details, roles, and permissions. ');
        
        await verifyText(page, 'admin', 'admin_user_table_name', 'Name');
        await verifyText(page, 'admin', 'admin_user_table_username', 'Username');
        await verifyText(page, 'admin', 'admin_user_table_brand', 'Brand');
        await verifyText(page, 'admin', 'admin_user_table_role', 'Role');
        await verifyText(page, 'admin', 'admin_user_table_reports_to', 'Reports To');
        // await verifyElementCount(page, 'admin', 'admin_user_rows', 16);

        await writeTextInLocator(page, 'admin', 'admin_user_search', 'admin');
        // await verifyElementCount(page, 'admin', 'admin_user_rows', 4);
    });

    test('verify admin is able to navigate to portfolio tab in Admin page and search a user [RST-2511, RST-2512, RST-2513]', async ({ page }) => {
        await page.route('**/api/users/current/', async (route, request) => {
            console.log('📦 Intercepted api/users/current/');
            await route.continue();
        });
        await page.route('**/api/users/list/', async (route, request) => {
            console.log('📦 Intercepted api/users/list/');
            await route.continue();
        });
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/admin');

        await verifyText(page, 'nav_bar', 'admin_page_heading', 'Admin', { index: 0 });
        await verifyText(page, 'admin', 'admin_heading_subtext', ' Manage users, roles, and portfolios. ');
        await verifyText(page, 'admin', 'admin_user_tab', ' Users ');
        await verifyText(page, 'admin', 'admin_portfolio_tab', ' Portfolio ');
        await actionClick(page, 'admin', 'admin_portfolio_tab');

        await verifyText(page, 'admin', 'admin_portfolio_header', ' Portfolio | ');
        await verifyText(page, 'admin', 'admin_portfolio_subheader', 'Analysts');
        await verifyText(page, 'admin', 'admin_portfolio_subtext', ' Click Edit to make changes. ');

        await verifyText(page, 'admin', 'admin_portfolio_table_name', 'Name');
        await verifyText(page, 'admin', 'admin_portfolio_table_role', 'Role');
        await verifyText(page, 'admin', 'admin_portfolio_table_brand', 'Brand');
        await verifyText(page, 'admin', 'admin_portfolio_table_total_ships', 'Total Ships');
        await verifyText(page, 'admin', 'admin_portfolio_table_ships_voyages', 'Ships (# of Sailings)');
        await verifyText(page, 'admin', 'admin_portfolio_table_reports_to', 'Reports To');
        await verifyText(page, 'admin', 'admin_portfolio_table_actions', 'Actions');
        // await verifyElementCount(page, 'admin', 'admin_portfolio_rows', 12);

        await writeTextInLocator(page, 'admin', 'admin_portfolio_search', 'admin');
        // await verifyElementCount(page, 'admin', 'admin_portfolio_rows', 4);
    });
})

test.describe('Admin Page- User tab for manager @regression @NCL-manager @OCEANIA-manager @REGENT-manager', () => {
    test('verify manager is able to navigate to user tab in Admin page and search a user [RST-2508, RST-2509, RST-2510]', async ({ page }) => {
        await page.route('**/api/users/current/', async (route, request) => {
            console.log('📦 Intercepted api/users/current/');
            await route.continue();
        });
        await page.route('**/api/users/list/', async (route, request) => {
            console.log('📦 Intercepted api/users/list/');
            await route.continue();
        });
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/admin');

        await verifyText(page, 'nav_bar', 'admin_page_heading', 'Admin', { index: 0 });
        await verifyText(page, 'admin', 'admin_heading_subtext', ' Manage users, roles, and portfolios. ');
        await verifyText(page, 'admin', 'admin_user_tab', ' Users ');
        await verifyText(page, 'admin', 'admin_portfolio_tab', ' Portfolio ');
        await verifyText(page, 'admin', 'admin_user_header', ' Users | ');
        await verifyText(page, 'admin', 'admin_user_subheader', 'All');
        await verifyText(page, 'admin', 'admin_user_subtext', ' View user details, roles, and permissions. ');
        
        await verifyText(page, 'admin', 'admin_user_table_name', 'Name');
        await verifyText(page, 'admin', 'admin_user_table_username', 'Username');
        await verifyText(page, 'admin', 'admin_user_table_brand', 'Brand');
        await verifyText(page, 'admin', 'admin_user_table_role', 'Role');
        await verifyText(page, 'admin', 'admin_user_table_reports_to', 'Reports To');
        // await verifyElementCount(page, 'admin', 'admin_user_rows', 16);

        await writeTextInLocator(page, 'admin', 'admin_user_search', 'admin');
        // await verifyElementCount(page, 'admin', 'admin_user_rows', 4);
    });

    test('verify manager is able to navigate to portfolio tab in Admin page and search a user [RST-2519, RST-2520, RST-2521]', async ({ page }) => {
        await page.route('**/api/users/current/', async (route, request) => {
            console.log('📦 Intercepted api/users/current/');
            await route.continue();
        });
        await page.route('**/api/users/list/', async (route, request) => {
            console.log('📦 Intercepted api/users/list/');
            await route.continue();
        });
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/admin');

        await verifyText(page, 'nav_bar', 'admin_page_heading', 'Admin', { index: 0 });
        await verifyText(page, 'admin', 'admin_heading_subtext', ' Manage users, roles, and portfolios. ');
        await verifyText(page, 'admin', 'admin_user_tab', ' Users ');
        await verifyText(page, 'admin', 'admin_portfolio_tab', ' Portfolio ');
        await actionClick(page, 'admin', 'admin_portfolio_tab');

        await verifyText(page, 'admin', 'admin_portfolio_header', ' Portfolio | ');
        await verifyText(page, 'admin', 'admin_portfolio_subheader', 'Analysts');
        await verifyText(page, 'admin', 'admin_portfolio_subtext', ' Click Edit to make changes. ');

        await verifyText(page, 'admin', 'admin_portfolio_table_name', 'Name');
        await verifyText(page, 'admin', 'admin_portfolio_table_role', 'Role');
        await verifyText(page, 'admin', 'admin_portfolio_table_brand', 'Brand');
        await verifyText(page, 'admin', 'admin_portfolio_table_total_ships', 'Total Ships');
        await verifyText(page, 'admin', 'admin_portfolio_table_ships_voyages', 'Ships (# of Sailings)');
        await verifyText(page, 'admin', 'admin_portfolio_table_reports_to', 'Reports To');
        await verifyText(page, 'admin', 'admin_portfolio_table_actions', 'Actions');
        // await verifyElementCount(page, 'admin', 'admin_portfolio_rows', 12);

        await writeTextInLocator(page, 'admin', 'admin_portfolio_search', 'admin');
        // await verifyElementCount(page, 'admin', 'admin_portfolio_rows', 4);
    });
})
