import { test, expect } from '../fixtures/baseFixture';
import { verifyText, verifyVisibility, actionClick, verifyUrl, verifyAttribute } from '../utils/actions';

test.describe('Verify summary flex component @smoke @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
  test('verify summary flex headers on dashboard @smoke [RST-2323, RST-2324]', async ({ page }) => {
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
      await page.waitForLoadState('networkidle');
      console.log('User verifies the 2 flex headers');
      await verifyText(page, 'dashboard', 'summary_flex_headers', ' Gross revenue for\nfuture sailings ', { index: 0 });
      await verifyText(page, 'dashboard', 'summary_flex_headers', ' Net revenue for\nfuture sailings', { index: 1 });  
  });

  test('verify summary flex headers show the colours via API- Blue for promos [RST-2325]', async ({ page }) => {
    const mockedData = {
      avg_pct_voyages_under_budget: 30.578,
      avg_pct_revenue_from_promos: 40.121
    };
  
    await page.route('**/voyages/summary/', async (route, request) => {
      console.log('📦 Intercepted /voyages/summary');
  
      const response = await route.fetch();
      const json = await response.json();
  
      json.summary.avg_pct_voyages_under_budget = mockedData.avg_pct_voyages_under_budget;
      json.summary.avg_pct_revenue_from_promos = mockedData.avg_pct_revenue_from_promos;
  
      await route.fulfill({
        response,
        body: JSON.stringify(json),
        headers: {
          ...response.headers(),
          'Content-Type': 'application/json',
        },
      });
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
    await page.waitForLoadState('networkidle');

    await verifyText(page, 'dashboard', 'summary_flex_headers', ' Gross revenue for\nfuture sailings ', { index: 0 })
        await verifyVisibility(page, 'dashboard', 'summary_flex_blue', true, { index: 0 });
        await verifyText(page, 'dashboard', 'summary_flex_headers', ' Net revenue for\nfuture sailings', { index: 1 })
    await verifyVisibility(page, 'dashboard', 'summary_flex_blue', true, { index: 1 });
    // await verifyText(page, 'dashboard', 'summary_flex_headers', ' Net revenue\nvs budget ', { index: 2 })    
    // await verifyText(page, 'dashboard', 'summary_flex_headers', ' % of sailings\nbelow budget ', { index: 3 })    
    // // await verifyVisibility(page, 'dashboard', 'summary_flex_blue', true, { index: 2 });
    // await verifyText(page, 'dashboard', 'summary_flex_headers', ' % of revenue\nfrom promos ', { index: 4 })   
    // await verifyVisibility(page, 'dashboard', 'summary_flex_blue', true, { index: 2 });
  });

  test('verify the my priority component and user navigates to pricing page @smoke [RST-2350, RST-2351, RST-2352]', async ({ page }) => {
    const mockedData = {
        unreviewed:500
    };
    
    await page.route('**/voyages/summary/?priorities=1', async (route, request) => {
        console.log('📦 Intercepted /voyages/summary/?priorities=1');
    
        const response = await route.fetch();
        const json = await response.json();
    
        json.user_review_summary.total_unreviewed_meta_alerts = mockedData.unreviewed;
    
        await route.fulfill({
          response,
          body: JSON.stringify(json),
          headers: {
            ...response.headers(),
            'Content-Type': 'application/json',
          },
        });
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
    await page.waitForLoadState('networkidle');

    console.log('User verifies the mocked data in "Review my Priorities"');
    // await verifyText(page, 'dashboard', 'summary_my_priority_btn', mockedData.unreviewed + '', { partial: true });
    await verifyText(page, 'dashboard', 'summary_my_priority_btn', 'Review my priorities', { partial : true });
    
    console.log('User clicks on "Review my Priorities" button');
    await actionClick(page, 'dashboard', 'summary_my_priority_btn');
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    let filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toBe('([Status] equals \"REVIEW\" OR [Status] equals \"PLANNED\" OR [Status] equals \"NO CHANGE\") AND [Blackout] is false');
    
  });
})

test.describe('Verify Opportunity breakdown tile component on dashboard @smoke @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
  test('verify the Opportunity breakdown component heading, sub-heading and tiles [RST-2347]', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      console.log('User verifies the heading of opportunity section');
      await verifyText(page, 'dashboard', 'summary_opportunity_breakdown_heading', 'Opportunity Breakdown of Alerts');
      
      console.log('User verifies the sub-heading of opportunity section');
      await verifyText(page, 'dashboard', 'summary_ob_sub_heading', ' Number of sailing meta alerts ');

      console.log('User verifies the legend text');
      await verifyText(page, 'dashboard', 'summary_ob_legend_price_change', ' Price change recommended ', { partial: true });
      await verifyText(page, 'dashboard', 'summary_ob_legend_tactical_change', ' Tactical lever only recommended ', { partial: true });

      console.log('User verifies the tile headings and icon');
      await verifyText(page, 'dashboard', 'summary_ob_spill_price_change_tile_heading', 'Spill', { partial: true });
      await verifyText(page, 'dashboard', 'summary_ob_spill_pc_icon', 'attach_money');
      
      await verifyText(page, 'dashboard', 'summary_ob_spill_tactical_tile_heading', 'Spill');
      await verifyText(page, 'dashboard', 'summary_ob_spill_tactical_icon', 'build', { index : 0 });
      await verifyText(page, 'dashboard', 'summary_ob_spill_tactical_icon', 'sell', { index : 1 });
      await verifyText(page, 'dashboard', 'summary_ob_spill_tactical_icon', 'G', { index : 2 });

      await verifyText(page, 'dashboard', 'summary_ob_noChange_tile_heading', 'No change');

      await verifyText(page, 'dashboard', 'summary_ob_optimisation_tile_heading', 'Optimization');
      await verifyText(page, 'dashboard', 'summary_ob_blackout_tile_heading', 'Blackout');

      await verifyText(page, 'dashboard', 'summary_ob_spoil_price_change_tile_heading', 'Spoil', { partial: true });
      await verifyText(page, 'dashboard', 'summary_ob_spoil_pc_icon', 'attach_money');

      await verifyText(page, 'dashboard', 'summary_ob_spoil_tactical_tile_heading', 'Spoil');
      await verifyText(page, 'dashboard', 'summary_ob_spoil_tactical_icon', 'build', { index : 0 });
      await verifyText(page, 'dashboard', 'summary_ob_spoil_tactical_icon', 'sell', { index : 1 });
      await verifyText(page, 'dashboard', 'summary_ob_spoil_tactical_icon', 'G', { index : 2 });
  });

  test('verify the spill with pc tile can navigate the user to pricing page with filters @smoke [RST-2335, RST-2336]', async ({ page }) => {
      let filterValue;
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      console.log('User clicks on spill with price change icon tile');
      await actionClick(page, 'dashboard', 'summary_ob_spill_price_change_tile_heading', { text: 'Spill' });
      await page.route('api/voyages/*', async (route, request) => {
          const response = await route.fetch();
          await route.continue();
      });
      await page.waitForURL('**/analytics/sailings');
      console.log('User verifies the pricing page url');
      await verifyUrl(page, '/analytics/sailings');
      await page.waitForResponse(response => 
        response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
      );
      console.log('User applies a filter on pricing page');
      filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
      expect(filterValue).toBe('[Opportunity] contains \"Spill\" AND [Price Change - Price Alert] is true AND [Blackout] is false');
  });

  test('verify the spill with tactical tile can navigate the user to pricing page with filters [RST-2337, RST-2338]', async ({ page }) => {
    let filterValue;
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('User clicks on spill with tactical icon tile');
    await actionClick(page, 'dashboard', 'summary_ob_spill_tactical_tile_heading', { index: 0 });
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toBe('[Opportunity] contains \"Spill\" AND [Price Change - Price Alert] is false AND [Blackout] is false');
  });

  test('verify the no change tile can navigate the user to pricing page with filters [RST-2339, RST-2340]', async ({ page }) => {
    let filterValue;
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('User clicks on no change tile');
      await actionClick(page, 'dashboard', 'summary_ob_noChange_tile_heading', { text: 'No change' });
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toBe('[Opportunity] contains \"No change\" AND [Blackout] is false');
  });

  test('verify the optimization tile can navigate the user to pricing page with filters @smoke [RST-2348, RST-2349]', async ({ page }) => {
    let filterValue;
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('User clicks on no change with blackout icon tile');
    await actionClick(page, 'dashboard', 'summary_ob_optimisation_tile_heading');
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toBe('[Opportunity] contains \"Optimization\" AND [Blackout] is false');
  });

  test('verify the blackout tile can navigate the user to pricing page with filters [RST-2341, RST-2342]', async ({ page }) => {
    let filterValue;
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('User clicks on no change with blackout icon tile');
    await actionClick(page, 'dashboard', 'summary_ob_blackout_tile_heading');
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
  expect(filterValue).toBe('[Blackout] is true');
  });

  test('verify the spoil with pc tile can navigate the user to pricing page with filters [RST-2343, RST-2344]', async ({ page }) => {
    let filterValue;
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('User clicks on spoil with price change icon tile');
    await Promise.all([
      page.waitForURL('**/analytics/sailings'),
      page.locator('[data-testid="opportunity-breakdown-section"] [data-testid="opportunity-card-5"]').click(),
    ]);
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toBe('[Opportunity] contains \"Spoil\" AND [Price Change - Price Alert] is true AND [Blackout] is false');
  });

  test('verify the spoil with tactical tile can navigate the user to pricing page with filters @smoke [RST-2345, RST-2346]', async ({ page }) => {
    let filterValue;
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    console.log('User clicks on spoil with tactical icon tile');
    await actionClick(page, 'dashboard', 'summary_ob_spoil_tactical_tile_heading', { text: 'Spoil' });
    await page.route('api/voyages/*', async (route, request) => {
        const response = await route.fetch();
        await route.continue();
    });
    await page.waitForURL('**/analytics/sailings');
    console.log('User verifies the pricing page url');
    await verifyUrl(page, '/analytics/sailings');
    await page.waitForResponse(response => 
      response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
    );
    console.log('User applies a filter on pricing page');
    filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
    expect(filterValue).toBe('[Opportunity] contains \"Spoil\" AND [Price Change - Price Alert] is false AND [Blackout] is false');
  });
})

test.describe('Verify review rate breakdown chart component on dashboard @smoke @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
  test('verify review rate breakdown chart heading, default value, dropdown items and navigate to pricing page @smoke [RST-2326, RST-2327, RST-2328]', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await verifyVisibility(page, 'dashboard', 'summary_rrb_chart_heading', true);

      await verifyText(page, 'dashboard', 'summary_rrb_chart_heading', 'Review rate breakdown');
      await verifyText(page, 'dashboard', 'summary_legend_rrb_accepted', 'Actioned/Snoozed');
      await verifyText(page, 'dashboard', 'summary_legend_rrb_notReviewed', 'Not reviewed');
      await verifyText(page, 'dashboard', 'summary_legend_rrb_pending', 'Pending manager review');
      await verifyText(page, 'dashboard', 'summary_legend_rrb_blackout', 'On blackout');
      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });
      await verifyText(page, 'dashboard', 'summary_rrb_chart_default_option', 'Booking horizon');
      console.log('User clicks on View by dropdown');
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_btn');

      await verifyText(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', 'Region', { index: 0 });
      await verifyText(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', 'Ship class', { index: 1 });
      await verifyText(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', 'Sailing length', { index: 2 });
      await verifyText(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', 'Booking horizon', { index: 3 });
      await verifyText(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', 'Meta category', { index: 4 });

      // console.log('User clicks on a barchart - not reviewed');
      // await actionClick(page, 'dashboard', 'summary_rrb_chart_notReview_bar', { index : 0 });
      // await page.route('api/voyages/*', async (route, request) => {
      //     const response = await route.fetch();
      //     await route.continue();
      // });
      // await page.waitForURL('**/analytics/sailings');
      // console.log('User verifies the pricing page url');
      // await verifyUrl(page, '/analytics/sailings');
      // await page.waitForResponse(response => 
      //   response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
      // );
      // console.log('User verifies applied a filter on pricing page');
      // let filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
      // expect(filterValue).toBe('([Opportunity] contains \"Spill\" OR [Opportunity] contains \"Spoil\") AND [Status] equals \"Review\"');
      // expect(filterValue).toBe('[Dept Date] >= \"2026-04-07\" AND [Dept Date] <= \"2026-07-07\" AND [Priority] <= 1 AND [Status] equals \"Review\"');
  });  

  test('verify review rate breakdown chart different view by options @smoke [RST-2329, RST-2330, RST-2331]', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });
      
      console.log('User click on View by dropdown in review rate breakdown chart');
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_btn');
      console.log('User click on Ship class option in review rate breakdown chart dropdown');
      await verifyText(page, 'dashboard', 'selected_list_item', 'Booking horizon', { index: 0 });
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', { index: 1 });
      console.log('User verifies the x axis in review rate breakdown chart');
      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });

      console.log('User click on View by dropdown in review rate breakdown chart');
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_btn');
      console.log('User click on Voyage Length option in review rate breakdown chart dropdown');
      await verifyText(page, 'dashboard', 'selected_list_item', 'Ship class', { index: 0 });
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', { index: 2 });
      console.log('User verifies the x axis in review rate breakdown chart');
      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });

      console.log('User click on View by dropdown in review rate breakdown chart');
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_btn');
      console.log('User click on Booking Horizon option in review rate breakdown chart dropdown');
      await verifyText(page, 'dashboard', 'selected_list_item', 'Sailing length', { index: 0 });
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', { index: 3 });
      console.log('User verifies the x axis in review rate breakdown chart');
      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });

      console.log('User click on View by dropdown in review rate breakdown chart');
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_btn');
      console.log('User click on Meta Category option in review rate breakdown chart dropdown');
      await verifyText(page, 'dashboard', 'selected_list_item', 'Booking horizon', { index: 0 });
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', { index: 4 });
      console.log('User verifies the x axis in review rate breakdown chart');
      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });

      console.log('User click on View by dropdown in review rate breakdown chart');
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_btn');
      console.log('User click on Regions option in review rate breakdown chart dropdown');
      await verifyText(page, 'dashboard', 'selected_list_item', 'Meta category', { index: 0 });
      await actionClick(page, 'dashboard', 'summary_rrb_chart_dropdown_list_item', { index: 0 });
      console.log('User verifies the x axis in review rate breakdown chart');
      await verifyVisibility(page, 'dashboard', 'summary_chart_xaxis', true, { index: 0 });
  });  
})

test.describe('Verify review rate donut chart component on dashboard @smoke @regression @NCL-admin @OCEANIA-admin @REGENT-admin @NCL-manager @OCEANIA-manager @REGENT-manager @NCL-analyst @OCEANIA-analyst @REGENT-analyst', () => {
  test('verify review rate chart heading, legend and navigate to pricing page @smoke [RST-2332, RST-2333, RST-2334]', async ({ page }) => {
  test.setTimeout(180000);

      let filterValue = null;
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
      await page.waitForLoadState('networkidle');
      
      await verifyText(page, 'dashboard', 'summary_rr_heading', 'Review rate');
      await verifyText(page, 'dashboard', 'summary_legend_rr_accepted', 'Actioned/Snoozed');
      await verifyText(page, 'dashboard', 'summary_legend_rr_notReviewed', 'Not reviewed');
      await verifyText(page, 'dashboard', 'summary_legend_rr_pending', 'Pending manager review');
      await verifyText(page, 'dashboard', 'summary_legend_rr_blackout', 'On blackout');

      console.log('User clicks on not reviewed- donut chart');
      await actionClick(page, 'dashboard', 'summary_legend_rr_accepted');
      await page.waitForURL('**/analytics/sailings');
      console.log('User verifies the pricing page url');
      await verifyUrl(page, '/analytics/sailings');
      await page.waitForResponse(response => 
        response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
      );
      console.log('User applies a filter on pricing page');
      filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
      expect(filterValue).toBe('([Status] equals \"COMPLETED\" OR [Status] equals \"SYNCING\")');

      await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.waitForLoadState('networkidle');
      await verifyUrl(page, '/dashboard');

      await actionClick(page, 'dashboard', 'summary_legend_rr_notReviewed');
      await page.waitForURL('**/analytics/sailings');
      console.log('User verifies the pricing page url');
      await verifyUrl(page, '/analytics/sailings');
      await page.waitForResponse(response => 
        response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
      );
      console.log('User applies a filter on pricing page');
      filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
      expect(filterValue).toBe('(([Status] equals \"REVIEW\" OR [Status] equals \"PLANNED\" OR [Status] equals \"NO CHANGE\") AND [Blackout] is false)');

      await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.waitForLoadState('networkidle');
      await verifyUrl(page, '/dashboard');

      await actionClick(page, 'dashboard', 'summary_legend_rr_pending');
      await page.waitForURL('**/analytics/sailings');
      console.log('User verifies the pricing page url');
      await verifyUrl(page, '/analytics/sailings');
      await page.waitForResponse(response => 
        response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
      );
      console.log('User applies a filter on pricing page');
      filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
      expect(filterValue).toBe('[Status] equals \"PENDING\"');

      await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.waitForLoadState('networkidle');
      await verifyUrl(page, '/dashboard');

      await actionClick(page, 'dashboard', 'summary_legend_rr_blackout');
      await page.waitForURL('**/analytics/sailings');
      console.log('User verifies the pricing page url');
      await verifyUrl(page, '/analytics/sailings');
      await page.waitForResponse(response => 
        response.url().includes('/voyages/price-prioritization/') && response.request().method() === 'POST'
      );
      console.log('User applies a filter on pricing page');
      filterValue = await page.$eval('input[aria-label="Advanced Filter Input"]', (el: Element) => (el as HTMLInputElement).value);
      expect(filterValue).toBe('([Blackout] is true AND [Status] does not contain \"PENDING\" AND [Status] does not contain \"SYNCING\" AND [Status] does not contain \"COMPLETED\")');

      await actionClick(page, 'nav_bar', 'nav_bar_home', { text: 'Home' })
        await page.waitForLoadState('networkidle');
      await verifyUrl(page, '/dashboard');
  });   
})