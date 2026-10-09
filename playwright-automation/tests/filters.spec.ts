import { test, expect } from '../fixtures/baseFixture';
import { verifyText,verifyVisibility,actionClick, verifyUrl, readTextFromLocator } from '../utils/actions';
import { locatorRegistry } from '../locators';

test.describe('Filter component @regression @NCL-admin @NCL-manager @REGENT-admin @REGENT-manager @OCEANIA-admin @OCEANIA-manager ', () => {
  test('verify user is able to open the filter component on dashboard @smoke [RST-2316, RST-2317, RST-2320]', async ({ page }) => {
      await page.route('**/api/voyages/summary/', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/summary/');
        await route.continue();
      });
      await page.route('**/api/voyages/filters/', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/filters/');
        await route.continue();
      });
      await page.route('**/api/voyages/user-review/rate-split/?group_by=region', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/user-review/rate-split/?group_by=region');
        await route.continue();
      });
      await page.route('**/api/voyages/opportunity-breakdown/?group_by=region', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/opportunity-breakdown/?group_by=region');
        await route.continue();
      });

      await page.goto('/dashboard');
      await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
      );
      
      console.log('User verifies the filters popup');
      await actionClick(page, 'nav_bar', 'nav_bar_filter');
      await verifyText(page, 'filters', 'filter_header', ' Filters ')
      await verifyText(page, 'filters', 'filter_subHeading_text', 'Filters below will affect data views across all the pages');
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Analysts ', { index: 0 });    
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Ship class ', { index: 1 }); 
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Ship ', { index: 2 });    
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Departure date range ', { index: 3 });    
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Booking horizon (Months to sailing) ', { index: 4 });   
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Region ', { index: 5 });    
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Market ', { index: 6 });    
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Sailing length (Sailing nights) ', { index: 7 });    
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Meta category ', { index: 8 }); 
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Priority ', { index: 9 }); 

      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select analyst ', { index: 0 });       
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select ship class ', { index: 1 });    
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select ship ', { index: 2 });    
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select booking horizon ', { index: 3 });    
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select region ', { index: 4 });    
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select market ', { index: 5 });    
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select length ', { index: 6 });    
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select category ', { index: 7 });  
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select priority ', { index: 8 });  

      await verifyText(page, 'filters', 'filter_popup_cancel_button', ' Cancel ')
      await verifyText(page, 'filters', 'filter_popup_reset_button', ' Reset ')
      await verifyText(page, 'filters', 'filter_popup_save_button', ' Apply ')
      
      console.log('User opens the ship class filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 1 });
      console.log('User verifies the ship class filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      // await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' America ', { index: 1 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 1 });
      
      console.log('User opens the ship filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 2 });
      console.log('User verifies the ship filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      // await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Norwegian aqua ', { index: 1 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 2 });
      
      console.log('User opens the Booking horizon filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 3 });
      console.log('User verifies the booking horizon filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 0-3 months ', { index: 1 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 4-6 months ', { index: 2 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 7-9 months ', { index: 3 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 10-12 months ', { index: 4 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 13-18 months ', { index: 5 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 3 });

      console.log('User opens the region filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 4 });
      console.log('User verifies the region filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      // await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Africa ', { index: 1 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 4 });
      
      console.log('User opens the market filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 5 });
      console.log('User verifies the market filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      // await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Africa ', { index: 1 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 5 });

      console.log('User opens the voyage lengths filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 6 });
      console.log('User verifies the voyage lengths filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 1-6 nights ', { index: 1 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', '7-10 nights ', { index: 2 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 11-14 nights ', { index: 3 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 15+ nights ', { index: 4 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 6 });

      console.log('User opens the meta category filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 7 });
      console.log('User verifies the meta category filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      // await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Balcony ', { index: 1 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 7 });

      console.log('User opens the meta category filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 8 });
      console.log('User verifies the meta category filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 0 ', { index: 1 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 1 ', { index: 2 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 2 ', { index: 3 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 3 ', { index: 4 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 8 });

      await actionClick(page, 'filters', 'filter_popup_cancel_button');
      await verifyVisibility(page, 'filters', 'filter_header', false)
      await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);

      await actionClick(page, 'nav_bar', 'nav_bar_filter');
      await actionClick(page, 'filters', 'filter_popup_cancel_button');
      await verifyVisibility(page, 'filters', 'filter_header', false)
      await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);
  });

  test('verify user is able to apply and reset filters dashboard [RST-2318, RST-2319, RST-2321]', async ({ page }) => {
    await page.route('**/api/voyages/summary/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/summary/');
      await route.continue();
    });
    await page.route('**/api/voyages/filters/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/filters/');
      await route.continue();
    });
    await page.route('**/api/voyages/user-review/rate-split/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/user-review/rate-split/?group_by=region');
      await route.continue();
    });
    await page.route('**/api/voyages/opportunity-breakdown/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/opportunity-breakdown/?group_by=region');
      await route.continue();
    });

    await page.goto('/dashboard');
    await page.waitForResponse(response2 => 
      response2.url().includes('/api/voyages/filters/') && 
      response2.request().method() === 'GET' && 
      response2.status() === 200
    );
    await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });
    
    console.log('User verifies the filters popup');
    await actionClick(page, 'nav_bar', 'nav_bar_filter');
    await verifyText(page, 'filters', 'filter_header', ' Filters ')

    console.log('User applies ship class filters');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User opens the ship filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 2 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );
    
    console.log('User opens the booking horizon filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 3 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 2 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 3 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );
    
    console.log('User opens the priority filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 8 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User applies analyst filters');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 7 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User clicks on apply filter');
    await actionClick(page, 'filters', 'filter_popup_save_button');
    await verifyVisibility(page, 'filters', 'filter_header', false)
    await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);

    console.log('User verifies the applied filter');
    await verifyText(page, 'nav_bar', 'nav_bar_filter', '5', { partial : true });
    
    await actionClick(page, 'nav_bar', 'nav_bar_filter');
    await actionClick(page, 'filters', 'filter_popup_reset_button');
    await verifyVisibility(page, 'filters', 'filter_header', false)
    await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User verifies the applied filter');
    await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });
  });

  test('Verify that the filters are applied user navigates to pricing page from dashboard [RST-2322]', async ({ page }) => {
    test.setTimeout(120000);
    await page.route('**/api/voyages/summary/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/summary/');
      await route.continue();
    });
    await page.route('**/api/voyages/filters/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/filters/');
      await route.continue();
    });
    await page.route('**/api/voyages/user-review/rate-split/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/user-review/rate-split/?group_by=region');
      await route.continue();
    });
    await page.route('**/api/voyages/opportunity-breakdown/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/opportunity-breakdown/?group_by=region');
      await route.continue();
    });

    const filtersResponsePromise = page.waitForResponse(response2 =>
      response2.url().includes('/api/voyages/filters/') &&
      response2.request().method() === 'GET' &&
      response2.status() === 200
    );
    await page.goto('/dashboard');
    await filtersResponsePromise;
    await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });
    
    console.log('User verifies the filters popup');
    await actionClick(page, 'nav_bar', 'nav_bar_filter');
    await verifyText(page, 'filters', 'filter_header', ' Filters ')
    
    console.log('User opens the priority filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 8 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 2 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 3 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User clicks on apply filter');
    await actionClick(page, 'filters', 'filter_popup_save_button');
    await verifyVisibility(page, 'filters', 'filter_header', false)
    await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);

    console.log('User verifies the applied filter');
    await verifyText(page, 'nav_bar', 'nav_bar_filter', '1', { partial : true });
    
    await actionClick(page, 'dashboard', 'summary_rrb_chart_notReview_bar', { index : 0 });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    let filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toContain('AND ([Status] equals \"REVIEW\" OR [Status] equals \"PLANNED\" OR [Status] equals \"NO CHANGE\") AND [Blackout] is false AND ([Priority] = 0 OR [Priority] = 1 OR [Priority] = 2)');
  });
})

test.describe('@regression @NCL-analyst @REGENT-analyst @OCEANIA-analyst Filter component', () => {
  test('verify user is able to open the filter component on dashboard @smoke [RST-2316, RST-2317, RST-2320]', async ({ page }) => {
      await page.route('**/api/voyages/summary/', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/summary/');
        await route.continue();
      });
      await page.route('**/api/voyages/filters/', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/filters/');
        await route.continue();
      });
      await page.route('**/api/voyages/user-review/rate-split/?group_by=region', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/user-review/rate-split/?group_by=region');
        await route.continue();
      });
      await page.route('**/api/voyages/opportunity-breakdown/?group_by=region', async (route, request) => {
        console.log('📦 Intercepted /api/voyages/opportunity-breakdown/?group_by=region');
        await route.continue();
      });

      await page.goto('/dashboard');
      await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
      );
      
      console.log('User verifies the filters popup');
      await actionClick(page, 'nav_bar', 'nav_bar_filter');
      const firstFilterLabel = await readTextFromLocator(page, 'filters', 'filter_popup_field_heading', { index: 0 });
      const filterFieldOffset = firstFilterLabel.toLowerCase() === 'analysts' ? 1 : 0;
      const fieldIdx = (value: number) => value + filterFieldOffset;
      await verifyText(page, 'filters', 'filter_header', ' Filters ')
      await verifyText(page, 'filters', 'filter_subHeading_text', 'Filters below will affect data views across all the pages');
      if (filterFieldOffset === 1) {
        await verifyText(page, 'filters', 'filter_popup_field_heading', ' Analysts ', { index: 0 });
        await verifyText(page, 'filters', 'filter_popup_field_text', ' Select analyst ', { index: 0 });
      }
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Ship class ', { index: fieldIdx(0) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Ship ', { index: fieldIdx(1) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Departure date range ', { index: fieldIdx(2) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Booking horizon (Months to sailing) ', { index: fieldIdx(3) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Region ', { index: fieldIdx(4) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Market ', { index: fieldIdx(5) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Sailing length (Sailing nights) ', { index: fieldIdx(6) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Meta category ', { index: fieldIdx(7) });
      await verifyText(page, 'filters', 'filter_popup_field_heading', ' Priority ', { index: fieldIdx(8) });

      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select ship class ', { index: fieldIdx(0) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select ship ', { index: fieldIdx(1) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select booking horizon ', { index: fieldIdx(2) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select region ', { index: fieldIdx(3) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select market ', { index: fieldIdx(4) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select length ', { index: fieldIdx(5) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select category ', { index: fieldIdx(6) });
      await verifyText(page, 'filters', 'filter_popup_field_text', ' Select priority ', { index: fieldIdx(7) });

      await verifyText(page, 'filters', 'filter_popup_cancel_button', ' Cancel ')
      await verifyText(page, 'filters', 'filter_popup_reset_button', ' Reset ')
      await verifyText(page, 'filters', 'filter_popup_save_button', ' Apply ')
      
      console.log('User opens the ship class filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(0) });
      console.log('User verifies the ship class filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(0) });
      
      console.log('User opens the ship filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(1) });
      console.log('User verifies the ship filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(1) });
      
      console.log('User opens the Booking horizon filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(2) });
      console.log('User verifies the booking horizon filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 0-3 months ', { index: 1 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 4-6 months ', { index: 2 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 7-9 months ', { index: 3 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 10-12 months ', { index: 4 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 13-18 months ', { index: 5 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(2) });

      console.log('User opens the region filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(3) });
      console.log('User verifies the region filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(3) });
      
      console.log('User opens the market filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(4) });
      console.log('User verifies the market filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(4) });

      console.log('User opens the voyage lengths filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(5) });
      console.log('User verifies the voyage lengths filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 1-6 nights ', { index: 1 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', '7-10 nights ', { index: 2 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 11-14 nights ', { index: 3 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 15+ nights ', { index: 4 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(5) });

      console.log('User opens the meta category filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(6) });
      console.log('User verifies the meta category filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(6) });

      console.log('User opens the priority filter dropdown');
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(7) });
      console.log('User verifies the priority filter dropdown list items');
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' Select All ', { index: 0 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 0 ', { index: 1 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 1 ', { index: 2 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 2 ', { index: 3 });
      await verifyText(page, 'filters', 'filter_popup_dropdown_item', ' 3 ', { index: 4 });
      await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(7) });

      await actionClick(page, 'filters', 'filter_popup_cancel_button');
      await verifyVisibility(page, 'filters', 'filter_header', false)
      await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);

      await actionClick(page, 'nav_bar', 'nav_bar_filter');
      await actionClick(page, 'filters', 'filter_popup_cancel_button');
      await verifyVisibility(page, 'filters', 'filter_header', false)
      await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);
  });

  test('verify user is able to apply and reset filters dashboard [RST-2318, RST-2319, RST-2321]', async ({ page }) => {
    await page.route('**/api/voyages/summary/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/summary/');
      await route.continue();
    });
    await page.route('**/api/voyages/filters/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/filters/');
      await route.continue();
    });
    await page.route('**/api/voyages/user-review/rate-split/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/user-review/rate-split/?group_by=region');
      await route.continue();
    });
    await page.route('**/api/voyages/opportunity-breakdown/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/opportunity-breakdown/?group_by=region');
      await route.continue();
    });

    await page.goto('/dashboard');
    await page.waitForResponse(response2 => 
      response2.url().includes('/api/voyages/filters/') && 
      response2.request().method() === 'GET' && 
      response2.status() === 200
    );
    await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });
    
    console.log('User verifies the filters popup');
    await actionClick(page, 'nav_bar', 'nav_bar_filter');
    await verifyText(page, 'filters', 'filter_header', ' Filters ')

    const firstFilterLabel = await readTextFromLocator(page, 'filters', 'filter_popup_field_heading', { index: 0 });
    const filterFieldOffset = firstFilterLabel.toLowerCase() === 'analysts' ? 1 : 0;
    const fieldIdx = (value: number) => value + filterFieldOffset;

    console.log('User applies ship class filters');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(0) });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(1) });
    await page.waitForResponse(response2 =>
        response2.url().includes('/api/voyages/filters/') &&
        response2.request().method() === 'GET' &&
        response2.status() === 200
    );

    console.log('User opens the ship filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(1) });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(0) });
    await page.waitForResponse(response2 =>
        response2.url().includes('/api/voyages/filters/') &&
        response2.request().method() === 'GET' &&
        response2.status() === 200
    );

    console.log('User opens the booking horizon filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(2) });
    await page.locator(locatorRegistry.filters.filter_popup_dropdown_item).nth(3).waitFor({ state: 'visible', timeout: 20000 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 2 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 3 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(0) });
    await page.waitForResponse(response2 =>
        response2.url().includes('/api/voyages/filters/') &&
        response2.request().method() === 'GET' &&
        response2.status() === 200
    );

    console.log('User opens the priority filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(7) });
    await expect(page.locator(locatorRegistry.filters.filter_popup_dropdown_item)).toHaveCount(5, { timeout: 15000 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: fieldIdx(0) });
    await page.waitForResponse(response2 =>
        response2.url().includes('/api/voyages/filters/') &&
        response2.request().method() === 'GET' &&
        response2.status() === 200
    );

    console.log('User clicks on apply filter');
    await actionClick(page, 'filters', 'filter_popup_save_button');
    await verifyVisibility(page, 'filters', 'filter_header', false)
    await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);

    console.log('User verifies the applied filter');
    await verifyText(page, 'nav_bar', 'nav_bar_filter', '4', { partial : true });
    
    await actionClick(page, 'nav_bar', 'nav_bar_filter');
    await actionClick(page, 'filters', 'filter_popup_reset_button');
    await verifyVisibility(page, 'filters', 'filter_header', false)
    await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User verifies the applied filter');
    await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });
  });

  test('Verify that the filters are applied user navigates to pricing page from dashboard [RST-2322]', async ({ page }) => {
    test.setTimeout(120000);
    await page.route('**/api/voyages/summary/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/summary/');
      await route.continue();
    });
    await page.route('**/api/voyages/filters/', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/filters/');
      await route.continue();
    });
    await page.route('**/api/voyages/user-review/rate-split/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/user-review/rate-split/?group_by=region');
      await route.continue();
    });
    await page.route('**/api/voyages/opportunity-breakdown/?group_by=region', async (route, request) => {
      console.log('📦 Intercepted /api/voyages/opportunity-breakdown/?group_by=region');
      await route.continue();
    });

    const filtersResponsePromise2 = page.waitForResponse(response2 =>
      response2.url().includes('/api/voyages/filters/') &&
      response2.request().method() === 'GET' &&
      response2.status() === 200
    );
    await page.goto('/dashboard');
    await filtersResponsePromise2;
    await verifyText(page, 'nav_bar', 'nav_bar_filter', 'filter_altFilters', { partial : true });
    
    console.log('User verifies the filters popup');
    await actionClick(page, 'nav_bar', 'nav_bar_filter');
    await verifyText(page, 'filters', 'filter_header', ' Filters ')
    
    console.log('User opens the priority filter dropdown');
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 7 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 1 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 2 });
    await actionClick(page, 'filters', 'filter_popup_dropdown_item', { index: 3 });
    await actionClick(page, 'filters', 'filter_popup_field_dropdown', { index: 0 });
    await page.waitForResponse(response2 => 
        response2.url().includes('/api/voyages/filters/') && 
        response2.request().method() === 'GET' && 
        response2.status() === 200
    );

    console.log('User clicks on apply filter');
    await actionClick(page, 'filters', 'filter_popup_save_button');
    await verifyVisibility(page, 'filters', 'filter_header', false)
    await verifyVisibility(page, 'filters', 'filter_subHeading_text', false);

    console.log('User verifies the applied filter');
    await verifyText(page, 'nav_bar', 'nav_bar_filter', '1', { partial : true });
    
    await actionClick(page, 'dashboard', 'summary_rrb_chart_notReview_bar', { index : 0 });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    let filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toContain('([Status] equals "REVIEW" OR [Status] equals "PLANNED" OR [Status] equals "NO CHANGE") AND [Blackout] is false');
  });
})