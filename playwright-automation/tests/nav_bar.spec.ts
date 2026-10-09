import { test } from '../fixtures/baseFixture';
import { verifyText,verifyAttribute,actionClick, verifyUrl, verifyVisibility } from '../utils/actions';

test.describe('Nav bar tests for admin and manager @smoke @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager ', () => {
    test('verify global nav bar items [RST-2305, RST-2306, RST-2307, RST-2308, RST-2309]', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        console.log('User verifies the components in nav bar');
        await verifyAttribute(page, 'nav_bar', 'nav_bar_logo', 'src', 'assets\/images\/logos\/lg-company\.svg');
        await verifyAttribute(page, 'nav_bar', 'nav_bar_logo', 'alt', 'Company Logo');

        await verifyText(page, 'nav_bar', 'nav_bar_home', 'Home')
        await verifyText(page, 'nav_bar', 'nav_bar_pricing', 'Prioritization')
        await verifyText(page, 'nav_bar', 'nav_bar_config', 'Config')
        await verifyText(page, 'nav_bar', 'nav_bar_admin', 'Admin')

        await verifyText(page, 'nav_bar', 'nav_bar_filter', 'Filters', {partial: true})
        await verifyText(page, 'nav_bar', 'nav_bar_opt_timestamp', 'Last optimized:', {partial: true})
        await verifyVisibility(page, 'nav_bar', 'nav_bar_user_name')
    });

    test('verify user can navigate to different pages from the nav bar [RST-2310, RST-2311, RST-2312, RST-2313, RST-2314, RST-2315]', async ({ page }) => {
        test.setTimeout(180000);

        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        console.log('User clicks on Pricing button in nav bar');
        await actionClick(page, 'nav_bar', 'nav_bar_pricing')
        await page.route('api/voyages/*', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.waitForURL('**/analytics/sailings');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/analytics/sailings');
        await verifyText(page, 'nav_bar', 'page_heading', 'Prioritization', { index: 0, partial: true });

        console.log('User clicks on Config button in nav bar');
        await actionClick(page, 'nav_bar', 'nav_bar_config', { text: 'Config' })
        await page.waitForURL('**/config/currency-panes/current-exchange');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes/current-exchange');
        await verifyText(page, 'nav_bar', 'config_page_heading', ' Config ', { index: 0 })
        await page.goto('/performance');
        await page.waitForURL('**/performance');
        await verifyUrl(page, '/performance');
        await verifyText(page, 'nav_bar', 'performance_page_heading', 'Performance')

        console.log('User navigates directly to Usage page');
        await page.goto('/usage');
        await page.waitForURL('**/usage');
        await page.waitForLoadState('networkidle');
        await verifyVisibility(page, 'nav_bar', 'page_heading', true, { index: 0, timeout: 30000 });
        await verifyUrl(page, '/usage');
        await verifyText(page, 'nav_bar', 'page_heading', 'USAGE', { index: 0, partial: true })

        console.log('User clicks on Admin button in nav bar');
        await actionClick(page, 'nav_bar', 'nav_bar_admin', { text: 'Admin' })
        await page.waitForURL('**/admin');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/admin');
        await verifyText(page, 'nav_bar', 'admin_page_heading', 'Admin', { index: 0 })
        await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.waitForURL('**/dashboard');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/dashboard');
        await verifyText(page, 'nav_bar', 'page_heading', 'Overall Revenue Performance', { index: 0, partial: true })
        await verifyText(page, 'nav_bar', 'page_heading', 'SUMMARY OF ALERTS', { index: 1, partial: true })
        await verifyText(page, 'nav_bar', 'page_heading', 'Opportunity Breakdown of Alerts', { index: 2, partial: true });
    });
});

test.describe('Nav bar tests for analysts @smoke @regression @NCL-analyst @OCEANIA-analyst @REGENT-analyst ', () => {
    test('verify global nav bar items [RST-2305, RST-2306, RST-2307, RST-2308, RST-2309]', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        console.log('User verifies the components in nav bar');
        await verifyAttribute(page, 'nav_bar', 'nav_bar_logo', 'src', 'assets\/images\/logos\/lg-company\.svg');
        await verifyAttribute(page, 'nav_bar', 'nav_bar_logo', 'alt', 'Company Logo');

        await verifyText(page, 'nav_bar', 'nav_bar_home', 'Home')
        await verifyText(page, 'nav_bar', 'nav_bar_pricing', 'Prioritization')
        await verifyText(page, 'nav_bar', 'nav_bar_config', 'Config')

        await verifyText(page, 'nav_bar', 'nav_bar_filter', 'Filters', {partial: true})
        await verifyText(page, 'nav_bar', 'nav_bar_opt_timestamp', 'Last optimized:', {partial: true})
        await verifyVisibility(page, 'nav_bar', 'nav_bar_user_name')
    });

    test('verify user can navigate to different pages from the nav bar [RST-2310, RST-2313, RST-2315]', async ({ page }) => {
        test.setTimeout(180000);

        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');

        console.log('User clicks on Pricing button in nav bar');
        await actionClick(page, 'nav_bar', 'nav_bar_pricing')
        await page.route('api/voyages/*', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await page.waitForURL('**/analytics/sailings');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/analytics/sailings');
        await verifyText(page, 'nav_bar', 'page_heading', 'Prioritization', { index: 0, partial: true });

        console.log('User clicks on Config button in nav bar');
        await actionClick(page, 'nav_bar', 'nav_bar_config', { text: 'Config' })
        await page.waitForURL('**/config/currency-panes/current-exchange');
        await page.waitForLoadState('networkidle');
        await verifyUrl(page, '/config/currency-panes/current-exchange');
        await verifyText(page, 'nav_bar', 'config_page_heading', ' Config ', { index: 0 })
        
        console.log('User clicks on Home button in nav bar');
        await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.waitForLoadState('networkidle');
        await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.route('api/voyages/*', async (route, request) => {
            const response = await route.fetch();
            await route.continue();
        });
        await verifyUrl(page, '/dashboard');
        await verifyText(page, 'nav_bar', 'page_heading', 'Overall Revenue Performance', { index: 0, partial: true })
        await verifyText(page, 'nav_bar', 'page_heading', 'SUMMARY OF ALERTS', { index: 1, partial: true })
        await verifyText(page, 'nav_bar', 'page_heading', 'Opportunity Breakdown of Alerts', { index: 2, partial: true });
    });
});